import { useState, useEffect, createContext, useContext } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Donation {
  id: string;
  name: string;
  email: string;
  amount: number;
  method: string;
  date: string;
  message?: string;
  user_id?: string;
  department?: string;
  year?: string;
  anonymous?: boolean;
  donorType?: string;
}

interface DonationsContextType {
  donations: Donation[];
  addDonation: (donation: Omit<Donation, 'id'>) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
  refreshDonations: () => Promise<void>;
}

const DonationsContext = createContext<DonationsContextType | undefined>(undefined);

export const DonationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchDonations = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setDonations(data.map(donation => ({
          id: donation.id,
          name: donation.name,
          email: donation.email,
          amount: Number(donation.amount),
          method: donation.method,
          date: donation.date,
          message: donation.message,
          user_id: donation.user_id,
          department: donation.department,
          year: donation.year,
          anonymous: donation.anonymous,
          donor_type: donation.donorType
        })));
      }
    } catch (err) {
      setError(err as Error);
      toast({
        title: "Error",
        description: "Failed to load donations data",
        variant: "destructive",
      });
      console.error('Error fetching donations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();

    // Set up real-time subscription
    const subscription = supabase
      .channel('donations-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'donations' }, 
        () => {
          // Refresh the donations data when any change occurs
          fetchDonations();
        }
      )
      .subscribe();

    return () => {
      // Clean up subscription
      subscription.unsubscribe();
    };
  }, []);

  const addDonation = async (donation: Omit<Donation, 'id'>) => {
    try {
      // Get current user ID if logged in
      const { data: { session } } = await supabase.auth.getSession();
      const user_id = session?.user.id;
      
      const { data, error } = await supabase
        .from('donations')
        .insert([
          {
            name: donation.anonymous ? 'Anonymous Donor' : donation.name,
            email: donation.email,
            amount: donation.amount,
            method: donation.method,
            user_id: user_id || null,
            message: donation.message || null,
            department: donation.department || null,
            year: donation.year || null,
            anonymous: donation.anonymous || false,
            donor_type: donation.donorType || null
            // date is set by default in the database
          }
        ])
        .select();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        toast({
          title: "Donation Successful",
          description: `Thank you for your donation of ₹${donation.amount.toFixed(0)}!`,
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to process donation",
        variant: "destructive",
      });
      console.error('Error adding donation:', err);
    }
  };

  const refreshDonations = async () => {
    return fetchDonations();
  };

  return (
    <DonationsContext.Provider value={{ donations, addDonation, isLoading, error, refreshDonations }}>
      {children}
    </DonationsContext.Provider>
  );
};

export const useDonations = () => {
  const context = useContext(DonationsContext);
  if (context === undefined) {
    throw new Error('useDonations must be used within a DonationsProvider');
  }
  return context;
};
