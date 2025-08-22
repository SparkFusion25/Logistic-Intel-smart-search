import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '@/components/auth/AuthLayout';
import { supabase } from '@/lib/supabase-client';

export default function Signup(){
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);
  
  const handleOAuth = (provider: 'google' | 'azure') => async () => {
    const { error } = await supabase.auth.signInWithOAuth({ 
      provider: provider === 'google' ? 'google' : 'azure',
      options: { 
        redirectTo: `${window.location.origin}/auth/callback` 
      }
    });
    if (error) setError(error.message);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { 
        data: { name } 
      }
    });
    
    setLoading(false);
    
    if (error) {
      setError(error.message);
      return;
    }
    
    if (data.user) {
      nav('/dashboard');
    }
  };

  return (
    <AuthLayout title='Create your account' subtitle='Start your 7‑day free trial.'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        {error && (
          <div className='rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-2 text-sm'>
            {error}
          </div>
        )}
        
        <div>
          <label className='block text-sm font-medium text-slate-700 mb-1'>Full name</label>
          <input 
            value={name} 
            onChange={e=>setName(e.target.value)} 
            required 
            className='w-full rounded-xl border-slate-300 shadow-sm focus:border-[#0F4C81] focus:ring-[#0F4C81] px-4 py-3'
            placeholder='Enter your full name'
          />
        </div>
        
        <div>
          <label className='block text-sm font-medium text-slate-700 mb-1'>Email</label>
          <input 
            type='email' 
            value={email} 
            onChange={e=>setEmail(e.target.value)} 
            required 
            className='w-full rounded-xl border-slate-300 shadow-sm focus:border-[#0F4C81] focus:ring-[#0F4C81] px-4 py-3'
            placeholder='Enter your email'
          />
        </div>
        
        <div>
          <label className='block text-sm font-medium text-slate-700 mb-1'>Password</label>
          <input 
            type='password' 
            value={password} 
            onChange={e=>setPassword(e.target.value)} 
            required 
            minLength={8} 
            className='w-full rounded-xl border-slate-300 shadow-sm focus:border-[#0F4C81] focus:ring-[#0F4C81] px-4 py-3'
            placeholder='Create a password'
          />
          <p className='mt-1 text-xs text-slate-500'>Use 8+ characters with a number and a symbol.</p>
        </div>
        
        <button 
          disabled={loading} 
          className='w-full rounded-xl py-3 font-semibold text-white bg-gradient-to-r from-[#0B1E39] to-[#0F4C81] hover:brightness-110 disabled:opacity-50 shadow-lg transition min-h-[48px]'
        >
          {loading ? 'Creating…' : 'Create account'}
        </button>
      </form>
      
      <div className='my-6 flex items-center gap-3'>
        <div className='h-px bg-slate-200 flex-1'></div>
        <span className='text-xs text-slate-500'>or</span>
        <div className='h-px bg-slate-200 flex-1'></div>
      </div>
      
      <div className='space-y-3'>
        <button 
          onClick={handleOAuth('google')} 
          className='w-full rounded-xl border border-slate-200 py-3 font-medium hover:bg-slate-50 transition min-h-[48px] flex items-center justify-center gap-2'
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign up with Google
        </button>
        
        <button 
          onClick={handleOAuth('azure')} 
          className='w-full rounded-xl border border-slate-200 py-3 font-medium hover:bg-slate-50 transition min-h-[48px] flex items-center justify-center gap-2'
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#00BCF2" d="M0 0h11.377v11.372H0z"/>
            <path fill="#0078D4" d="M12.623 0H24v11.372H12.623z"/>
            <path fill="#00BCF2" d="M0 12.628h11.377V24H0z"/>
            <path fill="#0078D4" d="M12.623 12.628H24V24H12.623z"/>
          </svg>
          Sign up with Microsoft
        </button>
      </div>
      
      <p className='mt-6 text-sm text-slate-600 text-center'>
        Already have an account? <Link to='/auth/login' className='text-[#0F4C81] font-medium hover:underline'>Sign in</Link>
      </p>
      
      <p className='mt-4 text-xs text-slate-500 text-center'>
        By continuing you agree to our <a href='/legal/terms' className='underline hover:text-slate-700'>Terms</a> and <a href='/legal/privacy' className='underline hover:text-slate-700'>Privacy Policy</a>.
      </p>
    </AuthLayout>
  );
}