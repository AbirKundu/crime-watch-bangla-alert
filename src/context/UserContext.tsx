import React, { createContext, useContext, useState, useEffect } from 'react';

// Import local images
import crimePic1 from '../components/picture/crimePic1.jpg';
import crimePic2 from '../components/picture/crimePic2.jpg';
import crimePic3 from '../components/picture/crimePic3.jpg';

// Types
export type UserReport = {
  id: number;
  title: string;
  location: string;
  time: string;
  type: string;
  description: string;
  severity: "low" | "medium" | "high";
  imageUrl?: string;
  isUserReport?: boolean;
  reportedBy?: string;
};

type User = {
  name: string;
  email: string;
};

type UserContextType = {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  userReports: UserReport[];
  addReport: (report: Omit<UserReport, 'id' | 'time'>) => void;
  allReports: UserReport[];
  user: User | null;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

// Sample user reports for demonstration
const initialUserReports: UserReport[] = [
  {
    id: 201,
    title: "Suspicious Person Near School",
    location: "Mirpur DOHS, Dhaka",
    time: "Just now",
    type: "Suspicious",
    description: "A man in dark clothing has been observing the school for over an hour.",
    severity: "medium",
    isUserReport: true,
    imageUrl: crimePic1
  },
  {
    id: 202,
    title: "Attempted Break-in",
    location: "Bashundhara R/A, Dhaka",
    time: "5 minutes ago",
    type: "Burglary",
    description: "Someone tried to break into my house through the back door.",
    severity: "high",
    isUserReport: true,
    imageUrl: crimePic2
  },
  {
    id: 203,
    title: "Wallet Theft at Mall",
    location: "Jamuna Future Park, Dhaka",
    time: "15 minutes ago",
    type: "Theft",
    description: "My wallet was stolen while shopping. Security has been notified.",
    severity: "medium",
    isUserReport: true,
    imageUrl: crimePic3
  }
];

// Sample official reports/alerts
const initialOfficialReports: UserReport[] = [
  {
    id: 1,
    title: "Armed Robbery at Convenience Store",
    location: "Banani, Dhaka",
    time: "Today, 2:30 PM",
    type: "Robbery",
    description: "Two armed individuals robbed a convenience store. Police are investigating. No injuries reported.",
    severity: "high"
  },
  {
    id: 2,
    title: "Vehicle Break-in",
    location: "Dhanmondi, Dhaka",
    time: "Today, 11:15 AM",
    type: "Theft",
    description: "Multiple vehicles reported broken into with valuables stolen from inside.",
    severity: "medium"
  }
];

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userReports, setUserReports] = useState<UserReport[]>(initialUserReports);
  const [officialReports] = useState<UserReport[]>(initialOfficialReports);
  const [user, setUser] = useState<User | null>(null);

  // Combine both types of reports for an all-inclusive list
  const allReports = [...userReports, ...officialReports];

  // Simulate checking if the user is logged in (could use localStorage in a real app)
  useEffect(() => {
    const checkAuthStatus = () => {
      // In a real app, check token validity, etc.
      const token = localStorage.getItem('authToken');
      const storedName = localStorage.getItem('userName');
      const storedEmail = localStorage.getItem('userEmail');
      
      if (token && storedName && storedEmail) {
        setIsAuthenticated(true);
        setUser({
          name: storedName,
          email: storedEmail,
        });
      }
    };
    
    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, validate credentials with backend
    if (email && password) {
      // Store auth token (in a real app, this would come from the server)
      localStorage.setItem('authToken', 'demo-token');
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userName', email.split('@')[0]);
      
      setUser({
        name: email.split('@')[0],
        email: email
      });
      
      setIsAuthenticated(true);
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const register = async (name: string, email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, register user with backend
    if (name && email && password) {
      // Store auth token (in a real app, this would come from the server)
      localStorage.setItem('authToken', 'demo-token');
      localStorage.setItem('userName', name);
      localStorage.setItem('userEmail', email);
      
      setUser({
        name: name,
        email: email
      });
      
      setIsAuthenticated(true);
    } else {
      throw new Error('Invalid registration information');
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    setIsAuthenticated(false);
    setUser(null);
  };

  const addReport = (report: Omit<UserReport, 'id' | 'time'>) => {
    const newReport: UserReport = {
      ...report,
      id: Date.now(), // Generate a unique ID
      time: "Just now", // Current time
      isUserReport: true, // Always mark as user report
    };
    
    setUserReports(prevReports => [newReport, ...prevReports]);
  };

  return (
    <UserContext.Provider value={{
      isAuthenticated,
      login,
      logout,
      register,
      userReports,
      addReport,
      allReports,
      user,
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
