'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { apiFetch } from '@/utils/api';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/api/auth/login", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('token', data.token);
        toast.success('Login successful');
        router.push('/dashboard');
      } else {
        toast.error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md border border-green-300">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-green-600 text-white rounded-full p-3 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 00-4-4H3m0 0a4 4 0 014-4h2m0 0V3m0 0h4m0 0v2m0 0a4 4 0 014 4h2a4 4 0 00-4 4v2a4 4 0 01-4 4h-2a4 4 0 01-4-4z" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-green-700">Pharmacy Login</h1>
          <p className="text-gray-500 text-sm mt-1">Access your dashboard and manage inventory</p>
        </div>

        <input
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-green-400"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading}
        />

        <input
          className="w-full p-3 border border-gray-300 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-green-400"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />

        <button
          onClick={handleLogin}
          className={`w-full bg-green-600 text-white py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center ${
            loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-green-700'
          }`}
          disabled={loading}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              Logging in...
            </>
          ) : (
            'Login'
          )}
        </button>

        <button
          onClick={() => router.push('/')}
          className="w-full text-green-600 border border-green-500 py-2 rounded-lg mt-4 hover:bg-green-100 transition disabled:opacity-50"
          disabled={loading}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
