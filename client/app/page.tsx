"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  shortenUrl,
  getErrorMessage,
  ShortenResponse,
} from "@/lib/api";
import { QRCodeCanvas } from "qrcode.react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [result, setResult] =
    useState<ShortenResponse | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const qrRef =
    useRef<HTMLCanvasElement>(null);

  const handleShorten = async () => {
    setError("");
    setResult(null);

    try {
      new URL(url);
    } catch {
      setError(
        "Please enter a valid URL including https://"
      );
      return;
    }

    setIsLoading(true);

    try {
      const data = await shortenUrl(url);
      setResult(data);
    } catch (error) {
      setError(
        getErrorMessage(error)
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;

    try {
      await navigator.clipboard.writeText(
        result.shortUrl
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setError("Failed to copy URL");
    }
  };

  const handleDownloadQR = () => {
    const canvas = qrRef.current;

    if (!canvas) return;

    const imageUrl =
      canvas.toDataURL("image/png");

    const a =
      document.createElement("a");

    a.href = imageUrl;
    a.download = `qr-${result?.shortCode}.png`;

    a.click();
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-xl">

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-semibold text-gray-800 mb-2 tracking-tight">
            URL Shortener
          </h1>

          <p className="text-gray-500 text-sm">
            Paste a long URL and get a short one instantly
          </p>
        </div>

        {/* Input */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 transition-shadow hover:shadow-lg">
          <div className="flex gap-3">

            <input
              type="text"
              value={url}
              onChange={(e) =>
                setUrl(e.target.value)
              }
              onKeyDown={(e) =>
                e.key === "Enter" &&
                handleShorten()
              }
              placeholder="https://your-long-url.com/..."
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-800 text-sm outline-none focus:border-gray-500 focus:bg-white transition-all"
            />

            <button
              onClick={handleShorten}
              disabled={
                isLoading || !url
              }
              className="px-6 py-3 bg-gray-800 text-white text-sm font-medium rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading
                ? "Shortening..."
                : "Shorten"}
            </button>

          </div>

          {error && (
            <p className="mt-3 text-sm text-red-500 font-medium">
              {error}
            </p>
          )}
        </div>

        {/* Result */}
        {result && (
          <div className="mt-6 bg-white rounded-2xl shadow-md border border-gray-200 p-6 animate-fadeIn">

            <div className="flex items-center justify-between gap-3 mb-6">

              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                  Your short URL
                </p>

                <a
                  href={result.shortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-800 font-medium text-sm hover:underline break-all"
                >
                  {result.shortUrl}
                </a>
              </div>

              <button
                onClick={handleCopy}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-600 whitespace-nowrap"
              >
                {copied
                  ? "Copied"
                  : "Copy"}
              </button>

            </div>

            <div className="border-t border-gray-200 mb-6" />

            <div className="flex flex-col items-center gap-4">

              <p className="text-xs text-gray-500 uppercase tracking-wider self-start">
                QR Code
              </p>

              <QRCodeCanvas
                value={result.shortUrl}
                size={160}
                ref={qrRef}
                className="rounded-lg border border-gray-200 p-1 bg-white"
              />

              <div className="flex gap-3 w-full">

                <button
                  onClick={handleDownloadQR}
                  className="flex-1 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-600"
                >
                  Download QR
                </button>

                <Link
                  href={`/stats/${result.shortCode}`}
                  className="flex-1 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-600 text-center"
                >
                  View Stats
                </Link>

              </div>

            </div>

          </div>
        )}

      </div>
    </main>
  );
}