'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { shortenUrl, getErrorMessage, ShortenResponse } from '@/lib/api';
import { QRCodeCanvas } from 'qrcode.react';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<ShortenResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const qrRef = useRef<HTMLCanvasElement | null>(null);
  const { isLoggedIn } = useAuth();

  const handleShorten = async () => {
    setError('');
    setResult(null);

    try {
      new URL(url);
    } catch {
      setError('Please enter a valid URL including https://');
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
      setError('Failed to copy URL');
    }
  };

  const handleDownloadQR = () => {
    const canvas = qrRef.current;

    if (!canvas) return;

    const imageUrl = canvas.toDataURL('image/png');

    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `qr-${result?.shortCode}.png`;
    a.click();
  };

  return (
    <div>
      {isLoggedIn ? (
        <p>Logged In</p>
      ) : (
        <p>Guest User</p>
      )}

      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleShorten()}
        placeholder="Enter URL here"
      />

      {error && <p>{error}</p>}

      {result && (
        <>
          <a
            href={result.shortUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {result.shortUrl}
          </a>

          <button onClick={handleCopy}>
            {copied ? 'Copied' : 'Copy'}
          </button>

          <QRCodeCanvas
            value={result.shortUrl}
            ref={qrRef}
          />

          <button onClick={handleDownloadQR}>
            Download QR
          </button>

        <Link
        
        href={`/stats/${result.shortCode}`}
      
        >
          View Stats
        </Link>

        </>
      )}
    </div>
  );
}