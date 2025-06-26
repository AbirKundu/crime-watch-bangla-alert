
import React, { useState } from 'react';
import { MessageCircle, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

import CrimeCard, { CrimeIncident } from '@/components/CrimeCard';
import { useUser } from '@/context/UserContext';

const NewsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { allReports, userReports, isAuthenticated } = useUser();

  // Convert UserReport type to CrimeIncident type for the CrimeCard component
  const allIncidentsAsReports: CrimeIncident[] = allReports.map(report => ({
    ...report,
    // Add any missing fields if needed
  }));

  const userReportsAsIncidents: CrimeIncident[] = userReports.map(report => ({
    ...report,
    // Add any missing fields if needed
  }));

  const filterIncidents = (incidents: CrimeIncident[], term: string) => {
    if (!term) return incidents;
    return incidents.filter(incident => 
      incident.title.toLowerCase().includes(term.toLowerCase()) || 
      incident.description.toLowerCase().includes(term.toLowerCase()) ||
      incident.location.toLowerCase().includes(term.toLowerCase()) ||
      incident.type.toLowerCase().includes(term.toLowerCase())
    );
  };

  // Count today's incidents from all reports
  const todayCount = allIncidentsAsReports.filter(incident => 
    incident.time.includes("Today") || 
    incident.time.includes("Just now") || 
    incident.time.includes("minutes ago")
  ).length;

  // Count this week's incidents from all reports
  const weekCount = allIncidentsAsReports.filter(incident => 
    !incident.time.includes("month") && !incident.time.includes("year")
  ).length;

  return (
    <div className="container py-8 px-4 sm:px-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">News & Alerts</h1>
          <p className="text-muted-foreground">
            {isAuthenticated 
              ? "All crime reports from community members across Bangladesh" 
              : "Crime reports submitted by community members across Bangladesh"
            }
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
            {isAuthenticated && <TabsTrigger value="user">My Reports</TabsTrigger>}
          </TabsList>
          
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-background/50">Today: {todayCount}</Badge>
            <Badge variant="outline" className="bg-background/50">This Week: {weekCount}</Badge>
          </div>
        </div>
        
        <div className="mt-6">
          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterIncidents(allIncidentsAsReports, searchTerm).map(incident => (
                <CrimeCard key={incident.id} incident={incident} />
              ))}
            </div>
            
            {filterIncidents(allIncidentsAsReports, searchTerm).length === 0 && (
              <div className="text-center py-12">
                <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No reports found</h3>
                <p className="text-muted-foreground">
                  {allReports.length === 0 
                    ? "No reports have been submitted yet. Be the first to report an incident!" 
                    : "Try adjusting your search terms"}
                </p>
              </div>
            )}
          </TabsContent>
          
          {isAuthenticated && (
            <TabsContent value="user" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filterIncidents(userReportsAsIncidents, searchTerm).map(incident => (
                  <CrimeCard key={incident.id} incident={incident} />
                ))}
              </div>
              
              {filterIncidents(userReportsAsIncidents, searchTerm).length === 0 && (
                <div className="text-center py-12">
                  <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No personal reports found</h3>
                  <p className="text-muted-foreground">
                    {userReports.length === 0 
                      ? "You haven't submitted any reports yet. Report an incident to see it here!" 
                      : "Try adjusting your search terms"}
                  </p>
                </div>
              )}
            </TabsContent>
          )}
        </div>
      </Tabs>
    </div>
  );
};

export default NewsPage;
