
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDonations } from '@/hooks/useDonations';
import { Search, Download, RefreshCw } from 'lucide-react';

const DonationList: React.FC = () => {
  const { donations, isLoading } = useDonations();
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredDonations = donations.filter(donation =>
    donation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    donation.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const exportDonations = () => {
    const csvContent = [
      // CSV header
      ['Name', 'Email', 'Amount', 'Method', 'Date'].join(','),
      // CSV data rows
      ...filteredDonations.map(d => 
        [
          d.name,
          d.email,
          d.amount,
          d.method,
          new Date(d.date).toLocaleDateString()
        ].join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `donations_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
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
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={exportDonations}
          >
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
    </div>
  );
};

export default DonationList;
