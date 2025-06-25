
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
  created_at?: string;
  user_id?: string;
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
  addReport: (report: Omit<UserReport, 'id' | 'time' | 'created_at' | 'user_id'>) => Promise<void>;
  allReports: UserReport[];
  loading: boolean;
  refreshReports: () => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [userReports, setUserReports] = useState<UserReport[]>([]);
  const [loading, setLoading] = useState(true);

  // Only user reports are shown - no more sample data
  const allReports = userReports;

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
          // Fetch user profile and reports when signed in
          setTimeout(() => {
            fetchUserProfile(session.user.id);
            fetchUserReports(session.user.id);
          }, 0);
        } else {
          setProfile(null);
          setUserReports([]);
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
        fetchUserReports(session.user.id);
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

  const fetchUserReports = async (userId: string) => {
    try {
      console.log('Fetching reports for user:', userId);
      
      const { data, error } = await supabase
        .from('crime_reports')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.log('Crime reports table error:', error.message);
        // No fallback data - start with empty array
        setUserReports([]);
        return;
      }

      // Transform database data to match our UserReport type
      const transformedReports: UserReport[] = (data || []).map(report => ({
        id: parseInt(report.id.substring(0, 8), 16) || Date.now(), // Convert UUID to number
        title: report.title,
        location: report.location,
        time: formatTimeAgo(report.created_at),
        type: report.incident_type,
        description: report.description,
        severity: report.severity as "low" | "medium" | "high",
        isUserReport: true,
        reportedBy: report.reporter_name || 'Anonymous',
        created_at: report.created_at,
        user_id: report.user_id,
        imageUrl: report.image_url
      }));

      console.log('User reports fetched:', transformedReports);
      setUserReports(transformedReports);
    } catch (error) {
      console.error('Error in fetchUserReports:', error);
      // No fallback data - start with empty array
      setUserReports([]);
    }
  };

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return date.toLocaleDateString();
  };

  const refreshReports = async () => {
    if (user?.id) {
      await fetchUserReports(user.id);
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
        
        if (error.message?.toLowerCase().includes('already registered') ||
            error.message?.toLowerCase().includes('email address is already in use') ||
            error.message?.toLowerCase().includes('user already registered')) {
          const duplicateError = new Error('An account with this email address already exists. Please sign in or use another email.');
          duplicateError.name = 'DuplicateEmailError';
          throw duplicateError;
        }
        
        throw error;
      }

      console.log('Registration successful for:', data.user?.email);
    } catch (error: any) {
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

  const addReport = async (report: Omit<UserReport, 'id' | 'time' | 'created_at' | 'user_id'>) => {
    if (!user?.id) {
      throw new Error('User must be logged in to submit reports');
    }

    try {
      // Save to database
      const { data, error } = await supabase
        .from('crime_reports')
        .insert([
          {
            user_id: user.id,
            title: report.title,
            location: report.location,
            incident_type: report.type,
            description: report.description,
            severity: report.severity,
            reporter_name: report.reportedBy || profile?.full_name || user?.email || 'Anonymous',
            image_url: report.imageUrl // Add image URL to database insert
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error saving to database:', error);
        // Fall back to local storage
        const newReport: UserReport = {
          ...report,
          id: Date.now(),
          time: "Just now",
          isUserReport: true,
          reportedBy: report.reportedBy || profile?.full_name || user?.email || 'Anonymous',
        };
        setUserReports(prevReports => [newReport, ...prevReports]);
        return;
      }

      console.log('Report saved successfully:', data);
      // Refresh reports from database
      await fetchUserReports(user.id);

    } catch (error) {
      console.error('Error in addReport:', error);
      // Fall back to local storage
      const newReport: UserReport = {
        ...report,
        id: Date.now(),
        time: "Just now",
        isUserReport: true,
        reportedBy: report.reportedBy || profile?.full_name || user?.email || 'Anonymous',
      };
      setUserReports(prevReports => [newReport, ...prevReports]);
    }
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
      refreshReports,
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
