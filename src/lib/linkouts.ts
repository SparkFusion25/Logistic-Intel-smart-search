// src/lib/linkouts.ts
export const enc = (s: string) => encodeURIComponent(s || '');
export function linkedinCompanyGuess(name: string){
  const q = `${name} site:linkedin.com/company`;
  return `https://www.google.com/search?q=${enc(q)}`;
}
export function linkedinPeopleSearch(companyName: string, titles: string[]){
  const base = 'https://www.google.com/search?q=';
  const q = `${companyName} (${titles.join(' OR ')}) site:linkedin.com/in`;
  return `${base}${enc(q)}`;
}
export function bingNewsSearch(companyName: string){
  return `https://www.bing.com/news/search?q=${enc(companyName)}&qft=sortbydate%3d%221%22`;
}
export function googleNewsSearch(companyName: string){
  return `https://www.google.com/search?q=${enc(companyName)}&tbm=nws&tbs=qdr:m`;
}
export function genericWebSearch(q: string){
  return `https://www.google.com/search?q=${enc(q)}`;
}