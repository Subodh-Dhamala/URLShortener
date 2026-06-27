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
      <main className="flex min-h-screen w-full max-w-md items-center justify-center bg-gray-100 px-4">
        <div className=" mx-auto flex w-full max-w-md md:max-w-2xl lg:max-w-3xl flex-col gap-6 px-4 pt-8 pb-10">
          <p className="text-lg text-gray-700">Link not found</p>
        </div>
      </main>
    );
  }

return (
  <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4 py-10">
    <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-xl">
      <h1 className="mb-8 text-center text-3xl font-bold text-gray-800">
        Link Stats
      </h1>

      <div className="mb-8 text-center">
        <p className="text-7xl font-bold ">{stats.clicks}</p>
        <p className="mt-2 text-gray-500">Total Clicks</p>
      </div>

      <div className="space-y-5">
        <div className="flex justify-between border-b pb-3">
          <span className="font-medium text-gray-600">Short Code</span>
          <span className="font-semibold">{stats.shortCode}</span>
        </div>

        <div className="flex justify-between gap-8 border-b pb-3">
          <span className="font-medium text-gray-600 whitespace-nowrap">
            Original URL
          </span>

          <a
            href={stats.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="max-w-sm break-all text-right text-blue-600 hover:underline"
          >
            {stats.originalUrl}
          </a>
        </div>

        <div className="flex justify-between border-b pb-3">
          <span className="font-medium text-gray-600">Created</span>
          <span>
            {new Date(stats.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>

        <div className="flex justify-between border-b pb-3">
          <span className="font-medium text-gray-600">Expires</span>
          <span>
            {stats.expiresAt
              ? new Date(stats.expiresAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "Never"}
          </span>
        </div>
      </div>

      <div className="mt-8 text-center">
        <a
          href="/"
          className="font-medium text-blue-600 hover:underline"
        >
          Back to Home
        </a>
      </div>
    </div>
  </main>
);
}
