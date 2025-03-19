
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
  year?: string;
  donorType?: string;
  anonymous?: boolean;
}

interface DepartmentStats {
  name: string;
  totalAmount: number;
  donorCount: number;
  rank: number;
  previousRank?: number;
}

interface YearStats {
  year: string;
  totalAmount: number;
  donorCount: number;
  rank: number;
  previousRank?: number;
}

interface DonorTypeStats {
  type: string;
  totalAmount: number;
  donorCount: number;
  rank: number;
  previousRank?: number;
}

interface LeaderboardContextType {
  leaderboard: Donor[];
  topDonors: Donor[];
  departmentStats: DepartmentStats[];
  yearStats: YearStats[];
  donorTypeStats: DonorTypeStats[];
  isLoading: boolean;
  error: Error | null;
  refreshLeaderboard: () => void;
}

const LeaderboardContext = createContext<LeaderboardContextType | undefined>(undefined);

export const LeaderboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { donations, isLoading: isDonationsLoading } = useDonations();
  const [leaderboard, setLeaderboard] = useState<Donor[]>([]);
  const [departmentStats, setDepartmentStats] = useState<DepartmentStats[]>([]);
  const [yearStats, setYearStats] = useState<YearStats[]>([]);
  const [donorTypeStats, setDonorTypeStats] = useState<DonorTypeStats[]>([]);
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
        const prevYearStats = [...yearStats];
        const prevDonorTypeStats = [...donorTypeStats];
        
        // Group donations by email and sum amounts
        const donorMap = new Map<string, { 
          total: number, 
          name: string, 
          date: string, 
          department?: string,
          year?: string,
          donorType?: string,
          anonymous?: boolean
        }>();
        
        // Department statistics map
        const deptMap = new Map<string, { totalAmount: number, donorCount: number }>();
        
        // Year statistics map
        const yearMap = new Map<string, { totalAmount: number, donorCount: number }>();
        
        // Donor type statistics map
        const donorTypeMap = new Map<string, { totalAmount: number, donorCount: number }>();
        
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
              if (donation.year) {
                existing.year = donation.year;
              }
              if (donation.donorType) {
                existing.donorType = donation.donorType;
              }
              if (donation.anonymous !== undefined) {
                existing.anonymous = donation.anonymous;
              }
            }
          } else {
            donorMap.set(key, {
              total: donation.amount,
              name: donation.name,
              date: donation.date,
              department: donation.department,
              year: donation.year,
              donorType: donation.donorType,
              anonymous: donation.anonymous
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
          
          // Process year data
          if (donation.year) {
            const year = yearMap.get(donation.year);
            if (year) {
              year.totalAmount += donation.amount;
              year.donorCount += 1;
            } else {
              yearMap.set(donation.year, {
                totalAmount: donation.amount,
                donorCount: 1
              });
            }
          }
          
          // Process donor type data
          if (donation.donorType) {
            const type = donorTypeMap.get(donation.donorType);
            if (type) {
              type.totalAmount += donation.amount;
              type.donorCount += 1;
            } else {
              donorTypeMap.set(donation.donorType, {
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
            name: data.anonymous ? 'Anonymous Donor' : data.name,
            amount: data.total,
            date: data.date,
            rank: index + 1,
            previousRank: prevEntry?.rank,
            department: data.department,
            year: data.year,
            donorType: data.donorType,
            anonymous: data.anonymous
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
        
        // Calculate year statistics
        const newYearStats = Array.from(yearMap.entries()).map(([year, data], index) => {
          const prevYear = prevYearStats.find(y => y.year === year);
          
          return {
            year,
            totalAmount: data.totalAmount,
            donorCount: data.donorCount,
            rank: index + 1,
            previousRank: prevYear?.rank
          };
        });
        
        // Sort years by total amount
        newYearStats.sort((a, b) => b.totalAmount - a.totalAmount);
        
        // Update ranks
        newYearStats.forEach((year, index) => {
          year.rank = index + 1;
        });
        
        // Calculate donor type statistics
        const newDonorTypeStats = Array.from(donorTypeMap.entries()).map(([type, data], index) => {
          const prevType = prevDonorTypeStats.find(t => t.type === type);
          
          return {
            type,
            totalAmount: data.totalAmount,
            donorCount: data.donorCount,
            rank: index + 1,
            previousRank: prevType?.rank
          };
        });
        
        // Sort donor types by total amount
        newDonorTypeStats.sort((a, b) => b.totalAmount - a.totalAmount);
        
        // Update ranks
        newDonorTypeStats.forEach((type, index) => {
          type.rank = index + 1;
        });
        
        setLeaderboard(newLeaderboard);
        setDepartmentStats(newDepartmentStats);
        setYearStats(newYearStats);
        setDonorTypeStats(newDonorTypeStats);
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
      yearStats,
      donorTypeStats,
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
