'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/utils/api';

export default function AddSupplierPage() {
  const [name, setName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Supplier name is required');
      return;
    }

    setLoading(true);

    try {
      const res = await apiFetch('/api/admin/supplier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, contactInfo, address }),
      });

      if (res.ok) {
        toast.success('Supplier added successfully');
        setName('');
        setContactInfo('');
        setAddress('');
        router.push('/dashboard');
      } else {
        const errorText = await res.text();
        toast.error(errorText || 'Failed to add supplier');
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-lg border border-green-200">
        <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">Add New Supplier</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 font-medium text-gray-700">Supplier Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="e.g., Medex Pharma"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-medium text-gray-700">Contact Info</label>
            <input
              type="text"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Phone or email"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-medium text-gray-700">Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Street, City, ZIP"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-green-600 text-white py-3 rounded-lg font-semibold transition-all duration-200 ${
              loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-green-700'
            }`}
          >
            {loading ? 'Saving...' : 'Add Supplier'}
          </button>
        </form>

        <button
          onClick={() => router.back()}
          disabled={loading}
          className="mt-4 w-full text-green-600 border border-green-500 py-2 rounded-lg hover:bg-green-100 transition disabled:opacity-50"
        >
          Back
        </button>
      </div>
    </div>
  );
}
