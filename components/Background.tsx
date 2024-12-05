'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface BackgroundProps {
  customBackground?: string;
  query?: string;
}

const Background: React.FC<BackgroundProps> = ({ 
  customBackground,
  query = 'nature,landscape'
}) => {
  const [backgroundUrl, setBackgroundUrl] = useState<string>('/images/default-bg.jpg');
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
          `https://api.unsplash.com/photos/random?query=${query}&orientation=landscape`,
          {
            headers: {
              Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch background');
        }

        const data = await response.json();
        setBackgroundUrl(data.urls.regular);
        setError(null);
      } catch (err) {
        console.error('Background fetch error:', err);
        setError('Failed to load background');
        // Keep the default background
      } finally {
        setIsLoading(false);
      }
    };

    fetchBackground();
  }, [customBackground, query]);

  return (
    <>
      {/* Overlay for better text readability */}
      <div className="fixed inset-0 bg-black/30 z-[1]" />
      
      {/* Background Image */}
      <div className="fixed inset-0 w-full h-full z-0">
        <Image
          src={backgroundUrl}
          alt="Background"
          fill
          priority
          quality={75}
          className={`object-cover transition-opacity duration-1000 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onLoadingComplete={() => setIsLoading(false)}
          onError={() => {
            setBackgroundUrl('/images/default-bg.jpg');
            setError('Failed to load image');
          }}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="fixed bottom-4 left-4 z-50 bg-red-500/80 text-white px-4 py-2 rounded-lg backdrop-blur-sm">
          {error}
        </div>
      )}
    </>
  );
};

export default Background; 