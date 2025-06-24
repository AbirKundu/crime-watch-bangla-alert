
import { useState, useEffect } from 'react';

export const useEmailCheck = (email: string) => {
  const [emailExists, setEmailExists] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    // Disable email checking for now - we'll rely on Supabase's built-in duplicate prevention
    // This prevents false positives while still allowing the registration process to handle duplicates
    setEmailExists(false);
    setIsChecking(false);
  }, [email]);

  return { emailExists, isChecking };
};
