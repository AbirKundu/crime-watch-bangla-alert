
import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, UserPlus, LogIn } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface AuthPromptDialogProps {
  isOpen: boolean;
  onClose: () => void;
  feature: 'Report' | 'News';
}

export const AuthPromptDialog: React.FC<AuthPromptDialogProps> = ({
  isOpen,
  onClose,
  feature,
}) => {
  const featureDescriptions = {
    Report: 'submit crime reports and help keep your community safe',
    News: 'view and access all community crime reports and alerts'
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-primary" />
            <DialogTitle>Account Required</DialogTitle>
          </div>
          <DialogDescription className="text-base">
            To {featureDescriptions[feature]}, you'll need to create a free account first.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 mt-4">
          <p className="text-sm text-muted-foreground">
            Join CrimeWatch Bangladesh to help build a safer community together.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Button asChild className="flex-1" onClick={onClose}>
              <Link to="/register">
                <UserPlus className="h-4 w-4 mr-2" />
                Create Account
              </Link>
            </Button>
            <Button variant="outline" asChild className="flex-1" onClick={onClose}>
              <Link to="/login">
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </Link>
            </Button>
          </div>
          
          <Button 
            variant="ghost" 
            className="w-full" 
            onClick={onClose}
          >
            Maybe Later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
