import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="flex flex-col items-center justify-between gap-4 border-t border-gray-400 px-4 py-4 md:flex-row">
      <div className="flex flex-wrap justify-center gap-4">
       <span className="hover:text-blue-500 cursor-pointer">&copy; {new Date().getFullYear()}{" "}
        <Link href="/">SanoLink</Link>
        </span> 
      </div>

      <div className="flex gap-4 p-4 ">
        <div className="hover:text-blue-500 cursor-pointer">Fast</div>
        <div className="hover:text-blue-500 cursor-pointer">Secure</div>
        <div className="hover:text-blue-500 cursor-pointer">Ads Free</div>
        <div className="hover:text-blue-500 cursor-pointer">Cross Platform</div>
      </div>
    </footer>
  );
}