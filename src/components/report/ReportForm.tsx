
import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/context/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { FormFields } from './FormFields';
import { ImageUpload } from './ImageUpload';

export const ReportForm: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { addReport, isAuthenticated, user, profile } = useUser();
  
  const [title, setTitle] = useState('');
  const [incidentType, setIncidentType] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file.",
          variant: "destructive",
        });
        return;
      }
      
      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const removeSelectedFile = () => {
    setSelectedFile(null);
    setImagePreview(null);
    const fileInput = document.getElementById('photo') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };
  
  const uploadImage = async (file: File): Promise<string | null> => {
    if (!user?.id) return null;
    
    setUploading(true);
    try {
      const fileName = `${user.id}/${Date.now()}_${file.name}`;
      
      const { data, error } = await supabase.storage
        .from('crime-images')
        .upload(fileName, file);
      
      if (error) {
        console.error('Upload error:', error);
        toast({
          title: "Upload failed",
          description: "Failed to upload image. Please try again.",
          variant: "destructive",
        });
        return null;
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('crime-images')
        .getPublicUrl(fileName);
      
      return publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };
  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "You need to login to submit a report. Redirecting to login page...",
      });
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
      return;
    }
    
    let imageUrl: string | undefined;
    
    // Upload image if selected
    if (selectedFile) {
      imageUrl = await uploadImage(selectedFile) || undefined;
    }
    
    // Determine severity based on incident type
    let severity: "low" | "medium" | "high" = "medium";
    if (["robbery", "assault", "violence"].includes(incidentType.toLowerCase())) {
      severity = "high";
    } else if (["suspicious", "vandalism"].includes(incidentType.toLowerCase())) {
      severity = "low";
    }
    
    // Add the report to our context
    await addReport({
      title,
      location: useCurrentLocation ? "Current Location (Dhaka)" : location,
      type: incidentType,
      description,
      severity,
      reportedBy: isAnonymous ? 'Anonymous' : (profile?.full_name || user?.email || 'User'),
      imageUrl
    });
    
    toast({
      title: "Report Submitted",
      description: "Thank you for your report. It will appear in the live alerts section and news page.",
      variant: "default",
    });
    
    // Clear the form
    setTitle('');
    setIncidentType('');
    setLocation('');
    setDescription('');
    setUseCurrentLocation(false);
    setIsAnonymous(false);
    setSelectedFile(null);
    setImagePreview(null);
    
    // Redirect to news page to see the report
    setTimeout(() => {
      navigate('/news');
    }, 2000);
  };

  return (
    <Card className="bg-card/70 backdrop-blur-sm border-border/50">
      <CardHeader>
        <CardTitle className="text-2xl">Incident Report</CardTitle>
        <CardDescription>Fill in the details about what you witnessed</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormFields
            title={title}
            setTitle={setTitle}
            incidentType={incidentType}
            setIncidentType={setIncidentType}
            location={location}
            setLocation={setLocation}
            description={description}
            setDescription={setDescription}
            useCurrentLocation={useCurrentLocation}
            setUseCurrentLocation={setUseCurrentLocation}
            isAnonymous={isAnonymous}
            setIsAnonymous={setIsAnonymous}
          />
          
          <ImageUpload
            selectedFile={selectedFile}
            imagePreview={imagePreview}
            onFileSelect={handleFileSelect}
            onRemoveFile={removeSelectedFile}
          />
          
          <Button type="submit" size="lg" className="w-full" disabled={uploading}>
            {uploading ? (
              <>
                <Upload className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              'Submit Report'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
