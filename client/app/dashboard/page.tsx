"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getMyLinks, StatsResponse } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DashboardPage() {
  const { isLoggedIn } = useAuth();

  const [links, setLinks] = useState<StatsResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    getMyLinks()
      .then(setLinks)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [isLoggedIn, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  if (links.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-3xl font-bold">No Links Yet!</h1>

        <p className="text-gray-600">
          You haven't shortened any links yet. Start by creating your first
          short link.
        </p>

        <Link
          href="/"
          className="rounded-lg bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-500"
        >
          Shorten Your First Link
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8 p-6">
      <h1 className="text-3xl font-bold">My Links</h1>

      <div className="w-full max-w-4xl overflow-x-auto rounded-xl border border-gray-200 shadow-md">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 text-left">Short URL</th>
              <th className="p-3 text-left">Original URL</th>
              <th className="p-3 text-left">Stats</th>
              <th className="p-3 text-left">Clicks</th>
              <th className="p-3 text-left">Expiry Date</th>
            </tr>
          </thead>

          <tbody>
            {links.map((link) => (
              <tr key={link.shortCode} className="border-t hover:bg-gray-50">
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
                  <Link
                    href={`/stats/${link.shortCode}`}
                    className="text-blue-600 hover:underline"
                  >
                    View Stats
                  </Link>
                </td>

                <td className="p-3">
                  <span className="rounded-full bg-green-100 px-2 py-1 text-sm text-green-700">
                    {link.clicks}
                  </span>
                </td>

                <td className="p-3">
                  {link.expiresAt
                    ? new Date(link.expiresAt).toLocaleString()
                    : "None"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-8 text-center">
        <a href="/" className="font-medium text-blue-600 hover:underline">
          Back to Home
        </a>
      </div>
    </div>
  );
}
