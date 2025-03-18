
import React, { useState } from 'react';
import { useDonations } from '@/hooks/useDonations';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DonationFilters from './donation-list/DonationFilters';
import DonationTable from './donation-list/DonationTable';
import { filterDonations, createDonationsCsv, exportToCsv } from './donation-list/donationUtils';

const DonationList: React.FC = () => {
  const { donations, isLoading, refreshDonations } = useDonations();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  
  const handleRefresh = async () => {
    await refreshDonations();
  };
  
  const filteredDonations = filterDonations(donations, searchTerm, filterType);
  
  const exportDonations = () => {
    const csvContent = createDonationsCsv(filteredDonations);
    exportToCsv(csvContent, `donations_${new Date().toISOString().split('T')[0]}.csv`);
  };
  
  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <CardTitle>Donation Transactions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <DonationFilters 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterType={filterType}
          setFilterType={setFilterType}
          onRefresh={handleRefresh}
          onExport={exportDonations}
        />
        
        <DonationTable 
          filteredDonations={filteredDonations}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
};

export default DonationList;
