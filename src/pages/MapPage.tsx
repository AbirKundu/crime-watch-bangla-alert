import React, { useState, useMemo } from 'react';
import CrimeMap from '@/components/CrimeMap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Shield } from 'lucide-react';
import { useUser } from '@/context/UserContext';

const MapPage = () => {
  const { allReports } = useUser();
  const [crimeType, setCrimeType] = useState<string>("all");
  const [timeFrame, setTimeFrame] = useState<string>("24h");
  
  // Filter reports based on selected criteria
  const filteredReports = useMemo(() => {
    let filtered = allReports;
    
    // Filter by crime type
    if (crimeType !== "all") {
      filtered = filtered.filter(report => report.type.toLowerCase() === crimeType.toLowerCase());
    }
    
    // Filter by time frame (simplified - in real app you'd use actual dates)
    if (timeFrame !== "all") {
      const now = new Date();
      filtered = filtered.filter(report => {
        if (timeFrame === "24h") {
          return report.time.includes("Just now") || 
                 report.time.includes("minutes ago") || 
                 report.time.includes("hours ago") ||
                 report.time.includes("hour ago");
        } else if (timeFrame === "7d") {
          return !report.time.includes("month") && !report.time.includes("year");
        } else if (timeFrame === "30d") {
          return !report.time.includes("year");
        }
        return true;
      });
    }
    
    return filtered;
  }, [allReports, crimeType, timeFrame]);

  // Calculate real statistics
  const stats = useMemo(() => {
    const today = filteredReports.filter(report => 
      report.time.includes("Just now") || 
      report.time.includes("minutes ago") || 
      report.time.includes("hours ago") ||
      report.time.includes("hour ago")
    );
    
    const critical = filteredReports.filter(report => report.severity === 'high');
    
    // Count unique locations
    const uniqueLocations = new Set(filteredReports.map(report => report.location.toLowerCase())).size;
    
    return [
      { 
        label: "Total Incidents", 
        value: filteredReports.length.toString(), 
        change: today.length > 0 ? `+${today.length}` : "0" 
      },
      { 
        label: "Critical Reports", 
        value: critical.length.toString(), 
        change: critical.length > filteredReports.length / 2 ? "+High" : "-Low" 
      },
      { 
        label: "Areas Affected", 
        value: uniqueLocations.toString(), 
        change: uniqueLocations > 3 ? "+3%" : "0%" 
      },
    ];
  }, [filteredReports]);

  // Calculate hotspots based on actual data
  const hotspots = useMemo(() => {
    const locationCounts: Record<string, number> = {};
    
    filteredReports.forEach(report => {
      const location = report.location;
      locationCounts[location] = (locationCounts[location] || 0) + 1;
    });
    
    return Object.entries(locationCounts)
      .sort(([,a], [,b]) => (b as number) - (a as number))
      .slice(0, 4)
      .map(([location, count], index) => ({
        name: location,
        count: count as number,
        color: index === 0 ? 'border-destructive' : 
               index === 1 ? 'border-yellow-600' : 
               index === 2 ? 'border-primary' : 'border-green-600'
      }));
  }, [filteredReports]);

  return (
    <div className="container py-8 px-4 sm:px-6">
      <div className="flex items-center gap-3 mb-2">
        <Shield className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Live Crime Map</h1>
      </div>
      <p className="text-muted-foreground mb-4">
        Interactive map showing {allReports.length} criminal incidents reported by the community across Bangladesh.
      </p>
      <div className="mb-6 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
        <p className="text-sm text-green-700 dark:text-green-300 flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Public Safety Data - Accessible to all community members without login
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="mb-6 bg-card/70 backdrop-blur-sm border-border/50">
            <CardHeader className="pb-2 flex flex-row flex-wrap gap-4 items-center justify-between">
              <CardTitle className="text-xl">
                Incident Map ({filteredReports.length} incidents)
              </CardTitle>
              <div className="flex flex-wrap gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="crime-type" className="text-xs">Crime Type</Label>
                  <Select value={crimeType} onValueChange={setCrimeType}>
                    <SelectTrigger id="crime-type" className="w-[140px]">
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="theft">Theft</SelectItem>
                      <SelectItem value="robbery">Robbery</SelectItem>
                      <SelectItem value="assault">Assault</SelectItem>
                      <SelectItem value="fraud">Fraud</SelectItem>
                      <SelectItem value="suspicious">Suspicious</SelectItem>
                      <SelectItem value="vandalism">Vandalism</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="time-frame" className="text-xs">Time Frame</Label>
                  <Select value={timeFrame} onValueChange={setTimeFrame}>
                    <SelectTrigger id="time-frame" className="w-[140px]">
                      <SelectValue placeholder="Last 24 Hours" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24h">Last 24 Hours</SelectItem>
                      <SelectItem value="7d">Last 7 Days</SelectItem>
                      <SelectItem value="30d">Last 30 Days</SelectItem>
                      <SelectItem value="all">All Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <CrimeMap fullHeight={true} />
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card className="bg-card/70 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-xl">Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats.map((stat, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-muted-foreground">{stat.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-lg">{stat.value}</span>
                    <Badge variant={stat.change.startsWith("+") ? "destructive" : "outline"} className="text-xs">
                      {stat.change}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          
          <Card className="bg-card/70 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-xl">Hotspots</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {hotspots.length > 0 ? (
                hotspots.map((hotspot, i) => (
                  <div key={i} className={`border-l-4 ${hotspot.color} pl-3 py-1`}>
                    <div className="font-medium">{hotspot.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {hotspot.count} incident{hotspot.count !== 1 ? 's' : ''} reported
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-4">
                  <p className="text-sm">No incidents to display</p>
                  <p className="text-xs">Submit a report to see data here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
