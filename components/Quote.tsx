'use client';

import { useState, useEffect } from 'react';
import { IoRefreshOutline } from "react-icons/io5";

interface ZenQuote {
  q: string;    // quote text
  a: string;    // author name
  h?: string;   // HTML format (optional)
}

// Fallback quotes in case API fails
const fallbackQuotes: ZenQuote[] = [
  {
    q: "The only way to do great work is to love what you do.",
    a: "Steve Jobs"
  },
  {
    q: "It does not matter how slowly you go as long as you do not stop.",
    a: "Confucius"
  },
  {
    q: "Everything you've ever wanted is on the other side of fear.",
    a: "George Addair"
  }
];

const Quote = () => {
  const [quote, setQuote] = useState<ZenQuote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getRandomFallbackQuote = () => {
    const randomIndex = Math.floor(Math.random() * fallbackQuotes.length);
    return fallbackQuotes[randomIndex];
  };

  const fetchQuote = async () => {
    setLoading(true);
    try {
      // Using today's quotes endpoint instead of random
      const response = await fetch('https://zenquotes.io/api/today', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        next: { revalidate: 3600 } // Cache for 1 hour
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch quote');
      }

      const data = await response.json();
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('Invalid response format');
      }

      setQuote(data[0]);
      setError(null);
    } catch {
      // Use fallback quote without logging error
      setQuote(getRandomFallbackQuote());
    } finally {
      setLoading(false);
    }
  };

  // Refresh quote when component mounts
  useEffect(() => {
    fetchQuote();
  }, []);

  if (loading) {
    return (
      <div className="backdrop-blur-bg rounded-lg p-4 text-white/80 text-center max-w-md">
        Loading...
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="backdrop-blur-bg rounded-lg p-4 text-white/80 text-center max-w-md">
        {error || 'Something went wrong'}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="backdrop-blur-bg rounded-lg p-6 text-white/90 text-center max-w-md relative group">
        <button 
          onClick={fetchQuote}
          className="absolute -right-3 -top-3 p-2 rounded-full backdrop-blur-bg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10"
          aria-label="Get new quote"
        >
          <IoRefreshOutline className="w-5 h-5" />
        </button>
        <p className="text-lg font-light italic mb-4">
          &ldquo;{quote.q}&rdquo;
        </p>
        <p className="text-sm text-white/70">
          — {quote.a}
        </p>
      </div>
      {/* Attribution as required by ZenQuotes */}
      <a 
        href="https://zenquotes.io/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-xs text-white/50 text-center hover:text-white/70 transition-colors"
      >
        Quotes provided by ZenQuotes API
      </a>
    </div>
  );
};

export default Quote; 