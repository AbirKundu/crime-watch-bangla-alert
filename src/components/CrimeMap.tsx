import React, { useEffect, useState, useRef } from 'react';
import { MapPin, AlertTriangle, Shield, Activity } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const CrimeMap = ({ fullHeight = false }) => {
  const { allReports } = useUser();
  const [selectedReport, setSelectedReport] = useState(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  // Parse coordinates from location string or return default coordinates for Bangladesh
  const parseLocationCoordinates = (location: string) => {
    // Check if location contains coordinates in format "lat,lng" or "latitude,longitude"
    const coordMatch = location.match(/(-?\d+\.?\d*),\s*(-?\d+\.?\d*)/);
    if (coordMatch) {
      const lat = parseFloat(coordMatch[1]);
      const lng = parseFloat(coordMatch[2]);
      if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        return { lat, lng, name: location, isExact: true };
      }
    }

    // Fallback to approximate locations in Bangladesh
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
        return { ...locationMap[key], isExact: false };
      }
    }
    
    // Default to central Dhaka if location not found
    return { lat: 23.8103, lng: 90.4125, name: location, isExact: false };
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return '#ef4444';
      case 'medium': return '#eab308';
      case 'low': return '#22c55e';
      default: return '#3b82f6';
    }
  };

  const createCustomIcon = (severity: string) => {
    const color = getSeverityColor(severity);
    
    return L.divIcon({
      className: 'custom-div-icon',
      html: `
        <div style="
          width: 20px;
          height: 20px;
          background-color: ${color};
          border: 2px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="
            width: 8px;
            height: 8px;
            background-color: white;
            border-radius: 50%;
          "></div>
        </div>
      `,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
      popupAnchor: [0, -10]
    });
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Create map centered on Dhaka, Bangladesh
    mapRef.current = L.map(mapContainerRef.current).setView([23.8103, 90.4125], 11);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(mapRef.current);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update markers when reports change
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapRef.current?.removeLayer(marker);
    });
    markersRef.current = [];

    // Add new markers
    allReports.forEach((report) => {
      const coords = parseLocationCoordinates(report.location);
      const icon = createCustomIcon(report.severity);
      
      const marker = L.marker([coords.lat, coords.lng], { icon })
        .addTo(mapRef.current!)
        .bindPopup(`
          <div class="p-2 min-w-[200px]">
            <div class="flex items-center justify-between mb-2">
              <h4 class="font-semibold text-sm">${report.title}</h4>
              <span class="px-2 py-1 text-xs rounded ${
                report.severity === 'high' ? 'bg-red-100 text-red-800' : 
                report.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                'bg-green-100 text-green-800'
              }">${report.severity}</span>
            </div>
            <p class="text-xs text-gray-600 mb-1">${coords.name}</p>
            <p class="text-xs mb-2">${report.description.substring(0, 100)}...</p>
            <div class="flex justify-between text-xs text-gray-500">
              <span>${report.type}</span>
              <span>${report.time}</span>
            </div>
            ${!coords.isExact ? '<p class="text-xs text-orange-600 mt-1">⚠ Approximate location</p>' : ''}
          </div>
        `);

      markersRef.current.push(marker);
    });

    // Fit map to show all markers if there are any
    if (markersRef.current.length > 0) {
      const group = L.featureGroup(markersRef.current);
      mapRef.current.fitBounds(group.getBounds().pad(0.1));
    }
  }, [allReports]);

  return (
    <div className={`relative w-full ${fullHeight ? 'h-[calc(100vh-11rem)]' : 'h-[400px]'} rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800`}>
      {/* Leaflet map container */}
      <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />
      
      {/* Map legend - positioned in left middle */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-background/90 backdrop-blur-sm rounded-lg p-3 shadow-lg z-[1000]">
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
        <div className="mt-1 text-xs text-orange-600">
          ⚠ Some locations are approximate
        </div>
      </div>
    </div>
  );
};

export default CrimeMap;
