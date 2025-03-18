
import { useState, useEffect, createContext, useContext } from 'react';
import { useDonations } from './useDonations';
import { supabase } from '@/integrations/supabase/client';

export interface Donor {
  id: string;
  name: string;
  amount: number;
  date: string;
  rank: number;
  previousRank?: number;
  department?: string;
}

interface DepartmentStats {
  name: string;
  totalAmount: number;
  donorCount: number;
  rank: number;
  previousRank?: number;
}

interface LeaderboardContextType {
  leaderboard: Donor[];
  topDonors: Donor[];
  departmentStats: DepartmentStats[];
  isLoading: boolean;
  error: Error | null;
  refreshLeaderboard: () => void;
}

const LeaderboardContext = createContext<LeaderboardContextType | undefined>(undefined);

export const LeaderboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { donations, isLoading: isDonationsLoading } = useDonations();
  const [leaderboard, setLeaderboard] = useState<Donor[]>([]);
  const [departmentStats, setDepartmentStats] = useState<DepartmentStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  useEffect(() => {
    if (isDonationsLoading) return;
    
    const calculateLeaderboard = async () => {
      setIsLoading(true);
      
      try {
        // Get the previous leaderboard for rank comparison
        const prevLeaderboard = [...leaderboard];
        const prevDepartmentStats = [...departmentStats];
        
        // Group donations by email and sum amounts
        const donorMap = new Map<string, { total: number, name: string, date: string, department?: string }>();
        
        // Department statistics map
        const deptMap = new Map<string, { totalAmount: number, donorCount: number }>();
        
        donations.forEach(donation => {
          const key = donation.email;
          const existing = donorMap.get(key);
          
          // Process donor data
          if (existing) {
            existing.total += donation.amount;
            // Keep the most recent date
            if (new Date(donation.date) > new Date(existing.date)) {
              existing.date = donation.date;
              if (donation.department) {
                existing.department = donation.department;
              }
            }
          } else {
            donorMap.set(key, {
              total: donation.amount,
              name: donation.name,
              date: donation.date,
              department: donation.department
            });
          }
          
          // Process department data
          if (donation.department) {
            const dept = deptMap.get(donation.department);
            if (dept) {
              dept.totalAmount += donation.amount;
              dept.donorCount += 1;
            } else {
              deptMap.set(donation.department, {
                totalAmount: donation.amount,
                donorCount: 1
              });
            }
          }
        });
        
        // Convert to array and sort by amount
        const newLeaderboard = Array.from(donorMap.entries()).map(([email, data], index) => {
          // Find previous rank if available
          const prevEntry = prevLeaderboard.find(entry => entry.id === email);
          
          return {
            id: email,
            name: data.name,
            amount: data.total,
            date: data.date,
            rank: index + 1,
            previousRank: prevEntry?.rank,
            department: data.department
          };
        });
        
        // Sort by amount (descending)
        newLeaderboard.sort((a, b) => b.amount - a.amount);
        
        // Update ranks based on new order
        newLeaderboard.forEach((donor, index) => {
          donor.rank = index + 1;
        });
        
        // Calculate department statistics
        const newDepartmentStats = Array.from(deptMap.entries()).map(([name, data], index) => {
          const prevDept = prevDepartmentStats.find(d => d.name === name);
          
          return {
            name,
            totalAmount: data.totalAmount,
            donorCount: data.donorCount,
            rank: index + 1,
            previousRank: prevDept?.rank
          };
        });
        
        // Sort departments by total amount
        newDepartmentStats.sort((a, b) => b.totalAmount - a.totalAmount);
        
        // Update ranks
        newDepartmentStats.forEach((dept, index) => {
          dept.rank = index + 1;
        });
        
        setLeaderboard(newLeaderboard);
        setDepartmentStats(newDepartmentStats);
      } catch (err) {
        setError(err as Error);
        console.error('Error calculating leaderboard:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    calculateLeaderboard();
  }, [donations, isDonationsLoading, lastUpdate]);

  // Get top donors for quick access
  const topDonors = leaderboard.slice(0, 10);

  const refreshLeaderboard = () => {
    setLastUpdate(Date.now());
  };

  return (
    <LeaderboardContext.Provider value={{ 
      leaderboard, 
      topDonors, 
      departmentStats, 
      isLoading, 
      error, 
      refreshLeaderboard 
    }}>
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
