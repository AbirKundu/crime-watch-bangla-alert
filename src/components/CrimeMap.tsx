
import React, { useEffect, useState } from 'react';
import { MapPin, AlertTriangle, Shield, Activity } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const CrimeMap = ({ fullHeight = false }) => {
  const { allReports } = useUser();
  const [selectedReport, setSelectedReport] = useState(null);

  // Mock coordinates for Bangladesh locations (in a real app, you'd geocode addresses)
  const getLocationCoordinates = (location) => {
    const locationMap = {
      'gulshan': { lat: 23.7944, lng: 90.4164, name: 'Gulshan' },
      'dhanmondi': { lat: 23.7461, lng: 90.3742, name: 'Dhanmondi' },
      'uttara': { lat: 23.8759, lng: 90.3795, name: 'Uttara' },
      'banani': { lat: 23.7937, lng: 90.4066, name: 'Banani' },
      'mirpur': { lat: 23.8223, lng: 90.3654, name: 'Mirpur' },
      'wari': { lat: 23.7104, lng: 90.4074, name: 'Wari' },
      'old dhaka': { lat: 23.7104, lng: 90.4074, name: 'Old Dhaka' },
      'current location': { lat: 23.8103, lng: 90.4125, name: 'Current Location' },
    };

    const locationKey = location.toLowerCase();
    for (const key in locationMap) {
      if (locationKey.includes(key)) {
        return locationMap[key];
      }
    }
    
    // Default to central Dhaka if location not found
    return { lat: 23.8103, lng: 90.4125, name: location };
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-blue-500';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high': return AlertTriangle;
      case 'medium': return Shield;
      case 'low': return Activity;
      default: return MapPin;
    }
  };

  return (
    <div className={`relative w-full ${fullHeight ? 'h-[calc(100vh-11rem)]' : 'h-[400px]'} rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800`}>
      {/* OpenStreetMap of Bangladesh */}
      <iframe 
        src="https://www.openstreetmap.org/export/embed.html?bbox=88.0,20.5,92.7,26.7&amp;layer=mapnik" 
        className="absolute inset-0 w-full h-full border-0"
        title="OpenStreetMap of Bangladesh"
      ></iframe>
      
      {/* Crime report markers overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {allReports.map((report) => {
          const coords = getLocationCoordinates(report.location);
          const SeverityIcon = getSeverityIcon(report.severity);
          
          // Convert lat/lng to approximate pixel positions (simplified for demo)
          // In a real app, you'd use proper map projection calculations
          const left = ((coords.lng - 88.0) / (92.7 - 88.0)) * 100;
          const top = ((26.7 - coords.lat) / (26.7 - 20.5)) * 100;
          
          return (
            <div
              key={report.id}
              className="absolute pointer-events-auto cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform"
              style={{ left: `${left}%`, top: `${top}%` }}
              onClick={() => setSelectedReport(selectedReport?.id === report.id ? null : report)}
            >
              <div className={`w-4 h-4 ${getSeverityColor(report.severity)} rounded-full border-2 border-white shadow-lg flex items-center justify-center`}>
                <SeverityIcon className="w-2 h-2 text-white" />
              </div>
              
              {/* Tooltip on hover/click */}
              {selectedReport?.id === report.id && (
                <Card className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-64 z-10 shadow-lg">
                  <CardContent className="p-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-sm">{report.title}</h4>
                        <Badge variant={report.severity === 'high' ? 'destructive' : 'outline'} className="text-xs">
                          {report.severity}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{coords.name}</p>
                      <p className="text-xs">{report.description.substring(0, 100)}...</p>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{report.type}</span>
                        <span>{report.time}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Map legend */}
      <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
        <h3 className="text-sm font-semibold mb-2">Incident Severity</h3>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>High Risk</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Medium Risk</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Low Risk</span>
          </div>
        </div>
        <div className="mt-2 pt-2 border-t text-xs text-muted-foreground">
          Total Reports: {allReports.length}
        </div>
      </div>
      
      {/* Map controls (mock) */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <button className="bg-background p-2 rounded shadow-md hover:bg-accent">
          <span className="text-xl font-bold">+</span>
        </button>
        <button className="bg-background p-2 rounded shadow-md hover:bg-accent">
          <span className="text-xl font-bold">−</span>
        </button>
      </div>
      
      {/* Map attribution */}
      <div className="absolute bottom-2 right-2 text-xs text-foreground/70 bg-background/50 px-2 py-1 rounded">
        © OpenStreetMap contributors
      </div>
      
      {/* Click outside to close tooltip */}
      {selectedReport && (
        <div 
          className="absolute inset-0 pointer-events-auto"
          onClick={() => setSelectedReport(null)}
        />
      )}
    </div>
  );
};

export default CrimeMap;
