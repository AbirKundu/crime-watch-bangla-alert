
import React from 'react';
import { AlertTriangle, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface CrimeIncident {
  id: string; // Changed from number to string to match UUID from database
  title: string;
  location: string;
  time: string;
  type: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  imageUrl?: string;
}

interface CrimeCardProps {
  incident: CrimeIncident;
}

const CrimeCard: React.FC<CrimeCardProps> = ({ incident }) => {
  const severityColors = {
    high: 'bg-destructive text-destructive-foreground',
    medium: 'bg-yellow-600 text-white',
    low: 'bg-green-600 text-white',
  };

  return (
    <Card className="overflow-hidden border-border/50 bg-card/70 backdrop-blur-sm hover:bg-card/90 transition-colors">
      {incident.imageUrl && (
        <div className="w-full h-48 overflow-hidden">
          <img 
            src={incident.imageUrl} 
            alt={incident.title} 
            className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold">{incident.title}</CardTitle>
          <Badge className={severityColors[incident.severity]}>
            {incident.severity === 'high' ? 'Critical' : 
             incident.severity === 'medium' ? 'Warning' : 'Alert'}
          </Badge>
        </div>
        <CardDescription className="flex items-center gap-1 text-sm text-muted-foreground">
          <AlertTriangle className="h-3 w-3 text-primary" />
          {incident.location}
          <span className="mx-1">•</span>
          <Clock className="h-3 w-3" />
          {incident.time}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{incident.description}</p>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between">
        <Badge variant="outline">{incident.type}</Badge>
        <button className="text-xs text-primary hover:underline">More Info</button>
      </CardFooter>
    </Card>
  );
};

export default CrimeCard;
