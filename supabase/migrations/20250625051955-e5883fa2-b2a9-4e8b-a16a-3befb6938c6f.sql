
-- Create a table for crime reports
CREATE TABLE public.crime_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  incident_type TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high')),
  report_date DATE NOT NULL,
  report_time TIME NOT NULL,
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  reported_by TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to ensure users can only see their own reports
ALTER TABLE public.crime_reports ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to SELECT their own reports
CREATE POLICY "Users can view their own reports" 
  ON public.crime_reports 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to INSERT their own reports
CREATE POLICY "Users can create their own reports" 
  ON public.crime_reports 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to UPDATE their own reports
CREATE POLICY "Users can update their own reports" 
  ON public.crime_reports 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy that allows users to DELETE their own reports
CREATE POLICY "Users can delete their own reports" 
  ON public.crime_reports 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create an index for better query performance
CREATE INDEX idx_crime_reports_user_id ON public.crime_reports(user_id);
CREATE INDEX idx_crime_reports_created_at ON public.crime_reports(created_at DESC);
