'use client';

import { useEffect, useState } from 'react';
import { apiGet } from '@/utils/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface ExpenseItem {
    title: string;
    amount: number;
    notes?: string;
}

interface DailyExpenseGroup {
    date: string;
    items: ExpenseItem[];
}

export default function ViewDailyExpensesPage() {
    const [expenses, setExpenses] = useState<DailyExpenseGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchExpenses = async () => {
            try {
                const res = await apiGet('/api/admin/AllExpenses');
                setExpenses(res.data);
            } catch {
                toast.error('Failed to load expenses');
            } finally {
                setLoading(false);
            }
        };

        fetchExpenses();
    }, []);

    const getTotal = (items: ExpenseItem[]) =>
        items.reduce((sum, item) => sum + item.amount, 0).toFixed(2);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
            <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold text-blue-700 mb-4">📅 Daily Expenses</h1>
                    <button
                        onClick={() => router.back()}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium px-4 py-2 rounded"
                    >
                        ← Back
                    </button>
                </div>
                {loading ? (
                    <p className="text-gray-500">Loading...</p>
                ) : expenses.length === 0 ? (
                    <p className="text-gray-500">No expenses found.</p>
                ) : (
                    expenses.map((group, index) => (
                        <div key={index} className="mb-6 border border-gray-200 rounded-lg shadow-sm">
                            <div className="bg-blue-100 px-4 py-3 rounded-t-lg flex justify-between items-center">
                                <span className="font-semibold text-blue-700">{new Date(group.date).toDateString()}</span>
                                <span className="text-blue-800 font-semibold">
                                    Total: PKR. {getTotal(group.items)}
                                </span>
                            </div>
                            <table className="w-full text-sm border-t border-gray-200">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="text-left px-4 py-2">Title</th>
                                        <th className="text-left px-4 py-2">Amount</th>
                                        <th className="text-left px-4 py-2">Notes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {group.items.map((item, i) => (
                                        <tr key={i} className="border-t">
                                            <td className="px-4 py-2">{item.title}</td>
                                            <td className="px-4 py-2 text-green-700 font-medium">PKR. {item.amount.toFixed(2)}</td>
                                            <td className="px-4 py-2 text-gray-500">{item.notes || '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
