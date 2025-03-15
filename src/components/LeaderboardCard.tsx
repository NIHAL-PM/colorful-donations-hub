
import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Heart, ArrowUp, Star, Sparkles, Calendar } from 'lucide-react';

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
    return 'bg-white/80';
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Sparkles className="h-6 w-6 text-amber-600" />;
    if (rank === 2) return <Star className="h-6 w-6 text-gray-600" />;
    if (rank === 3) return <Trophy className="h-6 w-6 text-amber-800" />;
    return rank;
  };

  const hasMoved = donor.previousRank && donor.previousRank > donor.rank;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={`glass-card ${index < 3 ? getBackgroundStyle(index + 1) : ''} relative overflow-hidden`}
    >
      <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-gradient-to-b from-primary to-secondary rounded-l-xl" />
      
      <div className="flex items-center justify-between gap-4 p-4">
        <div className="flex items-center space-x-4">
          <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
            index < 3 ? 'bg-white/20' : 'bg-primary/10'
          }`}>
            {typeof getRankIcon(index + 1) === 'number' ? 
              <span className="text-xl font-bold">{getRankIcon(index + 1)}</span> : 
              getRankIcon(index + 1)}
          </div>
          
          <div>
            <h3 className="font-medium text-lg">{donor.name}</h3>
            <div className="flex items-center text-sm opacity-80 space-x-2">
              <span className="flex items-center">
                <Calendar size={14} className="mr-1" />
                <span>{new Date(donor.date).toLocaleDateString('en-IN')}</span>
              </span>
              {hasMoved && (
                <span className="inline-flex items-center text-green-500 font-medium">
                  <ArrowUp size={14} className="mr-1" />
                  <span>{donor.previousRank - donor.rank}</span>
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            ₹{donor.amount.toLocaleString('en-IN')}
          </div>
          <div className="text-xs opacity-70 flex items-center justify-end">
            <Heart size={12} className="mr-1 text-pink-500" />
            <span>Generous Donor</span>
          </div>
        </div>
      </div>
      
      {index < 3 && (
        <div className="shine-effect" />
      )}
    </motion.div>
  );
};

export default LeaderboardCard;
