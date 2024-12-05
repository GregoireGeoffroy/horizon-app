'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface BackgroundProps {
  customBackground?: string;
}

const Background: React.FC<BackgroundProps> = ({ customBackground }) => {
  const [backgroundUrl, setBackgroundUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBackground = async () => {
      if (customBackground) {
        setBackgroundUrl(customBackground);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `https://api.unsplash.com/photos/random?query=nature,landscape&orientation=landscape`,
          {
            headers: {
              Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`,
            },
          }
        );

        if (!response.ok) throw new Error('Failed to fetch background');

        const data = await response.json();
        setBackgroundUrl(data.urls.regular);
        setError(null);
      } catch (_err) {
        setError('Failed to load background');
        setBackgroundUrl('/fallback-background.jpg');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBackground();
  }, [customBackground]);

  if (isLoading) {
    return <div className="fixed inset-0 bg-primary animate-pulse" />;
  }

  return (
    <div className="fixed inset-0 -z-10">
      <Image
        src={backgroundUrl}
        alt="Background"
        fill
        priority
        className="object-cover"
        onError={() => setBackgroundUrl('/fallback-background.jpg')}
      />
      {error && (
        <div className="absolute bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg">
          {error}
        </div>
      )}
    </div>
  );
};

export default Background; 