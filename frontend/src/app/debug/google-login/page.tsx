'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import GoogleLoginButton from '@/components/auth/GoogleLoginButton';

export default function GoogleLoginDebugPage() {
  const { googleLogin, isLoading, error } = useAuth();
  const [testResults, setTestResults] = useState<string[]>([]);
  const [mockToken, setMockToken] = useState('');

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const testMockGoogleLogin = async () => {
    if (!mockToken.trim()) {
      addTestResult('❌ Mock token is required');
      return;
    }

    try {
      addTestResult('🔄 Testing mock Google login...');
      await googleLogin(mockToken);
      addTestResult('✅ Mock Google login successful');
    } catch (error: any) {
      addTestResult(`❌ Mock Google login failed: ${error.message}`);
    }
  };

  const testServiceIntegration = () => {
    addTestResult('🔍 Testing service integration...');
    
    // Test if authService has googleLogin method
    try {
      const hasGoogleLogin = typeof googleLogin === 'function';
      addTestResult(hasGoogleLogin ? '✅ googleLogin function available' : '❌ googleLogin function missing');
    } catch (error) {
      addTestResult('❌ Error testing googleLogin function');
    }

    // Test if hooks are properly connected
    addTestResult(`✅ isLoading state: ${isLoading}`);
    addTestResult(`✅ error state: ${error || 'none'}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            🔧 Google Login Debug & Test Page
          </h1>

          {/* Service Integration Test */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Service Integration Test
            </h2>
            <button
              onClick={testServiceIntegration}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
            >
              Test Service Integration
            </button>
          </div>

          {/* Mock Token Test */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Mock Token Test
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mock Google Token (for testing backend integration):
              </label>
              <input
                type="text"
                value={mockToken}
                onChange={(e) => setMockToken(e.target.value)}
                placeholder="Enter mock JWT token or test string"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                Note: This will call the real backend API with the mock token
              </p>
            </div>
            <button
              onClick={testMockGoogleLogin}
              disabled={isLoading || !mockToken.trim()}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              {isLoading ? 'Testing...' : 'Test Mock Google Login'}
            </button>
          </div>

          {/* Real Google Login Button */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Real Google Login Button
            </h2>
            <div className="max-w-sm">
              <GoogleLoginButton
                onSuccess={() => addTestResult('✅ Real Google login successful')}
                onError={(error) => addTestResult(`❌ Real Google login error: ${error}`)}
              />
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-8">
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <h3 className="text-lg font-medium text-red-800 mb-2">Current Error:</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Test Results */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Test Results
            </h2>
            <div className="bg-gray-100 rounded-md p-4 max-h-96 overflow-y-auto">
              {testResults.length === 0 ? (
                <p className="text-gray-500 italic">No test results yet. Run some tests above.</p>
              ) : (
                <ul className="space-y-1 font-mono text-sm">
                  {testResults.map((result, index) => (
                    <li key={index} className="whitespace-pre-wrap">
                      {result}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button
              onClick={() => setTestResults([])}
              className="mt-2 bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded text-sm"
            >
              Clear Results
            </button>
          </div>

          {/* Configuration Info */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Configuration Info
            </h2>
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h3 className="font-medium text-blue-800 mb-2">Environment Variables:</h3>
              <ul className="text-blue-700 space-y-1">
                <li>
                  <strong>NEXT_PUBLIC_GOOGLE_CLIENT_ID:</strong>{' '}
                  {process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? 
                    `${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID.substring(0, 20)}...` : 
                    '❌ Not configured'
                  }
                </li>
                <li>
                  <strong>Current URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'N/A'}
                </li>
              </ul>
            </div>
          </div>

          {/* Implementation Status */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Implementation Status
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <h3 className="font-medium text-green-800 mb-2">✅ Completed:</h3>
                <ul className="text-green-700 text-sm space-y-1">
                  <li>• Google login types and constants</li>
                  <li>• AuthService integration</li>
                  <li>• useAuth hook extension</li>
                  <li>• GoogleLoginButton component</li>
                  <li>• LoginForm integration</li>
                  <li>• Error handling</li>
                  <li>• Loading states</li>
                </ul>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <h3 className="font-medium text-yellow-800 mb-2">⚠️ Configuration Needed:</h3>
                <ul className="text-yellow-700 text-sm space-y-1">
                  <li>• Google OAuth Client ID setup</li>
                  <li>• Environment variable configuration</li>
                  <li>• Backend server running</li>
                  <li>• CORS configuration verified</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}