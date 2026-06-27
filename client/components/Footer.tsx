import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="flex w-full justify-between gap-4 border-t border-gray-400 px-4 py-2">
      <div className="p-4 font-bold text-blue-600">
        &copy; {new Date().getFullYear()}{" "}
        <Link href="/">SanoLink</Link>
      </div>

      <div className="flex gap-4 p-4">
        <div>Fast</div>
        <div>Secure</div>
        <div>Cross Platform</div>
      </div>
    </footer>
  );
}