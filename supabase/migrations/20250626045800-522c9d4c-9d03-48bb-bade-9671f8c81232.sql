
-- Check if RLS is enabled on crime_reports table and what policies exist
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'crime_reports';

-- Check existing RLS policies on crime_reports table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'crime_reports';

-- Let's also check if there's any data in the table at all (this will help us understand if RLS is blocking or if there's no data)
SELECT COUNT(*) as total_reports FROM crime_reports;

-- If there are reports, let's see a sample
SELECT id, title, location, incident_type, severity, user_id, created_at 
FROM crime_reports 
ORDER BY created_at DESC 
LIMIT 5;
