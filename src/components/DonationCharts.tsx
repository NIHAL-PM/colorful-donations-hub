
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDonations } from '@/hooks/useDonations';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const DonationCharts: React.FC = () => {
  const { donations } = useDonations();
  
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
  
  return (
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
  );
};

export default DonationCharts;
