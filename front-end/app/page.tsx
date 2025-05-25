'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import toast from 'react-hot-toast';

interface JwtPayload {
  username?: string;
  role?: string;
}

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
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
      } catch {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUsername(null);
    toast.success('Logged out successfully');
    router.push('/');
  };

  const handleLoginClick = () => {
    setLoginLoading(true);
    setTimeout(() => router.push('/login'), 500);
  };

  const handleRegisterClick = () => {
    setRegisterLoading(true);
    setTimeout(() => router.push('/register'), 500);
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-green-50 to-blue-100">
      {/* Left image panel */}
      <div className="hidden md:flex md:w-1/2 bg-cover bg-center rounded-l-2xl" 
      style={{backgroundImage: `url('https://cdn.pixabay.com/photo/2016/10/10/13/20/drugs-1728381_1280.jpg')`}}>
        {/* You can replace the above URL with your pharmacy or relevant image */}
      </div>

      {/* Right content panel */}
      <div className="flex flex-col justify-center items-center md:w-1/2 p-8 bg-white rounded-r-2xl shadow-lg border border-green-300">
        <h1 className="text-4xl font-extrabold text-green-700 mb-2">Welcome to One Pharmacy</h1>
        <p className="text-gray-600 mb-8 text-center max-w-md">
          Manage prescriptions, inventory, and sales easily.
        </p>

        {isLoggedIn ? (
          <>
            <p className="text-gray-700 mb-6 text-lg">
              Hello, <span className="font-semibold">{username}</span>! You're logged in.
            </p>

            <button
              onClick={() => router.push('/dashboard')}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold mb-4 hover:bg-blue-700 transition"
            >
              Go to Dashboard
            </button>

            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <div className="w-full space-y-4 max-w-sm">
            <button
              onClick={handleLoginClick}
              disabled={loginLoading}
              className={`w-full bg-green-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center transition duration-200 ${
                loginLoading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-green-700'
              }`}
            >
              {loginLoading ? (
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
              onClick={handleRegisterClick}
              disabled={registerLoading}
              className={`w-full bg-amber-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center transition duration-200 ${
                registerLoading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-amber-700'
              }`}
            >
              {registerLoading ? (
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
                  Redirecting...
                </>
              ) : (
                'Register'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
