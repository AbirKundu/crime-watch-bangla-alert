
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const GuidelinesCard: React.FC = () => {
  return (
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
        <p className="text-muted-foreground mt-4 text-xs">All reports are submitted anonymously to protect your identity and encourage community participation.</p>
      </CardContent>
    </Card>
  );
};
