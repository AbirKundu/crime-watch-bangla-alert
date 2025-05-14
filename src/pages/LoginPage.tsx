
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff, Facebook, Mail } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, authenticate with backend
    toast({
      title: "Login Successful",
      description: "Welcome back to CrimeWatch Bangladesh!",
    });
    navigate('/');
  };

  const handleSocialLogin = (provider: string) => {
    // In a real app, authenticate with social provider
    toast({
      title: `${provider} Login Initiated`,
      description: `Authenticating with ${provider}...`,
    });
  };

  return (
    <div className="container flex items-center justify-center min-h-[80vh] py-8 px-4 sm:px-6">
      <Card className="w-full max-w-md bg-card/70 backdrop-blur-sm border-border/50">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
          <CardDescription className="text-center">
            Sign in to your CrimeWatch Bangladesh account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full">Sign In</Button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">or</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              type="button" 
              onClick={() => handleSocialLogin('Google')}
              className="w-full"
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
            >
              <Facebook className="h-5 w-5 mr-2 text-blue-600" />
              Facebook
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col">
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Register
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
