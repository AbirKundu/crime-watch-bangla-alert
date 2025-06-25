
-- Create a storage bucket for crime report images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'crime-images', 
  'crime-images', 
  true, 
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
);

-- Create storage policies for the crime-images bucket
-- Allow authenticated users to upload images
CREATE POLICY "Users can upload crime images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'crime-images' 
  AND auth.role() = 'authenticated'
);

-- Allow public read access to crime images
CREATE POLICY "Public can view crime images" ON storage.objects
FOR SELECT USING (bucket_id = 'crime-images');

-- Allow users to update their own uploaded images
CREATE POLICY "Users can update their own crime images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'crime-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own uploaded images
CREATE POLICY "Users can delete their own crime images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'crime-images' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Add image_url column to crime_reports table to store the uploaded image URL
ALTER TABLE public.crime_reports 
ADD COLUMN image_url TEXT;
