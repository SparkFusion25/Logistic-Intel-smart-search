import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { supabase } from '../../lib/supabase';

export default function AuthCallback() {
  const { isLoading, session } = useSessionContext();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          setError('Authentication failed. Please try again.');
          return;
        }

        if (data.session) {
          // Authentication successful - will redirect via session check
          return;
        }
      } catch (err) {
        console.error('Callback handling error:', err);
        setError('An unexpected error occurred.');
      }
    };

    if (!isLoading) {
      handleAuthCallback();
    }
  }, [isLoading]);

  // Redirect to dashboard if authenticated
  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  // Redirect to login if there's an error
  if (error) {
    return <Navigate to="/auth/login" state={{ error }} replace />;
  }

  // Show loading spinner
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-slate-600">Completing authentication...</p>
      </div>
    </div>
  );
}