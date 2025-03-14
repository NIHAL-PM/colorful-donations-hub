
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, UserCheck, DollarSign, TrendingUp } from 'lucide-react';
import { useDonations } from '@/hooks/useDonations';

const DonationStats: React.FC = () => {
  const { donations } = useDonations();
  
  // Calculate dashboard stats
  const totalDonations = donations.reduce((sum, donation) => sum + donation.amount, 0);
  const uniqueDonors = new Set(donations.map(d => d.email)).size;
  const averageDonation = donations.length > 0 ? totalDonations / donations.length : 0;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Total Donations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <div className="mr-2 rounded-full bg-donation-purple/10 p-2">
              <DollarSign className="h-4 w-4 text-donation-purple" />
            </div>
            <div className="text-2xl font-bold">${totalDonations.toLocaleString()}</div>
          </div>
          <p className="text-xs text-gray-500 mt-1">+5.2% from last month</p>
        </CardContent>
      </Card>
      
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Unique Donors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <div className="mr-2 rounded-full bg-donation-teal/10 p-2">
              <UserCheck className="h-4 w-4 text-donation-teal" />
            </div>
            <div className="text-2xl font-bold">{uniqueDonors}</div>
          </div>
          <p className="text-xs text-gray-500 mt-1">+12% from last month</p>
        </CardContent>
      </Card>
      
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Average Donation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <div className="mr-2 rounded-full bg-donation-orange/10 p-2">
              <Heart className="h-4 w-4 text-donation-orange" />
            </div>
            <div className="text-2xl font-bold">${averageDonation.toFixed(2)}</div>
          </div>
          <p className="text-xs text-gray-500 mt-1">+3.1% from last month</p>
        </CardContent>
      </Card>
      
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">Donation Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <div className="mr-2 rounded-full bg-donation-pink/10 p-2">
              <TrendingUp className="h-4 w-4 text-donation-pink" />
            </div>
            <div className="text-2xl font-bold">+24%</div>
          </div>
          <p className="text-xs text-gray-500 mt-1">Compared to last quarter</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DonationStats;
