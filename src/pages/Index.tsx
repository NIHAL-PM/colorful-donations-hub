
import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Heart, ChevronDown, ArrowRight, Users, Award, Download } from 'lucide-react';
import AnimatedBackground from '@/components/AnimatedBackground';
import Navbar from '@/components/Navbar';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';

const Index = () => {
  const featuresRef = useRef<HTMLDivElement>(null);
  const { leaderboard, isLoading } = useLeaderboard();
  const isMobile = useIsMobile();
  const [deferredPrompt, setDeferredPrompt] = React.useState<any>(null);
  
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Store the event so it can be triggered later
      console.log('Index page captured install prompt event');
      setDeferredPrompt(e);
    };
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);
  
  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const topDonors = leaderboard.slice(0, 3);
  
  const features = [
    {
      icon: <Heart className="h-10 w-10 text-white" />,
      title: "Donate with Ease",
      description: "Support causes you care about with a simple, secure donation process. Multiple payment options available."
    },
    {
      icon: <Users className="h-10 w-10 text-white" />,
      title: "Join a Community",
      description: "Be part of a passionate community of donors working together to make a difference."
    },
    {
      icon: <Award className="h-10 w-10 text-white" />,
      title: "Track Your Impact",
      description: "See your ranking on our leaderboard and track the difference your donations are making."
    }
  ];

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      toast.info("Installation not available. Try opening in your mobile browser.", {
        description: "Make sure you're using Chrome, Edge, or Samsung Internet on Android, or Safari on iOS."
      });
      return;
    }
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      toast.success("Thank you for installing our app!");
      setDeferredPrompt(null);
    } else {
      toast.info("App installation was canceled");
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-purple-50 to-white">
      <AnimatedBackground />
      <Navbar />
      
      {/* PWA Install Banner for Mobile (Prominent) */}
      {isMobile && deferredPrompt && (
        <div className="sticky top-0 z-50 bg-donation-primary text-white p-4 flex items-center justify-between animate-pulse">
          <div className="flex items-center">
            <Download className="h-6 w-6 mr-2" />
            <span className="font-bold">Install our app for a better experience!</span>
          </div>
          <Button
            onClick={handleInstallClick}
            variant="outline"
            className="bg-white text-donation-primary border-white hover:bg-white/90"
          >
            Install
          </Button>
        </div>
      )}
      
      {/* Hero Section */}
      <section className="pt-20 md:pt-28 pb-12 md:pb-20 px-4 container mx-auto max-w-6xl relative z-10">
        <div className="flex flex-col items-center justify-between gap-8 md:gap-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full text-center"
          >
            <div className="flex justify-center mb-4">
              <img 
                src="/lovable-uploads/dc5f60a7-e574-4624-9179-84afebf69ff9.png" 
                alt="Nilgiri College" 
                className="h-12 md:h-16" 
              />
            </div>
            
            <div className="inline-block rounded-full bg-donation-primary/10 px-4 py-1.5 mb-4">
              <span className="text-sm font-medium text-donation-primary flex items-center justify-center">
                <img 
                  src="/lovable-uploads/b8adb940-cf0a-4902-89fd-01b317af12a5.png" 
                  alt="Happiness Centre" 
                  className="h-4 mr-2" 
                />
                Happiness Club
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight mb-4 md:mb-6">
              <span className="text-donation-primary">Happy</span> Donation for a Brighter Future
            </h1>
            
            <p className="text-lg text-gray-600 mb-6 md:mb-8 max-w-lg mx-auto">
              Support the Happiness Club's initiatives with a simple donation. Every contribution makes a difference in our community.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/donate">
                <Button 
                  size="lg" 
                  className="bg-donation-primary hover:bg-donation-primary/90 transition-all duration-300 px-8 py-6 text-lg font-bold shadow-lg flex items-center gap-2 w-full sm:w-auto transform hover:scale-105"
                >
                  <Heart className="h-5 w-5" fill="white" />
                  <span>Donate Now</span>
                </Button>
              </Link>
              
              {isMobile && (
                <Button 
                  onClick={handleInstallClick}
                  size="lg" 
                  variant="outline"
                  className="border-donation-primary text-donation-primary hover:bg-donation-primary/10 transition-all duration-300 px-8 py-6 text-lg font-bold shadow-lg flex items-center gap-2 w-full sm:w-auto"
                >
                  <Download className="h-5 w-5" />
                  <span>Install App</span>
                </Button>
              )}
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full flex justify-center"
          >
            <div className="relative w-full max-w-md">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-donation-primary/20 rounded-full filter blur-3xl animate-pulse-soft"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-donation-secondary/20 rounded-full filter blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }}></div>
              
              <div className="relative glass-card p-6 rounded-2xl overflow-hidden shadow-card">
                <div className="absolute inset-0 bg-white/60 backdrop-blur-md -z-10"></div>
                
                <div className="text-center mb-6">
                  <Heart className="h-12 w-12 mx-auto text-donation-primary mb-2" fill="rgba(139, 92, 246, 0.2)" />
                  <h2 className="text-2xl font-bold text-gray-800">Join Our Top Donors</h2>
                  <p className="text-gray-600">See who's making the biggest impact</p>
                </div>
                
                <div className="space-y-3">
                  {isLoading ? (
                    <div className="text-center py-3">Loading donors...</div>
                  ) : topDonors.length > 0 ? (
                    topDonors.map((donor, index) => (
                      <div key={donor.id} className="flex items-center justify-between p-3 bg-white/70 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-donation-primary/10 flex items-center justify-center font-bold text-donation-primary">
                            {index + 1}
                          </div>
                          <div className="ml-3">
                            <div className="font-medium">{donor.name}</div>
                            <div className="text-sm text-gray-500">{new Date(donor.date).toLocaleDateString('en-IN')}</div>
                          </div>
                        </div>
                        <div className="font-bold text-donation-primary">₹{donor.amount.toLocaleString('en-IN')}</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-3">
                      <p>No donations yet. Be the first!</p>
                    </div>
                  )}
                </div>
                
                <div className="mt-6 text-center">
                  <Link to="/leaderboard">
                    <Button 
                      variant="ghost" 
                      className="text-donation-primary hover:bg-donation-primary/10 hover:text-donation-primary transition-all"
                    >
                      View Full Leaderboard
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <button 
            onClick={scrollToFeatures}
            className="flex flex-col items-center text-gray-500 hover:text-donation-primary transition-colors animate-bounce"
          >
            <span className="text-sm mb-1">Learn more</span>
            <ChevronDown className="h-6 w-6" />
          </button>
        </div>
      </section>
      
      {/* Features Section */}
      <section 
        ref={featuresRef}
        className="py-16 px-4 container mx-auto max-w-6xl"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold">Why Choose Happy Donation?</h2>
          <p className="text-gray-600 mt-2 max-w-xl mx-auto">Our platform makes giving back simple, secure, and satisfying.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-donation-primary to-donation-secondary p-6 rounded-xl text-white shadow-xl transition-transform duration-300 hover:scale-105"
            >
              <div className="rounded-full bg-white/20 w-16 h-16 flex items-center justify-center mb-4 mx-auto backdrop-blur-sm">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-center mb-2">{feature.title}</h3>
              <p className="text-white/90 text-center">{feature.description}</p>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link to="/donate">
            <Button 
              size="lg" 
              className="bg-donation-primary hover:bg-donation-primary/90 transition-all duration-300 px-8 py-6 text-lg font-bold shadow-lg transform hover:scale-105"
            >
              <Heart className="mr-2 h-5 w-5" fill="white" />
              <span>Donate Now</span>
            </Button>
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-12 px-4 bg-gradient-to-r from-purple-900 to-indigo-900 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex flex-col items-center md:items-start mb-6 md:mb-0">
              <div className="flex items-center mb-3">
                <img 
                  src="/lovable-uploads/b8adb940-cf0a-4902-89fd-01b317af12a5.png" 
                  alt="Happiness Centre" 
                  className="h-8 mr-3 bg-white rounded-full p-1" 
                />
                <span className="font-display font-bold text-xl text-white">Happy Donation</span>
              </div>
              <p className="text-white/80 text-center md:text-left">Supporting happiness initiatives at Nilgiri College</p>
            </div>
            
            <div className="flex flex-col items-center md:items-end">
              <img 
                src="/lovable-uploads/dc5f60a7-e574-4624-9179-84afebf69ff9.png" 
                alt="Nilgiri College" 
                className="h-10 mb-3 bg-white rounded p-1" 
              />
              <div className="flex space-x-4">
                <a href="#" className="text-white/80 hover:text-white transition-colors">Privacy</a>
                <a href="#" className="text-white/80 hover:text-white transition-colors">Terms</a>
                <a href="#" className="text-white/80 hover:text-white transition-colors">Contact</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/20 pt-6 text-center text-sm text-white/60">
            <p>© {new Date().getFullYear()} Nilgiri College of Arts and Science - Happiness Club. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
