"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

import LogoutModal from "./LogoutModal";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const { isLoggedIn, username, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <>
      <nav className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            SanoLink
          </Link>

          {isLoggedIn ? (
            <div className="relative cursor-pointer">
              <button
                onClick={() => setOpen(!open)}
                className="flex cursor-pointer items-center gap-2 rounded-full px-3 py-2 transition hover:bg-gray-100"
              >
                <div className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
                  {username?.charAt(0).toUpperCase()}
                </div>

                <span className="hidden cursor-pointer font-medium text-gray-700 sm:block">
                  {username}
                </span>
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-44 cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className="block px-4 py-3 transition hover:bg-gray-100 hover:text-blue-500 hover:underline hover:decoration-blue-500"
                  >
                    My Links
                  </Link>

                  <button
                    onClick={() => {
                      setOpen(false);
                      setShowLogoutModal(true);
                    }}
                    className="block w-full cursor-pointer px-4 py-3 text-left transition hover:bg-gray-100 hover:text-blue-500 hover:underline hover:decoration-blue-500"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="font-medium text-gray-700 hover:text-blue-500 hover:underline hover:decoration-blue-500"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-500"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </nav>

      <LogoutModal
        isVisible={showLogoutModal}
        onConfirm={() => {
          setShowLogoutModal(false);
          handleLogout();
        }}
        onCancel={() => setShowLogoutModal(false)}
      />
    </>
  );
}
