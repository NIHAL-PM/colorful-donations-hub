
import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import LeaderboardCard from '@/components/LeaderboardCard';
import FloatingShapes from '@/components/FloatingShapes';
import { Trophy, AlertCircle, Heart, Sparkles, Crown } from 'lucide-react';
import { useLeaderboard } from '@/hooks/useLeaderboard';

const Leaderboard = () => {
  const { leaderboard, isLoading, error } = useLeaderboard();

  return (
    <div className="min-h-screen">
      <FloatingShapes variant="leaderboard" />
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
          
          <div className="inline-block rounded-full bg-primary/10 px-4 py-1.5 mb-4">
            <span className="text-sm font-medium text-primary flex items-center">
              <img 
                src="/lovable-uploads/b8adb940-cf0a-4902-89fd-01b317af12a5.png" 
                alt="Happiness Centre" 
                className="h-4 mr-2" 
              />
              <Trophy size={14} className="mr-1" />
              Top Contributors
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-4 text-gradient">
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
            <div className="text-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading leaderboard data...</p>
            </div>
          ) : error ? (
            <div className="text-center py-10 text-red-500 flex items-center justify-center">
              <AlertCircle className="mr-2" />
              <span>Error loading leaderboard data</span>
            </div>
          ) : (
            <div className="space-y-4">
              {leaderboard.length > 0 ? (
                <React.Fragment>
                  {/* Top 3 podium for larger screens */}
                  <div className="hidden md:flex gap-4 mb-8 justify-center">
                    {leaderboard.slice(0, 3).map((donor, index) => {
                      const position = [1, 0, 2][index]; // Center the 1st place
                      const height = index === 0 ? 'h-64' : index === 1 ? 'h-72' : 'h-56';
                      
                      return (
                        <motion.div
                          key={donor.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.2 * position }}
                          className={`${height} w-full max-w-xs flex flex-col justify-end`}
                          style={{ order: position }}
                        >
                          <div className="text-center mb-2">
                            {index === 0 && <Crown className="h-8 w-8 mx-auto text-amber-500" />}
                            {index === 1 && <Sparkles className="h-8 w-8 mx-auto text-yellow-400" />}
                            {index === 2 && <Trophy className="h-8 w-8 mx-auto text-amber-700" />}
                            <div className="text-lg font-medium">{donor.name}</div>
                            <div className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                              ₹{donor.amount.toLocaleString('en-IN')}
                            </div>
                          </div>
                          <div className={`h-24 ${
                            index === 0 ? 'bg-gradient-to-t from-amber-400 to-yellow-300'
                            : index === 1 ? 'bg-gradient-to-t from-gray-400 to-gray-300'
                            : 'bg-gradient-to-t from-amber-800 to-amber-700'
                          } rounded-t-lg flex items-center justify-center`}>
                            <span className="text-3xl font-bold text-white opacity-90">{index + 1}</span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                
                  {/* Standard list */}
                  {leaderboard.map((donor, index) => (
                    <LeaderboardCard key={donor.id} donor={donor} index={index} />
                  ))}
                </React.Fragment>
              ) : (
                <div className="text-center py-10 glass-card flex flex-col items-center p-8">
                  <Heart className="h-12 w-12 text-pink-400 mb-4" />
                  <p className="text-gray-500 mb-4">No donations yet. Be the first to donate!</p>
                  <motion.a 
                    href="/donate"
                    whileHover={{ scale: 1.05 }}
                    className="bg-gradient-to-r from-primary to-secondary text-white font-medium px-6 py-2 rounded-full"
                  >
                    Make a Donation
                  </motion.a>
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
