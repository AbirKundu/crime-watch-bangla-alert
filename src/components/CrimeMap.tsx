
import React from 'react';
import { MapPin } from 'lucide-react';

const CrimeMap = ({ fullHeight = false }) => {
  // Mock crime incidents - in real app would come from an API
  const incidents = [
    { id: 1, type: 'Theft', top: '30%', left: '40%' },
    { id: 2, type: 'Assault', top: '50%', left: '60%' },
    { id: 3, type: 'Robbery', top: '65%', left: '30%' },
    { id: 4, type: 'Fraud', top: '25%', left: '70%' },
    { id: 5, type: 'Vandalism', top: '45%', left: '25%' },
  ];

  return (
    <div className={`relative w-full ${fullHeight ? 'h-[calc(100vh-11rem)]' : 'h-[400px]'} rounded-lg overflow-hidden`}>
      {/* OpenStreetMap of Bangladesh */}
      <iframe 
        src="https://www.openstreetmap.org/export/embed.html?bbox=88.0,20.5,92.7,26.7&amp;layer=mapnik" 
        className="absolute inset-0 w-full h-full border-0"
        title="OpenStreetMap of Bangladesh"
      ></iframe>
      
      {/* Incident markers */}
      {incidents.map((incident) => (
        <div 
          key={incident.id}
          className="absolute z-10"
          style={{ top: incident.top, left: incident.left }}
        >
          <div className="relative group">
            <MapPin className="h-8 w-8 text-primary animate-pulse" />
            <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-card px-3 py-1 rounded shadow-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {incident.type} reported
            </div>
          </div>
        </div>
      ))}
      
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
