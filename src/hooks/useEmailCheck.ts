
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useEmailCheck = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkEmailExists = async (email: string): Promise<boolean> => {
    setIsChecking(true);
    setError(null);

    try {
      // Use Supabase auth API to check if user exists
      const { data, error } = await supabase.auth.signUp({
        email,
        password: 'dummy-password-for-check', // This won't actually create an account
      });

      if (error) {
        // If error is about user already registered, return true
        if (error.message?.toLowerCase().includes('already registered') ||
            error.message?.toLowerCase().includes('email address is already in use') ||
            error.message?.toLowerCase().includes('user already registered')) {
          return true;
        }
        
        // For other errors, set error state
        setError(error.message);
        return false;
      }

      // If no error, email doesn't exist yet
      return false;
    } catch (err: any) {
      setError(err.message || 'Failed to check email');
      return false;
    } finally {
      setIsChecking(false);
    }
  };

  const validateEmailAvailability = async (email: string) => {
    const exists = await checkEmailExists(email);
    return {
      isAvailable: !exists,
      exists,
      error
    };
  };

  return {
    checkEmailExists,
    validateEmailAvailability,
    isChecking,
    error,
    setError
  };
};
