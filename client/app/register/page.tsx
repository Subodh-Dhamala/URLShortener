"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { register as registerApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setLoading] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const handleRegister = async () => {
    setError("");
    setLoading(true);

    try {
      const { token } = await registerApi(email, password);
      const decoded = jwtDecode<{ email: string }>(token);

      login(token, decoded.email);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.error || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 shadow-2xl">
        <h1 className="text-center text-2xl font-bold text-gray-700">
          Register
        </h1>

        <div className="flex flex-col space-y-6">
          <input
            type="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full rounded-lg border border-gray-300 p-4 focus:outline-blue-600"
          />

          <input
            type="password"
            value={password}
            required
            placeholder="***********"
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleRegister()}
            className="w-full rounded-lg border border-gray-300 p-4 focus:outline-blue-600"
          />

          {error && (
            <p className="text-center text-sm text-red-500">{error}</p>
          )}

          <button
            onClick={handleRegister}
            disabled={isLoading || !email || !password}
            className="rounded-lg bg-blue-600 p-4 text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Creating account..." : "Sign up"}
          </button>

          <p className="text-center">
            Have an account?{" "}
            <Link href="/login" className="hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}