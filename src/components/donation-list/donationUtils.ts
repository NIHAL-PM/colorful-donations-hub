
import { Donation } from '@/types/donation';

export const filterDonations = (
  donations: Donation[], 
  searchTerm: string, 
  filterType: string
): Donation[] => {
  return donations.filter(donation => {
    const matchesSearch = 
      donation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (donation.department && donation.department.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (filterType === 'all') return matchesSearch;
    if (filterType === 'anonymous' && donation.anonymous) return matchesSearch;
    if (filterType === 'student' && donation.donorType === 'Student') return matchesSearch;
    if (filterType === 'faculty' && donation.donorType === 'Faculty') return matchesSearch;
    if (filterType === 'alumni' && donation.donorType === 'Alumni') return matchesSearch;
    
    return false;
  });
};

export const createDonationsCsv = (donations: Donation[]): string => {
  return [
    // CSV header
    ['Name', 'Email', 'Amount', 'Method', 'Date', 'Department', 'Year', 'Donor Type', 'Anonymous'].join(','),
    // CSV data rows
    ...donations.map(d => 
      [
        d.name,
        d.email,
        d.amount,
        d.method,
        new Date(d.date).toLocaleDateString(),
        d.department || '',
        d.year || '',
        d.donorType || '',
        d.anonymous ? 'Yes' : 'No'
      ].join(',')
    )
  ].join('\n');
};

export const exportToCsv = (content: string, filename: string): void => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
};
