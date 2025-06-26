
import React, { useEffect, useRef } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useUser } from '@/context/UserContext';

const NewsTicker = () => {
  const tickerRef = useRef<HTMLDivElement>(null);
  const { allReports } = useUser();

  // Prepare news alerts from reports
  const newsAlerts = allReports.map(report => ({
    id: report.id,
    text: `${report.isUserReport ? "USER REPORT" : "ALERT"}: ${report.title} in ${report.location} - ${report.time}`,
    image: report.imageUrl,
    isUserReport: report.isUserReport || false,
    severity: report.severity
  }));

  useEffect(() => {
    const tickerElement = tickerRef.current;
    if (!tickerElement) return;

    const animateTicker = () => {
      if (!tickerElement) return;
      
      if (tickerElement.offsetWidth > 0) {
        const tickerWidth = tickerElement.offsetWidth;
        
        tickerElement.style.animation = 'none';
        tickerElement.style.animation = `ticker ${tickerWidth / 30}s linear infinite`;
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
          animation: ticker 45s linear infinite;
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
                <span 
                  className={`mx-4 ${
                    alert.isUserReport 
                      ? 'bg-yellow-500/80 text-white px-2 py-1 rounded font-medium' 
                      : 'text-white bg-destructive/80 px-2 py-1 rounded font-medium'
                  }`}
                >
                  {alert.text}
                </span>
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
