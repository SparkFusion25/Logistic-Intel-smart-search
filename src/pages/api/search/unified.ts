import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
const s=(v:any)=>typeof v==='string'?v:(v==null?'':String(v));
const toDate=(v:any)=>{const t=s(v).trim(); if(!t) return null; const d=new Date(t); return isNaN(d.getTime())?null:d.toISOString().slice(0,10)};
const toNum=(v:any,d=0)=>{const n=Number(v); return Number.isFinite(n)?n:d};
const norm=(v:any)=>{const t=s(v).trim(); return t.length?t:null};
export default async function handler(req:NextApiRequest,res:NextApiResponse){
  if(req.method!=='GET') return res.status(405).json({success:false,error:'Method not allowed'});
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL as string; const anon=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string; if(!url||!anon) return res.status(500).json({success:false,error:'Missing Supabase env'});
  const supabase=createClient(url,anon);
  const { q=null, mode='all', hs_code=null, origin_country=null, destination_country=null, destination_city=null, carrier=null, date_from=null, date_to=null, limit='25', offset='0' }=req.query as Record<string,string>;
  const p={ p_q: q?String(q):null, p_mode: ['all','air','ocean'].includes(String(mode))?String(mode):'all', p_date_from: toDate(date_from), p_date_to: toDate(date_to), p_hs_code: hs_code||null, p_origin_country: origin_country||null, p_destination_country: destination_country||null, p_destination_city: destination_city||null, p_carrier: carrier||null, p_limit: toNum(limit,25), p_offset: toNum(offset,0)};
  const { data, error } = await supabase.rpc('search_unified', p as any);
  if(error) return res.status(500).json({success:false,error:error.message,data:[],total:0});
  const list=(data||[]) as any[]; const total=list.length?Number(list[0]?.total_count??list.length):0;
  const rows=list.map((r:any)=>({ id: norm(r.id), mode: norm(r.mode), unified_company_name: norm(r.unified_company_name), origin_country: norm(r.origin_country), destination_country: norm(r.destination_country), destination_city: norm(r.destination_city), hs_code: norm(r.hs_code), description: norm(r.description), vessel_name: norm(r.vessel_name), bol_number: norm(r.bol_number), unified_carrier: norm(r.unified_carrier), container_count: Number.isFinite(Number(r.container_count))?Number(r.container_count):null, gross_weight_kg: Number.isFinite(Number(r.gross_weight_kg))?Number(r.gross_weight_kg):null, value_usd: Number.isFinite(Number(r.value_usd))?Number(r.value_usd):null, unified_date: r.unified_date?String(r.unified_date):null, score: Number.isFinite(Number(r.score))?Number(r.score):null, total_count: Number.isFinite(Number(r.total_count))?Number(r.total_count):total }));
  res.status(200).json({success:true,data:rows,total,summary:{},pagination:{hasMore:(p.p_offset + rows.length)<total}});
}