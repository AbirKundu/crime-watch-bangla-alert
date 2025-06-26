
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

  console.log('NewsPage - All reports:', allReports);
  console.log('NewsPage - User reports:', userReports);
  console.log('NewsPage - Is authenticated:', isAuthenticated);

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
  const todayCount = allReports.filter(incident => 
    incident.time.includes("Today") || 
    incident.time.includes("Just now") || 
    incident.time.includes("minutes ago")
  ).length;

  // Count this week's incidents from all reports
  const weekCount = allReports.filter(incident => 
    !incident.time.includes("month") && !incident.time.includes("year")
  ).length;

  // Filter all reports and user reports based on search term
  const filteredAllReports = filterIncidents(allReports, searchTerm);
  const filteredUserReports = filterIncidents(userReports, searchTerm);

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
            <TabsTrigger value="all">All Reports ({filteredAllReports.length})</TabsTrigger>
            {isAuthenticated && <TabsTrigger value="user">My Reports ({filteredUserReports.length})</TabsTrigger>}
          </TabsList>
          
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-background/50">Today: {todayCount}</Badge>
            <Badge variant="outline" className="bg-background/50">This Week: {weekCount}</Badge>
          </div>
        </div>
        
        <div className="mt-6">
          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAllReports.map(incident => (
                <CrimeCard key={incident.id} incident={incident} />
              ))}
            </div>
            
            {filteredAllReports.length === 0 && (
              <div className="text-center py-12">
                <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">No reports found</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? "Try adjusting your search terms" : "No reports have been submitted yet. Be the first to report an incident!"}
                </p>
              </div>
            )}
          </TabsContent>
          
          {isAuthenticated && (
            <TabsContent value="user" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUserReports.map(incident => (
                  <CrimeCard key={incident.id} incident={incident} />
                ))}
              </div>
              
              {filteredUserReports.length === 0 && (
                <div className="text-center py-12">
                  <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No personal reports found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm ? "Try adjusting your search terms" : "You haven't submitted any reports yet. Report an incident to see it here!"}
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
