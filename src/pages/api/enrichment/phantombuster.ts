import type { NextApiRequest, NextApiResponse } from 'next';
import { linkedinPeopleSearch } from '@/lib/linkouts';

/**
 * PhantomBuster fallback (optional)
 * Requires: PHANTOMBUSTER_API_KEY and PHANTOMBUSTER_AGENT_ID (optional)
 * If agent envs are not set, returns a safe Google search URL for LinkedIn people.
 * Body: { company: string, titles?: string[] }
 */
export default async function handler(req:NextApiRequest,res:NextApiResponse){
  if(req.method!=='POST') return res.status(405).json({success:false,error:'Method not allowed'});
  const { company='', titles=[] } = req.body||{};
  const co = String(company||'').trim();
  if(!co) return res.status(400).json({success:false,error:'Missing company'});

  const apiKey=process.env.PHANTOMBUSTER_API_KEY||'';
  const companyScraper=process.env.PHANTOMBUSTER_COMPANY_SCRAPER||'';
  const profileScraper=process.env.PHANTOMBUSTER_PROFILE_SCRAPER||'';
  const searchExport=process.env.PHANTOMBUSTER_SEARCH_EXPORT||'';
  const searchUrl = linkedinPeopleSearch(co, Array.isArray(titles)&&titles.length?titles:["Head of Supply Chain","Director of Logistics","Procurement Manager"]);

  if(!apiKey || !companyScraper){
    return res.status(200).json({success:true, mode:'link-only', url: searchUrl});
  }

  // Enhanced PhantomBuster integration with multiple scrapers
  try{
    const scrapers = {
      company: companyScraper,
      profiles: profileScraper,
      search_export: searchExport
    };

    // Launch company scraper for LinkedIn company data
    const companyAgentId = companyScraper.split('/phantoms/')[1]?.split('/')[0];
    if (companyAgentId) {
      const launch = await fetch(`https://api.phantombuster.com/api/v2/agents/launch`, {
        method: 'POST', 
        headers: { 
          'X-Phantombuster-Key-1': apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: companyAgentId,
          argument: {
            sessionCookie: process.env.PHANTOMBUSTER_LINKEDIN_COOKIE || '',
            searches: `${co} ${titles.join(' OR ')}`,
            numberOfProfiles: 10
          }
        })
      });
      const lj = await launch.json();
      return res.status(200).json({
        success: true, 
        mode: 'agent-launched', 
        url: searchUrl, 
        launch: lj,
        scrapers: Object.keys(scrapers),
        company: co
      });
    }
    
    return res.status(200).json({success:true, mode:'scrapers-configured', url: searchUrl, scrapers: Object.keys(scrapers)});
  }catch(e:any){
    return res.status(200).json({success:true, mode:'link-only', url: searchUrl, note:'Agent launch failed', error: e.message});
  }
}