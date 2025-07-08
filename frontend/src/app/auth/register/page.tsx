"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

const RegisterPage = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        name,
        email,
        phone,
        password,
      });
      router.push("/auth/login"); // Redirect to login after registration
    } catch (error: any) {
        console.error("Registration error:", error.response?.data || error.message);
      setError("Error registering. Please try again.");
    } finally {
        setLoading(false)
    }
  };

  return (
    <div className="flex flex-row justify-center items-center h-screen">
        <form
            onSubmit={handleRegister}
            className="max-w-sm w-full bg-white p-8 rounded shadow-lg"
        >
            <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

            {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

            <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium mb-2">
                Name
            </label>
            <input
                type="text"
                id="name"
                name="name"
                className="w-full p-3 border rounded"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            </div>

            <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
            </label>
            <input
                type="email"
                id="email"
                name="email"
                className="w-full p-3 border rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            </div>
            
            <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium mb-2">
                Phone
            </label>
            <input
                type="text"
                id="phone"
                name="phone"
                className="w-full p-3 border rounded"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
            />
            </div>

            <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
            </label>
            <input
                type="password"
                id="password"
                name="password"
                className="w-full p-3 border rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            </div>

            <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded"
            >
            {loading ? 'Registering...' : 'Register'}
            </button>
        </form>
        <p className="text-center p-4 mt-4">
            Already registered? <Link href="/auth/login" className="text-blue-600">Login</Link>
        </p>

    </div>
  );
};

export default RegisterPage;
