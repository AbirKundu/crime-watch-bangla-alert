
-- First, let's check what RLS policies currently exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'crime_reports';

-- Check if RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'crime_reports';

-- Drop any existing restrictive policies that might be blocking access
DROP POLICY IF EXISTS "Users can view their own reports" ON public.crime_reports;
DROP POLICY IF EXISTS "Authenticated users can create reports" ON public.crime_reports;
DROP POLICY IF EXISTS "Users can update their own reports" ON public.crime_reports;
DROP POLICY IF EXISTS "Users can delete their own reports" ON public.crime_reports;

-- Create a simple policy that allows EVERYONE (authenticated and anonymous) to view all crime reports
CREATE POLICY "Anyone can view all crime reports" 
ON public.crime_reports 
FOR SELECT 
USING (true);

-- Allow authenticated users to insert reports (both with their user_id or as anonymous with NULL user_id)
CREATE POLICY "Authenticated users can create reports" 
ON public.crime_reports 
FOR INSERT 
TO authenticated
WITH CHECK (user_id IS NULL OR auth.uid() = user_id);

-- Allow users to update only their own reports (not anonymous ones)
CREATE POLICY "Users can update their own reports" 
ON public.crime_reports 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id AND user_id IS NOT NULL);

-- Allow users to delete only their own reports (not anonymous ones)
CREATE POLICY "Users can delete their own reports" 
ON public.crime_reports 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id AND user_id IS NOT NULL);

-- Verify that we have data in the table
SELECT COUNT(*) as total_reports FROM crime_reports;

-- Show a sample of the data
SELECT id, title, location, incident_type, severity, reporter_name, user_id, created_at 
FROM crime_reports 
ORDER BY created_at DESC 
LIMIT 10;
