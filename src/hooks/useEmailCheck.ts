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

      const { data, error } = await supabase
        .from('public_users_table') // this must be created + populated via sync
        .select('id')
        .eq('email', email)
        .maybeSingle();

      setIsChecking(false);

      if (error) {
        console.error('Email check error:', error.message);
        setEmailExists(false); // fallback: treat as non-existent
        return;
      }

      setEmailExists(!!data);
    };

    // Debounce to avoid hammering the DB on every keystroke
    const delayDebounce = setTimeout(checkEmail, 500);

    return () => clearTimeout(delayDebounce);
  }, [email]);

  return { emailExists, isChecking };
};
