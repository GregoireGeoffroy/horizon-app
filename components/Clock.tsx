'use client';

import { useState, useEffect } from 'react';

interface ClockProps {
  format24h?: boolean;
  showSeconds?: boolean;
  className?: string;
}

const Clock: React.FC<ClockProps> = ({ 
  format24h = false, 
  showSeconds = false,
  className = ''
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const formatTime = (date: Date) => {
      const hours = format24h 
        ? date.getHours().toString().padStart(2, '0')
        : (date.getHours() % 12 || 12).toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const seconds = date.getSeconds().toString().padStart(2, '0');
      const period = format24h ? '' : date.getHours() >= 12 ? ' PM' : ' AM';
      
      return `${hours}:${minutes}${showSeconds ? ':' + seconds : ''}${period}`;
    };

    const updateTime = () => {
      setCurrentTime(formatTime(new Date()));
    };

    // Update immediately
    updateTime();

    // Then update every second
    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, [format24h, showSeconds]);

  return (
    <div className={`clock text-shadow text-white ${className}`}>
      {currentTime}
    </div>
  );
};

export default Clock; 