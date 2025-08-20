import type { NextApiRequest, NextApiResponse } from 'next';
// Stub upsert; replace with Supabase insert/update when ready
export default async function handler(req:NextApiRequest,res:NextApiResponse){
  if(req.method!=='POST') return res.status(405).json({success:false,message:'POST only'});
  const body=req.body||{};
  res.status(200).json({success:true,contact:{id:'stub',...body}});
}