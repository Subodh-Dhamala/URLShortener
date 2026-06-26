import { getStats, StatsResponse } from "@/lib/api";

export default async function StatsPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  let stats: StatsResponse;

  try {
    stats = await getStats(code);
  } catch {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-md">
          <p className="text-lg text-gray-700">Link not found</p>
        </div>
      </main>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-16">
      <h1 className="text-2xl font-bold text-gray-700">Link Stats</h1>

      <div className="flex w-full max-w-md flex-col items-center space-y-12 text-center shadow-2xl">
        <div>
          <p className="text-8xl font-bold">{stats.clicks}</p>
          <p className="text-xl text-gray-700">Total Clicks</p>
        </div>

        <div className="flex flex-col space-y-4">
          <div className="flex justify-between">
            <p>Short Code</p>
            <p>{stats.shortCode}</p>
          </div>

          <div className="flex justify-between gap-12">
            <p>Original URL</p>
            <a
              href={stats.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {stats.originalUrl}
            </a>
          </div>

          <div className="flex justify-between">
            <p>Created</p>
            <p>
              {new Date(stats.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="p-8">
            <a className="text-blue-500 hover:underline" href="/">
              Back to home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}