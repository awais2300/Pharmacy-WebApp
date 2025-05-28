'use client';

import { useEffect, useState } from 'react';
import { apiGet, apiPost } from '@/utils/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface Medicine {
    id: number;
    name: string;
    price: number;
    stock: number;
}

interface User {
    id: number;
    name: string;
}

interface SaleItem {
    medicineId: number;
    quantity: number;
    price: number;
    total: number;
}

interface SaleReport {
    customerName: string;
    invoiceNumber: string;
    date: string;
    items: SaleItem[];
}

export default function SaleMedicinePage() {
    const [stock, setStock] = useState<Medicine[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
    const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
    const [customerName, setCustomerName] = useState('');
    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [reportVisible, setReportVisible] = useState(false);
    const [report, setReport] = useState<SaleReport | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchStock = async () => {
            try {
                const res = await apiGet('/api/admin/inventory');
                setStock(res.data);
            } catch {
                toast.error('Failed to load stock');
            }
        };

        // Fetch users/customers
        const fetchUsers = async () => {
            try {
                const res = await apiGet('/api/admin/users');
                setUsers(res.data);
            } catch {
                toast.error('Failed to load customers');
            }
        };

        fetchUsers();
        fetchStock();
    }, []);

    useEffect(() => {
        // Auto-generate invoice number on mount
        const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
        setInvoiceNumber(`INV-${timestamp}`);
    }, []);

    const handleAddRow = () => {
        setSaleItems([...saleItems, { medicineId: 0, quantity: 1, price: 0, total: 0 }]);
    };

    const handleChange = (
        index: number,
        field: keyof SaleItem,
        value: number
    ) => {
        const updated = [...saleItems];
        if (field === 'medicineId') {
            const med = stock.find((m) => m.id === value);
            if (med) {
                updated[index] = {
                    ...updated[index],
                    medicineId: med.id,
                    price: med.price,
                    total: med.price * updated[index].quantity,
                };
            }
        } else if (field === 'quantity') {
            updated[index].quantity = value;
            updated[index].total = updated[index].price * value;
        }

        setSaleItems(updated);
    };

    const handleSubmit = async () => {

        if (!selectedCustomerId) {
            toast.error('Please select a customer');
            return;
        }

        try {
            const itemsToSubmit = saleItems.map(({ medicineId, quantity, price }) => ({
                medicineId,
                quantity,
                price
            }));

            await apiPost('/api/admin/sales', {
                customerId: selectedCustomerId,
                invoiceNumber,
                items: itemsToSubmit,
            });

            toast.success('Sale submitted successfully');
            setSaleItems([]);
            setReportVisible(false);
            setReport(null);
            setSelectedCustomerId(null);
            const newInvoice = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
            setInvoiceNumber(`INV-${newInvoice}`);
        } catch {
            toast.error('Error submitting sale');
        }
    };

    const handleRemoveRow = (index: number) => {
        const updatedItems = [...saleItems];
        updatedItems.splice(index, 1);
        setSaleItems(updatedItems);
    };

    const generateReport = () => {
        if (!selectedCustomerId) {
            toast.error('Please select a customer before generating report');
            return;
        }

        const customer = users.find((u) => u.id === selectedCustomerId);

        setReport({
            customerName,
            invoiceNumber,
            date: new Date().toLocaleString(),
            items: [...saleItems],
        });
        setReportVisible(true);
    };

    const handlePrint = () => {
        if (!report) return;

        const popup = window.open('', '_blank');
        if (!popup) return;

        const html = `
      <html>
        <head>
          <title>Sale Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            h2 { margin-top: 0; }
          </style>
        </head>
        <body>
          <h2>🧾 Sale Report</h2>
          <p><strong>Customer Name:</strong> ${report.customerName}</p>
          <p><strong>Invoice Number:</strong> ${report.invoiceNumber}</p>
          <p><strong>Date:</strong> ${report.date}</p>
          <table>
            <thead>
              <tr>
                <th>Medicine</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${report.items
                .map((item) => {
                    const med = stock.find((m) => m.id === item.medicineId);
                    return `
                    <tr>
                      <td>${med?.name ?? '-'}</td>
                      <td>${item.quantity}</td>
                      <td>PKR. ${item.price.toFixed(2)}</td>
                      <td>PKR. ${item.total.toFixed(2)}</td>
                    </tr>`;
                })
                .join('')}
              <tr>
                <td colspan="3"><strong>Total</strong></td>
                <td><strong>PKR. ${report.items
                .reduce((sum, item) => sum + item.total, 0)
                .toFixed(2)}</strong></td>
              </tr>
            </tbody>
          </table>
        </body>
      </html>
    `;

        popup.document.write(html);
        popup.document.close();
        popup.print();
    };

    const grandTotal = saleItems.reduce((sum, item) => sum + item.total, 0);

    return (
        <div className="min-h-screen p-6 bg-gradient-to-br from-green-50 to-blue-50">
            <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-green-700">🧾 Sale Medicines</h2>

                <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select
                        className="border border-gray-300 px-3 py-2 rounded"
                        value={selectedCustomerId ?? ''}
                        onChange={(e) => setSelectedCustomerId(Number(e.target.value))}
                    >
                        <option value="">-- Select Customer --</option>
                        {users.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.name}
                            </option>
                        ))}
                    </select>
                    <input
                        className="border border-gray-300 px-3 py-2 rounded"
                        placeholder="Invoice Number"
                        value={invoiceNumber}
                        onChange={(e) => setInvoiceNumber(e.target.value)}
                    />
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200">
                        <thead className="bg-green-100">
                            <tr>
                                <th className="text-left px-4 py-2">Medicine</th>
                                <th className="text-left px-4 py-2">Quantity</th>
                                <th className="text-left px-4 py-2">Price</th>
                                <th className="text-left px-4 py-2">Total</th>
                                <th className="text-left px-4 py-2">Remove</th>
                            </tr>
                        </thead>
                        <tbody>
                            {saleItems.map((item, index) => (
                                <tr key={index} className="border-t">
                                    <td className="px-4 py-2">
                                        <select
                                            className="w-full border border-gray-300 rounded px-2 py-1"
                                            value={item.medicineId}
                                            onChange={(e) =>
                                                handleChange(index, 'medicineId', parseInt(e.target.value))
                                            }
                                        >
                                            <option value={0}>-- Select Medicine --</option>
                                            {stock.map((med) => (
                                                <option key={med.id} value={med.id}>
                                                    {med.name} ({med.stock})
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-4 py-2">
                                        <input
                                            type="number"
                                            min={1}
                                            className="w-full border border-gray-300 rounded px-2 py-1"
                                            value={item.quantity}
                                            onChange={(e) =>
                                                handleChange(index, 'quantity', parseInt(e.target.value))
                                            }
                                        />
                                    </td>
                                    <td className="px-4 py-2">PKR. {item.price.toFixed(2)}</td>
                                    <td className="px-4 py-2 font-semibold text-green-700">
                                        PKR. {item.total.toFixed(2)}
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
                            {saleItems.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="text-center py-4 text-gray-400">
                                        No items added
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
                        ➕ Add Medicine
                    </button>
                    <div className="text-right font-semibold text-lg text-green-800">
                        Total: PKR. {grandTotal.toFixed(2)}
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
                        onClick={generateReport}
                        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                    >
                        📄 Generate Report
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                        💾 Submit Sale
                    </button>
                </div>

                {reportVisible && report && (
                    <div className="mt-10 bg-gray-50 border border-gray-200 p-6 rounded-lg shadow">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-gray-700">🧾 Sale Report</h3>
                                <p className="text-sm text-gray-600">Customer: {report.customerName}</p>
                                <p className="text-sm text-gray-600">Invoice: {report.invoiceNumber}</p>
                                <p className="text-sm text-gray-600">Date: {report.date}</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        setReportVisible(false);
                                        setReport(null);
                                    }}
                                    className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                                >
                                    ← Back
                                </button>
                                <button
                                    onClick={handlePrint}
                                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                                >
                                    🖨️ Print / 📥 Download
                                </button>
                            </div>
                        </div>

                        <table className="w-full text-left border border-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-2">Medicine</th>
                                    <th className="px-4 py-2">Quantity</th>
                                    <th className="px-4 py-2">Price</th>
                                    <th className="px-4 py-2">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {report.items.map((item, index) => {
                                    const med = stock.find((m) => m.id === item.medicineId);
                                    return (
                                        <tr key={index} className="border-t">
                                            <td className="px-4 py-2">{med?.name ?? '-'}</td>
                                            <td className="px-4 py-2">{item.quantity}</td>
                                            <td className="px-4 py-2">PKR. {item.price.toFixed(2)}</td>
                                            <td className="px-4 py-2 font-medium text-green-700">
                                                PKR. {item.total.toFixed(2)}
                                            </td>
                                        </tr>
                                    );
                                })}
                                <tr className="font-bold border-t bg-white">
                                    <td colSpan={3} className="px-4 py-2 text-right">Total</td>
                                    <td className="px-4 py-2 text-green-800">
                                        PKR. {report.items.reduce((sum, item) => sum + item.total, 0).toFixed(2)}
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
