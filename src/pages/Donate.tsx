
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
            <div className="inline-block rounded-full bg-donation-purple/10 px-4 py-1.5 mb-4">
              <span className="text-sm font-medium text-donation-purple flex items-center">
                <ChevronRight size={14} className="mr-1" />
                Make Your Contribution
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Your Generosity Makes a Difference
            </h1>
            
            <p className="text-gray-600 max-w-xl mx-auto">
              Choose an amount that feels right for you. Every donation, no matter the size, helps us continue our mission.
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
                <div className="flex-shrink-0 rounded-full bg-donation-purple/10 p-1 mr-3 mt-1">
                  <ChevronRight size={14} className="text-donation-purple" />
                </div>
                <p className="text-gray-600">
                  <strong>Education Programs:</strong> 40% of donations support educational initiatives in underserved communities.
                </p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 rounded-full bg-donation-teal/10 p-1 mr-3 mt-1">
                  <ChevronRight size={14} className="text-donation-teal" />
                </div>
                <p className="text-gray-600">
                  <strong>Community Development:</strong> 30% goes toward building infrastructure and supporting local businesses.
                </p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 rounded-full bg-donation-orange/10 p-1 mr-3 mt-1">
                  <ChevronRight size={14} className="text-donation-orange" />
                </div>
                <p className="text-gray-600">
                  <strong>Healthcare Access:</strong> 20% helps provide medical services and supplies to those who need it most.
                </p>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 rounded-full bg-donation-pink/10 p-1 mr-3 mt-1">
                  <ChevronRight size={14} className="text-donation-pink" />
                </div>
                <p className="text-gray-600">
                  <strong>Operational Costs:</strong> 10% covers administrative expenses to ensure efficient use of funds.
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
