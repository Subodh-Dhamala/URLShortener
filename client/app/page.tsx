"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { shortenUrl, getErrorMessage, ShortenResponse } from "@/lib/api";
import { QRCodeCanvas } from "qrcode.react";
import { useAuth } from "@/context/AuthContext";

import Image from "next/image";


import {
  FiCopy,
  FiDownload,
  FiBarChart2,
} from 'react-icons/fi';

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

   
    <div
      className="pt-20 px-4 py-2 flex flex-col gap-4 w-full max-w-150 ml-auto mr-auto"
    >
      <div className="text-center text-2xl font-semibold flex flex-col items-center">
        {isLoggedIn ? (
          <div className="flex gap-4 flex-col">
            <p>
              Hello <span className="font-bold">{email}</span>!
            </p>
            <p className="text-gray-600">Lets Shorten Your Links
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <p>
              {" "}
              Hello <span className="font-bold">Guest User</span>!
            </p>
            <p className="text-gray-600">Lets Shorten Your Links</p>
          </div>
        )}
      </div>

      <div className="text-center pt-16 flex flex-col gap-4 ">
        <div className="flex gap-2 ">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleShorten()}
            placeholder="Paste your long URL...."
            className="
        border
        p-4 rounded-lg
        grow
        "
          />

          <button
            className="rounded-lg border p-4 bg-blue-600 text-white hover:bg-blue-500 transition
      border-gray-50
      "
            onClick={handleShorten}
          >
            Shorten
          </button>
        </div>

        {error && <p className="text-red-500">{error}</p>}

        {result && (
          <div className="flex flex-col gap-4 items-center">
            <div className="flex gap-4 px-4 py-2">
              <a
                href={result.shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2
    
                "
              >
                Your shortened URL :<span
                className="
                font-bold
                "
                
                >{" " + result.shortUrl}</span>
              </a>

              <button 
              className="
              bg-blue-400
              text-white
              rounded-lg
              px-2
              hover:bg-blue-300
              transition
              flex
              items-center
              gap-2
              
              "
              onClick={handleCopy}
              >
                {copied ? "Copied " : "Copy"} <FiCopy />
              </button>
            </div>

              <QRCodeCanvas value={result.shortUrl} ref={qrRef} />

            <div className="font-semibold flex gap-4">
              <Link href={`/stats/${result.shortCode}`}> <button
              className="
              bg-blue-400
              text-white
              rounded-lg
              px-2 py-2
              hover:bg-blue-300
              transition
              flex
              items-center
              gap-2
              
              "
              >
                View Stats
                 <FiBarChart2 />
              </button>
              </Link>

              <button
              className="
              bg-blue-400
              text-white
              rounded-lg
              px-2 py-2
              hover:bg-blue-300
              transition
              flex
              items-center
              gap-2
              
              "
              onClick={handleDownloadQR}>
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
