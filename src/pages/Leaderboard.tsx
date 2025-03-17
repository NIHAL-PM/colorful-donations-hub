
import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import LeaderboardCard from '@/components/LeaderboardCard';
import AnimatedBackground from '@/components/AnimatedBackground';
import { Trophy, AlertCircle } from 'lucide-react';
import { useLeaderboard } from '@/hooks/useLeaderboard';

const Leaderboard = () => {
  const { leaderboard, isLoading, error } = useLeaderboard();

  return (
    <div className="min-h-screen">
      <AnimatedBackground variant="leaderboard" />
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 md:pt-32 pb-12 md:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="flex justify-center mb-4">
            <img 
              src="/lovable-uploads/dc5f60a7-e574-4624-9179-84afebf69ff9.png" 
              alt="Nilgiri College" 
              className="h-12" 
            />
          </div>
          
          <div className="inline-block rounded-full bg-donation-primary/10 px-4 py-1.5 mb-4">
            <span className="text-sm font-medium text-donation-primary flex items-center">
              <img 
                src="/lovable-uploads/b8adb940-cf0a-4902-89fd-01b317af12a5.png" 
                alt="Happiness Centre" 
                className="h-4 mr-2" 
              />
              <Trophy size={14} className="mr-1" />
              Top Contributors
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Donation Leaderboard
          </h1>
          
          <p className="text-gray-600 max-w-xl mx-auto">
            Recognizing the generous donors of Nilgiri College's Happiness Club. Every contribution makes a difference in our mission.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          {isLoading ? (
            <div className="text-center py-10">Loading leaderboard data...</div>
          ) : error ? (
            <div className="text-center py-10 text-red-500 flex items-center justify-center">
              <AlertCircle className="mr-2" />
              <span>Error loading leaderboard data</span>
            </div>
          ) : (
            <div className="space-y-4">
              {leaderboard.length > 0 ? (
                leaderboard.map((donor, index) => (
                  <LeaderboardCard key={donor.id} donor={donor} index={index} />
                ))
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500">No donations yet. Be the first to donate!</p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Leaderboard;
