import { useState, useEffect, createContext, useContext } from 'react';
import { useDonations } from './useDonations';
import type { Donor } from '@/components/LeaderboardCard';

interface LeaderboardContextType {
  leaderboard: Donor[];
  isLoading: boolean;
  error: Error | null;
  refreshLeaderboard: () => void;
}

const LeaderboardContext = createContext<LeaderboardContextType | undefined>(undefined);

export const LeaderboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { donations, isLoading: isDonationsLoading } = useDonations();
  const [leaderboard, setLeaderboard] = useState<Donor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  useEffect(() => {
    if (isDonationsLoading) return;
    
    const calculateLeaderboard = async () => {
      setIsLoading(true);
      
      try {
        // Simulate some processing delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Get the previous leaderboard for rank comparison
        const prevLeaderboard = [...leaderboard];
        
        // Group donations by email and sum amounts
        const donorMap = new Map<string, { total: number, name: string, date: string }>();
        
        donations.forEach(donation => {
          const key = donation.email;
          const existing = donorMap.get(key);
          
          if (existing) {
            existing.total += donation.amount;
            // Keep the most recent date
            if (new Date(donation.date) > new Date(existing.date)) {
              existing.date = donation.date;
            }
          } else {
            donorMap.set(key, {
              total: donation.amount,
              name: donation.name,
              date: donation.date,
            });
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
          };
        });
        
        // Sort by amount (descending)
        newLeaderboard.sort((a, b) => b.amount - a.amount);
        
        // Update ranks based on new order
        newLeaderboard.forEach((donor, index) => {
          donor.rank = index + 1;
        });
        
        setLeaderboard(newLeaderboard);
      } catch (err) {
        setError(err as Error);
        console.error('Error calculating leaderboard:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    calculateLeaderboard();
  }, [donations, isDonationsLoading, lastUpdate]);

  const refreshLeaderboard = () => {
    setLastUpdate(Date.now());
  };

  return (
    <LeaderboardContext.Provider value={{ leaderboard, isLoading, error, refreshLeaderboard }}>
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
