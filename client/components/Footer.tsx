import React from "react";
import Link from 'next/link';

export default function Footer() {
  return (
    <footer 
    className="
    w-full
    border-t border-gray-400
    absolute
    bottom-0
    px-4
    py-2
    flex
    gap-4
    justify-between
    min-h-16
    "
    >
    <div 
    className='font-bold text-blue-600 p-4  '
    >&copy;  {new Date().getFullYear()} 
    {' '}
    <Link href="/" >
          SanoLink
        </Link>
        
        </div>
    <div className="flex gap-4 p-4">
      <div>Fast</div>
      <div>Secure</div>
      <div>Cross Platform</div>
    </div>
    


    </footer>
  );
}
