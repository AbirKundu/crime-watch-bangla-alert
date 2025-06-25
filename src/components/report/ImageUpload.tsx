
import React from 'react';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface ImageUploadProps {
  selectedFile: File | null;
  imagePreview: string | null;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: () => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  selectedFile,
  imagePreview,
  onFileSelect,
  onRemoveFile,
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="photo">Upload Photo/Video (Optional)</Label>
      <div className="space-y-3">
        <Input 
          id="photo" 
          type="file" 
          accept="image/*"
          onChange={onFileSelect}
          className="cursor-pointer" 
        />
        
        {imagePreview && (
          <div className="relative inline-block">
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="max-w-xs max-h-48 rounded-lg border"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
              onClick={onRemoveFile}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        )}
        
        {selectedFile && (
          <p className="text-sm text-muted-foreground">
            Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
          </p>
        )}
      </div>
    </div>
  );
};
