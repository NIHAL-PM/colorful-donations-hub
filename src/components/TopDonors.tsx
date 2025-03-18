
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { motion } from 'framer-motion';

const TopDonors: React.FC = () => {
  const { leaderboard } = useLeaderboard();
  
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Top Donors</CardTitle>
        <CardDescription>Leaderboard of top contributors</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {leaderboard.slice(0, 5).map((donor, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-donation-purple/20 flex items-center justify-center font-medium">
                  {index + 1}
                </div>
                <div>
                  <div className="font-medium">{donor.name}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <span>{new Date(donor.date).toLocaleDateString()}</span>
                    {donor.department && (
                      <>
                        <span className="inline-block w-1 h-1 bg-gray-300 rounded-full"></span>
                        <span className="text-donation-primary/80">{donor.department}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="font-bold">₹{donor.amount.toLocaleString('en-IN')}</div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopDonors;
