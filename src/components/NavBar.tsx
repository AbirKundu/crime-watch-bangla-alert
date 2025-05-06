
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Map, AlertTriangle, MessageCircle, Info, Contact } from 'lucide-react';

const NavBar = () => {
  return (
    <nav className="bg-secondary border-b border-border/40 sticky top-0 w-full z-50 shadow-md">
      <div className="container flex justify-between items-center py-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-6 w-6 text-primary" />
          <Link to="/" className="font-bold text-xl">CrimeWatch <span className="text-primary">Bangladesh</span></Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-1">
          <NavLink to="/" icon={<Home className="h-4 w-4 mr-1" />}>
            Home
          </NavLink>
          <NavLink to="/map" icon={<Map className="h-4 w-4 mr-1" />}>
            Live Map
          </NavLink>
          <NavLink to="/report" icon={<AlertTriangle className="h-4 w-4 mr-1" />}>
            Report
          </NavLink>
          <NavLink to="/news" icon={<MessageCircle className="h-4 w-4 mr-1" />}>
            News
          </NavLink>
          <NavLink to="/about" icon={<Info className="h-4 w-4 mr-1" />}>
            About
          </NavLink>
          <NavLink to="/contact" icon={<Contact className="h-4 w-4 mr-1" />}>
            Contact
          </NavLink>
        </div>
        
        <div className="md:hidden">
          <Button variant="ghost" size="icon">
            <span className="sr-only">Toggle menu</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </Button>
        </div>
      </div>
    </nav>
  );
};

// Helper component for nav links
const NavLink = ({ to, icon, children }: { to: string; icon?: React.ReactNode; children: React.ReactNode }) => {
  return (
    <Link to={to}>
      <Button variant="ghost" size="sm" className="flex items-center">
        {icon}
        {children}
      </Button>
    </Link>
  );
};

export default NavBar;
