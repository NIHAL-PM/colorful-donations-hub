
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DonationStats from '@/components/DonationStats';
import DonationCharts from '@/components/DonationCharts';
import DonationList from '@/components/DonationList';
import TopDonors from '@/components/TopDonors';
import UserManagement from '@/components/UserManagement';

const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <DonationStats />
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="donations">Donations</TabsTrigger>
          <TabsTrigger value="donors">Donors</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <DonationCharts />
        </TabsContent>
        
        <TabsContent value="donations" className="space-y-4">
          <DonationList />
        </TabsContent>
        
        <TabsContent value="donors" className="space-y-4">
          <TopDonors />
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4">
          <UserManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
