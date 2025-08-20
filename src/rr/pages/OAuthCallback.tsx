import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const { toast } = useToast();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const code = searchParams.get('code');
        const error = searchParams.get('error');

        if (error) {
          throw new Error(`OAuth error: ${error}`);
        }

        if (!code) {
          throw new Error('No authorization code received');
        }

        // Send the code to our edge function to complete the OAuth flow
        const { data, error: callbackError } = await supabase.functions.invoke('gmail-integration', {
          body: {
            action: 'oauth_callback',
            code: code
          }
        });

        if (callbackError) throw callbackError;

        if (data?.success) {
          setStatus('success');
          toast({
            title: "Gmail Connected!",
            description: `Successfully connected ${data.email}`,
          });

          // Close the popup and refresh the parent window
          setTimeout(() => {
            if (window.opener) {
              window.opener.postMessage({ type: 'GMAIL_OAUTH_SUCCESS', email: data.email }, '*');
              window.close();
            } else {
              // If not in popup, redirect to email page
              window.location.href = '/dashboard/email';
            }
          }, 2000);
        } else {
          throw new Error(data?.error || 'Failed to complete OAuth flow');
        }

      } catch (error) {
        console.error('OAuth callback error:', error);
        setStatus('error');
        toast({
          title: "Connection Failed",
          description: "Failed to connect Gmail account. Please try again.",
          variant: "destructive",
        });

        setTimeout(() => {
          if (window.opener) {
            window.opener.postMessage({ type: 'GMAIL_OAUTH_ERROR', error: error.message }, '*');
            window.close();
          } else {
            window.location.href = '/dashboard/email';
          }
        }, 3000);
      }
    };

    handleOAuthCallback();
  }, [searchParams, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        {status === 'loading' && (
          <>
            <LoadingSpinner />
            <p className="text-muted-foreground">Connecting your Gmail account...</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div className="text-green-500 text-6xl">✓</div>
            <h2 className="text-2xl font-bold text-foreground">Gmail Connected!</h2>
            <p className="text-muted-foreground">Your Gmail account has been successfully connected.</p>
            <p className="text-sm text-muted-foreground">This window will close automatically...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-red-500 text-6xl">✗</div>
            <h2 className="text-2xl font-bold text-foreground">Connection Failed</h2>
            <p className="text-muted-foreground">There was an error connecting your Gmail account.</p>
            <p className="text-sm text-muted-foreground">This window will close automatically...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default OAuthCallback;