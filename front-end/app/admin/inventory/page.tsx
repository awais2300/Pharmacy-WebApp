'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiGet } from '@/utils/api';

interface Medicine {
  id: number;
  name: string;
  category: string;
  supplier: string;
  price: number;
  quantity: number;
  expiryDate: string;
  description: string;
}

export default function InventoryPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await apiGet<Medicine[]>('/api/admin/medicines');
        setMedicines(response.data);
      } catch (error) {
        console.error('Error fetching medicines:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* ✅ BACK BUTTON */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
        >
          ← Back
        </button>
      </div>

      <h1 className="text-3xl font-bold text-green-800 mb-6">Medicine Inventory</h1>

      {loading ? (
        <p className="text-gray-600">Loading inventory...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
                <th className="py-3 px-4 border-b">Name</th>
                <th className="py-3 px-4 border-b">Category</th>
                <th className="py-3 px-4 border-b">Supplier</th>
                <th className="py-3 px-4 border-b">Price</th>
                <th className="py-3 px-4 border-b">Quantity</th>
                <th className="py-3 px-4 border-b">Expiry</th>
                <th className="py-3 px-4 border-b">Description</th>
              </tr>
            </thead>
            <tbody>
              {medicines.map((med) => (
                <tr key={med.id} className="border-t hover:bg-gray-50">
                  <td className="py-2 px-4">{med.name}</td>
                  <td className="py-2 px-4">{med.category}</td>
                  <td className="py-2 px-4">{med.supplier}</td>
                  <td className="py-2 px-4">PKR. {med.price.toFixed(2)}</td>
                  <td className="py-2 px-4">{med.quantity}</td>
                  <td className="py-2 px-4">{med.expiryDate?.slice(0, 10)}</td>
                  <td className="py-2 px-4 text-gray-600">{med.description}</td>
                </tr>
              ))}
              {medicines.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center text-gray-500 py-4">No medicines found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
