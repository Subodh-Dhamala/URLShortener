"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { login as loginApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    setError("");
    setIsLoading(true);

    try {
      const { token } = await loginApi(email, password);
      const decoded = jwtDecode<{ email: string }>(token);
      login(token, decoded.email);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.error || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

 return (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    
    <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 space-y-6">
      
      <h1 className="text-2xl font-bold text-center text-gray-800">
        Welcome Back
      </h1>

      <div className="flex flex-col gap-4">
        <input
          type="email"
          value={email}
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-blue-500"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="***********"
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          className="w-full border border-gray-300 p-3 rounded-lgfocus:ring-blue-500"
        />
      </div>

      {error && (
        <p className="text-sm text-red-500 text-center">
          {error}
        </p>
      )}

      <button
        onClick={handleLogin}
        disabled={isLoading || !email || !password}
        className="w-full rounded-lg p-4 bg-blue-600 text-white hover:bg-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Logging in..." : "Login"}
      </button>

      <p className="text-sm text-gray-500 text-center">
        No Account?{" "}
        <Link
          href="/register"
          className="text-blue-600 hover:underline"
        >
          Sign Up
        </Link>
      </p>

    </div>
  </div>
);
}