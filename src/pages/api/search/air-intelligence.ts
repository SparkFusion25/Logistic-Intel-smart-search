import type { NextApiRequest, NextApiResponse } from 'next';
export default function handler(req:NextApiRequest,res:NextApiResponse){
  const company=(req.query.company as string)||'';
  // If you have BTS data wired, query here. For now, return a safe stub.
  res.status(200).json({ success:true, intelligence:{ company, is_likely_air_shipper:false, confidence_score: 0, route_matches: [] }});
}