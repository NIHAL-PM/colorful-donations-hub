
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { Heart, TrendingUp, Award, Users, Calendar } from 'lucide-react';

const TopDonors: React.FC = () => {
  const { leaderboard } = useLeaderboard();
  
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
    <Card className="glass-card border-none shadow-lg bg-white/40 backdrop-blur-md overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-donation-primary/20 to-donation-secondary/20">
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-donation-primary" />
          <CardTitle>Top Donors</CardTitle>
        </div>
        <CardDescription>Supporting our community with generosity</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <motion.div 
          className="space-y-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {leaderboard.slice(0, 5).map((donor, index) => (
            <motion.div 
              key={index} 
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
              variants={itemVariants}
              whileHover={{ scale: 1.02, backgroundColor: "rgba(79, 157, 105, 0.05)" }}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium text-white ${
                  index === 0 
                    ? 'bg-yellow-400' 
                    : index === 1 
                      ? 'bg-gray-400' 
                      : index === 2 
                        ? 'bg-amber-600' 
                        : 'bg-donation-purple/70'
                }`}>
                  {index + 1}
                </div>
                <div>
                  <div className="font-medium">{donor.name}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(donor.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="font-bold bg-gradient-to-r from-donation-primary to-donation-secondary bg-clip-text text-transparent">
                  ₹{donor.amount.toLocaleString()}
                </div>
                {donor.previousRank && donor.previousRank > donor.rank && (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="h-4 w-4 text-donation-primary" />
              <span>Total Donors: {leaderboard.length}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Heart className="h-4 w-4 text-red-500" />
              <span>Total Donated: ₹{
                leaderboard.reduce((sum, donor) => sum + donor.amount, 0).toLocaleString()
              }</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TopDonors;
