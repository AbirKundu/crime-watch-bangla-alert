
import React from 'react';
import { MapPin } from 'lucide-react';

// In a real application, this would be replaced with a proper map integration like Google Maps or Mapbox
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
    <div className={`relative w-full ${fullHeight ? 'h-[calc(100vh-11rem)]' : 'h-[400px]'} bg-secondary/50 rounded-lg overflow-hidden`}>
      {/* This is a placeholder map background */}
      <div className="absolute inset-0 bg-[url('https://miro.medium.com/max/1400/1*qYUvh-EtES8dtgKiBRiLsA.png')] bg-cover bg-center opacity-50"></div>
      
      {/* Map overlay with grid lines */}
      <div className="absolute inset-0 bg-secondary bg-opacity-70">
        <div className="h-full w-full grid grid-cols-8 grid-rows-8">
          {Array.from({ length: 64 }).map((_, i) => (
            <div key={i} className="border border-border/20"></div>
          ))}
        </div>
      </div>
      
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
        CrimeWatch Map (Simulated)
      </div>
    </div>
  );
};

export default CrimeMap;
