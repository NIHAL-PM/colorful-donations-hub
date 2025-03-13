
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Heart, Trophy, UserCog, LogOut, Menu, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const navItems = [
    { name: 'Donate', path: '/donate', icon: <Heart size={18} /> },
    { name: 'Leaderboard', path: '/leaderboard', icon: <Trophy size={18} /> },
    user?.isAdmin && { name: 'Admin', path: '/admin', icon: <UserCog size={18} /> }
  ].filter(Boolean);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center space-x-2"
          onClick={closeMenu}
        >
          <span className="animate-float">
            <Heart className="h-6 w-6 text-donation-purple" fill="#9b87f5" />
          </span>
          <span className="font-display font-bold text-2xl animated-gradient-text">ColorDon</span>
        </Link>
        
        {isMobile ? (
          <>
            <button 
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-donation-purple focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            {/* Mobile menu */}
            <div className={`fixed inset-0 bg-white z-40 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
              <div className="pt-20 px-6 space-y-4">
                {navItems.map((item, i) => (
                  <Link
                    key={i}
                    to={item!.path}
                    className={`flex items-center space-x-2 p-3 rounded-lg transition-all duration-300 ${
                      location.pathname === item!.path
                        ? 'bg-donation-purple text-white'
                        : 'hover:bg-donation-purple/10'
                    }`}
                    onClick={closeMenu}
                  >
                    {item!.icon}
                    <span>{item!.name}</span>
                  </Link>
                ))}
                
                {user ? (
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start mt-4 hover:bg-donation-purple/10"
                    onClick={() => {
                      logout();
                      closeMenu();
                    }}
                  >
                    <LogOut size={18} className="mr-2" />
                    <span>Logout</span>
                  </Button>
                ) : (
                  <Link 
                    to="/login"
                    className="block w-full mt-4"
                    onClick={closeMenu}
                  >
                    <Button className="w-full bg-gradient-primary hover:opacity-90 transition-opacity">Login</Button>
                  </Link>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              {navItems.map((item, i) => (
                <Link
                  key={i}
                  to={item!.path}
                  className={`inline-flex items-center px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                    location.pathname === item!.path
                      ? 'bg-donation-purple text-white shadow-sm'
                      : 'hover:bg-donation-purple/10'
                  }`}
                >
                  {item!.icon}
                  <span className="ml-1">{item!.name}</span>
                </Link>
              ))}
            </div>
            
            {user ? (
              <Button 
                variant="ghost" 
                className="hover:bg-donation-purple/10"
                onClick={logout}
              >
                <LogOut size={18} className="mr-1" />
                <span>Logout</span>
              </Button>
            ) : (
              <Link to="/login">
                <Button className="bg-gradient-primary hover:opacity-90 transition-opacity shadow-sm">Login</Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
