'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';

export default function Navbar(){
  const{isLoggedIn, email, logout} = useAuth();
  const router = useRouter();


  const handlelogout = ()=>{
    logout();
    router.push('/');
  };

return (
    <nav className="border-b border-gray-100 bg-white px-6 py-4">
      <div className="max-w-lg mx-auto flex items-center justify-between">
        <Link href="/" className="text-sm font-medium text-gray-900">
          SanoLink
        </Link>
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-900">
                My Links
              </Link>
              <span className="text-sm text-gray-400">{email}</span>
              <button
                onClick={handlelogout}
                className="text-sm text-gray-500 hover:text-gray-900"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-gray-500 hover:text-gray-900">
                Login
              </Link>
              <Link
                href="/register"
                className="text-sm px-4 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-700 transition-colors"
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