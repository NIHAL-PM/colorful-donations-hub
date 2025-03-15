
import React, { useState } from 'react';
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
import { motion } from 'framer-motion';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isActive = (path: string) => location.pathname === path;
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-lg shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/b8adb940-cf0a-4902-89fd-01b317af12a5.png" 
              alt="Happiness Centre" 
              className="h-8" 
            />
            <span className="font-bold text-xl font-display hidden md:inline">
              <span className="text-gradient">Happy</span>Donation
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center justify-center space-x-1">
            <Button 
              variant={isActive('/') ? "default" : "ghost"} 
              size="sm" 
              asChild
              className={isActive('/') ? "bg-primary/10 text-primary hover:bg-primary/20" : ""}
            >
              <Link to="/" className="flex items-center space-x-1">
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
            </Button>
            
            <Button 
              variant={isActive('/donate') ? "default" : "ghost"} 
              size="sm" 
              asChild
              className={isActive('/donate') ? "bg-secondary/10 text-secondary hover:bg-secondary/20" : ""}
            >
              <Link to="/donate" className="flex items-center space-x-1">
                <Heart className="h-4 w-4" />
                <span>Donate</span>
              </Link>
            </Button>
            
            <Button 
              variant={isActive('/leaderboard') ? "default" : "ghost"} 
              size="sm" 
              asChild
              className={isActive('/leaderboard') ? "bg-accent/10 text-accent hover:bg-accent/20" : ""}
            >
              <Link to="/leaderboard" className="flex items-center space-x-1">
                <Award className="h-4 w-4" />
                <span>Leaderboard</span>
              </Link>
            </Button>
            
            {user?.isAdmin && (
              <Button 
                variant={isActive('/admin') ? "default" : "ghost"} 
                size="sm" 
                asChild
                className={isActive('/admin') ? "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20" : ""}
              >
                <Link to="/admin" className="flex items-center space-x-1">
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Admin</span>
                </Link>
              </Button>
            )}
          </nav>
          
          <div className="flex items-center">
            {/* Mobile menu button */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full ml-2 bg-primary/10">
                    <User className="h-5 w-5 text-primary" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white">
                  <DropdownMenuLabel>
                    <div className="font-normal text-sm text-gray-500">Signed in as</div>
                    <div className="font-medium">{user.name}</div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {user.isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleLogout} className="text-red-500 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="sm" asChild className="hidden md:flex">
                <Link to="/login" className="flex items-center space-x-1">
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden bg-white shadow-lg py-4"
        >
          <nav className="flex flex-col space-y-2 px-4">
            <Button 
              variant={isActive('/') ? "default" : "ghost"} 
              asChild
              className={isActive('/') ? "bg-primary/10 text-primary hover:bg-primary/20 justify-start" : "justify-start"}
              onClick={closeMobileMenu}
            >
              <Link to="/" className="flex items-center space-x-2">
                <Home className="h-5 w-5" />
                <span>Home</span>
              </Link>
            </Button>
            
            <Button 
              variant={isActive('/donate') ? "default" : "ghost"} 
              asChild
              className={isActive('/donate') ? "bg-secondary/10 text-secondary hover:bg-secondary/20 justify-start" : "justify-start"}
              onClick={closeMobileMenu}
            >
              <Link to="/donate" className="flex items-center space-x-2">
                <Heart className="h-5 w-5" />
                <span>Donate</span>
              </Link>
            </Button>
            
            <Button 
              variant={isActive('/leaderboard') ? "default" : "ghost"} 
              asChild
              className={isActive('/leaderboard') ? "bg-accent/10 text-accent hover:bg-accent/20 justify-start" : "justify-start"}
              onClick={closeMobileMenu}
            >
              <Link to="/leaderboard" className="flex items-center space-x-2">
                <Award className="h-5 w-5" />
                <span>Leaderboard</span>
              </Link>
            </Button>
            
            {user?.isAdmin && (
              <Button 
                variant={isActive('/admin') ? "default" : "ghost"} 
                asChild
                className={isActive('/admin') ? "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 justify-start" : "justify-start"}
                onClick={closeMobileMenu}
              >
                <Link to="/admin" className="flex items-center space-x-2">
                  <LayoutDashboard className="h-5 w-5" />
                  <span>Admin Dashboard</span>
                </Link>
              </Button>
            )}

            {!user && (
              <Button 
                variant="outline"
                asChild
                className="justify-start mt-2 border-primary text-primary"
                onClick={closeMobileMenu}
              >
                <Link to="/login" className="flex items-center space-x-2">
                  <LogIn className="h-5 w-5" />
                  <span>Login</span>
                </Link>
              </Button>
            )}
          </nav>
        </motion.div>
      )}
    </header>
  );
};

export default Navbar;
