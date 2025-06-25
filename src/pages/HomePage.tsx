
import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, MapPin, ArrowRight, TrendingUp, Bell } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import CrimeMap from '@/components/CrimeMap';

const HomePage = () => {
  return (
    <div className="container py-8 px-4 sm:px-6">
      <section className="mb-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-3">CrimeWatch <span className="text-primary">Bangladesh</span></h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Stay informed about criminal activities in your area with real-time alerts and community reporting.
            Together we can build a safer Bangladesh.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <FeatureCard 
            icon={<Bell />}
            title="Real-time Alerts"
            description="Receive instant notifications about incidents in your area to stay safe."
          />
          <FeatureCard 
            icon={<MapPin />}
            title="Interactive Map"
            description="View crime hotspots and incidents with precise location data."
          />
          <FeatureCard 
            icon={<TrendingUp />}
            title="Crime Analysis"
            description="Track crime trends and patterns to make informed safety decisions."
          />
        </div>

        <div className="flex justify-center mb-8">
          <Button asChild size="lg" className="gap-2">
            <Link to="/map">
              View Live Crime Map
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Live Crime Map</h2>
          <Button variant="outline" asChild size="sm">
            <Link to="/map">View Full Map</Link>
          </Button>
        </div>
        <CrimeMap />
      </section>
    </div>
  );
};

// Helper component for feature cards
const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => {
  return (
    <Card className="bg-card/70 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-2">
        <div className="mb-2 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm text-muted-foreground">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default HomePage;
