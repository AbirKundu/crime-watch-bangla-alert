
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { LocationInput } from './LocationInput';

interface FormFieldsProps {
  title: string;
  setTitle: (value: string) => void;
  incidentType: string;
  setIncidentType: (value: string) => void;
  location: string;
  setLocation: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  useCurrentLocation: boolean;
  setUseCurrentLocation: (value: boolean) => void;
}

export const FormFields: React.FC<FormFieldsProps> = ({
  title,
  setTitle,
  incidentType,
  setIncidentType,
  location,
  setLocation,
  description,
  setDescription,
  useCurrentLocation,
  setUseCurrentLocation,
}) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="title">Report Title</Label>
        <Input 
          id="title" 
          placeholder="Brief title describing the incident" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required 
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="incident-type">Incident Type</Label>
          <Select 
            value={incidentType}
            onValueChange={setIncidentType}
            required
          >
            <SelectTrigger id="incident-type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="theft">Theft</SelectItem>
              <SelectItem value="robbery">Robbery</SelectItem>
              <SelectItem value="assault">Assault</SelectItem>
              <SelectItem value="fraud">Fraud</SelectItem>
              <SelectItem value="suspicious">Suspicious Activity</SelectItem>
              <SelectItem value="vandalism">Vandalism</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input id="date" type="date" required />
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="time">Time</Label>
          <Input id="time" type="time" required />
        </div>
      </div>
      
      <LocationInput
        location={location}
        setLocation={setLocation}
        useCurrentLocation={useCurrentLocation}
        setUseCurrentLocation={setUseCurrentLocation}
      />
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description" 
          placeholder="Describe what happened in detail..." 
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
    </>
  );
};
