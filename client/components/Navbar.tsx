'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { isLoggedIn, email, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className=' fixed top-0 w-full px-4 py-2'>
      <div className='flex gap-4 justify-between items-center'>
        
        <div>
        <Link href="/" className='font-bold text-blue-600 
        text-3xl '>
          SanoLink
        </Link>
        </div>

        <div className='flex justify-between items-center gap-4'>
          {isLoggedIn ? (
            <>
              <Link
                href="/dashboard"
                className=""
              >
                My Links
              </Link>

              <span className="">
                {email}
              </span>

              <button
                onClick={handleLogout}
                className=""
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
              
              >
                Login
              </Link>

              <Link
                href="/register"
                className="
                border-none
                bg-blue-600
                 hover:bg-blue-500 transition
                text-white
                p-2
                rounded-lg
                "
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