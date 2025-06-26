
-- First, let's modify the crime_reports table to allow NULL user_id for anonymous reports
ALTER TABLE public.crime_reports ALTER COLUMN user_id DROP NOT NULL;

-- Now insert sample reports with NULL user_id (anonymous reports)
INSERT INTO public.crime_reports (
  title, 
  location, 
  incident_type, 
  description, 
  severity, 
  reporter_name, 
  user_id
) VALUES 
(
  'Theft at Local Market', 
  'Dhanmondi Market, Dhaka', 
  'theft', 
  'Someone stole vegetables from a vendor stall during busy hours', 
  'medium', 
  'Anonymous Market Vendor',
  NULL
),
(
  'Road Accident on Main Street', 
  'Gulshan Avenue, Dhaka', 
  'other', 
  'Minor collision between two cars, no injuries reported', 
  'low', 
  'Anonymous Witness',
  NULL
),
(
  'Burglary Attempt', 
  'Uttara Residential Area', 
  'robbery', 
  'Attempted break-in at residential building, security guards intervened', 
  'high', 
  'Anonymous Security Guard',
  NULL
),
(
  'Suspicious Activity', 
  'Mirpur DOHS', 
  'suspicious', 
  'Unusual activity reported near residential complex at night', 
  'medium', 
  'Anonymous Resident',
  NULL
),
(
  'Vandalism in Park', 
  'Ramna Park, Dhaka', 
  'vandalism', 
  'Public property damaged in the park area', 
  'low', 
  'Anonymous Park Authority',
  NULL
);

-- Verify the data was inserted successfully
SELECT COUNT(*) as total_reports FROM crime_reports;
SELECT title, location, incident_type, severity, reporter_name, user_id FROM crime_reports ORDER BY created_at DESC LIMIT 5;
