
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDonations } from '@/hooks/useDonations';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Heart, UserCheck, DollarSign, TrendingUp, Search, Download, RefreshCw } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { donations, isLoading } = useDonations();
  const { leaderboard } = useLeaderboard();
  const [searchTerm, setSearchTerm] = useState('');

  // Calculate dashboard stats
  const totalDonations = donations.reduce((sum, donation) => sum + donation.amount, 0);
  const uniqueDonors = new Set(donations.map(d => d.email)).size;
  const averageDonation = donations.length > 0 ? totalDonations / donations.length : 0;

  // Prepare data for charts
  const last7DaysDonations = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    
    const dailyDonations = donations.filter(d => 
      new Date(d.date).toISOString().split('T')[0] === dateString
    );
    
    const total = dailyDonations.reduce((sum, d) => sum + d.amount, 0);
    
    return {
      date: new Date(dateString).toLocaleDateString('en-US', { weekday: 'short' }),
      amount: total,
    };
  }).reverse();

  const paymentMethodData = donations.reduce((acc: any[], donation) => {
    const existingMethod = acc.find(m => m.name === donation.method);
    if (existingMethod) {
      existingMethod.value += donation.amount;
    } else {
      acc.push({ name: donation.method, value: donation.amount });
    }
    return acc;
  }, []);

  const COLORS = ['#9b87f5', '#33C3F0', '#FEC6A1', '#FFDEE2'];

  const filteredDonations = donations.filter(donation =>
    donation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    donation.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
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
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="donations">Donations</TabsTrigger>
          <TabsTrigger value="donors">Donors</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Donation Trend (Last 7 Days)</CardTitle>
                <CardDescription>Daily donation amounts</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={last7DaysDonations} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Amount']} />
                    <Bar dataKey="amount" fill="#9b87f5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Distribution by payment type</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={paymentMethodData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {paymentMethodData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Amount']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="donations" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search donations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 glass-input"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </Button>
            </div>
          </div>
          
          <div className="rounded-md border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100 text-gray-600">
                    <th className="px-4 py-3 text-left">Donor</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Amount</th>
                    <th className="px-4 py-3 text-left">Method</th>
                    <th className="px-4 py-3 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="text-center py-4">Loading donations...</td>
                    </tr>
                  ) : filteredDonations.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-4">No donations found</td>
                    </tr>
                  ) : (
                    filteredDonations.map((donation, index) => (
                      <tr key={index} className="border-t border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-3">{donation.name}</td>
                        <td className="px-4 py-3">{donation.email}</td>
                        <td className="px-4 py-3 font-medium">${donation.amount.toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <span className="inline-block px-2 py-1 rounded-full text-xs bg-gray-100">
                            {donation.method}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          {new Date(donation.date).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="donors" className="space-y-4">
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
