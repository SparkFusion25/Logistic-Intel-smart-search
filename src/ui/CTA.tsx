import { ButtonHTMLAttributes } from 'react';

export function CTAPrimary(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button 
      {...props} 
      className={`inline-flex items-center gap-2 rounded-xl bg-blue-600 text-white px-4 py-2 font-medium transition
                   hover:bg-blue-700 hover:shadow-sm active:scale-[0.99] ${props.className || ''}`} 
    />
  );
}

export function CTAGhost(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button 
      {...props} 
      className={`inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/90 px-4 py-2 font-medium transition
                   hover:bg-slate-50 hover:border-slate-300 hover:shadow-sm active:scale-[0.99] ${props.className || ''}`} 
    />
  );
}