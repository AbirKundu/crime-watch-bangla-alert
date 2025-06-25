
-- Create contact_messages table to store contact form submissions
CREATE TABLE public.contact_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) NULL, -- Optional reference to authenticated user
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to insert contact messages (both authenticated and anonymous users)
CREATE POLICY "Anyone can submit contact messages" 
  ON public.contact_messages 
  FOR INSERT 
  TO public
  WITH CHECK (true);

-- Policy: Only authenticated users can view their own messages
CREATE POLICY "Users can view their own contact messages" 
  ON public.contact_messages 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy: Admins/service role can view all messages (for future admin panel)
CREATE POLICY "Service role can view all contact messages" 
  ON public.contact_messages 
  FOR SELECT 
  TO service_role
  USING (true);

-- Add an index on created_at for efficient querying
CREATE INDEX idx_contact_messages_created_at ON public.contact_messages(created_at DESC);

-- Add an index on user_id for efficient user-specific queries
CREATE INDEX idx_contact_messages_user_id ON public.contact_messages(user_id) WHERE user_id IS NOT NULL;
