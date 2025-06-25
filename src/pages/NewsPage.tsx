
import React, { useState } from 'react';
import { MessageCircle, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

import CrimeCard, { CrimeIncident } from '@/components/CrimeCard';
import { useUser } from '@/context/UserContext';

const NewsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { userReports } = useUser();

  // Convert UserReport type to CrimeIncident type for the CrimeCard component
  const userReportsAsIncidents: CrimeIncident[] = userReports.map(report => ({
    ...report,
    // Add any missing fields if needed
  }));

  // Only user reports are shown now - no more sample data
  const allIncidents = userReportsAsIncidents;

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
  const todayCount = allIncidents.filter(incident => 
    incident.time.includes("Today") || 
    incident.time.includes("Just now") || 
    incident.time.includes("minutes ago")
  ).length;

  // Count this week's incidents
  const weekCount = allIncidents.filter(incident => 
    !incident.time.includes("month") && !incident.time.includes("year")
  ).length;

  return (
    <div className="container py-8 px-4 sm:px-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">News & Alerts</h1>
          <p className="text-muted-foreground">
            Crime reports submitted by community members across Bangladesh
          </p>
        </div>
        
        <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reports..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <Tabs defaultValue="all" className="mb-8">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="all">All Reports</TabsTrigger>
            <TabsTrigger value="user">User Reports</TabsTrigger>
          </TabsList>
          
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-background/50">Today: {todayCount}</Badge>
            <Badge variant="outline" className="bg-background/50">This Week: {weekCount}</Badge>
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
                <h3 className="text-xl font-semibold mb-2">No reports found</h3>
                <p className="text-muted-foreground">
                  {userReports.length === 0 
                    ? "No reports have been submitted yet. Be the first to report an incident!" 
                    : "Try adjusting your search terms"}
                </p>
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
                <p className="text-muted-foreground">
                  {userReports.length === 0 
                    ? "No reports have been submitted yet. Be the first to report an incident!" 
                    : "Try adjusting your search terms"}
                </p>
              </div>
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default NewsPage;
