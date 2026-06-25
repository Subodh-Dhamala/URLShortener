'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getMyLinks, StatsResponse } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { table } from 'console';

export default function DashboardPage() {
  const { isLoggedIn } = useAuth();

  const [links, setLinks] = useState<StatsResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    getMyLinks()
      .then(setLinks)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [isLoggedIn, router]);

  if (isLoading) {
    return <p className='p-16 flex justify-center items-center text-center font-bold h-screen'>Loading...</p>;
  }

  return (
<div className="flex flex-col items-center p-16">
  <h1 className="mb-6 text-2xl font-semibold text-gray-500">
    My Links
  </h1>

  <div className="w-full max-w-4xl overflow-x-auto rounded-xl border border-gray-200 shadow-md">
    <table className="w-full">
      <thead>
        <tr className="bg-gray-200">
          <th className="p-3 text-left">Short URL</th>
          <th className="p-3 text-left">Original URL</th>
          <th className="p-3 text-left">Clicks</th>
        </tr>
      </thead>

      <tbody>
        {links.map((link) => (
          <tr
            key={link.shortCode}
            className="border-t hover:bg-gray-50"
          >
            <td className="p-3 font-mono text-blue-600">
              {link.shortCode}
            </td>

            <td
              className="max-w-50 truncate p-3 sm:max-w-xs"
              title={link.originalUrl}
            >
              {link.originalUrl}
            </td>

            <td className="p-3">
              <span className="rounded-full bg-green-100 px-2 py-1 text-sm text-green-700">
                {link.clicks}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
  );
}