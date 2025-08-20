// src/pages/api/news/suggest.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { googleNewsSearch, bingNewsSearch } from '@/lib/linkouts';

/**
 * Optional live headlines when NEWS_API_KEY is present (NewsAPI.org or similar JSON feed):
 *   NEWS_API_URL=https://newsapi.org/v2/everything
 *   NEWS_API_KEY=... (server key)
 * Fallback: return only Google/Bing news links (no scraping).
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse){
  if(req.method !== 'POST') return res.status(405).json({success:false,error:'Method not allowed'});
  const { company = '' } = req.body || {};
  const co = String(company||'').trim();
  if(!co) return res.status(400).json({success:false,error:'Missing company'});

  const NEWS_API_URL = process.env.NEWS_API_URL || 'https://newsapi.org/v2/everything';
  const NEWS_API_KEY = process.env.NEWS_API_KEY || '';

  const news_link_google = googleNewsSearch(co);
  const news_link_bing = bingNewsSearch(co);
  const out = { success: true, items: [] as any[], news_link_google, news_link_bing };

  if(!NEWS_API_KEY){
    // No key: return only the links
    return res.status(200).json(out);
  }

  try{
    const url = new URL(NEWS_API_URL);
    url.searchParams.set('q', co);
    url.searchParams.set('language','en');
    url.searchParams.set('pageSize','3');
    url.searchParams.set('sortBy','publishedAt');
    const r = await fetch(url.toString(), { headers: { 'X-Api-Key': NEWS_API_KEY } });
    if(!r.ok) throw new Error(`NEWS API ${r.status}`);
    const j = await r.json();
    const items = (j.articles||[]).slice(0,3).map((a:any)=>({
      title: a.title,
      url: a.url,
      source: a.source?.name,
      published_at: a.publishedAt,
      summary: a.description || ''
    }));
    return res.status(200).json({ ...out, items });
  }catch(_e){
    return res.status(200).json(out);
  }
}