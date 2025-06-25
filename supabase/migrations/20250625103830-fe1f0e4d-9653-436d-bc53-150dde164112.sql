
-- First, let's check if there's a problematic function or trigger that references public_users_table
-- and remove it if it exists
DROP FUNCTION IF EXISTS public.sync_public_users() CASCADE;

-- Remove any triggers that might be referencing the non-existent table
DROP TRIGGER IF EXISTS on_auth_user_created_sync ON auth.users;

-- Ensure our existing handle_new_user function is working correctly
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger to ensure it's properly attached
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
