
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Home, Heart, Award, LogIn, LogOut, User, LayoutDashboard, Menu, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const isActive = (path: string) => location.pathname === path;
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { path: '/', icon: <Home className="h-4 w-4" />, label: 'Home', color: 'donation-primary' },
    { path: '/donate', icon: <Heart className="h-4 w-4" />, label: 'Donate', color: 'donation-secondary' },
    { path: '/leaderboard', icon: <Award className="h-4 w-4" />, label: 'Leaderboard', color: 'donation-accent' },
  ];

  if (user?.isAdmin) {
    navLinks.push({ 
      path: '/admin', 
      icon: <LayoutDashboard className="h-4 w-4" />, 
      label: 'Admin', 
      color: 'blue-500'
    });
  }
  
  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/90 backdrop-blur-md shadow-md' : 'bg-white/50 backdrop-blur-sm'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/b8adb940-cf0a-4902-89fd-01b317af12a5.png" 
              alt="Happiness Centre" 
              className="h-8" 
            />
            <span className="font-bold text-xl font-display hidden md:inline">
              <span className="text-donation-primary">Happy</span>Donation
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center justify-center space-x-1">
            {navLinks.map(link => (
              <Button 
                key={link.path}
                variant={isActive(link.path) ? "default" : "ghost"} 
                size="sm" 
                asChild
                className={isActive(link.path) ? `bg-${link.color}/10 text-${link.color} hover:bg-${link.color}/20` : ""}
              >
                <Link to={link.path} className="flex items-center space-x-1">
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              </Button>
            ))}
          </nav>
          
          {/* User menu or login button */}
          <div className="flex items-center">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <User className="h-5 w-5" />
                    </motion.div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-md border border-gray-200 shadow-lg rounded-xl p-2 w-56">
                  <DropdownMenuLabel>
                    <div className="font-normal text-sm text-gray-500">Signed in as</div>
                    <div className="font-medium">{user.name}</div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {user.isAdmin && (
                    <DropdownMenuItem asChild className="rounded-lg">
                      <Link to="/admin" className="cursor-pointer flex items-center py-2">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleLogout} className="text-red-500 cursor-pointer rounded-lg">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="ghost" size="sm" asChild className="rounded-full">
                  <Link to="/login" className="flex items-center space-x-1">
                    <LogIn className="h-4 w-4" />
                    <span>Login</span>
                  </Link>
                </Button>
              </motion.div>
            )}
            
            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden ml-2"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-lg"
          >
            <div className="container mx-auto p-4 space-y-2">
              {navLinks.map(link => (
                <Button
                  key={link.path}
                  variant={isActive(link.path) ? "default" : "ghost"}
                  size="sm"
                  asChild
                  className={`w-full justify-start ${isActive(link.path) ? `bg-${link.color}/10 text-${link.color}` : ""}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Link to={link.path} className="flex items-center space-x-2">
                    {link.icon}
                    <span>{link.label}</span>
                  </Link>
                </Button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
