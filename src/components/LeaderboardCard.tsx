
import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Heart, ArrowUp } from 'lucide-react';

export interface Donor {
  id: string;
  name: string;
  amount: number;
  date: string;
  avatar?: string;
  rank: number;
  previousRank?: number;
}

export interface LeaderboardCardProps {
  donor: Donor;
  index: number;
}

const LeaderboardCard: React.FC<LeaderboardCardProps> = ({ donor, index }) => {
  const getBackgroundStyle = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-300 to-amber-500 text-black shadow-lg';
    if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-400 text-black';
    if (rank === 3) return 'bg-gradient-to-r from-amber-700 to-amber-800 text-white';
    return 'bg-white';
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🏆';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return rank;
  };

  const hasMoved = donor.previousRank && donor.previousRank > donor.rank;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={`leaderboard-item glass-card ${index < 3 ? getBackgroundStyle(index + 1) : ''} relative overflow-hidden`}
    >
      <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-donation-purple rounded-l-xl" />
      
      <div className="flex items-center justify-between gap-4 p-4">
        <div className="flex items-center space-x-4">
          <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${
            index < 3 ? 'bg-white/20' : 'bg-donation-purple/10'
          }`}>
            {getRankIcon(index + 1)}
          </div>
          
          <div>
            <h3 className="font-medium text-lg">{donor.name}</h3>
            <div className="flex items-center text-sm opacity-80 space-x-2">
              <span className="flex items-center">
                <Heart size={14} className="mr-1" />
                <span>Donated</span>
              </span>
              {hasMoved && (
                <span className="inline-flex items-center text-green-500">
                  <ArrowUp size={14} className="mr-1" />
                  <span>{donor.previousRank - donor.rank}</span>
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold">${donor.amount.toLocaleString()}</div>
          <div className="text-xs opacity-70">{new Date(donor.date).toLocaleDateString()}</div>
        </div>
      </div>
      
      {index < 3 && (
        <div className="shine-effect" />
      )}
    </motion.div>
  );
};

export default LeaderboardCard;
