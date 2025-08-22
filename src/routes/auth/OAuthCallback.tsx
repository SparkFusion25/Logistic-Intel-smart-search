import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase-client';

export default function OAuthCallback(){
  const nav = useNavigate();
  
  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('OAuth callback error:', error);
          nav('/auth/login?error=oauth_failed');
          return;
        }
        
        if (data.session) {
          nav('/dashboard');
        } else {
          nav('/auth/login');
        }
      } catch (err) {
        console.error('Callback error:', err);
        nav('/auth/login?error=callback_failed');
      }
    };
    
    handleCallback();
  }, [nav]);

  return (
    <div className='min-h-screen grid place-items-center bg-slate-50'>
      <div className='text-center'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-[#0F4C81] mx-auto mb-4'></div>
        <div className='text-slate-600'>Completing sign in…</div>
      </div>
    </div>
  );
}