
-- Create a table to store registered user emails for duplicate checking
CREATE TABLE public.registered_emails (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.registered_emails ENABLE ROW LEVEL SECURITY;

-- Create policy to allow reading registered emails (needed for duplicate check)
CREATE POLICY "Allow reading registered emails for duplicate check" 
  ON public.registered_emails 
  FOR SELECT 
  TO authenticated, anon
  USING (true);

-- Create policy that allows users to insert their own email
CREATE POLICY "Users can insert their own email" 
  ON public.registered_emails 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create trigger function to automatically add email to registered_emails table when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.registered_emails (email, user_id)
  VALUES (NEW.email, NEW.id);
  RETURN NEW;
END;
$$;

-- Create trigger to automatically add email when user is created
CREATE TRIGGER on_auth_user_created_email
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user_email();
