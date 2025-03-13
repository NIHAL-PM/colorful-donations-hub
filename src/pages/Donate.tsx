
import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import DonationForm from '@/components/DonationForm';
import AnimatedBackground from '@/components/AnimatedBackground';
import { ChevronRight } from 'lucide-react';

const Donate = () => {
  return (
    <div className="min-h-screen">
      <AnimatedBackground variant="donation" />
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <div className="inline-block rounded-full bg-donation-primary/10 px-4 py-1.5 mb-4">
              <span className="text-sm font-medium text-donation-primary flex items-center">
                <ChevronRight size={14} className="mr-1" />
                Nilgiri College Happiness Club
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Your Generosity Makes a Difference
            </h1>
            
            <p className="text-gray-600 max-w-xl mx-auto">
              Choose an amount that feels right for you. Every donation, no matter the size, helps the Happiness Club continue its mission.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <DonationForm />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 bg-white/60 backdrop-blur-sm rounded-xl p-6 max-w-2xl mx-auto"
          >
            <h3 className="text-lg font-medium mb-3">Where Your Donation Goes</h3>
            
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="flex-shrink-0 rounded-full bg-donation-primary/10 p-1 mr-3 mt-1">
                  <ChevronRight size={14} className="text-donation-primary" />
                </div>
                <p className="text-gray-600">
                  <strong>Campus Wellness Programs:</strong> 40% of donations support wellness initiatives and events on campus.
                </p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 rounded-full bg-donation-secondary/10 p-1 mr-3 mt-1">
                  <ChevronRight size={14} className="text-donation-secondary" />
                </div>
                <p className="text-gray-600">
                  <strong>Community Outreach:</strong> 30% goes toward community service and local outreach programs.
                </p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 rounded-full bg-donation-accent/10 p-1 mr-3 mt-1">
                  <ChevronRight size={14} className="text-donation-accent" />
                </div>
                <p className="text-gray-600">
                  <strong>Student Support:</strong> 20% helps provide resources and support for students in need.
                </p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 rounded-full bg-donation-light/50 p-1 mr-3 mt-1">
                  <ChevronRight size={14} className="text-donation-dark" />
                </div>
                <p className="text-gray-600">
                  <strong>Club Operations:</strong> 10% covers materials and resources needed for club activities.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Donate;
