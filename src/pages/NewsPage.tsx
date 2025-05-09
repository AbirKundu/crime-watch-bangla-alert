
import React, { useState } from 'react';
import { MessageCircle, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

import CrimeCard, { CrimeIncident } from '@/components/CrimeCard';

// Using placeholder images from Unsplash
const crimePic1 = "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80";
const crimePic2 = "https://images.unsplash.com/photo-1500673922987-e212871fec22?auto=format&fit=crop&w=800&q=80";
const crimePic3 = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80";
const crimePic4 = "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80";
const crimePic5 = "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80";
const crimePic6 = "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=800&q=80";

// Sample news data
const allIncidents: CrimeIncident[] = [
  {
    id: 1,
    title: "Armed Robbery at Convenience Store",
    location: "Banani, Dhaka",
    time: "Today, 2:30 PM",
    type: "Robbery",
    description: "Two armed individuals robbed a convenience store. Police are investigating. No injuries reported.",
    severity: "high",
    imageUrl: crimePic1
  },
  {
    id: 2,
    title: "Vehicle Break-in",
    location: "Dhanmondi, Dhaka",
    time: "Today, 11:15 AM",
    type: "Theft",
    description: "Multiple vehicles reported broken into with valuables stolen from inside.",
    severity: "medium",
    imageUrl: crimePic2
  },
  {
    id: 3,
    title: "Suspicious Activity",
    location: "Gulshan 2, Dhaka",
    time: "Yesterday, 9:45 PM",
    type: "Suspicious",
    description: "Residents reported suspicious individuals surveilling residences in the area.",
    severity: "low",
    imageUrl: crimePic3
  },
  {
    id: 4,
    title: "Phone Snatching Incident",
    location: "Motijheel, Dhaka",
    time: "Yesterday, 6:20 PM",
    type: "Theft",
    description: "A person's phone was snatched while they were walking. Suspects fled on a motorcycle.",
    severity: "medium",
    imageUrl: crimePic4
  },
  {
    id: 5,
    title: "Home Invasion",
    location: "Uttara, Dhaka",
    time: "2 days ago, 3:15 AM",
    type: "Burglary",
    description: "A residence was broken into while occupants were sleeping. Electronics and jewelry stolen.",
    severity: "high",
    imageUrl: crimePic5
  },
  {
    id: 6,
    title: "Credit Card Fraud Alert",
    location: "Online",
    time: "2 days ago, 10:40 AM",
    type: "Fraud",
    description: "Multiple residents reporting unauthorized transactions. Local bank investigating.",
    severity: "medium",
    imageUrl: crimePic6
  },
];

// Government updates
const governmentUpdates: CrimeIncident[] = [
  {
    id: 101,
    title: "Police Increase Patrols in Gulshan Area",
    location: "Gulshan, Dhaka",
    time: "Today, 9:00 AM",
    type: "Police",
    description: "Due to recent incidents, police have increased patrol frequency in Gulshan residential areas.",
    severity: "low",
    imageUrl: crimePic2
  },
  {
    id: 102,
    title: "New Traffic Control Measures",
    location: "Dhaka City",
    time: "Yesterday, 11:00 AM",
    type: "Traffic",
    description: "Authorities announce new traffic control measures to reduce congestion and improve safety.",
    severity: "low",
    imageUrl: crimePic3
  },
  {
    id: 103,
    title: "Anti-Corruption Drive Launched",
    location: "Nationwide",
    time: "3 days ago, 2:30 PM",
    type: "Government",
    description: "Government launches new initiative to combat corruption in public services.",
    severity: "medium",
    imageUrl: crimePic1
  },
  {
    id: 104,
    title: "Cybersecurity Advisory Issued",
    location: "Nationwide",
    time: "4 days ago, 10:15 AM",
    type: "Security",
    description: "Government issues advisory on protecting personal data from increasing cyber threats.",
    severity: "medium",
    imageUrl: crimePic4
  },
  {
    id: 105,
    title: "Emergency Response Training Program",
    location: "Dhaka Metropolitan",
    time: "1 week ago, 9:30 AM",
    type: "Training",
    description: "New program launched to train civilians on emergency response procedures.",
    severity: "low",
    imageUrl: crimePic5
  },
  {
    id: 106,
    title: "Public Safety Infrastructure Upgrade",
    location: "Dhaka City",
    time: "1 week ago, 3:45 PM",
    type: "Infrastructure",
    description: "City authorities announce plans to install additional CCTV cameras and emergency call boxes.",
    severity: "low",
    imageUrl: crimePic6
  },
];

const NewsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filterIncidents = (incidents: CrimeIncident[], term: string) => {
    if (!term) return incidents;
    return incidents.filter(incident => 
      incident.title.toLowerCase().includes(term.toLowerCase()) || 
      incident.description.toLowerCase().includes(term.toLowerCase()) ||
      incident.location.toLowerCase().includes(term.toLowerCase()) ||
      incident.type.toLowerCase().includes(term.toLowerCase())
    );
  };

  return (
    <div className="container py-8 px-4 sm:px-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">News & Alerts</h1>
          <p className="text-muted-foreground">
            Latest crime reports and official updates across Bangladesh
          </p>
        </div>
        
        <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search incidents..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <Tabs defaultValue="all" className="mb-8">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="all">All Incidents</TabsTrigger>
            <TabsTrigger value="government">Government Updates</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-background/50">Today: 3</Badge>
            <Badge variant="outline" className="bg-background/50">This Week: 12</Badge>
          </div>
        </div>
        
        <div className="mt-6">
          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterIncidents(allIncidents, searchTerm).map(incident => (
                <CrimeCard key={incident.id} incident={incident} />
              ))}
            </div>
            
            {filterIncidents(allIncidents, searchTerm).length === 0 && (
              <div className="text-center py-12">
                <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No incidents found</h3>
                <p className="text-muted-foreground">Try adjusting your search terms</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="government" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterIncidents(governmentUpdates, searchTerm).map(update => (
                <CrimeCard key={update.id} incident={update} />
              ))}
            </div>
            
            {filterIncidents(governmentUpdates, searchTerm).length === 0 && (
              <div className="text-center py-12">
                <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No updates found</h3>
                <p className="text-muted-foreground">Try adjusting your search terms</p>
              </div>
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default NewsPage;
