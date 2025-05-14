
import React from 'react';

const CrimeMap = ({ fullHeight = false }) => {
  return (
    <div className={`relative w-full ${fullHeight ? 'h-[calc(100vh-11rem)]' : 'h-[400px]'} rounded-lg overflow-hidden`}>
      {/* OpenStreetMap of Bangladesh */}
      <iframe 
        src="https://www.openstreetmap.org/export/embed.html?bbox=88.0,20.5,92.7,26.7&amp;layer=mapnik" 
        className="absolute inset-0 w-full h-full border-0"
        title="OpenStreetMap of Bangladesh"
      ></iframe>
      
      {/* Map controls (mock) */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button className="bg-background p-2 rounded shadow-md">
          <span className="text-xl font-bold">+</span>
        </button>
        <button className="bg-background p-2 rounded shadow-md">
          <span className="text-xl font-bold">−</span>
        </button>
      </div>
      
      {/* Map attribution */}
      <div className="absolute bottom-2 right-2 text-xs text-foreground/70 bg-background/50 px-2 py-1 rounded">
        © OpenStreetMap contributors
      </div>
    </div>
  );
};

export default CrimeMap;
