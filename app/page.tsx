'use client';

import { useState, useEffect } from 'react';
import Clock from "@/components/Clock";
import Background from "@/components/Background";
import Weather from "@/components/Weather";
import Quote from "@/components/Quote";
import Settings from "@/components/Settings";

// Type for all user preferences
interface UserPreferences {
  clock: {
    format24h: boolean;
    showSeconds: boolean;
  };
  weather: {
    unit: 'celsius' | 'fahrenheit';
  };
  // Add other preferences here as we implement them
  background?: {
    query: string;
    customUrl?: string;
  };
}

// Default preferences
const DEFAULT_PREFERENCES: UserPreferences = {
  clock: {
    format24h: true,
    showSeconds: false
  },
  weather: {
    unit: 'celsius'
  }
};

// Load settings from localStorage with error handling
const getStoredPreferences = (): UserPreferences => {
  if (typeof window === 'undefined') return DEFAULT_PREFERENCES;
  
  try {
    const saved = localStorage.getItem('userPreferences');
    if (!saved) return DEFAULT_PREFERENCES;

    const parsed = JSON.parse(saved);
    return {
      ...DEFAULT_PREFERENCES,
      ...parsed
    };
  } catch (error) {
    console.error('Failed to load preferences:', error);
    return DEFAULT_PREFERENCES;
  }
};

export default function Home() {
  const [preferences, setPreferences] = useState<UserPreferences>(getStoredPreferences);

  // Save preferences to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  }, [preferences]);

  // Update specific preference sections
  const updateClockSettings = (clockSettings: UserPreferences['clock']) => {
    setPreferences(prev => ({
      ...prev,
      clock: clockSettings
    }));
  };

  const updateWeatherSettings = (weatherSettings: UserPreferences['weather']) => {
    setPreferences(prev => ({
      ...prev,
      weather: weatherSettings
    }));
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Background query="nature,landscape" />
      
      <main className="relative z-10 min-h-screen flex flex-col items-center justify-between p-8">
        <div className="w-full flex justify-end p-4">
          <Weather unit={preferences.weather.unit} />
        </div>

        <div className="flex flex-col items-center gap-8">
          <Clock 
            format24h={preferences.clock.format24h}
            showSeconds={preferences.clock.showSeconds}
            className="text-7xl md:text-8xl lg:text-9xl text-shadow text-white"
          />
          <Quote />
        </div>

        <div className="w-full max-w-md backdrop-blur-bg rounded-lg p-4">
          {/* Todo List will go here */}
        </div>
      </main>

      <Settings 
        clockFormat={preferences.clock}
        weatherSettings={preferences.weather}
        onClockFormatChange={updateClockSettings}
        onWeatherSettingsChange={updateWeatherSettings}
      />
    </div>
  );
}
