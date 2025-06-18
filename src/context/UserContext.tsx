import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

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

type UserProfile = {
  id: string;
  full_name: string | null;
  created_at: string;
  updated_at: string;
};

type UserContextType = {
  isAuthenticated: boolean;
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  userReports: UserReport[];
  addReport: (report: Omit<UserReport, 'id' | 'time'>) => void;
  allReports: UserReport[];
  loading: boolean;
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
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userReports, setUserReports] = useState<UserReport[]>(initialUserReports);
  const [officialReports] = useState<UserReport[]>(initialOfficialReports);
  const [loading, setLoading] = useState(true);

  // Combine both types of reports for an all-inclusive list
  const allReports = [...userReports, ...officialReports];

  // Set up auth state listener and check for existing session
  useEffect(() => {
    console.log('Setting up auth state listener');
    
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user profile when signed in
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      
      setLoading(false);
    });

    return () => {
      console.log('Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      console.log('Profile fetched:', data);
      setProfile(data);
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  };

  const login = async (email: string, password: string) => {
    console.log('Attempting login for:', email);
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error);
        throw error;
      }

      console.log('Login successful:', data.user?.email);
      // The onAuthStateChange listener will handle the state updates
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    console.log('Attempting registration for:', email);
    setLoading(true);
    
    try {
      // Use the current origin to ensure proper redirect
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: name,
          },
        },
      });

      if (error) {
        console.error('Registration error:', error);
        throw error;
      }

      console.log('Registration successful:', data.user?.email);
      console.log('Email redirect URL set to:', redirectUrl);
      // The onAuthStateChange listener will handle the state updates
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = async () => {
    console.log('Attempting logout');
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
        throw error;
      }
      console.log('Logout successful');
      // The onAuthStateChange listener will handle the state updates
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const addReport = (report: Omit<UserReport, 'id' | 'time'>) => {
    const newReport: UserReport = {
      ...report,
      id: Date.now(), // Generate a unique ID
      time: "Just now", // Current time
      isUserReport: true, // Always mark as user report
      reportedBy: profile?.full_name || user?.email || 'Anonymous',
    };
    
    setUserReports(prevReports => [newReport, ...prevReports]);
  };

  const isAuthenticated = !!user;

  return (
    <UserContext.Provider value={{
      isAuthenticated,
      user,
      profile,
      session,
      login,
      register,
      logout,
      userReports,
      addReport,
      allReports,
      loading,
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
