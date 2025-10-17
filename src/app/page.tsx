'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    if (status === 'loading') return; // Still loading

    if (session) {
      router.push('/dashboard');
    } else {
      // Don't auto-redirect to login, let users see the landing page
      console.log('No session found, showing landing page');
    }
  }, [session, status, router]);

  // Show landing page with debug info
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              KLH Lost & Found
            </h1>
            <p className="text-gray-600 mb-6">
              Platform for KLH University students
            </p>
            
            <div className="space-y-4">
              <Link
                href="/login"
                className="block w-full bg-indigo-600 text-white px-4 py-3 rounded-md text-center font-medium hover:bg-indigo-700"
              >
                Sign In with Google
              </Link>
              
              <button
                onClick={() => setShowDebug(!showDebug)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                {showDebug ? 'Hide' : 'Show'} Debug Info
              </button>
            </div>
            
            {showDebug && (
              <div className="mt-6 p-4 bg-gray-100 rounded-lg text-left text-sm">
                <h3 className="font-semibold mb-2">Debug Info:</h3>
                <p><strong>Status:</strong> {status}</p>
                <p><strong>Session:</strong> {session ? 'Yes' : 'No'}</p>
                <p><strong>User:</strong> {session?.user?.email || 'None'}</p>
                <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
