'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';  // Next.js 13+ client router
import { apiGet } from '@/utils/api';
import toast from 'react-hot-toast';

interface OrderItem {
  medicineName: string;
  quantity: number;
  price: number;
  total: number;
}

interface Order {
  id: number;
  customerName: string;
  invoiceNumber: string;
  date: string;
  items: OrderItem[];
  totalAmount: number;
}

export default function OrdersPage() {
  const router = useRouter();  // router instance

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await apiGet('/api/admin/orders');
        setOrders(res.data.orders);
      } catch {
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <p className="p-6 text-center">Loading orders...</p>;
  }

  if (orders.length === 0) {
    return <p className="p-6 text-center">No orders found.</p>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="mb-6 px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 transition"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold mb-6">📦 All Orders</h1>

      {orders.map((order) => (
        <div key={order.id} className="mb-8 border rounded-lg p-4 shadow-sm bg-white">
          <div className="flex justify-between mb-3">
            <div>
              <p><strong>Customer:</strong> {order.customerName}</p>
              <p><strong>Invoice:</strong> {order.id}</p>
              <p><strong>Date:</strong> {new Date(order.date).toLocaleString()}</p>
            </div>
            <div className="text-green-700 font-semibold text-lg">
              Total: PKR. {order.totalAmount.toFixed(2)}
            </div>
          </div>

          <table className="w-full text-left border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-3 py-1">Medicine</th>
                <th className="border border-gray-300 px-3 py-1">Quantity</th>
                <th className="border border-gray-300 px-3 py-1">Price</th>
                <th className="border border-gray-300 px-3 py-1">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, i) => (
                <tr key={i}>
                  <td className="border border-gray-300 px-3 py-1">{item.medicineName}</td>
                  <td className="border border-gray-300 px-3 py-1">{item.quantity}</td>
                  <td className="border border-gray-300 px-3 py-1">PKR. {item.price.toFixed(2)}</td>
                  <td className="border border-gray-300 px-3 py-1">PKR. {item.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
