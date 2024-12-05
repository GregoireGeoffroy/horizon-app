import Clock from "@/components/Clock";
import Background from "@/components/Background";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background with nature/landscape photos */}
      <Background query="nature,landscape" />
      
      {/* Main Content */}
      <main className="relative z-10 min-h-screen flex flex-col items-center justify-between p-8">
        {/* Top Section */}
        <div className="w-full flex justify-end p-4">
          {/* Weather will go here */}
        </div>

        {/* Center Section */}
        <div className="flex flex-col items-center gap-8">
          <Clock 
            format24h={false}
            showSeconds={true}
            className="text-7xl md:text-8xl lg:text-9xl text-shadow text-white"
          />
          {/* Quote will go here */}
        </div>

        {/* Bottom Section */}
        <div className="w-full max-w-md backdrop-blur-bg rounded-lg p-4">
          {/* Todo List will go here */}
        </div>
      </main>

      {/* Settings Button */}
      <button 
        className="fixed bottom-8 right-8 p-3 rounded-full backdrop-blur-bg hover:bg-black/30 transition-colors z-20"
        aria-label="Settings"
      >
        <svg 
          className="w-6 h-6 text-white"
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </button>
    </div>
  );
}
