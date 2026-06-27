"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { shortenUrl, ShortenResponse } from "@/lib/api";
import { QRCodeCanvas } from "qrcode.react";
import { useAuth } from "@/context/AuthContext";
import {
  FiCopy,
  FiDownload,
  FiBarChart2,
} from "react-icons/fi";

export default function Home() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<ShortenResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [customCode, setCustomCode] = useState("");
  const [expiresAt, setExpiresAt] = useState("");

  const qrRef = useRef<HTMLCanvasElement | null>(null);
  const { isLoggedIn, username } = useAuth();

  const handleShorten = async () => {
    if (isLoading) return;

    setError("");
    setResult(null);

    try {
      new URL(url);
    } catch {
      setError("Please enter a valid URL including https://");
      return;
    }

    setIsLoading(true);

    try {
      const data = await shortenUrl(url, customCode, expiresAt);
      setResult(data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;

    try {
      await navigator.clipboard.writeText(result.shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Failed to copy URL");
    }
  };

  const handleDownloadQR = () => {
    const canvas = qrRef.current;
    if (!canvas) return;

    const imageUrl = canvas.toDataURL("image/png");

    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = `qr-${result?.shortCode}.png`;
    a.click();
  };

  return (
    <div className="min-h-screen w-full bg-[#f6fafe]">
      <div className="mx-auto flex w-full max-w-md md:max-w-2xl lg:max-w-3xl flex-col gap-6 px-4 pt-8 pb-10">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-3xl font-bold">
            Hello{" "}
            <span className="text-blue-600">
              {isLoggedIn ? username : "Guest User"}!
            </span>
          </h1>

          <p className="mt-2 text-gray-600 text-lg">
            Let's Shorten Your Links
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-lg border border-gray-200">
          <div className="flex flex-col gap-4">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleShorten()}
              placeholder="Paste your long URL..."
              className="rounded-lg border p-4 outline-none focus:border-blue-500"
            />

            <label className="text-sm font-medium text-gray-700">
              Optional Values - Expiry Time and Custom Code
            </label>

            <input
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="rounded-lg border p-4 outline-none focus:border-blue-500"
            />

            <input
              type="text"
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value)}
              placeholder="Custom Code (optional)"
              className="rounded-lg border p-4 outline-none focus:border-blue-500"
            />

            <button
              onClick={handleShorten}
              disabled={isLoading}
              className="rounded-lg bg-blue-600 p-4 font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Shortening..." : "Shorten"}
            </button>
          </div>

          {error && (
            <p className="mt-4 text-center text-red-500">{error}</p>
          )}

          {result && (
            <div className="mt-8 flex flex-col items-center gap-6">
              <div className="flex flex-wrap items-center justify-center gap-3">
                <a
                  href={result.shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-blue-600 hover:underline"
                >
                  {result.shortUrl}
                </a>

                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-400"
                >
                  {copied ? "Copied" : "Copy"}
                  <FiCopy />
                </button>
              </div>

              <QRCodeCanvas value={result.shortUrl} ref={qrRef} />

              <div className="flex gap-4">
                <Link href={`/stats/${result.shortCode}`}>
                  <button className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-400">
                    View Stats
                    <FiBarChart2 />
                  </button>
                </Link>

                <button
                  onClick={handleDownloadQR}
                  className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-400"
                >
                  Download QR
                  <FiDownload />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}