// @ts-nocheck
// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import * as XLSX from "npm:xlsx";

type Json = Record<string, unknown>;

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SR_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

serve(async (req) => {
  try {
    if (req.method === "OPTIONS") {
      return cors(new Response(null, { status: 204 }));
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return cors(json({ error: "Missing Authorization" }, 401));

    // User-scoped client (verifies JWT)
    const supaUser = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await supaUser.auth.getUser();
    if (userErr || !userData?.user) return cors(json({ error: "Unauthorized" }, 401));

    const body = await safeJson(req);
    const job_id = body?.job_id as string | undefined;
    const bucket = body?.bucket as string | undefined;
    const object_path = body?.object_path as string | undefined;
    
    if (!job_id) {
      return cors(json({ error: "job_id is required" }, 400));
    }

    console.log(`Processing import job: ${job_id} for user: ${userData.user.id}`);

    // Service role client for DB writes
    const supa = createClient(SUPABASE_URL, SR_KEY);

    // Load job from import_jobs table
    const { data: job, error: jerr } = await supa
      .from("import_jobs")
      .select("*")
      .eq("id", job_id)
      .single();
      
    if (jerr || !job) {
      console.error("Import job not found:", jerr);
      return cors(json({ error: "Import job not found" }, 404));
    }

    console.log(`Found job: ${job.object_path}, status: ${job.status}`);

    // Update job to running
    await supa.from("import_jobs").update({
      status: "running",
      started_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }).eq("id", job_id);

    // Download file from storage
    const fileBucket = job.source_bucket || 'imports';
    const filePath = job.object_path;
    
    console.log(`Downloading file from storage: ${fileBucket}/${filePath}`);
    const dl = await supa.storage.from(fileBucket).download(filePath);
    if ((dl as any).error) {
      console.error("Storage download error:", (dl as any).error);
      throw (dl as any).error;
    }

    const buf = await (dl as Blob).arrayBuffer();
    console.log(`Downloaded file: ${buf.byteLength} bytes`);

    // Parse file based on extension
    const ext = filePath.toLowerCase().split('.').pop() || '';
    let rows: any[] = [];

    try {
      if (ext === 'csv') {
        rows = csvToRows(new TextDecoder().decode(new Uint8Array(buf)));
      } else if (['xlsx', 'xls'].includes(ext)) {
        rows = sheetToRows(buf);
      } else if (ext === 'zip') {
        // For ZIP files, extract and process first CSV/Excel file
        throw new Error('ZIP files not yet supported in this version');
      } else {
        throw new Error(`Unsupported file type: ${ext}`);
      }
    } catch (parseError) {
      console.error("Parse error:", parseError);
      await markJobFailed(supa, job_id, `Failed to parse file: ${parseError.message}`);
      return cors(json({ error: `Failed to parse file: ${parseError.message}` }, 400));
    }

    console.log(`Parsed ${rows.length} rows from ${ext} file`);

    // Update total rows count
    await supa.from("import_jobs").update({
      total_rows: rows.length,
      updated_at: new Date().toISOString()
    }).eq("id", job_id);

    // Process rows in batches
    const errors: any[] = [];
    const validRows: any[] = [];
    
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      try {
        const mappedRow = mapRowToUnified(row, job.org_id || userData.user.id);
        
        // Validate essential data
        if (!mappedRow.unified_company_name || mappedRow.unified_company_name === 'Unknown Company') {
          throw new Error('Missing or invalid company name');
        }

        validRows.push(mappedRow);
      } catch (error) {
        console.warn(`Row ${i + 1} validation failed:`, error);
        
        errors.push({
          job_id: job_id,
          row_number: i + 1,
          raw_data: row,
          error_code: 'VALIDATION_ERROR',
          error_detail: error.message || String(error),
          created_at: new Date().toISOString()
        });
      }
    }

    // Insert errors into import_job_errors table
    if (errors.length > 0) {
      console.log(`Inserting ${errors.length} errors`);
      const { error: errorsInsertError } = await supa
        .from("import_job_errors")
        .insert(errors);
      
      if (errorsInsertError) {
        console.error("Failed to insert errors:", errorsInsertError);
      }
    }

    // Batch insert valid rows into unified_shipments
    const BATCH_SIZE = 1000;
    let totalInserted = 0;
    
    for (let i = 0; i < validRows.length; i += BATCH_SIZE) {
      const batch = validRows.slice(i, i + BATCH_SIZE);
      console.log(`Inserting batch ${Math.floor(i/BATCH_SIZE) + 1}/${Math.ceil(validRows.length/BATCH_SIZE)}: ${batch.length} rows`);
      
      const { error } = await supa.from("unified_shipments").upsert(batch, {
        onConflict: "id",
        ignoreDuplicates: false,
      });
      
      if (error) {
        console.error("Batch insert error:", error);
        // Continue with other batches, but log the error
        errors.push({
          job_id: job_id,
          row_number: null,
          raw_data: { batch_start: i, batch_size: batch.length },
          error_code: 'INSERT_ERROR',
          error_detail: error.message,
          created_at: new Date().toISOString()
        });
      } else {
        totalInserted += batch.length;
      }
    }

    console.log(`Successfully inserted ${totalInserted} rows, ${errors.length} errors`);

    // Update job completion status
    const finalStatus = errors.length === 0 && totalInserted > 0 ? "success" : "error";
    await supa.from("import_jobs").update({
      status: finalStatus,
      finished_at: new Date().toISOString(),
      success_rows: totalInserted,
      error_rows: errors.length,
      updated_at: new Date().toISOString()
    }).eq("id", job_id);

    // Insert any remaining errors
    if (errors.length > 0) {
      await supa.from("import_job_errors").insert(errors);
    }

    console.log(`Import job ${job_id} completed with status: ${finalStatus}`);

    return cors(json({ 
      success: true, 
      total_rows: rows.length,
      success_rows: totalInserted,
      error_rows: errors.length,
      job_id: job_id 
    }));
    
  } catch (e) {
    console.error("Import processing error:", e);
    
    // Mark job as failed
    try {
      const body = await safeJson(req);
      if (body?.job_id) {
        const supa = createClient(SUPABASE_URL, SR_KEY);
        await markJobFailed(supa, body.job_id as string, String(e?.message ?? e));
      }
    } catch (updateErr) {
      console.error("Failed to update error status:", updateErr);
    }
    
    return cors(json({ error: String(e?.message ?? e) }, 500));
  }
});

async function markJobFailed(supa: any, job_id: string, errorMessage: string) {
  await supa.from("import_jobs").update({
    status: "error",
    finished_at: new Date().toISOString(),
    error_rows: 1,
    updated_at: new Date().toISOString()
  }).eq("id", job_id);
  
  // Also log the error
  await supa.from("import_job_errors").insert({
    job_id: job_id,
    row_number: null,
    raw_data: { system_error: true },
    error_code: 'SYSTEM_ERROR',
    error_detail: errorMessage,
    created_at: new Date().toISOString()
  });
}

function cors(res: Response) {
  const h = new Headers(res.headers);
  h.set("Access-Control-Allow-Origin", "*");
  h.set("Access-Control-Allow-Headers", "authorization, x-client-info, content-type");
  h.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  return new Response(res.body, { status: res.status, headers: h });
}

async function safeJson(req: Request): Promise<Json> {
  try { return await req.json(); } catch { return {}; }
}

function csvToRows(csv: string) {
  const lines = csv.split(/\r?\n/).filter(line => line.trim());
  if (!lines.length) return [];
  
  const headers = splitCsvLine(lines[0]);
  return lines.slice(1).map((line, index) => {
    const vals = splitCsvLine(line);
    const obj: Record<string, any> = {};
    headers.forEach((h, i) => {
      obj[h.trim()] = vals[i]?.trim() || null;
    });
    return obj;
  });
}

function splitCsvLine(line: string) {
  const out: string[] = [];
  let cur = "", inQ = false;
  
  for (const ch of line) {
    if (ch === '"') { 
      inQ = !inQ; 
      continue; 
    }
    if (ch === "," && !inQ) { 
      out.push(cur); 
      cur = ""; 
      continue; 
    }
    cur += ch;
  }
  out.push(cur);
  return out;
}

function sheetToRows(buf: ArrayBuffer) {
  const wb = XLSX.read(buf, { type: "array", cellDates: true });
  const ws = wb.Sheets[wb.SheetNames[0]];
  if (!ws) throw new Error('No worksheet found');
  
  return XLSX.utils.sheet_to_json(ws, { 
    defval: null, 
    raw: false, 
    blankrows: false 
  });
}

function toInt(v: any): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(String(v).replace(/[,\s]/g, ""));
  return Number.isNaN(n) ? null : Math.round(n);
}

function toNum(v: any): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(String(v).replace(/[,\s]/g, ""));
  return Number.isNaN(n) ? null : n;
}

function cleanHs(h: any): string | null {
  const s = String(h ?? "").replace(/\D/g, "");
  return s ? s.slice(0, 10) : null;
}

function mapRowToUnified(r: any, org_id: string) {
  // Apply column mapping based on common patterns
  const mapped = {
    id: crypto.randomUUID(),
    org_id,
    
    // Company mapping (priority order)
    unified_company_name: r.unified_company_name 
      || r.company_name || r.company 
      || r.shipper_name || r.shipper
      || r.consignee_name || r.consignee
      || "Unknown Company",
      
    // Transport mode
    mode: guessMode(r),
    
    // Geographic
    origin_country: r.origin_country || r.origin || r.shipper_country || null,
    destination_country: r.destination_country || r.destination || r.consignee_country || null,
    destination_city: r.destination_city || r.city || r.consignee_city || null,
    
    // Company details
    shipper_name: r.shipper_name || r.shipper || null,
    consignee_name: r.consignee_name || r.consignee || r.receiver || null,
    
    // Commodity
    hs_code: cleanHs(r.hs_code || r.hs || r.tariff_code),
    description: r.description || r.commodity_description || r.goods_description || null,
    
    // Measurements
    container_count: toInt(r.container_count || r.containers),
    quantity: toNum(r.quantity || r.qty),
    gross_weight_kg: toNum(r.weight_kg || r.weight || r.gross_weight_kg || r.gross_weight),
    value_usd: toNum(r.value_usd || r.value || r.declared_value),
    
    // Dates
    unified_date: r.shipment_date || r.date || r.unified_date || r.export_date || null,
    
    // Transport details
    unified_carrier: r.carrier || r.unified_carrier || r.carrier_name || null,
    vessel_name: r.vessel_name || r.vessel || null,
    bol_number: r.bol_number || r.bol || r.bill_of_lading || null,
    port_of_loading: r.port_of_loading || r.origin_port || r.pol || null,
    port_of_discharge: r.port_of_discharge || r.destination_port || r.pod || null,
    
    // Metadata
    created_at: new Date().toISOString(),
  };
  
  // Clean up the unified_company_name
  if (mapped.unified_company_name && mapped.unified_company_name.trim() === '') {
    mapped.unified_company_name = 'Unknown Company';
  }
  
  return mapped;
}

function guessMode(r: any): string | null {
  // Check explicit mode field
  const modeField = String(r.mode || r.transport_mode || "").toLowerCase();
  if (modeField.includes("air")) return "air";
  if (modeField.includes("ocean") || modeField.includes("sea")) return "ocean";
  
  // Check for air indicators
  if (r.awb || r.airline || r.flight || r.air) return "air";
  
  // Check for ocean indicators  
  if (r.vessel || r.container || r.teu || r.ship) return "ocean";
  
  // Default fallback
  return "ocean";
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}