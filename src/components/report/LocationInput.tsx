import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { MapPin, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface LocationInputProps {
  location: string;
  setLocation: (value: string) => void;
  useCurrentLocation: boolean;
  setUseCurrentLocation: (value: boolean) => void;
}

export const LocationInput: React.FC<LocationInputProps> = ({
  location,
  setLocation,
  useCurrentLocation,
  setUseCurrentLocation,
}) => {
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const { toast } = useToast();

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation.",
        variant: "destructive",
      });
      return;
    }

    setIsGettingLocation(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates({ lat: latitude, lng: longitude });
        setLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        setIsGettingLocation(false);
        
        toast({
          title: "Location captured",
          description: "Your current location has been captured successfully.",
        });
      },
      (error) => {
        setIsGettingLocation(false);
        let errorMessage = "Failed to get your location.";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied. Please enable location permissions.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
        }
        
        toast({
          title: "Location Error",
          description: errorMessage,
          variant: "destructive",
        });
        
        // Reset to manual input
        setUseCurrentLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  useEffect(() => {
    if (useCurrentLocation && !isGettingLocation && !coordinates) {
      getCurrentLocation();
    }
  }, [useCurrentLocation]);

  const handleLocationToggle = (checked: boolean) => {
    setUseCurrentLocation(checked);
    if (checked) {
      getCurrentLocation();
    } else {
      setCoordinates(null);
      setLocation('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <div className="flex gap-2">
          <Input 
            id="location" 
            placeholder={useCurrentLocation ? "Getting location..." : "Enter address or coordinates (lat, lng)"} 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            disabled={useCurrentLocation || isGettingLocation}
            required={!useCurrentLocation} 
          />
          {useCurrentLocation && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={getCurrentLocation}
              disabled={isGettingLocation}
            >
              {isGettingLocation ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <MapPin className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
        {coordinates && (
          <p className="text-xs text-muted-foreground">
            📍 Coordinates: {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
          </p>
        )}
      </div>
      
      <div className="flex items-center space-x-4">
        <Switch 
          id="use-location" 
          checked={useCurrentLocation}
          onCheckedChange={handleLocationToggle}
          disabled={isGettingLocation}
        />
        <Label htmlFor="use-location">
          {isGettingLocation ? "Getting current location..." : "Use my current location"}
        </Label>
      </div>
      
      <div className="text-xs text-muted-foreground space-y-1">
        <p><strong>Privacy Notice:</strong></p>
        <p>• Enable "Use my current location" to show the incident on the map with precise coordinates</p>
        <p>• Keep it disabled to store the location privately (won't be shown on the public map)</p>
        <p>• For manual entry: use coordinates format (23.8103, 90.4125) or enter an address</p>
      </div>
    </div>
  );
};
