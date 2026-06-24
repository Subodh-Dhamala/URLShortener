'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getMyLinks, StatsResponse } from '@/lib/api';
import { useRouter } from 'next/navigation';

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
    return <p>Loading...</p>;
  }

  return (
    <div>
      {links.length === 0 ? (
        <p>No links found.</p>
      ) : (
        links.map((link) => (
          <div key={link.shortCode}>
            <p>{link.shortCode}</p>
            <p>{link.originalUrl}</p>

            <p>{link.clicks}</p>
            <p>Clicks!</p>
          </div>
        ))
      )}
    </div>
  );
}