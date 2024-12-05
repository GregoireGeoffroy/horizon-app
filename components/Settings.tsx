'use client';

import { useState } from 'react';
import { IoSettingsOutline } from "react-icons/io5";

interface SettingsProps {
  clockFormat: {
    format24h: boolean;
    showSeconds: boolean;
  };
  weatherSettings: {
    unit: 'celsius' | 'fahrenheit';
  };
  onClockFormatChange: (settings: { format24h: boolean; showSeconds: boolean }) => void;
  onWeatherSettingsChange: (settings: { unit: 'celsius' | 'fahrenheit' }) => void;
}

const Settings = ({ 
  clockFormat, 
  weatherSettings,
  onClockFormatChange,
  onWeatherSettingsChange 
}: SettingsProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Settings Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 p-3 rounded-full backdrop-blur-bg hover:bg-black/30 transition-colors z-20"
        aria-label="Open settings"
      >
        <IoSettingsOutline className="w-6 h-6 text-white" />
      </button>

      {/* Modal Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Settings Modal */}
      {isOpen && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md backdrop-blur-bg bg-black/30 rounded-lg p-6 z-40">
          <h2 className="text-xl text-white mb-6 font-semibold">Settings</h2>
          
          {/* Clock Settings */}
          <div className="space-y-4 mb-8">
            <h3 className="text-white/80 text-sm font-medium mb-2">Clock Format</h3>
            
            <div className="flex items-center justify-between">
              <label className="text-white/70">Time Format</label>
              <select
                value={clockFormat.format24h ? "24h" : "12h"}
                onChange={(e) => onClockFormatChange({
                  ...clockFormat,
                  format24h: e.target.value === "24h"
                })}
                className="bg-white/10 text-white border border-white/20 rounded px-2 py-1"
              >
                <option value="12h">12-hour</option>
                <option value="24h">24-hour</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-white/70">Show Seconds</label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={clockFormat.showSeconds}
                  onChange={(e) => onClockFormatChange({
                    ...clockFormat,
                    showSeconds: e.target.checked
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>
          </div>

          {/* Weather Settings */}
          <div className="space-y-4 mb-8">
            <h3 className="text-white/80 text-sm font-medium mb-2">Weather Settings</h3>
            
            <div className="flex items-center justify-between">
              <label className="text-white/70">Temperature Unit</label>
              <select
                value={weatherSettings.unit}
                onChange={(e) => onWeatherSettingsChange({
                  unit: e.target.value as 'celsius' | 'fahrenheit'
                })}
                className="bg-white/10 text-white border border-white/20 rounded px-2 py-1"
              >
                <option value="celsius">Celsius (°C)</option>
                <option value="fahrenheit">Fahrenheit (°F)</option>
              </select>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="mt-6 w-full py-2 px-4 bg-white/10 hover:bg-white/20 text-white rounded transition-colors"
          >
            Close
          </button>
        </div>
      )}
    </>
  );
};

export default Settings; 