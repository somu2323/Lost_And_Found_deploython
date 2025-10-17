'use client';

import { signIn, getSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check for error parameters in URL
    const errorParam = searchParams.get('error');
    if (errorParam === 'InvalidDomain' || errorParam === 'AccessDenied') {
      setError('❌ Access Denied: Only KLH University students can access this platform. Please use your @klh.edu.in email address to sign in.');
    } else if (errorParam === 'OAuthAccountNotLinked') {
      setError('❌ Sign in failed. Please try again or contact support if the problem persists.');
    } else if (errorParam) {
      setError('❌ Sign in failed. Please make sure you are using a @klh.edu.in email address.');
    }

    // Check if user is already logged in
    getSession().then((session) => {
      if (session) {
        router.push('/dashboard');
      }
    });
  }, [router, searchParams]);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError('');
      
      const result = await signIn('google', {
        redirect: false,
        callbackUrl: '/dashboard',
      });

      if (result?.error) {
        if (result.error === 'InvalidDomain') {
          setError('❌ Access Denied: Only KLH University students can access this platform. Please use your @klh.edu.in email address to sign in.');
        } else {
          setError('❌ Sign in failed. Please make sure you are using a @klh.edu.in email address.');
        }
      } else if (result?.url) {
        // Check if the URL contains error parameters
        if (result.url.includes('error=InvalidDomain')) {
          setError('❌ Access Denied: Only KLH University students can access this platform. Please use your @klh.edu.in email address to sign in.');
        } else {
          router.push(result.url);
        }
      }
    } catch (err) {
      setError('❌ An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-gray-900 tracking-tight">
              KLH Lost & Found
            </h2>
            <p className="mt-2 text-base font-medium text-gray-700">
              Sign in with your KLH University email
            </p>
          </div>

          <div className="mt-8">
            {error && (
              <div className="mb-6 p-4 text-red-800 bg-red-50 border-2 border-red-200 rounded-lg shadow-md">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-semibold leading-relaxed">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className={`group relative w-full flex justify-center py-4 px-6 border border-transparent text-base font-semibold rounded-lg text-white ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              } transition duration-150 ease-in-out shadow-lg hover:shadow-xl`}
            >
              {loading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              {loading ? 'Signing in...' : 'Sign in with Google'}
            </button>

            <div className="mt-6 text-center">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-center justify-center">
                  <svg className="h-4 w-4 text-blue-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm font-semibold text-blue-800">
                    🎓 Exclusive to KLH Students
                  </p>
                </div>
                <p className="text-xs text-blue-600 mt-1">
                  Only @klh.edu.in email addresses are permitted
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}