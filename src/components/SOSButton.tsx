
import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const SOSButton = () => {
  const { toast } = useToast();
  const [isPressed, setIsPressed] = useState(false);
  
  const handleSOSClick = () => {
    setIsPressed(true);
    
    toast({
      title: "Emergency Alert Sent",
      description: "Authorities have been notified of your emergency.",
      variant: "destructive",
    });
    
    // In a real application, this would trigger an API call to emergency services
    // and potentially share location data
    
    // Reset button state after 3 seconds
    setTimeout(() => {
      setIsPressed(false);
    }, 3000);
  };
  
  return (
    <div className="fixed bottom-6 right-6 z-40">
      <Button 
        onClick={handleSOSClick}
        disabled={isPressed}
        className={`rounded-full h-16 w-16 shadow-lg ${isPressed ? 'bg-secondary' : 'bg-primary'} ${!isPressed && 'pulse-alert'}`}
      >
        <AlertTriangle className="h-8 w-8" />
        <span className="sr-only">Emergency SOS</span>
      </Button>
    </div>
  );
};

export default SOSButton;
