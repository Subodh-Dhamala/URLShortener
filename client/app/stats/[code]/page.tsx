import {
  getStats,
  StatsResponse,
} from "@/lib/api";

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
      <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-200">
          <p className="text-lg text-gray-700">
            Link not found
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-md border border-gray-200 p-8">

        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Link Stats
        </h1>

        <div className="space-y-4">

          <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-200">

            <p className="text-4xl font-semibold text-gray-900">
              {stats.clicks}
            </p>

            <p className="text-sm text-gray-400 mt-1">
              total clicks
            </p>

          </div>

          <div className="border-t border-gray-200 pt-4 space-y-3">

            <div>
              <p className="text-xs text-gray-400 mb-1">
                Short Code
              </p>

              <p className="text-sm text-gray-700 font-medium break-all">
                {stats.shortCode}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-400 mb-1">
                Original URL
              </p>

              <a
                href={stats.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-700 hover:underline break-all"
              >
                {stats.originalUrl}
              </a>
            </div>

            <div>
              <p className="text-xs text-gray-400 mb-1">
                Created
              </p>

              <p className="text-sm text-gray-700">
                {new Date(
                  stats.createdAt
                ).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </p>
            </div>

          </div>

        </div>

        <div className="mt-6 text-center">
          <a
            href="/"
            className="text-sm text-gray-500 hover:text-gray-700 hover:underline"
          >
            Back to home
          </a>
        </div>

      </div>

    </main>
  );
}