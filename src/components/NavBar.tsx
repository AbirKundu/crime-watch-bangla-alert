
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Map, AlertTriangle, MessageCircle, Info, Contact, LogIn, UserPlus, LogOut, User, Menu, X, Sun, Moon, Shield } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { useTheme } from '@/context/ThemeContext';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { AuthPromptDialog } from './AuthPromptDialog';

const NavBar = () => {
  const { isAuthenticated, logout, profile, user } = useUser();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [authPrompt, setAuthPrompt] = useState<{
    isOpen: boolean;
    feature: 'Report' | 'News' | null;
  }>({
    isOpen: false,
    feature: null,
  });

  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleProtectedNavigation = (feature: 'Report' | 'News') => {
    if (!isAuthenticated) {
      setAuthPrompt({ isOpen: true, feature });
      return;
    }
  };

  const closeAuthPrompt = () => {
    setAuthPrompt({ isOpen: false, feature: null });
  };

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'User';

  return (
    <>
      <nav className="bg-secondary border-b border-border/40 sticky top-0 w-full z-50 shadow-md">
        <div className="container flex justify-between items-center py-2">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <Link to="/" className="font-bold text-xl">CrimeWatch <span className="text-primary">Bangladesh</span></Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-1">
            <NavLink to="/" icon={<Home className="h-4 w-4 mr-1" />}>
              Home
            </NavLink>
            <NavLink to="/map" icon={<Map className="h-4 w-4 mr-1" />}>
              Live Map
            </NavLink>
            <ProtectedNavLink 
              to="/report" 
              icon={<AlertTriangle className="h-4 w-4 mr-1" />}
              onClick={() => handleProtectedNavigation('Report')}
              isAuthenticated={isAuthenticated}
            >
              Report
            </ProtectedNavLink>
            <ProtectedNavLink 
              to="/news" 
              icon={<MessageCircle className="h-4 w-4 mr-1" />}
              onClick={() => handleProtectedNavigation('News')}
              isAuthenticated={isAuthenticated}
            >
              News
            </ProtectedNavLink>
            <NavLink to="/about" icon={<Info className="h-4 w-4 mr-1" />}>
              About
            </NavLink>
            <NavLink to="/contact" icon={<Contact className="h-4 w-4 mr-1" />}>
              Contact
            </NavLink>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Theme toggle button */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme}
              className="text-foreground"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            {isAuthenticated ? (
              <>
                <div className="hidden sm:flex items-center mr-2 text-sm">
                  <span>Hello, {displayName}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="hidden sm:flex items-center gap-1"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <NavLink to="/login" icon={<LogIn className="h-4 w-4 mr-1" />} className="hidden sm:flex">
                  Login
                </NavLink>
                <NavLink to="/register" icon={<UserPlus className="h-4 w-4 mr-1" />} className="hidden sm:flex">
                  Register
                </NavLink>
              </>
            )}
            
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <span className="sr-only">Toggle menu</span>
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80%] sm:w-[350px]">
                <div className="flex flex-col h-full py-4">
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-6">
                      <AlertTriangle className="h-6 w-6 text-primary" />
                      <span className="font-bold text-xl">CrimeWatch</span>
                    </div>
                    
                    {isAuthenticated ? (
                      <div className="border-b border-border pb-4 mb-4">
                        <div className="text-sm mb-2">Hello, {displayName}</div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full justify-start"
                          onClick={handleLogout}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </Button>
                      </div>
                    ) : (
                      <div className="border-b border-border pb-4 mb-4 flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          asChild
                          onClick={() => setIsOpen(false)}
                        >
                          <Link to="/login">
                            <LogIn className="h-4 w-4 mr-2" />
                            Login
                          </Link>
                        </Button>
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="flex-1"
                          asChild
                          onClick={() => setIsOpen(false)}
                        >
                          <Link to="/register">
                            <UserPlus className="h-4 w-4 mr-2" />
                            Register
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    <MobileNavLink to="/" icon={<Home className="h-5 w-5 mr-3" />} setIsOpen={setIsOpen}>
                      Home
                    </MobileNavLink>
                    <MobileNavLink to="/map" icon={<Map className="h-5 w-5 mr-3" />} setIsOpen={setIsOpen}>
                      Live Map
                    </MobileNavLink>
                    <MobileProtectedNavLink 
                      to="/report" 
                      icon={<AlertTriangle className="h-5 w-5 mr-3" />}
                      setIsOpen={setIsOpen}
                      onClick={() => handleProtectedNavigation('Report')}
                      isAuthenticated={isAuthenticated}
                    >
                      Report
                    </MobileProtectedNavLink>
                    <MobileProtectedNavLink 
                      to="/news" 
                      icon={<MessageCircle className="h-5 w-5 mr-3" />}
                      setIsOpen={setIsOpen}
                      onClick={() => handleProtectedNavigation('News')}
                      isAuthenticated={isAuthenticated}
                    >
                      News
                    </MobileProtectedNavLink>
                    <MobileNavLink to="/about" icon={<Info className="h-5 w-5 mr-3" />} setIsOpen={setIsOpen}>
                      About
                    </MobileNavLink>
                    <MobileNavLink to="/contact" icon={<Contact className="h-5 w-5 mr-3" />} setIsOpen={setIsOpen}>
                      Contact
                    </MobileNavLink>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <AuthPromptDialog
        isOpen={authPrompt.isOpen}
        onClose={closeAuthPrompt}
        feature={authPrompt.feature || 'Report'}
      />
    </>
  );
};

// Helper component for nav links
const NavLink = ({ to, icon, children, className = "" }: { to: string; icon?: React.ReactNode; children: React.ReactNode; className?: string }) => {
  return (
    <Link to={to}>
      <Button variant="ghost" size="sm" className={`flex items-center ${className}`}>
        {icon}
        {children}
      </Button>
    </Link>
  );
};

// Helper component for protected nav links
const ProtectedNavLink = ({ 
  to, 
  icon, 
  children, 
  className = "", 
  onClick, 
  isAuthenticated 
}: { 
  to: string; 
  icon?: React.ReactNode; 
  children: React.ReactNode; 
  className?: string;
  onClick: () => void;
  isAuthenticated: boolean;
}) => {
  if (isAuthenticated) {
    return (
      <Link to={to}>
        <Button variant="ghost" size="sm" className={`flex items-center ${className}`}>
          {icon}
          {children}
        </Button>
      </Link>
    );
  }

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className={`flex items-center ${className}`}
      onClick={onClick}
    >
      {icon}
      {children}
    </Button>
  );
};

// Mobile navigation link component
const MobileNavLink = ({ 
  to, 
  icon, 
  children, 
  setIsOpen 
}: { 
  to: string; 
  icon?: React.ReactNode; 
  children: React.ReactNode;
  setIsOpen: (open: boolean) => void;
}) => {
  return (
    <Link to={to} onClick={() => setIsOpen(false)}>
      <Button variant="ghost" size="lg" className="w-full justify-start">
        {icon}
        {children}
      </Button>
    </Link>
  );
};

// Mobile protected navigation link component
const MobileProtectedNavLink = ({ 
  to, 
  icon, 
  children, 
  setIsOpen,
  onClick,
  isAuthenticated
}: { 
  to: string; 
  icon?: React.ReactNode; 
  children: React.ReactNode;
  setIsOpen: (open: boolean) => void;
  onClick: () => void;
  isAuthenticated: boolean;
}) => {
  if (isAuthenticated) {
    return (
      <Link to={to} onClick={() => setIsOpen(false)}>
        <Button variant="ghost" size="lg" className="w-full justify-start">
          {icon}
          {children}
        </Button>
      </Link>
    );
  }

  return (
    <Button 
      variant="ghost" 
      size="lg" 
      className="w-full justify-start"
      onClick={() => {
        setIsOpen(false);
        onClick();
      }}
    >
      {icon}
      {children}
    </Button>
  );
};

export default NavBar;
