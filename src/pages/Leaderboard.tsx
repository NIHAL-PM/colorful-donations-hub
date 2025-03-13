
import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import LeaderboardCard from '@/components/LeaderboardCard';
import AnimatedBackground from '@/components/AnimatedBackground';
import { Trophy } from 'lucide-react';

const Leaderboard = () => {
  return (
    <div className="min-h-screen">
      <AnimatedBackground variant="leaderboard" />
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <div className="inline-block rounded-full bg-donation-purple/10 px-4 py-1.5 mb-4">
            <span className="text-sm font-medium text-donation-purple flex items-center">
              <Trophy size={14} className="mr-1" />
              Top Contributors
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Leaderboard
          </h1>
          
          <p className="text-gray-600 max-w-xl mx-auto">
            Recognizing our most generous donors. Every contribution makes a difference in our mission.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <LeaderboardCard />
        </motion.div>
      </div>
    </div>
  );
};

export default Leaderboard;
