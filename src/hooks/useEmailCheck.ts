
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useEmailCheck = (email: string) => {
  const [emailExists, setEmailExists] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    // Basic validation to avoid unnecessary queries
    if (!email || !email.includes('@') || email.length < 5) {
      setEmailExists(false);
      return;
    }

    const checkEmail = async () => {
      setIsChecking(true);

      try {
        const { data, error } = await supabase
          .from('public_users_table')
          .select('id')
          .eq('email', email)
          .maybeSingle();

        if (error) {
          console.log('Email check failed (table may not exist):', error.message);
          // Don't block registration if the table doesn't exist
          setEmailExists(false);
          setIsChecking(false);
          return;
        }

        setEmailExists(!!data);
      } catch (error) {
        console.log('Email check error:', error);
        setEmailExists(false);
      }
      
      setIsChecking(false);
    };

    // Debounce to avoid hammering the DB on every keystroke
    const delayDebounce = setTimeout(checkEmail, 500);

    return () => clearTimeout(delayDebounce);
  }, [email]);

  return { emailExists, isChecking };
};
