
import React, { useState } from 'react';
import CrimeMap from '@/components/CrimeMap';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

const MapPage = () => {
  const [crimeType, setCrimeType] = useState<string>("all");
  const [timeFrame, setTimeFrame] = useState<string>("24h");
  
  // Mock statistics
  const stats = [
    { label: "Total Incidents", value: "143", change: "+12%" },
    { label: "Critical Reports", value: "27", change: "-5%" },
    { label: "Areas Affected", value: "32", change: "+3%" },
  ];

  return (
    <div className="container py-8 px-4 sm:px-6">
      <h1 className="text-3xl font-bold mb-2">Live Crime Map</h1>
      <p className="text-muted-foreground mb-6">
        Interactive map showing criminal incidents across Bangladesh.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="mb-6 bg-card/70 backdrop-blur-sm border-border/50">
            <CardHeader className="pb-2 flex flex-row flex-wrap gap-4 items-center justify-between">
              <CardTitle className="text-xl">Incident Map</CardTitle>
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
              <div className="border-l-4 border-destructive pl-3 py-1">
                <div className="font-medium">Gulshan-2</div>
                <div className="text-xs text-muted-foreground">23 incidents this month</div>
              </div>
              <div className="border-l-4 border-yellow-600 pl-3 py-1">
                <div className="font-medium">Dhanmondi</div>
                <div className="text-xs text-muted-foreground">18 incidents this month</div>
              </div>
              <div className="border-l-4 border-primary pl-3 py-1">
                <div className="font-medium">Uttara Sector-4</div>
                <div className="text-xs text-muted-foreground">15 incidents this month</div>
              </div>
              <div className="border-l-4 border-green-600 pl-3 py-1">
                <div className="font-medium">Banani</div>
                <div className="text-xs text-muted-foreground">12 incidents this month</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
