
import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';

const ReportPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { addReport, isAuthenticated } = useUser();
  
  const [title, setTitle] = useState('');
  const [incidentType, setIncidentType] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "You need to login to submit a report. Redirecting to login page...",
      });
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
      return;
    }
    
    // Determine severity based on incident type
    let severity: "low" | "medium" | "high" = "medium";
    if (["robbery", "assault", "violence"].includes(incidentType.toLowerCase())) {
      severity = "high";
    } else if (["suspicious", "vandalism"].includes(incidentType.toLowerCase())) {
      severity = "low";
    }
    
    // Add the report to our context
    addReport({
      title,
      location: useCurrentLocation ? "Current Location (Dhaka)" : location,
      type: incidentType,
      description,
      severity,
    });
    
    toast({
      title: "Report Submitted",
      description: "Thank you for your report. Authorities have been notified.",
    });
    
    // Clear the form
    setTitle('');
    setIncidentType('');
    setLocation('');
    setDescription('');
    setUseCurrentLocation(false);
    setIsAnonymous(false);
    
    // Redirect to news page to see the report
    setTimeout(() => {
      navigate('/news');
    }, 2000);
  };

  return (
    <div className="container py-8 px-4 sm:px-6">
      <h1 className="text-3xl font-bold mb-2">Report a Crime</h1>
      <p className="text-muted-foreground mb-6">
        Report criminal activity or suspicious behavior. Your information helps keep the community safe.
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="bg-card/70 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-2xl">Incident Report</CardTitle>
              <CardDescription>Fill in the details about what you witnessed</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
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
                    <Label htmlFor="location">Location</Label>
                    <Input 
                      id="location" 
                      placeholder="Address or area" 
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      disabled={useCurrentLocation}
                      required={!useCurrentLocation} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" type="date" required />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input id="time" type="time" required />
                  </div>
                </div>
                
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
                
                <div className="space-y-2">
                  <Label htmlFor="photo">Upload Photo/Video (Optional)</Label>
                  <Input id="photo" type="file" accept="image/*,video/*" className="cursor-pointer" />
                </div>
                
                <div className="flex items-center space-x-4">
                  <Switch 
                    id="use-location" 
                    checked={useCurrentLocation}
                    onCheckedChange={setUseCurrentLocation}
                  />
                  <Label htmlFor="use-location">Use my current location</Label>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Switch 
                    id="anonymous"
                    checked={isAnonymous}
                    onCheckedChange={setIsAnonymous}
                  />
                  <Label htmlFor="anonymous">Submit anonymously</Label>
                </div>
                
                <Button type="submit" size="lg" className="w-full">
                  Submit Report
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card className="bg-primary text-primary-foreground">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle />
                <CardTitle>Emergency?</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4">For emergencies requiring immediate assistance, please contact emergency services directly:</p>
              <p className="font-bold text-xl mb-2">Call 999</p>
              <p className="text-sm">This form is for non-emergency reports only.</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card/70 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Reporting Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>• Provide as much detail as possible</p>
              <p>• Include time and location information</p>
              <p>• Describe individuals involved</p>
              <p>• Note any vehicles or weapons seen</p>
              <p>• Add photo evidence if available</p>
              <p className="text-muted-foreground mt-4 text-xs">Your identity will be protected if you choose to report anonymously.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
