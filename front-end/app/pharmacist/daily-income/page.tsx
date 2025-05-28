'use client';

import { useEffect, useRef, useState } from 'react';
import { apiGet } from '@/utils/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function DailyIncomePage() {
    const [date, setDate] = useState('');
    const [profit, setProfit] = useState(0);
    const [expenses, setExpenses] = useState(0);
    const [dailySale, setDailySale] = useState(0);
    const [dailyPurchase, setDailyPurchase] = useState(0);
    const [loading, setLoading] = useState(false);
    const [showReport, setShowReport] = useState(false);
    const router = useRouter();
    const reportRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        setDate(today);
    }, []);

    const fetchData = async () => {
        if (!date) return toast.error('Please select a valid date');
        setShowReport(false);
        setLoading(true);
        try {
            const [profitRes, expenseRes, dailySaleRes, dailyPurchaseRes] = await Promise.all([
                apiGet(`/api/admin/dailyProfit?date=${date}`),
                apiGet(`/api/admin/dailyExpensesTotal?date=${date}`),
                apiGet(`/api/admin/dailySale?date=${date}`),
                apiGet(`/api/admin/dailyPurchase?date=${date}`)
            ]);

            setProfit(parseFloat(profitRes.data.total) || 0);
            setExpenses(parseFloat(expenseRes.data.total) || 0);
            setDailySale(parseFloat(dailySaleRes.data.total) || 0);
            setDailyPurchase(parseFloat(dailyPurchaseRes.data.total) || 0);
            setShowReport(true);
        } catch {
            toast.error('Failed to load daily income data');
        } finally {
            setLoading(false);
        }
    };

    const income = profit - expenses;

    const printReport = () => {
        if (!reportRef.current) return;
        const printContents = reportRef.current.innerHTML;
        const win = window.open('', '', 'width=800,height=700');
        if (win) {
            win.document.write(`
        <html>
          <head>
            <title>Daily Income Report</title>
            <style>
              body { font-family: sans-serif; padding: 20px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { padding: 10px; border: 1px solid #ccc; text-align: left; }
              th { background-color: #f0f0f0; }
              h2 { color: #047857; }
            </style>
          </head>
          <body>
            <h2>Daily Income Report - ${date}</h2>
            ${printContents}
          </body>
        </html>
      `);
            win.document.close();
            win.focus();
            win.print();
            win.close();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 px-4 py-6 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-md">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-emerald-700">💰 Daily Income Summary</h1>
                    <button
                        onClick={() => router.back()}
                        className="text-sm text-emerald-600 hover:underline"
                    >
                        ← Back
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Select Date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full border border-gray-300 px-3 py-2 rounded"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                            onClick={fetchData}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded"
                            disabled={loading}
                        >
                            📊 Show Summary
                        </button>
                        {showReport && (
                            <button
                                onClick={printReport}
                                className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
                            >
                                🖨️ Print Report
                            </button>
                        )}
                    </div>
                </div>

                {loading && <p className="text-center text-gray-500 mt-6">Loading...</p>}

                {showReport && (
                    <div
                        ref={reportRef}
                        className="bg-gray-50 rounded-lg p-4 mt-6 space-y-3 text-lg border"
                    >
                        <table className="w-full text-left border border-gray-200">
                            <thead>
                                <tr>
                                    <th className="border px-4 py-2 bg-emerald-100">Item</th>
                                    <th className="border px-4 py-2 bg-emerald-100">Amount (PKR)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="border px-4 py-2">Daily Total Sale</td>
                                    <td className="border px-4 py-2 text-green-700 font-semibold">{dailySale.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td className="border px-4 py-2">Daily Total Purchase</td>
                                    <td className="border px-4 py-2 text-pink-700 font-semibold">{dailyPurchase.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td className="border px-4 py-2">Expenses</td>
                                    <td className="border px-4 py-2 text-red-600 font-semibold">{expenses.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td className="border px-4 py-2">Profit</td>
                                    <td className="border px-4 py-2 text-emerald-600 font-semibold">{profit.toFixed(2)}</td>
                                </tr>
                                <tr className="font-bold text-lg">
                                    <td className="border px-4 py-2">Income</td>
                                    <td className={`border px-4 py-2 ${income >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                                        {income.toFixed(2)}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
