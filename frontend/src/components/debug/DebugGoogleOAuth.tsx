'use client';

import { useEffect, useState } from 'react';

export default function DebugGoogleOAuth() {
  const [debugInfo, setDebugInfo] = useState({
    currentUrl: '',
    clientId: '',
    googleLoaded: false,
    error: null as string | null
  });

  useEffect(() => {
    setDebugInfo(prev => ({
      ...prev,
      currentUrl: window.location.href,
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'NOT_SET'
    }));

    // Load Google Scripts
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      setDebugInfo(prev => ({ ...prev, googleLoaded: true }));
      initializeGoogle();
    };
    
    script.onerror = (error) => {
      setDebugInfo(prev => ({ ...prev, error: 'Failed to load Google scripts' }));
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const initializeGoogle = () => {
    try {
      if (typeof window.google === 'undefined') {
        setDebugInfo(prev => ({ ...prev, error: 'Google object not available' }));
        return;
      }

      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      if (!clientId) {
        setDebugInfo(prev => ({ ...prev, error: 'Client ID not configured' }));
        return;
      }

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: false
      });

      window.google.accounts.id.renderButton(
        document.getElementById("google-signin-button"),
        { 
          theme: "outline", 
          size: "large",
          text: "signin_with",
          shape: "rectangular"
        }
      );

      setDebugInfo(prev => ({ ...prev, error: null }));
    } catch (error) {
      console.error('Google initialization error:', error);
      setDebugInfo(prev => ({ ...prev, error: error instanceof Error ? error.message : 'Unknown error' }));
    }
  };

  const handleCredentialResponse = (response: any) => {
    console.log("Google OAuth Response:", response);
    alert(`Login successful! Credential: ${response.credential.substring(0, 50)}...`);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Debug Google OAuth</h1>
      
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-3">Debug Information</h2>
        <div className="space-y-2">
          <p><strong>Current URL:</strong> {debugInfo.currentUrl}</p>
          <p><strong>Client ID:</strong> {debugInfo.clientId}</p>
          <p><strong>Google Scripts Loaded:</strong> {debugInfo.googleLoaded ? '✅ Yes' : '❌ No'}</p>
          <p><strong>Error:</strong> {debugInfo.error || '✅ None'}</p>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3">Google Sign-In Button</h2>
        <div id="google-signin-button"></div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-3">Troubleshooting Steps</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li>Check if Client ID is correctly set in .env.local</li>
          <li>Verify Google Console origins configuration</li>
          <li>Clear browser cache and cookies</li>
          <li>Try incognito/private browsing mode</li>
          <li>Check browser console for detailed errors</li>
          <li>Wait 5-10 minutes after changing Google Console settings</li>
        </ol>
      </div>
    </div>
  );
}
