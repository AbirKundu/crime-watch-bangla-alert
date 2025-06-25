
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useEmailCheck = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkEmailExists = async (email: string): Promise<boolean> => {
    setIsChecking(true);
    setError(null);

    try {
      // Check if email exists in the registered_emails table
      const { data, error } = await supabase
        .from('registered_emails')
        .select('email')
        .eq('email', email.toLowerCase().trim())
        .maybeSingle();

      if (error) {
        console.error('Error checking email:', error);
        setError('Failed to validate email availability');
        return false;
      }

      // If data exists, email is already registered
      return !!data;
    } catch (err: any) {
      console.error('Error in checkEmailExists:', err);
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
