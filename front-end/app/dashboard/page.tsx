'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { apiGet } from '@/utils/api';

interface JwtPayload {
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'?: string;
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'?: string;
  exp?: number;
}

export default function Dashboard() {
  const [dateTime, setDateTime] = useState(new Date());
  const [userRole, setUserRole] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();
  const [stats, setStats] = useState({ medicines: 0, stock: 0, users: 0 });

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const decoded = jwtDecode<JwtPayload>(token);
        const role = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || 'Unknown';
        const name = decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || 'User';

        setUserRole(role);
        setUsername(name);

      } catch (error) {
        localStorage.removeItem('token');
        router.push('/login');
      }
    };

    fetchData();
  }, [router]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiGet('/api/admin/overview');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch overview stats:', error);
      }
    };

    fetchStats();
  }, []);

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

  const navigate = (path: string) => {
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      {/* Header */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-bold text-green-800">
            {userRole === 'Pharmacist' ? 'Pharmacist Dashboard' : 'Admin Dashboard'}
          </h1>
          <p className="text-gray-600 mt-1">
            Welcome back, <span className="font-semibold text-green-700">{username}</span>
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="px-3 py-1 rounded-full bg-green-200 text-green-800 font-semibold text-sm">
            {userRole}
          </span>
          <div className="text-sm text-gray-700">
            {dateTime && <p className="text-gray-700">{dateTime.toLocaleString()}</p>}
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Action Grid */}
      <div className="max-w-6xl mx-auto grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {userRole === 'Pharmacist' ? (
          <>
            <div
              onClick={() => navigate('/pharmacist/sale')}
              className="cursor-pointer bg-white shadow-md rounded-xl p-6 hover:shadow-lg border border-pink-200 transition"
            >
              <h2 className="text-lg font-semibold text-pink-700 mb-2">💊 Sale Medicines</h2>
              <p className="text-gray-600 text-sm">Manage and process customer medicine sales.</p>
            </div>

            <div
              onClick={() => navigate('/admin/inventory')}
              className="cursor-pointer bg-white shadow-md rounded-xl p-6 hover:shadow-lg border border-blue-200 transition"
            >
              <h2 className="text-lg font-semibold text-blue-800 mb-2">📦 View Inventory</h2>
              <p className="text-gray-600 text-sm">Check and manage existing medicine stocks.</p>
            </div>
            <div
              onClick={() => navigate('/pharmacist/orders')}
              className="cursor-pointer bg-white shadow-md rounded-xl p-6 hover:shadow-lg border border-green-200 transition"
            >
              <h2 className="text-lg font-semibold text-green-700 mb-2">📋 View Orders</h2>
              <p className="text-gray-600 text-sm">See all customer orders and sales reports.</p>
            </div>
          </>
        ) : (
          <>
            <div
              onClick={() => navigate('/admin/add-medicine')}
              className="cursor-pointer bg-white shadow-md rounded-xl p-6 hover:shadow-lg border border-green-200 transition"
            >
              <h2 className="text-lg font-semibold text-green-800 mb-2">➕ Add New Medicine</h2>
              <p className="text-gray-600 text-sm">Create and store new medicine entries in inventory.</p>
            </div>

            <div
              onClick={() => navigate('/admin/inventory')}
              className="cursor-pointer bg-white shadow-md rounded-xl p-6 hover:shadow-lg border border-blue-200 transition"
            >
              <h2 className="text-lg font-semibold text-blue-800 mb-2">📦 View Inventory</h2>
              <p className="text-gray-600 text-sm">Check and manage existing medicine stocks.</p>
            </div>

            <div
              onClick={() => navigate('/admin/users')}
              className="cursor-pointer bg-white shadow-md rounded-xl p-6 hover:shadow-lg border border-yellow-200 transition"
            >
              <h2 className="text-lg font-semibold text-yellow-700 mb-2">👥 Manage Users</h2>
              <p className="text-gray-600 text-sm">Assign roles or deactivate users from the system.</p>
            </div>

            <div
              onClick={() => navigate('/admin/add-category')}
              className="cursor-pointer bg-white shadow-md rounded-xl p-6 hover:shadow-lg border border-purple-200 transition"
            >
              <h2 className="text-lg font-semibold text-purple-700 mb-2">🏷️ Add Category</h2>
              <p className="text-gray-600 text-sm">Add new medicine categories to classify inventory.</p>
            </div>

            <div
              onClick={() => navigate('/admin/add-supplier')}
              className="cursor-pointer bg-white shadow-md rounded-xl p-6 hover:shadow-lg border border-orange-200 transition"
            >
              <h2 className="text-lg font-semibold text-orange-700 mb-2">🏭 Add Supplier</h2>
              <p className="text-gray-600 text-sm">Register new suppliers with contact and address info.</p>
            </div>
          </>
        )}
      </div>

      {/* Overview Section */}
      <div className="max-w-6xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-5 border-t-4 border-green-500">
          <h3 className="text-gray-500 text-sm uppercase">Medicines</h3>
          <p className="text-2xl font-bold text-green-700 mt-2">{stats.medicines}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 border-t-4 border-blue-500">
          <h3 className="text-gray-500 text-sm uppercase">Total Stock</h3>
          <p className="text-2xl font-bold text-blue-700 mt-2">{stats.stock}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 border-t-4 border-yellow-500">
          <h3 className="text-gray-500 text-sm uppercase">Users</h3>
          <p className="text-2xl font-bold text-yellow-700 mt-2">{stats.users}</p>
        </div>
      </div>
    </div>
  );


}
