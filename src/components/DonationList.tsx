
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDonations } from '@/hooks/useDonations';
import { Search, Download, RefreshCw, Calendar, Filter, AlertCircle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DonationList: React.FC = () => {
  const { donations, isLoading, refreshDonations } = useDonations();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  
  const handleRefresh = async () => {
    await refreshDonations();
  };
  
  const filteredDonations = donations.filter(donation => {
    const matchesSearch = 
      donation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (donation.department && donation.department.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (filterType === 'all') return matchesSearch;
    if (filterType === 'anonymous' && donation.anonymous) return matchesSearch;
    if (filterType === 'student' && donation.donor_type === 'Student') return matchesSearch;
    if (filterType === 'faculty' && donation.donor_type === 'Faculty') return matchesSearch;
    if (filterType === 'alumni' && donation.donor_type === 'Alumni') return matchesSearch;
    
    return false;
  });
  
  const exportDonations = () => {
    const csvContent = [
      // CSV header
      ['Name', 'Email', 'Amount', 'Method', 'Date', 'Department', 'Year', 'Donor Type', 'Anonymous'].join(','),
      // CSV data rows
      ...filteredDonations.map(d => 
        [
          d.name,
          d.email,
          d.amount,
          d.method,
          new Date(d.date).toLocaleDateString(),
          d.department || '',
          d.year || '',
          d.donor_type || '',
          d.anonymous ? 'Yes' : 'No'
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
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <CardTitle>Donation Transactions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
          
          <div className="flex gap-2 w-full md:w-auto">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-40">
                <div className="flex items-center">
                  <Filter size={14} className="mr-2" />
                  <SelectValue placeholder="Filter by" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Donors</SelectItem>
                <SelectItem value="anonymous">Anonymous</SelectItem>
                <SelectItem value="student">Students</SelectItem>
                <SelectItem value="faculty">Faculty</SelectItem>
                <SelectItem value="alumni">Alumni</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4" />
              <span className="hidden md:inline">Refresh</span>
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={exportDonations}
            >
              <Download className="h-4 w-4" />
              <span className="hidden md:inline">Export</span>
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
                  <th className="px-4 py-3 text-left hidden md:table-cell">Department</th>
                  <th className="px-4 py-3 text-left hidden md:table-cell">Type</th>
                  <th className="px-4 py-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-donation-primary mr-2"></div>
                        Loading donations...
                      </div>
                    </td>
                  </tr>
                ) : filteredDonations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <AlertCircle className="h-5 w-5 mb-2" />
                        <span>No donations found</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredDonations.map((donation, index) => (
                    <tr key={index} className="border-t border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          {donation.anonymous && (
                            <Badge variant="outline" className="mr-2 text-xs">Anonymous</Badge>
                          )}
                          <span>{donation.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{donation.email}</td>
                      <td className="px-4 py-3 font-medium">₹{donation.amount.toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        {donation.department ? (
                          <span className="inline-block px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                            {donation.department}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        {donation.donor_type ? (
                          <span className="inline-block px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                            {donation.donor_type}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        <div className="flex items-center">
                          <Calendar size={14} className="mr-1" />
                          {format(new Date(donation.date), 'dd MMM yyyy')}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DonationList;
