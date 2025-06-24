import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Facebook, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { useUser } from '@/context/UserContext';

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { register, isAuthenticated, loading: authLoading } = useUser();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate('/');
    }
  }, [isAuthenticated, authLoading, navigate]);

  const isFormValid = name && email && password.length >= 6 && acceptedTerms;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (!acceptedTerms) {
      toast({
        title: "Terms Required",
        description: "Please accept the Terms of Service and Privacy Policy.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      await register(name, email, password);
      
      toast({
        title: "Registration Successful",
        description: "Welcome to CrimeWatch Bangladesh! Please check your email to confirm your account.",
      });
      
      navigate('/');
    } catch (error: any) {
      console.error('Registration failed:', error);
      
      let errorMessage = "Registration failed. Please try again.";
      
      if (error.name === 'DuplicateEmailError') {
        errorMessage = error.message;
      } else if (error.message?.toLowerCase().includes('user already registered') || 
          error.message?.toLowerCase().includes('already been registered') ||
          error.message?.toLowerCase().includes('email address is already in use') ||
          error.message?.toLowerCase().includes('already registered')) {
        errorMessage = "An account with this email address already exists. Please try signing in instead.";
      } else if (error.message?.includes('Password should be at least 6 characters')) {
        errorMessage = "Password must be at least 6 characters long.";
      } else if (error.message?.includes('Invalid email')) {
        errorMessage = "Please enter a valid email address.";
      } else if (error.message?.toLowerCase().includes('signup is disabled')) {
        errorMessage = "Account registration is currently disabled. Please contact support.";
      }
      
      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    toast({
      title: `${provider} Signup`,
      description: "Social registration will be available soon.",
    });
  };

  if (authLoading) {
    return (
      <div className="container flex items-center justify-center min-h-[80vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container flex items-center justify-center min-h-[80vh] py-8 px-4 sm:px-6">
      <Card className="w-full max-w-md bg-card/70 backdrop-blur-sm border-border/50">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Create an Account</CardTitle>
          <CardDescription className="text-center">
            Sign up to join CrimeWatch Bangladesh
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                type="text" 
                placeholder="John Doe" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required 
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Password must be at least 6 characters long
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="terms" 
                checked={acceptedTerms}
                onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                disabled={isLoading}
              />
              <Label htmlFor="terms" className="text-sm">
                I agree to the{" "}
                <Link to="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>
                {" "}and{" "}
                <Link to="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </Label>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || !isFormValid}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              type="button" 
              onClick={() => handleSocialLogin('Google')}
              className="w-full"
              disabled={isLoading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 mr-2">
                <path fill="#EA4335" d="M5.266 9.805C5.977 7.401 8.252 5.727 10.935 5.727c1.359 0 2.582.47 3.541 1.235l2.646-2.646C15.357 2.664 13.252 2 10.935 2 6.364 2 2.489 4.94 1 8.827L5.266 9.805z"/>
                <path fill="#34A853" d="M10.935 22c2.77 0 5.095-.919 6.791-2.487l-3.318-2.577c-.919.616-2.1.995-3.473.995-2.667 0-4.927-1.8-5.736-4.221L1 14.827C2.511 18.845 6.433 22 10.935 22z"/>
                <path fill="#4A90E2" d="M22 11.455c0-.708-.065-1.39-.188-2.045H10.935v3.868h6.206c-.267 1.436-1.078 2.651-2.295 3.466l3.318 2.577C20.041 17.35 22 14.7 22 11.455z"/>
                <path fill="#FBBC05" d="M1 8.827l4.239 1.107c.811-2.422 3.071-4.222 5.736-4.222 1.359 0 2.582.47 3.541 1.235l2.646-2.646C15.357 2.664 13.252 2 10.935 2 6.364 2 2.489 4.94 1 8.827z"/>
              </svg>
              Google
            </Button>
            <Button 
              variant="outline" 
              type="button" 
              onClick={() => handleSocialLogin('Facebook')}
              className="w-full"
              disabled={isLoading}
            >
              <Facebook className="h-5 w-5 mr-2 text-blue-600" />
              Facebook
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegisterPage;
