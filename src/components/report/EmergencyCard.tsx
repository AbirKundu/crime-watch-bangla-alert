
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const EmergencyCard: React.FC = () => {
  return (
    <Card className="bg-primary text-primary-foreground">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <AlertTriangle />
          <CardTitle>Emergency?</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-4">For emergencies requiring immediate assistance, please contact emergency services directly:</p>
        <p className="font-bold text-xl mb-2">Call 999</p>
        <p className="text-sm">This form is for non-emergency reports only.</p>
      </CardContent>
    </Card>
  );
};
