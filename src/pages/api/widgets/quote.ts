import type { NextApiRequest, NextApiResponse } from 'next';
export default async function handler(req:NextApiRequest,res:NextApiResponse){
  if(req.method!=="POST") return res.status(405).json({success:false});
  const payload=req.body||{};
  // Normally generate PDF/HTML and store; here we echo safely.
  res.status(200).json({ success:true, quoteId:'stub-quote', output_url:null, payload });
}