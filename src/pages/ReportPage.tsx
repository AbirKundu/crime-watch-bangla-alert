
import React from 'react';
import { ReportForm } from '@/components/report/ReportForm';
import { EmergencyCard } from '@/components/report/EmergencyCard';
import { GuidelinesCard } from '@/components/report/GuidelinesCard';

const ReportPage = () => {
  return (
    <div className="container py-8 px-4 sm:px-6">
      <h1 className="text-3xl font-bold mb-2">Report a Crime</h1>
      <p className="text-muted-foreground mb-6">
        Report criminal activity or suspicious behavior. Your information helps keep the community safe.
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ReportForm />
        </div>
        
        <div className="space-y-6 order-first lg:order-last">
          <EmergencyCard />
          <GuidelinesCard />
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
