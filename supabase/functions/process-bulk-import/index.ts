// @ts-nocheck
// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
// Deno supports npm modules in Supabase Edge Functions:
import * as XLSX from "npm:xlsx";

type Json = Record<string, unknown>;

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SR_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

serve(async (req) => {
  try {
    if (req.method === "OPTIONS") {
      return cors(new Response(null, { status: 204 })); // preflight
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return cors(json({ error: "Missing Authorization" }, 401));

    // User-scoped client (verifies JWT and gets user)
    const supaUser = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await supaUser.auth.getUser();
    if (userErr || !userData?.user) return cors(json({ error: "Unauthorized" }, 401));

    const body = await safeJson(req);
    const import_job_id = body?.import_job_id as string | undefined;
    if (!import_job_id) return cors(json({ error: "import_job_id required" }, 400));

    console.log(`Processing bulk import job: ${import_job_id} for user: ${userData.user.id}`);

    // Admin client for DB writes (bypass RLS for bulk)
    const supa = createClient(SUPABASE_URL, SR_KEY);

    // Load job
    const { data: job, error: jerr } = await supa
      .from("bulk_imports")
      .select("*")
      .eq("id", import_job_id)
      .single();
    if (jerr || !job) {
      console.error("Import job not found:", jerr);
      return cors(json({ error: "Import job not found" }, 404));
    }

    console.log(`Found import job: ${job.filename}, status: ${job.status}`);

    // Move to processing
    await supa.from("bulk_imports").update({
      status: "processing",
      ai_processing_status: "ai_processing",
      started_at: new Date().toISOString(),
      error_details: null,
    }).eq("id", import_job_id);

    // Download source file from Storage
    const bucket = "bulk-imports";
    const path = job.file_path;
    if (!path) {
      throw new Error("file_path missing on bulk_imports record");
    }

    console.log(`Downloading file from storage: ${bucket}/${path}`);
    const dl = await supa.storage.from(bucket).download(path);
    if ((dl as any).error) {
      console.error("Storage download error:", (dl as any).error);
      throw (dl as any).error;
    }

    const buf = await (dl as Blob).arrayBuffer();
    console.log(`Downloaded file: ${buf.byteLength} bytes`);

    // Parse rows
    const ext = (job.file_type || "").toLowerCase();
    const rows: any[] =
      ext === "csv"
        ? csvToRows(new TextDecoder().decode(new Uint8Array(buf)))
        : sheetToRows(buf); // default xlsx

    console.log(`Parsed ${rows.length} rows from ${ext} file`);

    // Transform + sanitize
    const mapped = rows.map((r) => mapRowToUnified(r, import_job_id, job.filename, job.org_id));

    // Chunked upsert
    const BATCH = 1000;
    let totalInserted = 0;
    for (let i = 0; i < mapped.length; i += BATCH) {
      const slice = mapped.slice(i, i + BATCH);
      console.log(`Upserting batch ${Math.floor(i/BATCH) + 1}/${Math.ceil(mapped.length/BATCH)}: ${slice.length} rows`);
      
      const { error } = await supa.from("unified_shipments").upsert(slice, {
        onConflict: "id",
        ignoreDuplicates: false,
      });
      if (error) {
        console.error("Upsert error:", error);
        throw error;
      }
      totalInserted += slice.length;
    }

    console.log(`Successfully inserted ${totalInserted} rows`);

    // Done
    await supa.from("bulk_imports").update({
      status: "completed",
      ai_processing_status: "completed",
      completed_at: new Date().toISOString(),
      total_rows: mapped.length,
      processed_records: totalInserted,
    }).eq("id", import_job_id);

    console.log(`Import job ${import_job_id} completed successfully`);

    return cors(json({ 
      success: true, 
      rows: mapped.length,
      processed: totalInserted,
      importId: import_job_id 
    }));
  } catch (e) {
    console.error("Import processing error:", e);
    
    // Best effort: attempt to mark failed
    try {
      const body = await safeJson(req);
      if (body?.import_job_id) {
        console.log(`Marking import job ${body.import_job_id} as failed`);
        const supa = createClient(SUPABASE_URL, SR_KEY);
        await supa.from("bulk_imports").update({
          status: "failed",
          ai_processing_status: "failed",
          failed_at: new Date().toISOString(),
          error_details: { error: String(e?.message ?? e), timestamp: new Date().toISOString() },
        }).eq("id", body.import_job_id as string);
      }
    } catch (updateErr) {
      console.error("Failed to update error status:", updateErr);
    }
    
    return cors(json({ error: String(e?.message ?? e) }, 500));
  }
});

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
  const lines = csv.split(/\r?\n/).filter(Boolean);
  if (!lines.length) return [];
  const headers = splitCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const vals = splitCsvLine(line);
    const obj: Record<string, any> = {};
    headers.forEach((h, i) => (obj[h] = vals[i] ?? null));
    return obj;
  });
}

function splitCsvLine(line: string) {
  // simple CSV splitter, assumes no embedded newlines
  const out: string[] = [];
  let cur = "", inQ = false;
  for (const ch of line) {
    if (ch === '"') { inQ = !inQ; continue; }
    if (ch === "," && !inQ) { out.push(cur.trim()); cur = ""; continue; }
    cur += ch;
  }
  out.push(cur.trim());
  return out;
}

function sheetToRows(buf: ArrayBuffer) {
  const wb = XLSX.read(buf, { type: "array", cellDates: true });
  const ws = wb.Sheets[wb.SheetNames[0]];
  return XLSX.utils.sheet_to_json(ws, { defval: null, raw: false, blankrows: false });
}

function toInt(v: any): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(String(v).replace(/,/g, ""));
  if (Number.isNaN(n)) return null;
  return Math.round(n);
}

function toNum(v: any): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(String(v).replace(/,/g, ""));
  return Number.isNaN(n) ? null : n;
}

function cleanHs(h: any) {
  const s = String(h ?? "").replace(/\D/g, "");
  return s ? s.slice(0, 10) : null;
}

function mapRowToUnified(r: any, import_job_id: string, source_file_name: string | null, org_id: string) {
  return {
    id: crypto.randomUUID(),
    org_id,
    mode: guessMode(r),
    unified_company_name: r.unified_company_name ?? r.company_name ?? r.shipper_name ?? r.consignee_name ?? "Unknown Company",
    origin_country: r.origin_country ?? r.origin ?? null,
    destination_country: r.destination_country ?? r.destination ?? null,
    destination_city: r.destination_city ?? r.city ?? null,
    container_count: toInt(r.container_count),
    quantity: toNum(r.quantity),
    gross_weight_kg: toNum(r.weight_kg ?? r.weight ?? r.gross_weight_kg),
    hs_code: cleanHs(r.hs_code ?? r.hs),
    shipper_name: r.shipper_name ?? r.shipper ?? null,
    consignee_name: r.consignee_name ?? r.consignee ?? r.receiver ?? null,
    unified_date: r.shipment_date ?? r.date ?? r.unified_date ?? null,
    unified_carrier: r.carrier ?? r.unified_carrier ?? null,
    vessel_name: r.vessel_name ?? r.vessel ?? null,
    bol_number: r.bol_number ?? r.bol ?? null,
    description: r.description ?? r.commodity_description ?? r.goods_description ?? null,
    value_usd: toNum(r.value_usd ?? r.value),
    port_of_loading: r.port_of_loading ?? r.origin_port ?? null,
    port_of_discharge: r.port_of_discharge ?? r.destination_port ?? null,
    created_at: new Date().toISOString(),
  };
}

function guessMode(r: any) {
  const m = String(r.mode ?? "").toLowerCase();
  if (m.includes("air")) return "air";
  if (m.includes("ocean") || m.includes("sea")) return "ocean";
  if (r.awb || r.airline || r.t100) return "air";
  if (r.vessel || r.container || r.teu) return "ocean";
  return null;
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}