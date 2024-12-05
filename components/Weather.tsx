'use client';

import { useState, useEffect } from 'react';
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm, WiFog } from 'react-icons/wi';

interface WeatherData {
  temp: number;
  condition: string;
  icon: string;
}

interface WeatherProps {
  unit: 'celsius' | 'fahrenheit';
}

const Weather = ({ unit }: WeatherProps) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getWeather = async (lat: number, lon: number) => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit === 'fahrenheit' ? 'imperial' : 'metric'}&appid=${process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }

        const data = await response.json();
        setWeather({
          temp: Math.round(data.main.temp),
          condition: data.weather[0].main,
          icon: data.weather[0].icon,
        });
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
  }, []);

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
    if (unit === 'fahrenheit') {
      return `${Math.round(temp * 9/5 + 32)}°F`;
    }
    return `${Math.round(temp)}°C`;
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
    <div className="backdrop-blur-bg rounded-lg p-3 text-white flex items-center gap-2">
      {getWeatherIcon(weather.condition)}
      <span className="text-2xl font-semibold">{formatTemperature(weather.temp)}</span>
    </div>
  );
};

export default Weather; 