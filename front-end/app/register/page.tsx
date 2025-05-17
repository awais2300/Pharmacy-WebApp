"use client";

import { useRouter } from 'next/navigation';
import { useState } from "react";
import toast from 'react-hot-toast';
import { apiFetch } from '@/utils/api';

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState(""); 
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const res = await apiFetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, role }),
    });

    if (res.ok) {
      toast.success('User registered successfully!');
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      setRole(""); 
    } else {
      toast.error('Failed to register user');
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-300 to-blue-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">Register</h2>
        <form onSubmit={handleSubmit}>
          <input
            className="w-full p-3 border border-gray-300 rounded mb-4"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            className="w-full p-3 border border-gray-300 rounded mb-4"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            className="w-full p-3 border border-gray-300 rounded mb-4"
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <label className="block mb-2 font-semibold text-gray-700">Select Role:</label>
          <select
            className="w-full p-3 border border-gray-300 rounded mb-6"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="">Please Select</option>
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="User">User</option>
          </select>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Register
          </button>
        </form>

        <button
          onClick={() => router.push('/')}
          className="w-full bg-gray-500 text-white py-2 rounded mt-3 hover:bg-gray-600 transition"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
