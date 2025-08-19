// src/pages/api/search/countries.ts
import type { NextApiRequest, NextApiResponse } from 'next';
export default function handler(_req:NextApiRequest,res:NextApiResponse){
  res.status(200).json({ success:true, countries:["United States","China","Germany","Mexico","United Kingdom"] });
}