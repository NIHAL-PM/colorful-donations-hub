
import { useState, useEffect, createContext, useContext } from 'react';
import { toast } from '@/components/ui/use-toast';

interface Donation {
  id?: string;
  name: string;
  email: string;
  amount: number;
  method: string;
  date: string;
}

interface DonationsContextType {
  donations: Donation[];
  addDonation: (donation: Omit<Donation, 'id'>) => void;
  isLoading: boolean;
  error: Error | null;
}

// Sample initial donations data
const initialDonations: Donation[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@example.com',
    amount: 250,
    method: 'card',
    date: '2023-05-15T10:30:00Z',
  },
  {
    id: '2',
    name: 'Emma Johnson',
    email: 'emma@example.com',
    amount: 100,
    method: 'upi',
    date: '2023-05-16T14:20:00Z',
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'michael@example.com',
    amount: 500,
    method: 'card',
    date: '2023-05-16T09:45:00Z',
  },
  {
    id: '4',
    name: 'Sarah Davis',
    email: 'sarah@example.com',
    amount: 75,
    method: 'upi',
    date: '2023-05-17T16:10:00Z',
  },
  {
    id: '5',
    name: 'David Wilson',
    email: 'david@example.com',
    amount: 350,
    method: 'cash',
    date: '2023-05-18T11:30:00Z',
  },
  {
    id: '6',
    name: 'Jessica Taylor',
    email: 'jessica@example.com',
    amount: 150,
    method: 'card',
    date: '2023-05-18T13:20:00Z',
  },
  {
    id: '7',
    name: 'James Anderson',
    email: 'james@example.com',
    amount: 200,
    method: 'upi',
    date: '2023-05-19T10:00:00Z',
  },
  {
    id: '8',
    name: 'Lisa Thomas',
    email: 'lisa@example.com',
    amount: 300,
    method: 'card',
    date: '2023-05-19T15:45:00Z',
  },
  {
    id: '9',
    name: 'Robert Martinez',
    email: 'robert@example.com',
    amount: 450,
    method: 'cash',
    date: '2023-05-20T09:30:00Z',
  },
  {
    id: '10',
    name: 'Emily White',
    email: 'emily@example.com',
    amount: 125,
    method: 'upi',
    date: '2023-05-20T14:15:00Z',
  },
];

const DonationsContext = createContext<DonationsContextType | undefined>(undefined);

export const DonationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchDonations = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check if we have donations in localStorage
        const storedDonations = localStorage.getItem('colordon_donations');
        
        if (storedDonations) {
          setDonations(JSON.parse(storedDonations));
        } else {
          // Use initial data
          setDonations(initialDonations);
          localStorage.setItem('colordon_donations', JSON.stringify(initialDonations));
        }
      } catch (err) {
        setError(err as Error);
        toast({
          title: "Error",
          description: "Failed to load donations data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDonations();
  }, []);

  const addDonation = (donation: Omit<Donation, 'id'>) => {
    const newDonation = {
      ...donation,
      id: `donation_${Date.now()}`,
    };

    const updatedDonations = [...donations, newDonation];
    setDonations(updatedDonations);
    
    // Save to localStorage
    localStorage.setItem('colordon_donations', JSON.stringify(updatedDonations));
    
    // In a real app, we would also send this to the server
    console.log('Donation added:', newDonation);
  };

  return (
    <DonationsContext.Provider value={{ donations, addDonation, isLoading, error }}>
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
