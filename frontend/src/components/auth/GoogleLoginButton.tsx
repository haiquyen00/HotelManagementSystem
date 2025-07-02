'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts';
import { useRouter } from 'next/navigation';

interface GoogleLoginButtonProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  disabled?: boolean;
}

// Declare Google global types
declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (parent: HTMLElement | null, options: any) => void;
          prompt: () => void;
        };
      };
    };
  }
}

export default function GoogleLoginButton({ 
  onSuccess, 
  onError, 
  disabled = false 
}: GoogleLoginButtonProps) {
  const { googleLogin, isLoading } = useAuth();
  const router = useRouter();
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  // Load Google Identity Services script
  useEffect(() => {
    const loadGoogleScript = () => {
      // Check if script already exists
      if (document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
        setScriptLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        setScriptLoaded(true);
      };
      
      script.onerror = () => {
        setInitError('Failed to load Google Identity Services');
      };

      document.head.appendChild(script);
    };

    loadGoogleScript();
  }, []);

  // Initialize Google Sign-In
  useEffect(() => {
    if (!scriptLoaded || typeof window.google === 'undefined') {
      return;
    }

    try {
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      
      if (!clientId) {
        setInitError('Google Client ID not configured. Please set NEXT_PUBLIC_GOOGLE_CLIENT_ID in environment variables.');
        return;
      }

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      // Render the button
      const buttonContainer = document.getElementById('google-signin-button');
      if (buttonContainer) {
        window.google.accounts.id.renderButton(buttonContainer, {
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          shape: 'rectangular',
          width: '100%',
        });
      }
    } catch (error) {
      console.error('Google Sign-In initialization error:', error);
      setInitError('Failed to initialize Google Sign-In');
    }
  }, [scriptLoaded]);

  const handleCredentialResponse = async (response: any) => {
    try {
      if (!response.credential) {
        throw new Error('No credential received from Google');
      }

      await googleLogin(response.credential);
      
      onSuccess?.();
      
      // Redirect to dashboard after successful login
      router.push('/dashboard');
    } catch (error: any) {
      const errorMessage = error.message || 'Google login failed';
      console.error('Google login error:', error);
      onError?.(errorMessage);
    }
  };

  if (initError) {
    return (
      <div className="w-full">
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <div className="text-sm text-red-700">
            <strong>Google Login Setup Error:</strong>
            <p className="mt-1">{initError}</p>
            {initError.includes('Client ID') && (
              <p className="mt-2 text-xs">
                To fix this:
                <br />1. Get Google OAuth Client ID from Google Cloud Console
                <br />2. Add NEXT_PUBLIC_GOOGLE_CLIENT_ID to your .env.local file
                <br />3. Restart the development server
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!scriptLoaded) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-center p-3 border border-gray-300 rounded-md bg-gray-50">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2"></div>
          <span className="text-sm text-gray-600">Loading Google Sign-In...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div 
        id="google-signin-button" 
        className={`w-full ${disabled || isLoading ? 'pointer-events-none opacity-50' : ''}`}
      />
      
      {/* Fallback manual button if Google button doesn't render */}
      <style jsx>{`
        #google-signin-button iframe {
          width: 100% !important;
        }
      `}</style>
    </div>
  );
}