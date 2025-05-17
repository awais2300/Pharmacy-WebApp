'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  username?: string;
  role?: string;
}

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        if (decoded?.username) {
          setUsername(decoded.username);
          setIsLoggedIn(true);
        }
      } catch (err) {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUsername(null);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=1920&q=80')`,
      }}
    >
      <div className="bg-white shadow-lg p-6 rounded-lg max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4 text-blue-700">Welcome to EG Group Application</h1>

        {isLoggedIn ? (
          <>
            <p className="text-gray-700 mb-4">
              Hello, <span className="font-semibold">{username}</span>! You're already logged in.
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-blue-600 text-white px-4 py-2 rounded mb-2 w-full hover:bg-blue-700"
            >
              Go to Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded w-full hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <p className="text-gray-700 mb-6">Please login or register to continue.</p>
            <button
              onClick={() => router.push('/login')}
              className="bg-blue-600 text-white px-4 py-2 rounded mb-2 w-full hover:bg-blue-700"
            >
              Login
            </button>
            <button
              onClick={() => router.push('/register')}
              className="bg-green-600 text-white px-4 py-2 rounded w-full hover:bg-green-700"
            >
              Register
            </button>
          </>
        )}
      </div>
    </div>
  );
}
