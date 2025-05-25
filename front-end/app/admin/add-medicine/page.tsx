'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { apiFetch } from '@/utils/api';

export default function AddMedicinePage() {
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await apiFetch('/api/admin/categories');
        const supRes = await apiFetch('/api/admin/suppliers');
        setCategories(await catRes.json());
        setSuppliers(await supRes.json());
      } catch (error) {
        toast.error('Error fetching categories or suppliers');
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiFetch('/api/admin/medicines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          categoryId: parseInt(categoryId),
          supplierId: parseInt(supplierId),
          price: parseFloat(price),
          quantity: parseInt(quantity),
          expiryDate,
          description,
        }),
      });

      if (res.ok) {
        toast.success('Medicine added successfully');
        router.push('/dashboard'); // Redirect after success
      } else {
        toast.error('Failed to add medicine');
      }
    } catch (error) {
      toast.error('An error occurred');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-xl border border-green-200">
        <h1 className="text-2xl font-bold text-green-700 mb-6 text-center">Add New Medicine</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Medicine Name" value={name} onChange={e => setName(e.target.value)} required className="w-full p-3 border rounded-lg" />

          <select value={categoryId} onChange={e => setCategoryId(e.target.value)} required className="w-full p-3 border rounded-lg">
            <option value="">Select Category</option>
            {categories.map((cat: any) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>

          <select value={supplierId} onChange={e => setSupplierId(e.target.value)} required className="w-full p-3 border rounded-lg">
            <option value="">Select Supplier</option>
            {suppliers.map((sup: any) => <option key={sup.id} value={sup.id}>{sup.name}</option>)}
          </select>

          <input type="number" step="0.01" placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} required className="w-full p-3 border rounded-lg" />

          <input type="number" placeholder="Quantity" value={quantity} onChange={e => setQuantity(e.target.value)} required className="w-full p-3 border rounded-lg" />

          <input type="date" placeholder="Expiry Date" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} className="w-full p-3 border rounded-lg" />

          <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className="w-full p-3 border rounded-lg" />

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-green-600 text-white py-3 rounded-lg font-semibold transition-all duration-200 ${
              loading ? 'opacity-60 cursor-not-allowed' : 'hover:bg-green-700'
            }`}
          >
            {loading ? 'Adding...' : 'Add Medicine'}
          </button>
        </form>

        {/* ✅ Cancel / Back Button */}
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
