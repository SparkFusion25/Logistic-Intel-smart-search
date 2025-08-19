import type { NextApiRequest, NextApiResponse } from 'next';
export default async function handler(req:NextApiRequest,res:NextApiResponse){
  if(req.method!=="POST") return res.status(405).json({success:false,message:'POST only'});
  const body=req.body||{};
  // TODO: Upsert into Supabase crm_contacts when service role env is present.
  res.status(200).json({ success:true, contact: { id: 'stub', ...body } });
}