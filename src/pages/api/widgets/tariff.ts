import type { NextApiRequest, NextApiResponse } from 'next';
export default async function handler(req:NextApiRequest,res:NextApiResponse){
  if(req.method!=="POST") return res.status(405).json({success:false});
  const { hs_code, country } = req.body||{};
  // If AVALARA/FLEXPORT env present, call provider; else return stub so UI works.
  res.status(200).json({ success:true, rate:null, provider:'stub', input:{hs_code,country}, note:'Connect provider to return real rate.' });
}