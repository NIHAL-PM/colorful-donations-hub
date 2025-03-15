
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import DonationForm from '@/components/DonationForm';
import AnimatedBackground from '@/components/AnimatedBackground';
import { ChevronRight, BarChart3, Heart, Trophy, Calendar, Users } from 'lucide-react';
import { useLeaderboard } from '@/hooks/useLeaderboard';

const Donate = () => {
  const { topDonors } = useLeaderboard();

  const impact = [
    {
      icon: <Heart size={20} className="text-donation-primary" />,
      title: "Campus Wellness Programs",
      percentage: "40%",
      description: "Support wellness initiatives and events on campus."
    },
    {
      icon: <Users size={20} className="text-donation-secondary" />,
      title: "Community Outreach",
      percentage: "30%",
      description: "Funds local outreach and community service programs."
    },
    {
      icon: <Trophy size={20} className="text-donation-accent" />,
      title: "Student Support",
      percentage: "20%",
      description: "Provides resources and support for students in need."
    },
    {
      icon: <Calendar size={20} className="text-donation-dark" />,
      title: "Club Operations",
      percentage: "10%",
      description: "Covers materials and resources for club activities."
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen">
      <AnimatedBackground variant="donation" />
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 md:pt-32 pb-12 md:pb-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="flex justify-center mb-4">
              <img 
                src="/lovable-uploads/dc5f60a7-e574-4624-9179-84afebf69ff9.png" 
                alt="Nilgiri College" 
                className="h-14" 
              />
            </div>
            
            <div className="inline-block rounded-full bg-gradient-to-r from-donation-primary/20 to-donation-secondary/20 px-4 py-1.5 mb-4">
              <span className="text-sm font-medium bg-gradient-to-r from-donation-primary to-donation-secondary bg-clip-text text-transparent flex items-center">
                <img 
                  src="/lovable-uploads/b8adb940-cf0a-4902-89fd-01b317af12a5.png" 
                  alt="Happiness Centre" 
                  className="h-4 mr-2" 
                />
                Happiness Club Initiative
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 bg-gradient-to-r from-donation-primary to-donation-secondary bg-clip-text text-transparent">
              Your Generosity Makes a Difference
            </h1>
            
            <p className="text-gray-600 max-w-xl mx-auto">
              Every donation, no matter the size, helps the Happiness Club continue its mission to foster well-being and joy within our campus community.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-3 order-2 lg:order-1"
            >
              <div className="space-y-8">
                <DonationForm />
                
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="bg-white/60 backdrop-blur-md rounded-2xl p-6 shadow-lg"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="h-5 w-5 text-donation-primary" />
                    <h3 className="text-xl font-medium">Where Your Donation Goes</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {impact.map((item, index) => (
                      <motion.div 
                        key={index}
                        variants={itemVariants}
                        className="flex items-center"
                      >
                        <div className="flex-shrink-0 rounded-full bg-gray-100 p-2 mr-3">
                          {item.icon}
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between items-center mb-1">
                            <h4 className="font-medium">{item.title}</h4>
                            <span className="text-donation-primary font-medium">{item.percentage}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                            <div 
                              className="bg-gradient-to-r from-donation-primary to-donation-secondary h-2 rounded-full" 
                              style={{ width: item.percentage }}
                            ></div>
                          </div>
                          <p className="text-sm text-gray-600">{item.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="lg:col-span-2 order-1 lg:order-2"
            >
              <div className="bg-white/60 backdrop-blur-md rounded-2xl p-6 shadow-lg h-full">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-medium mb-2">Recent Generous Donors</h3>
                  <div className="w-20 h-1 bg-gradient-to-r from-donation-primary to-donation-secondary rounded-full mx-auto"></div>
                </div>
                
                <div className="space-y-3">
                  {topDonors.slice(0, 5).map((donor, index) => (
                    <motion.div 
                      key={donor.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-center p-3 bg-white/80 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-donation-primary/20 to-donation-secondary/20 flex items-center justify-center font-bold text-donation-primary">
                        {index + 1}
                      </div>
                      <div className="ml-3 flex-grow">
                        <div className="font-medium">{donor.name}</div>
                        <div className="text-sm text-gray-500">{new Date(donor.date).toLocaleDateString()}</div>
                      </div>
                      <div className="font-bold bg-gradient-to-r from-donation-primary to-donation-secondary bg-clip-text text-transparent">
                        ₹{donor.amount.toLocaleString('en-IN')}
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <div className="mt-6 space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <h4 className="font-medium mb-2 text-gray-700">Donation FAQ</h4>
                    <div className="space-y-2 text-sm">
                      <p className="flex items-start">
                        <ChevronRight size={16} className="text-donation-primary mt-1 mr-1 flex-shrink-0" />
                        <span className="text-gray-600">Are donations tax deductible?</span>
                      </p>
                      <p className="flex items-start">
                        <ChevronRight size={16} className="text-donation-primary mt-1 mr-1 flex-shrink-0" />
                        <span className="text-gray-600">Can I set up recurring donations?</span>
                      </p>
                      <p className="flex items-start">
                        <ChevronRight size={16} className="text-donation-primary mt-1 mr-1 flex-shrink-0" />
                        <span className="text-gray-600">How will I receive my donation receipt?</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-gradient-to-r from-donation-primary/10 to-donation-secondary/10">
                    <div className="font-medium mb-2">Need help with your donation?</div>
                    <p className="text-sm text-gray-600 mb-2">
                      Our team is here to assist you with any questions about the donation process.
                    </p>
                    <div className="text-sm text-donation-primary font-medium">
                      Contact: donations@nilgiricollege.edu
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-12 text-center"
          >
            <p className="text-sm text-gray-500">
              Happiness Club is a registered non-profit organization at Nilgiri College
              <br />
              All donations are secured using industry-standard encryption and security practices
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Donate;
