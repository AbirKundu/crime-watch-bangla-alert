
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Shield, Users, Lock } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="container py-8 px-4 sm:px-6">
      <h1 className="text-3xl font-bold mb-2">About CrimeWatch Bangladesh</h1>
      <p className="text-muted-foreground mb-10">
        Our mission, values, and commitment to creating a safer Bangladesh
      </p>

      <div className="mb-14">
        <div className="flex flex-col md:flex-row gap-10 items-center">
          <div className="flex-1">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="mb-4 text-muted-foreground">
              CrimeWatch Bangladesh is dedicated to enhancing public safety through community-powered crime reporting, 
              real-time alerts, and data-driven insights. We believe that informed citizens are empowered citizens.
            </p>
            <p className="text-muted-foreground">
              By creating transparency around criminal activity and providing tools for community vigilance, 
              we aim to contribute to safer neighborhoods and a more secure Bangladesh for everyone.
            </p>
          </div>
          
          <div className="max-w-md">
            <div className="relative rounded-lg overflow-hidden w-full aspect-video border border-border/50">
              <img 
                src="https://images.pexels.com/photos/2043739/pexels-photo-2043739.jpeg" 
                alt="City skyline of Dhaka" 
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-background/40"></div>
              <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm p-3 rounded-md">
                <AlertTriangle className="text-primary h-6 w-6" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
        <Card className="bg-card/70 backdrop-blur-sm border-border/50">
          <CardHeader>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
              <Shield className="h-6 w-6" />
            </div>
            <CardTitle>Our Vision</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              We envision a Bangladesh where every citizen feels safe and secure in their community, 
              empowered by knowledge and the tools to protect themselves and their loved ones.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="bg-card/70 backdrop-blur-sm border-border/50">
          <CardHeader>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
              <Users className="h-6 w-6" />
            </div>
            <CardTitle>Community Focus</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              We believe in the power of community engagement and citizen reporting. Our platform enables 
              communities to work together with authorities to create safer neighborhoods.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="bg-card/70 backdrop-blur-sm border-border/50">
          <CardHeader>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
              <Lock className="h-6 w-6" />
            </div>
            <CardTitle>Privacy & Security</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              We take data privacy seriously. All personal information is protected, and users can choose to 
              remain anonymous when submitting reports while still helping their community.
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      <div className="mb-14">
        <h2 className="text-2xl font-semibold mb-6">Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: "Rahim Ahmed", role: "Founder & Director", image: "https://randomuser.me/api/portraits/men/32.jpg" },
            { name: "Tasnim Khan", role: "Head of Operations", image: "https://randomuser.me/api/portraits/women/44.jpg" },
            { name: "Farhan Rahman", role: "Security Specialist", image: "https://randomuser.me/api/portraits/men/46.jpg" },
            { name: "Nadia Islam", role: "Community Manager", image: "https://randomuser.me/api/portraits/women/65.jpg" }
          ].map((member, index) => (
            <div key={index} className="text-center">
              <div className="w-32 h-32 mx-auto rounded-full overflow-hidden mb-4 border-4 border-card">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="font-semibold text-lg">{member.name}</h3>
              <p className="text-muted-foreground text-sm">{member.role}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-6">How We Work</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="flex flex-col">
            <div className="text-4xl font-bold text-primary mb-2">01</div>
            <h3 className="text-xl font-semibold mb-2">Community Reports</h3>
            <p className="text-muted-foreground text-sm">
              Citizens report incidents through our platform, providing essential details and optional media evidence.
            </p>
          </div>
          <div className="flex flex-col">
            <div className="text-4xl font-bold text-primary mb-2">02</div>
            <h3 className="text-xl font-semibold mb-2">Verification Process</h3>
            <p className="text-muted-foreground text-sm">
              Our team reviews reports for accuracy and severity before publishing, working with local authorities as needed.
            </p>
          </div>
          <div className="flex flex-col">
            <div className="text-4xl font-bold text-primary mb-2">03</div>
            <h3 className="text-xl font-semibold mb-2">Public Alerts</h3>
            <p className="text-muted-foreground text-sm">
              Verified incidents are published to alert the public, with critical incidents receiving emergency priority.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
