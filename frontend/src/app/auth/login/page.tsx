// app/auth/login/page.tsx

"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();
//   const [email, setEmail] = useState("");
    const [phone, setPhone] = useState('')
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      redirect: false,
    //   email,
      phone,
      password,
    });

    if (res?.error) {
      setError("Invalid phone number or password");
    } else {
      router.push("/dashboard"); // Redirect to the dashboard after login
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
        <form
            onSubmit={handleLogin}
            className="max-w-sm w-full bg-white p-8 rounded shadow-lg"
        >
            <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

            {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

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
            Login
            </button>
        </form>
        <p className="text-center mt-4">
            Register an account? <a href="/auth/register" className="text-blue-600">Register Here!</a>
        </p>


    </div>
  );
};

export default LoginPage;
