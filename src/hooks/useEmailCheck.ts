
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useEmailCheck = (email: string) => {
  const [emailExists, setEmailExists] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    const checkEmail = async () => {
      if (!email || email.length === 0) {
        setEmailExists(false);
        return;
      }

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setEmailExists(false);
        return;
      }

      setIsChecking(true);
      
      try {
        // Try to sign in with the email to check if it exists
        // This won't actually sign them in since we're using a dummy password
        const { error } = await supabase.auth.signInWithPassword({
          email: email,
          password: 'dummy-password-check-12345'
        });

        // If we get "Invalid login credentials", the email exists but password is wrong
        // If we get "Email not confirmed", the email exists but isn't confirmed
        // If we get other errors, we assume email doesn't exist
        if (error) {
          if (error.message.includes('Invalid login credentials') || 
              error.message.includes('Email not confirmed')) {
            setEmailExists(true);
          } else {
            setEmailExists(false);
          }
        } else {
          // This shouldn't happen with our dummy password, but just in case
          setEmailExists(true);
        }
      } catch (error) {
        console.error('Email check error:', error);
        setEmailExists(false);
      } finally {
        setIsChecking(false);
      }
    };

    // Debounce the email check
    const timeoutId = setTimeout(checkEmail, 500);
    return () => clearTimeout(timeoutId);
  }, [email]);

  return { emailExists, isChecking };
};
