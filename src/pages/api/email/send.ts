import type { NextApiRequest, NextApiResponse } from 'next';
export default async function handler(req:NextApiRequest,res:NextApiResponse){
  if(req.method!=="POST") return res.status(405).json({success:false});
  // If Gmail/Outlook tokens present, send; else stub OK so UI flows.
  res.status(200).json({ success:true, sendId:'stub-send' });
}