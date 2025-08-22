import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase-client';

export default function Logout(){
  const nav = useNavigate();
  
  useEffect(() => {
    const handleLogout = async () => {
      await supabase.auth.signOut();
      nav('/auth/login');
    };
    
    handleLogout();
  }, [nav]);
  
  return null;
}