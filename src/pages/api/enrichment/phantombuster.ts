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
  const agentId=process.env.PHANTOMBUSTER_AGENT_ID||'';
  const searchUrl = linkedinPeopleSearch(co, Array.isArray(titles)&&titles.length?titles:["Head of Supply Chain","Director of Logistics","Procurement Manager"]);

  if(!apiKey || !agentId){
    return res.status(200).json({success:true, mode:'link-only', url: searchUrl});
  }

  // Best-effort launch; polling omitted for brevity
  try{
    const launch = await fetch(`https://api.phantombuster.com/api/v2/agents/launch?agentId=${encodeURIComponent(agentId)}`, {
      method: 'POST', headers: { 'X-Phantombuster-Key-1': apiKey }
    });
    const lj = await launch.json();
    return res.status(200).json({success:true, mode:'agent-launched', url: searchUrl, launch: lj});
  }catch(e:any){
    return res.status(200).json({success:true, mode:'link-only', url: searchUrl, note:'Agent launch failed'});
  }
}