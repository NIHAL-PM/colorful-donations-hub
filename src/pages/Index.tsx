
import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Heart, ChevronDown, ArrowRight, User, Users, Award } from 'lucide-react';
import AnimatedBackground from '@/components/AnimatedBackground';
import Navbar from '@/components/Navbar';

const Index = () => {
  const featuresRef = useRef<HTMLDivElement>(null);
  
  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const features = [
    {
      icon: <Heart className="h-8 w-8 text-donation-purple" />,
      title: "Donate with Ease",
      description: "Support causes you care about with a simple, secure donation process. Multiple payment options available."
    },
    {
      icon: <Users className="h-8 w-8 text-donation-teal" />,
      title: "Join a Community",
      description: "Be part of a passionate community of donors working together to make a difference."
    },
    {
      icon: <Award className="h-8 w-8 text-donation-orange" />,
      title: "Track Your Impact",
      description: "See your ranking on our leaderboard and track the difference your donations are making."
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <AnimatedBackground />
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 container mx-auto max-w-6xl relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full md:w-1/2 text-center md:text-left"
          >
            <div className="inline-block rounded-full bg-donation-purple/10 px-4 py-1.5 mb-4">
              <span className="text-sm font-medium text-donation-purple flex items-center">
                <Heart size={14} className="mr-1" fill="#9b87f5" />
                Make a difference today
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight mb-6">
              <span className="animated-gradient-text">Colorful</span> Donations for a Brighter Future
            </h1>
            
            <p className="text-lg text-gray-600 mb-8 max-w-lg md:max-w-md">
              Support causes that matter with a beautiful, seamless donation experience. Every contribution makes a difference.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link to="/donate">
                <Button 
                  size="lg" 
                  className="bg-gradient-primary hover:opacity-90 transition-opacity px-8 py-6 text-lg shadow-lg flex items-center gap-2 w-full sm:w-auto"
                >
                  <Heart className="h-5 w-5" />
                  <span>Donate Now</span>
                </Button>
              </Link>
              
              <Link to="/leaderboard">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="px-8 py-6 text-lg border-donation-purple/30 hover:bg-donation-purple/10 hover:border-donation-purple/50 transition-colors w-full sm:w-auto"
                >
                  <span>View Leaderboard</span>
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full md:w-1/2 flex justify-center md:justify-end"
          >
            <div className="relative w-full max-w-lg">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-donation-purple/20 rounded-full filter blur-3xl animate-pulse-soft"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-donation-teal/20 rounded-full filter blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }}></div>
              
              <div className="relative glass-card p-6 rounded-2xl overflow-hidden shadow-card">
                <div className="absolute inset-0 bg-white/40 backdrop-blur-md -z-10"></div>
                
                <div className="text-center mb-6">
                  <Heart className="h-12 w-12 mx-auto text-donation-purple mb-2" fill="rgba(155, 135, 245, 0.2)" />
                  <h2 className="text-2xl font-bold text-gray-800">Join Our Top Donors</h2>
                  <p className="text-gray-600">See who's making the biggest impact</p>
                </div>
                
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-donation-purple/10 flex items-center justify-center font-bold">
                          {i}
                        </div>
                        <div className="ml-3">
                          <div className="font-medium">Top Donor {i}</div>
                          <div className="text-sm text-gray-500">Recent donor</div>
                        </div>
                      </div>
                      <div className="font-bold text-donation-purple">${(1000 / i).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 text-center">
                  <Link to="/leaderboard">
                    <Button 
                      variant="ghost" 
                      className="text-donation-purple hover:bg-donation-purple/10 hover:text-donation-purple transition-all"
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
            className="flex flex-col items-center text-gray-500 hover:text-donation-purple transition-colors animate-bounce"
          >
            <span className="text-sm mb-1">Learn more</span>
            <ChevronDown className="h-6 w-6" />
          </button>
        </div>
      </section>
      
      {/* Features Section */}
      <section 
        ref={featuresRef}
        className="py-20 px-4 container mx-auto max-w-6xl bg-white/40 backdrop-blur-md rounded-3xl shadow-glass my-10"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Why Choose ColorDon?</h2>
          <p className="text-gray-600 mt-2 max-w-xl mx-auto">Our platform makes giving back simple, secure, and satisfying.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="glass-card p-6 rounded-xl transition-transform duration-300 hover:scale-105"
            >
              <div className="rounded-full bg-white/80 w-16 h-16 flex items-center justify-center mb-4 mx-auto">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-center mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-center">{feature.description}</p>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <Link to="/donate">
            <Button 
              size="lg" 
              className="bg-gradient-primary hover:opacity-90 transition-opacity px-8 py-6 text-lg shadow-lg"
            >
              <Heart className="mr-2 h-5 w-5" />
              <span>Donate Now</span>
            </Button>
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 px-4 container mx-auto max-w-6xl text-center text-gray-600">
        <div className="flex justify-center items-center mb-4">
          <Heart className="h-6 w-6 text-donation-purple mr-2" fill="#9b87f5" />
          <span className="font-display font-bold text-xl text-gradient">ColorDon</span>
        </div>
        <p className="mb-2">Making a difference, one donation at a time.</p>
        <div className="text-sm">© {new Date().getFullYear()} ColorDon. All rights reserved.</div>
      </footer>
    </div>
  );
};

export default Index;
