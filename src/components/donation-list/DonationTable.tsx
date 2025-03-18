
import React from 'react';
import { AlertCircle, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import { Donation } from '@/types/donation';

interface DonationTableProps {
  filteredDonations: Donation[];
  isLoading: boolean;
}

const DonationTable: React.FC<DonationTableProps> = ({ filteredDonations, isLoading }) => {
  return (
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
                    {donation.donorType ? (
                      <span className="inline-block px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                        {donation.donorType}
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
  );
};

export default DonationTable;
