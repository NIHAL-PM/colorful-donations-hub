
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLeaderboard } from '@/hooks/useLeaderboard';

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
            <div 
              key={index} 
              className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-donation-purple/20 flex items-center justify-center font-medium">
                  {index + 1}
                </div>
                <div>
                  <div className="font-medium">{donor.name}</div>
                  <div className="text-xs text-gray-500">{new Date(donor.date).toLocaleDateString()}</div>
                </div>
              </div>
              <div className="font-bold">${donor.amount.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TopDonors;
