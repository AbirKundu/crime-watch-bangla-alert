
import React, { useState } from 'react';
import { MessageCircle, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

import CrimeCard, { CrimeIncident } from '@/components/CrimeCard';
import { useUser, UserReport } from '@/context/UserContext';

// Move image imports to the top level of the file
import crimePic1 from '../components/picture/crimePic1.jpg';
import crimePic2 from '../components/picture/crimePic2.jpg';
import crimePic3 from '../components/picture/crimePic3.jpg';
import crimePic4 from '../components/picture/crimePic4.jpg';
import crimePic5 from '../components/picture/crimePic5.jpg';
import crimePic6 from '../components/picture/crimePic6.jpg';

const NewsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { userReports } = useUser();

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

  // Convert UserReport type to CrimeIncident type for the CrimeCard component
  const userReportsAsIncidents: CrimeIncident[] = userReports.map(report => ({
    ...report,
    // Add any missing fields if needed
  }));

  // Combine user reports with official incidents for the "All" tab
  const combinedIncidents = [...userReportsAsIncidents, ...allIncidents];

  const filterIncidents = (incidents: CrimeIncident[], term: string) => {
    if (!term) return incidents;
    return incidents.filter(incident => 
      incident.title.toLowerCase().includes(term.toLowerCase()) || 
      incident.description.toLowerCase().includes(term.toLowerCase()) ||
      incident.location.toLowerCase().includes(term.toLowerCase()) ||
      incident.type.toLowerCase().includes(term.toLowerCase())
    );
  };

  // Count today's incidents
  const todayCount = combinedIncidents.filter(incident => 
    incident.time.includes("Today") || 
    incident.time.includes("Just now") || 
    incident.time.includes("minutes ago")
  ).length;

  // Count this week's incidents
  const weekCount = combinedIncidents.filter(incident => 
    !incident.time.includes("month") && !incident.time.includes("year")
  ).length;

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
            <TabsTrigger value="user">User Reports</TabsTrigger>
            <TabsTrigger value="government">Government Updates</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-background/50">Today: {todayCount}</Badge>
            <Badge variant="outline" className="bg-background/50">This Week: {weekCount}</Badge>
          </div>
        </div>
        
        <div className="mt-6">
          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterIncidents(combinedIncidents, searchTerm).map(incident => (
                <CrimeCard key={incident.id} incident={incident} />
              ))}
            </div>
            
            {filterIncidents(combinedIncidents, searchTerm).length === 0 && (
              <div className="text-center py-12">
                <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No incidents found</h3>
                <p className="text-muted-foreground">Try adjusting your search terms</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="user" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterIncidents(userReportsAsIncidents, searchTerm).map(incident => (
                <CrimeCard key={incident.id} incident={incident} />
              ))}
            </div>
            
            {filterIncidents(userReportsAsIncidents, searchTerm).length === 0 && (
              <div className="text-center py-12">
                <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No user reports found</h3>
                <p className="text-muted-foreground">Be the first to report an incident!</p>
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
