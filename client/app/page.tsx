"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { shortenUrl, getErrorMessage, ShortenResponse } from "@/lib/api";
import { QRCodeCanvas } from "qrcode.react";
import { useAuth } from "@/context/AuthContext";
import { FiCopy, FiDownload, FiBarChart2 } from "react-icons/fi";

export default function Home() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<ShortenResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const qrRef = useRef<HTMLCanvasElement | null>(null);
  const { isLoggedIn, email } = useAuth();

  const handleShorten = async () => {
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
      const data = await shortenUrl(url);
      setResult(data);
    } catch (error) {
      setError(getErrorMessage(error));
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
    <div className="flex min-h-screen w-full max-w-150 grow flex-col gap-4 px-4 py-2 pt-20 ml-auto mr-auto">
      <div className="flex flex-col items-center text-center text-2xl font-semibold">
        {isLoggedIn ? (
          <div className="flex flex-col gap-4">
            <p>
              Hello <span className="font-bold">{email}</span>!
            </p>
            <p className="text-gray-600">Lets Shorten Your Links</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <p>
              Hello <span className="font-bold">Guest User</span>!
            </p>
            <p className="text-gray-600">Lets Shorten Your Links</p>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4 pt-16 text-center">
        <div className="flex gap-2">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleShorten()}
            placeholder="Paste your long URL...."
            className="grow rounded-lg border p-4"
          />

          <button
            onClick={handleShorten}
            className="rounded-lg border border-gray-50 bg-blue-600 p-4 text-white transition hover:bg-blue-500"
          >
            Shorten
          </button>
        </div>

        {error && <p className="text-red-500">{error}</p>}

        {result && (
          <div className="flex flex-col items-center gap-4">
            <div className="flex gap-4 px-4 py-2">
              <a
                href={result.shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2"
              >
                Your shortened URL:
                <span className="font-bold"> {result.shortUrl}</span>
              </a>

              <button
                onClick={handleCopy}
                className="flex items-center gap-2 rounded-lg bg-blue-400 px-2 text-white transition hover:bg-blue-300"
              >
                {copied ? "Copied" : "Copy"} <FiCopy />
              </button>
            </div>

            <QRCodeCanvas value={result.shortUrl} ref={qrRef} />

            <div className="flex gap-4 font-semibold">
              <Link href={`/stats/${result.shortCode}`}>
                <button className="flex items-center gap-2 rounded-lg bg-blue-400 px-2 py-2 text-white transition hover:bg-blue-300">
                  View Stats
                  <FiBarChart2 />
                </button>
              </Link>

              <button
                onClick={handleDownloadQR}
                className="flex items-center gap-2 rounded-lg bg-blue-400 px-2 py-2 text-white transition hover:bg-blue-300"
              >
                Download QR
                <FiDownload />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}