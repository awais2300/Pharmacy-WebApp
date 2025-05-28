'use client';

import { useEffect, useState } from 'react';
import { apiPost } from '@/utils/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface ExpenseItem {
    title: string;
    amount: number;
    notes: string;
}

export default function AddDailyExpensePage() {
    const [expenseDate, setExpenseDate] = useState('');
    const [expenseItems, setExpenseItems] = useState<ExpenseItem[]>([]);
    const router = useRouter();

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        setExpenseDate(today);
    }, []);

    const handleAddRow = () => {
        setExpenseItems([...expenseItems, { title: '', amount: 0, notes: '' }]);
    };

    const handleChange = (
        index: number,
        field: keyof ExpenseItem,
        value: string | number
    ) => {
        const updated = [...expenseItems];
        if (field === 'amount') {
            updated[index][field] = Number(value) as ExpenseItem['amount'];
        } else {
            updated[index][field] = value as string;
        }
        setExpenseItems(updated);
    };

    const handleRemoveRow = (index: number) => {
        const updated = [...expenseItems];
        updated.splice(index, 1);
        setExpenseItems(updated);
    };

    const handleSubmit = async () => {
        if (!expenseDate || expenseItems.length === 0) {
            toast.error('Please enter a date and at least one expense item');
            return;
        }

        try {
            await apiPost('/api/admin/expenses', {
                date: expenseDate,
                items: expenseItems,
            });

            toast.success('Expenses submitted');
            setExpenseItems([]);
        } catch {
            toast.error('Error submitting expenses');
        }
    };

    const totalAmount = expenseItems.reduce((sum, item) => sum + item.amount, 0);

    return (
        <div className="min-h-screen p-6 bg-gradient-to-br from-yellow-50 to-red-50">
            <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-red-700">📒 Add Daily Expense</h2>

                <div className="mb-4">
                    <label className="block mb-1 text-gray-700 font-medium">Expense Date</label>
                    <input
                        type="date"
                        value={expenseDate}
                        onChange={(e) => setExpenseDate(e.target.value)}
                        className="w-full border border-gray-300 px-3 py-2 rounded"
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200">
                        <thead className="bg-red-100">
                            <tr>
                                <th className="text-left px-4 py-2">Title</th>
                                <th className="text-left px-4 py-2">Amount</th>
                                <th className="text-left px-4 py-2">Notes</th>
                                <th className="text-left px-4 py-2">Remove</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenseItems.map((item, index) => (
                                <tr key={index} className="border-t">
                                    <td className="px-4 py-2">
                                        <input
                                            type="text"
                                            placeholder="Expense title"
                                            className="w-full border border-gray-300 rounded px-2 py-1"
                                            value={item.title}
                                            onChange={(e) => handleChange(index, 'title', e.target.value)}
                                        />
                                    </td>
                                    <td className="px-4 py-2">
                                        <input
                                            type="number"
                                            min={0}
                                            className="w-full border border-gray-300 rounded px-2 py-1"
                                            value={item.amount}
                                            onChange={(e) => handleChange(index, 'amount', e.target.value)}
                                        />
                                    </td>
                                    <td className="px-4 py-2">
                                        <input
                                            type="text"
                                            placeholder="Optional notes"
                                            className="w-full border border-gray-300 rounded px-2 py-1"
                                            value={item.notes}
                                            onChange={(e) => handleChange(index, 'notes', e.target.value)}
                                        />
                                    </td>
                                    <td className="text-center px-4 py-2">
                                        <button
                                            onClick={() => handleRemoveRow(index)}
                                            className="text-red-600 hover:text-red-800"
                                            title="Remove Row"
                                        >
                                            ❌
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {expenseItems.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="text-center py-4 text-gray-400">
                                        No expense added
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-between mt-4">
                    <button
                        onClick={handleAddRow}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        ➕ Add Expense
                    </button>
                    <div className="text-right font-semibold text-lg text-red-800">
                        Total: PKR. {totalAmount.toFixed(2)}
                    </div>
                </div>

                <div className="flex justify-end mt-6 gap-4">
                    <button
                        onClick={() => router.back()}
                        className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                    >
                        ← Back
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                        💾 Submit Expense
                    </button>
                </div>
            </div>
        </div>
    );
}
