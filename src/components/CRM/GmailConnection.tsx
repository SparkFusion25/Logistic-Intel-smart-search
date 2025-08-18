import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface GmailConnectionProps {
  onConnectionChange?: (connected: boolean) => void;
}

export function GmailConnection({ onConnectionChange }: GmailConnectionProps) {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkConnectionStatus();
  }, []);

  const checkConnectionStatus = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('gmail-integration', {
        body: { action: 'check_connection' }
      });

      if (error) throw error;

      if (data?.connected) {
        setIsConnected(true);
        setUserEmail(data.email);
        onConnectionChange?.(true);
      }
    } catch (error) {
      console.error('Error checking Gmail connection:', error);
    } finally {
      setLoading(false);
    }
  };

  const connectGmail = async () => {
    setIsConnecting(true);
    try {
      const { data, error } = await supabase.functions.invoke('gmail-integration', {
        body: { action: 'get_auth_url' }
      });

      if (error) throw error;

      if (data?.authUrl) {
        // Open OAuth popup
        const popup = window.open(
          data.authUrl,
          'gmail-oauth',
          'width=500,height=600,scrollbars=yes,resizable=yes'
        );

        // Listen for OAuth completion
        const checkClosed = setInterval(() => {
          if (popup?.closed) {
            clearInterval(checkClosed);
            // Check if connection was successful
            setTimeout(() => {
              checkConnectionStatus();
            }, 1000);
          }
        }, 1000);
      }
    } catch (error) {
      console.error('Error connecting Gmail:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect Gmail. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectGmail = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('gmail-integration', {
        body: { action: 'disconnect' }
      });

      if (error) throw error;

      if (data?.success) {
        setIsConnected(false);
        setUserEmail(null);
        onConnectionChange?.(false);
        toast({
          title: "Disconnected",
          description: "Gmail account has been disconnected.",
        });
      }
    } catch (error) {
      console.error('Error disconnecting Gmail:', error);
      toast({
        title: "Error",
        description: "Failed to disconnect Gmail account.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            <span className="text-sm text-muted-foreground">Checking Gmail connection...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Gmail Integration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant={isConnected ? "default" : "secondary"} className="flex items-center gap-1">
              {isConnected ? (
                <>
                  <CheckCircle className="h-3 w-3" />
                  Connected
                </>
              ) : (
                <>
                  <AlertCircle className="h-3 w-3" />
                  Not Connected
                </>
              )}
            </Badge>
            {userEmail && (
              <span className="text-sm text-muted-foreground">{userEmail}</span>
            )}
          </div>
          
          {isConnected ? (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={disconnectGmail}
            >
              Disconnect
            </Button>
          ) : (
            <Button 
              size="sm" 
              onClick={connectGmail}
              disabled={isConnecting}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              {isConnecting ? 'Connecting...' : 'Connect Gmail'}
            </Button>
          )}
        </div>

        {!isConnected && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Connect your Gmail account to send emails, view email history, and track email opens and clicks directly from the CRM.
            </AlertDescription>
          </Alert>
        )}

        {isConnected && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Your Gmail account is connected. You can now send emails and view your email history in the CRM.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}