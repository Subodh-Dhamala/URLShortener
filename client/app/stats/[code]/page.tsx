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
  <div className="
  min-h-screen
  flex
  flex-col
  justify-center
  items-center
  p-16
  bg-gray-50
  "
  >
    <h1
    className="font-bold text-gray-700 text-2xl"
    >Link Stats</h1>

    <div className="flex flex-col items-center w-full max-w-md space-y-12 shadow-2xl text-center">

      <div>
        <p className="text-center text-8xl font-bold">{stats.clicks}</p>
        <p className="text-gray-700 text-1xl">Total Clicks</p>
      </div>

      <div className="flex flex-col space-y-4">
        
        <div className="flex justify-between">
          <p>Short Code</p>
          <p>{stats.shortCode}</p>
        </div>

        <div className="flex justify-between gap-12 ">
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
      <a
      className="hover:underline text-blue-500"
      href="/">Back to home</a>
    </div>


      </div>
    </div>

 
  </div>
);
}