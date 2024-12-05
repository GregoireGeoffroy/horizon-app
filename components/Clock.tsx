'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ClockProps {
  format24h?: boolean;
}

const Clock: React.FC<ClockProps> = ({ format24h = false }) => {
  const [time, setTime] = useState<Date>(new Date());
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const formatTime = (date: Date) => {
      const hours = format24h 
        ? date.getHours() 
        : date.getHours() % 12 || 12;
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const period = format24h ? '' : date.getHours() >= 12 ? 'PM' : 'AM';
      return `${hours}:${minutes}${period}`;
    };

    setCurrentTime(formatTime(time));
  }, [time, format24h]);

  return (
    <div className="text-8xl font-bold text-white drop-shadow-lg">
      <AnimatePresence mode="popLayout">
        <motion.div
          key={currentTime}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-center"
        >
          {currentTime}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Clock; 