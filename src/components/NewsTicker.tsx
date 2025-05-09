
import React, { useEffect, useRef } from 'react';
import { AlertTriangle } from 'lucide-react';

// Using local image imports
import crimePic1 from './picture/crimePic1.jpeg';
import crimePic2 from './picture/crimePic2.jpg';
import crimePic3 from './picture/crimePic3.jpg';
import crimePic4 from './picture/crimePic4.jpg';
import crimePic5 from './picture/crimePic5.jpg';
import crimePic6 from './picture/crimePic6.jpg';

// Sample news alerts - in a real app, these would come from an API
const newsAlerts = [
  { id: 1, text: "BREAKING: Robbery reported in Gulshan-2 area at 2:30 PM", image: crimePic1 },
  { id: 2, text: "ALERT: Suspicious activity near Dhanmondi Lake", image: crimePic2 },
  { id: 3, text: "Police conducting special operation in Uttara Sector 7", image: crimePic3 },
  { id: 4, text: "Two arrested in connection with Mirpur phone snatching incidents", image: crimePic4 },
  { id: 5, text: "Warning: Increased reports of fraud in Banani residential area", image: crimePic5 },
  { id: 6, text: "Special police checkpoint established at Mohakhali intersection", image: crimePic6 },
];

const NewsTicker = () => {
  const tickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tickerElement = tickerRef.current;
    if (!tickerElement) return;

    const animateTicker = () => {
      if (!tickerElement) return;
      
      if (tickerElement.offsetWidth > 0) {
        const tickerWidth = tickerElement.offsetWidth;
        
        tickerElement.style.animation = 'none';
        tickerElement.style.animation = `ticker ${tickerWidth / 50}s linear infinite`;
      }
    };

    animateTicker();
    window.addEventListener('resize', animateTicker);

    return () => {
      window.removeEventListener('resize', animateTicker);
    };
  }, []);

  return (
    <div className="bg-primary/90 text-white py-2 overflow-hidden whitespace-nowrap w-full relative">
      <style>
        {`
        @keyframes ticker {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .news-ticker {
          animation: ticker 30s linear infinite;
          display: inline-block;
        }
        `}
      </style>
      <div className="flex">
        <div className="flex-shrink-0 px-3 flex items-center border-r border-white/40">
          <AlertTriangle className="h-4 w-4 mr-2" />
          <span className="font-bold">LIVE ALERTS</span>
        </div>
        <div className="overflow-hidden relative flex-grow">
          <div ref={tickerRef} className="news-ticker inline-block">
            {newsAlerts.map((alert, index) => (
              <React.Fragment key={alert.id}>
                <span className="mx-4">{alert.text}</span>
                {index < newsAlerts.length - 1 && (
                  <span className="text-primary-foreground/70 mx-2">•</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsTicker;
