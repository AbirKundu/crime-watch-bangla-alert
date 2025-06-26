
-- First, let's check if RLS is enabled and what policies exist for crime_reports
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'crime_reports';

-- Check existing RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'crime_reports';

-- Enable RLS on crime_reports if not already enabled
ALTER TABLE public.crime_reports ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to view all reports (for admin functionality)
CREATE POLICY "Allow authenticated users to view all reports" 
ON public.crime_reports 
FOR SELECT 
TO authenticated 
USING (true);

-- Create policy to allow authenticated users to insert reports
CREATE POLICY "Allow authenticated users to insert reports" 
ON public.crime_reports 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Create policy to allow authenticated users to update their own reports
CREATE POLICY "Allow users to update their own reports" 
ON public.crime_reports 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id OR user_id IS NULL);

-- Create policy to allow authenticated users to delete reports (for admin functionality)
CREATE POLICY "Allow authenticated users to delete reports" 
ON public.crime_reports 
FOR DELETE 
TO authenticated 
USING (true);
