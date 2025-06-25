
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface UserReport {
  id: string;
  title: string;
  location: string;
  type: string;
  description: string;
  severity: "low" | "medium" | "high";
  time: string;
  reportedBy: string;
  imageUrl?: string;
  created_at?: string;
  user_id?: string;
  showOnMap?: boolean;
  isUserReport?: boolean;
}

interface UserProfile {
  id: string;
  full_name?: string;
  created_at: string;
  updated_at: string;
}

interface UserContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  loading: boolean;
  allReports: UserReport[];
  userReports: UserReport[];
  profile: UserProfile | null;
  addReport: (report: Omit<UserReport, 'id' | 'time' | 'created_at' | 'user_id'>) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [allReports, setAllReports] = useState<UserReport[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const { toast } = useToast();

  // Computed property for user reports
  const userReports = allReports.filter(report => report.user_id === user?.id);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();

        setSession(session);

        if (session) {
          setUser(session.user);
          // Fetch user profile
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profileData) {
            setProfile(profileData);
          }
        }
      } catch (error) {
        console.error('Error fetching session:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();

    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'INITIAL_SESSION') {
        fetchSession();
      } else {
        setSession(session);
        setUser(session?.user || null);
        if (session?.user) {
          // Fetch profile when user signs in
          setTimeout(async () => {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            if (profileData) {
              setProfile(profileData);
            }
          }, 0);
        } else {
          setProfile(null);
        }
      }
    });
  }, []);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const { data: crime_reports, error } = await supabase
          .from('crime_reports')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching crime reports:', error);
          return;
        }

        if (crime_reports) {
          const formattedReports: UserReport[] = crime_reports.map(report => ({
            id: report.id,
            title: report.title,
            location: report.location,
            type: report.incident_type, // Map incident_type to type
            description: report.description,
            severity: report.severity as "low" | "medium" | "high", // Type assertion for severity
            time: new Date(report.created_at).toLocaleString(),
            reportedBy: report.reporter_name || 'Anonymous', // Map reporter_name to reportedBy
            imageUrl: report.image_url,
            created_at: report.created_at,
            user_id: report.user_id,
            showOnMap: true, // Default value since show_on_map column doesn't exist
            isUserReport: !!report.user_id // Mark as user report if user_id exists
          }));
          setAllReports(formattedReports);
        }
      } catch (error) {
        console.error('Failed to fetch reports:', error);
      }
    };

    fetchReports();
  }, []);

  const addReport = async (reportData: Omit<UserReport, 'id' | 'time' | 'created_at' | 'user_id'>) => {
    try {
      const reportToInsert = {
        title: reportData.title,
        location: reportData.location,
        incident_type: reportData.type, // Map type to incident_type
        description: reportData.description,
        severity: reportData.severity,
        reporter_name: reportData.reportedBy, // Map reportedBy to reporter_name
        image_url: reportData.imageUrl,
        user_id: user?.id || null
      };

      const { data, error } = await supabase
        .from('crime_reports')
        .insert([reportToInsert])
        .select()
        .single();

      if (error) {
        console.error('Error adding report:', error);
        throw error;
      }

      // Convert database format back to frontend format
      const newReport: UserReport = {
        id: data.id,
        title: data.title,
        location: data.location,
        type: data.incident_type, // Map incident_type to type
        description: data.description,
        severity: data.severity as "low" | "medium" | "high", // Type assertion
        time: new Date(data.created_at).toLocaleString(),
        reportedBy: data.reporter_name || 'Anonymous', // Map reporter_name to reportedBy
        imageUrl: data.image_url,
        created_at: data.created_at,
        user_id: data.user_id,
        showOnMap: true, // Default value
        isUserReport: !!data.user_id
      };

      setAllReports(prev => [newReport, ...prev]);
    } catch (error: any) {
      console.error('Failed to add report:', error);
      throw error;
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        console.error('Login error:', error);
        throw error;
      }

      if (data.user) {
        setUser(data.user);
        setSession(data.session);
        toast({
          title: "Login Successful",
          description: "You have successfully logged in!",
        });
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      let errorMessage = "Login failed. Please check your credentials and try again.";

      if (error.message?.toLowerCase().includes('invalid login credentials')) {
        errorMessage = "Invalid email or password. Please try again.";
      } else if (error.message?.toLowerCase().includes('email not confirmed')) {
        errorMessage = "Please confirm your email address before logging in.";
      } else if (error.message?.toLowerCase().includes('user not found')) {
        errorMessage = "No account found with that email address.";
      }

      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) {
        console.error('Registration error:', error);
        throw error;
      }

      if (data.user) {
        setUser(data.user);
        setSession(data.session);
        toast({
          title: "Registration Successful",
          description: "Welcome to CrimeWatch Bangladesh! Please check your email to confirm your account.",
        });
      }
    } catch (error: any) {
      console.error('Registration failed:', error);

      let errorMessage = "Registration failed. Please try again.";

      if (error.message?.toLowerCase().includes('user already registered') ||
        error.message?.toLowerCase().includes('already been registered') ||
        error.message?.toLowerCase().includes('email address is already in use') ||
        error.message?.toLowerCase().includes('already registered')) {
        errorMessage = "An account with this email address already exists. Please try signing in instead.";
      } else if (error.message?.includes('Password should be at least 6 characters')) {
        errorMessage = "Password must be at least 6 characters long.";
      } else if (error.message?.includes('Invalid email')) {
        errorMessage = "Please enter a valid email address.";
      } else if (error.message?.toLowerCase().includes('signup is disabled')) {
        errorMessage = "Account registration is currently disabled. Please contact support.";
      }

      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
        throw error;
      }
      setUser(null);
      setSession(null);
      toast({
        title: "Logout Successful",
        description: "You have been successfully logged out.",
      });
    } catch (error: any) {
      console.error('Logout failed:', error);
      toast({
        title: "Logout Failed",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider value={{
      user,
      session,
      isAuthenticated: !!session,
      loading,
      allReports,
      userReports,
      profile,
      addReport,
      login,
      register,
      logout
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
