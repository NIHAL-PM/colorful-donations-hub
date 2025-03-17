
import { useState, useEffect, createContext, useContext } from 'react';
import { useDonations } from './useDonations';
import type { Donor } from '@/components/LeaderboardCard';
import { supabase } from '@/integrations/supabase/client';

export interface DepartmentStats {
  department: string;
  totalAmount: number;
  donorCount: number;
  rank: number;
  previousRank?: number;
}

interface LeaderboardContextType {
  leaderboard: Donor[];
  topDonors: Donor[]; 
  departmentLeaderboard: DepartmentStats[];
  selectedDepartment: string;
  setSelectedDepartment: (department: string) => void;
  isLoading: boolean;
  error: Error | null;
  refreshLeaderboard: () => void;
}

const LeaderboardContext = createContext<LeaderboardContextType | undefined>(undefined);

export const LeaderboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { donations, isLoading: isDonationsLoading } = useDonations();
  const [leaderboard, setLeaderboard] = useState<Donor[]>([]);
  const [departmentLeaderboard, setDepartmentLeaderboard] = useState<DepartmentStats[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  useEffect(() => {
    if (isDonationsLoading) return;
    
    const calculateLeaderboards = async () => {
      setIsLoading(true);
      
      try {
        // Get the previous leaderboard for rank comparison
        const prevLeaderboard = [...leaderboard];
        const prevDeptLeaderboard = [...departmentLeaderboard];
        
        // Group donations by email and sum amounts
        const donorMap = new Map<string, { total: number, name: string, date: string, department?: string }>();
        
        donations.forEach(donation => {
          const key = donation.email;
          const existing = donorMap.get(key);
          
          if (existing) {
            existing.total += donation.amount;
            // Keep the most recent date
            if (new Date(donation.date) > new Date(existing.date)) {
              existing.date = donation.date;
              // Update department if available
              if (donation.department) {
                existing.department = donation.department;
              }
            }
          } else {
            donorMap.set(key, {
              total: donation.amount,
              name: donation.name,
              date: donation.date,
              department: donation.department,
            });
          }
        });
        
        // Convert to array and sort by amount for individual leaderboard
        const newLeaderboard = Array.from(donorMap.entries()).map(([email, data], index) => {
          // Find previous rank if available
          const prevEntry = prevLeaderboard.find(entry => entry.id === email);
          
          return {
            id: email,
            name: data.name,
            amount: data.total,
            date: data.date,
            department: data.department,
            rank: index + 1,
            previousRank: prevEntry?.rank,
          };
        });
        
        // Sort by amount (descending)
        newLeaderboard.sort((a, b) => b.amount - a.amount);
        
        // Update ranks based on new order
        newLeaderboard.forEach((donor, index) => {
          donor.rank = index + 1;
        });
        
        // Create department leaderboard
        const deptMap = new Map<string, { totalAmount: number, donorCount: number }>();
        
        // Process donations by department
        donations.forEach(donation => {
          if (!donation.department) return;
          
          const dept = donation.department;
          const existing = deptMap.get(dept);
          
          if (existing) {
            existing.totalAmount += donation.amount;
            existing.donorCount += 1;
          } else {
            deptMap.set(dept, {
              totalAmount: donation.amount,
              donorCount: 1
            });
          }
        });
        
        // Convert department map to array
        const newDeptLeaderboard = Array.from(deptMap.entries()).map(([dept, data], index) => {
          // Find previous rank if available
          const prevEntry = prevDeptLeaderboard.find(entry => entry.department === dept);
          
          return {
            department: dept,
            totalAmount: data.totalAmount,
            donorCount: data.donorCount,
            rank: index + 1,
            previousRank: prevEntry?.rank,
          };
        });
        
        // Sort departments by total amount (descending)
        newDeptLeaderboard.sort((a, b) => b.totalAmount - a.totalAmount);
        
        // Update ranks based on new order
        newDeptLeaderboard.forEach((dept, index) => {
          dept.rank = index + 1;
        });
        
        setLeaderboard(newLeaderboard);
        setDepartmentLeaderboard(newDeptLeaderboard);
      } catch (err) {
        setError(err as Error);
        console.error('Error calculating leaderboard:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    calculateLeaderboards();
  }, [donations, isDonationsLoading, lastUpdate]);

  const refreshLeaderboard = () => {
    setLastUpdate(Date.now());
  };

  // Expose topDonors as filtered by department if selected
  const topDonors = selectedDepartment 
    ? leaderboard.filter(donor => donor.department === selectedDepartment)
    : leaderboard;

  return (
    <LeaderboardContext.Provider 
      value={{ 
        leaderboard, 
        topDonors, 
        departmentLeaderboard, 
        selectedDepartment, 
        setSelectedDepartment,
        isLoading, 
        error, 
        refreshLeaderboard 
      }}
    >
      {children}
    </LeaderboardContext.Provider>
  );
};

export const useLeaderboard = () => {
  const context = useContext(LeaderboardContext);
  if (context === undefined) {
    throw new Error('useLeaderboard must be used within a LeaderboardProvider');
  }
  return context;
};
