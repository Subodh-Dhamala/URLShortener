"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { isLoggedIn, username, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {

    if(!window.confirm('Are you sure you want to logout? '))return;

    logout();
    router.push("/");
  };

  return (
    <nav className="fixed top-0 z-50 w-full bg-white px-4 py-2 shadow">
      <div className="flex items-center justify-between gap-4">
        <div>
          <Link href="/" className="text-3xl font-bold text-blue-600">
            SanoLink
          </Link>
        </div>

        <div className="flex items-center justify-between gap-4">
          {isLoggedIn ? (
            <>
              <Link href="/dashboard">My Links</Link>

              <span>{username}</span>

              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link href="/login">Login</Link>

              <Link
                href="/register"
                className="rounded-lg border-none bg-blue-600 p-2 text-white transition hover:bg-blue-500"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}