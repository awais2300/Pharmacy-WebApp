'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  // These keys are the full claim URIs exactly as in your token
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'?: string;
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string;
  exp?: number;
  iss?: string;
  aud?: string;
}

export default function Dashboard() {
  const [message, setMessage] = useState('');
  const [dateTime, setDateTime] = useState(new Date());
  const [userRole, setUserRole] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        router.push('/login');
        return;
      }

      try {
        // Decode token with full claim keys
        const decoded = jwtDecode<JwtPayload>(token);
        
        // Extract username and role from full claim URIs
        const role = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || 'Unknown';
        const name = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || 'User';

        setUserRole(role);
        setUsername(name);

        const res = await axios.get('http://localhost:5222/api/protected', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMessage(res.data);
      } catch (error) {
        alert('Unauthorized or invalid token. Redirecting to login.');
        localStorage.removeItem('token');
        router.push('/login');
      }
    };

    fetchData();
  }, [router]);

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white shadow-lg rounded-xl mt-10">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-blue-700">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      <p className="mb-2 text-gray-600">
        Welcome <span className="font-semibold">{username}</span>! Your role is: <span className="font-semibold">{userRole}</span>.
      </p>

      <p className="mb-4 text-gray-600">
        Here is your protected message:
      </p>

      <div className="bg-gray-100 p-4 rounded border mb-6">
        <p className="text-lg text-gray-800">{message || 'Loading...'}</p>
      </div>

      {/* Role-based content */}
      {userRole === 'Admin' && (
        <div className="bg-yellow-100 p-4 rounded border mb-6">
          <h2 className="text-lg font-semibold mb-2">Admin Panel</h2>
          <p>You have full access as an Admin.</p>
        </div>
      )}

      {(userRole === 'Admin' || userRole === 'Manager') && (
        <div className="bg-green-100 p-4 rounded border mb-6">
          <h2 className="text-lg font-semibold mb-2">Manager Section</h2>
          <p>Managers and Admins can view this section.</p>
        </div>
      )}

      <div className="bg-blue-50 p-4 rounded border">
        <h2 className="text-md font-semibold text-blue-800 mb-2">Current Date & Time</h2>
        <p className="text-gray-700">{dateTime.toLocaleString()}</p>
      </div>
    </div>
  );
}
