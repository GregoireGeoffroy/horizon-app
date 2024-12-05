'use client';

import { useState, useEffect } from 'react';
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm, WiFog } from 'react-icons/wi';
import { IoLocationOutline } from 'react-icons/io5';

interface WeatherData {
  current: {
    temp: number;
    condition: string;
    icon: string;
  };
  forecast: Array<{
    date: string;
    temp: {
      min: number;
      max: number;
    };
    condition: string;
    icon: string;
  }>;
  location: {
    name: string;
    country: string;
  };
}

interface WeatherProps {
  unit: 'celsius' | 'fahrenheit';
}

const Weather = ({ unit }: WeatherProps) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const getWeather = async (lat: number, lon: number) => {
      try {
        // Fetch current weather
        const currentResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit === 'fahrenheit' ? 'imperial' : 'metric'}&appid=${process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY}`
        );

        // Fetch 5-day forecast
        const forecastResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${unit === 'fahrenheit' ? 'imperial' : 'metric'}&appid=${process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY}`
        );

        if (!currentResponse.ok || !forecastResponse.ok) {
          throw new Error('Failed to fetch weather data');
        }

        const currentData = await currentResponse.json();
        const forecastData = await forecastResponse.json();

        // Process forecast data to get daily forecasts
        const dailyForecasts = forecastData.list
          .filter((_: any, index: number) => index % 8 === 0) // Get one forecast per day
          .slice(0, 5) // Get 5 days
          .map((day: any) => ({
            date: new Date(day.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
            temp: {
              min: Math.round(day.main.temp_min),
              max: Math.round(day.main.temp_max)
            },
            condition: day.weather[0].main,
            icon: day.weather[0].icon
          }));

        setWeather({
          current: {
            temp: Math.round(currentData.main.temp),
            condition: currentData.weather[0].main,
            icon: currentData.weather[0].icon,
          },
          forecast: dailyForecasts,
          location: {
            name: currentData.name,
            country: currentData.sys.country
          }
        });
        setError(null);
      } catch (err) {
        console.error('Weather fetch error:', err);
        setError('Unable to fetch weather');
      } finally {
        setLoading(false);
      }
    };

    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          getWeather(position.coords.latitude, position.coords.longitude);
        },
        (err) => {
          console.error('Geolocation error:', err);
          setError('Location access denied');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation not supported');
      setLoading(false);
    }
  }, [unit]);

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear':
        return <WiDaySunny className="w-8 h-8" />;
      case 'clouds':
        return <WiCloudy className="w-8 h-8" />;
      case 'rain':
      case 'drizzle':
        return <WiRain className="w-8 h-8" />;
      case 'snow':
        return <WiSnow className="w-8 h-8" />;
      case 'thunderstorm':
        return <WiThunderstorm className="w-8 h-8" />;
      case 'mist':
      case 'fog':
        return <WiFog className="w-8 h-8" />;
      default:
        return <WiDaySunny className="w-8 h-8" />;
    }
  };

  const formatTemperature = (temp: number): string => {
    return `${Math.round(temp)}°${unit === 'fahrenheit' ? 'F' : 'C'}`;
  };

  if (loading) {
    return (
      <div className="backdrop-blur-bg rounded-lg p-3 text-white">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="backdrop-blur-bg rounded-lg p-3 text-white">
        {error}
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div 
      className={`backdrop-blur-bg rounded-lg transition-all duration-300 ${
        isExpanded ? 'p-4' : 'p-3'
      }`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Current Weather */}
      <div className="flex items-center gap-2 text-white cursor-pointer">
        {getWeatherIcon(weather.current.condition)}
        <span className="text-2xl font-semibold">
          {formatTemperature(weather.current.temp)}
        </span>
        <IoLocationOutline className="w-4 h-4 ml-2" />
        <span className="text-sm opacity-80">
          {weather.location.name}
        </span>
      </div>

      {/* Forecast (shows when expanded) */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="grid grid-cols-5 gap-2 text-white text-center">
            {weather.forecast.map((day) => (
              <div key={day.date} className="flex flex-col items-center">
                <span className="text-xs opacity-80">{day.date}</span>
                {getWeatherIcon(day.condition)}
                <div className="text-xs space-x-2">
                  <span className="opacity-80">{formatTemperature(day.temp.min)}</span>
                  <span>{formatTemperature(day.temp.max)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Weather; 