
import React from 'react';
import { AlertTriangle } from 'lucide-react';

// Sample news alerts - in a real app, these would come from an API
const newsAlerts = [
  { id: 1, text: "BREAKING: Robbery reported in Gulshan-2 area at 2:30 PM" },
  { id: 2, text: "ALERT: Suspicious activity near Dhanmondi Lake" },
  { id: 3, text: "Police conducting special operation in Uttara Sector 7" },
  { id: 4, text: "Two arrested in connection with Mirpur phone snatching incidents" },
  { id: 5, text: "Warning: Increased reports of fraud in Banani residential area" },
];

const NewsTicker = () => {
  return (
    <div className="bg-primary/90 text-white py-2 overflow-hidden whitespace-nowrap w-full">
      <div className="flex">
        <div className="flex-shrink-0 px-3 flex items-center border-r border-white/40">
          <AlertTriangle className="h-4 w-4 mr-2" />
          <span className="font-bold">LIVE ALERTS</span>
        </div>
        <div className="overflow-hidden relative flex-grow">
          <div className="news-ticker inline-block">
            {newsAlerts.map((alert, index) => (
              <React.Fragment key={alert.id}>
                <span className="mx-4">{alert.text}</span>
                <span className="text-primary-foreground/70 mx-2">•</span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsTicker;
