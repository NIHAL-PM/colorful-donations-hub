import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  users: User[];
  addUser: (user: Omit<User, 'id'> & { password: string }) => void;
  deleteUser: (id: string) => void;
  updateUser: (id: string, updates: Partial<Omit<User, 'id'>>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users with passwords
const initialMockUsers = [
  { id: '1', email: 'admin@happydonation.com', password: 'admin123', name: 'Admin User', isAdmin: true },
  { id: '2', email: 'user@happydonation.com', password: 'user123', name: 'Regular User', isAdmin: false },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<(User & { password: string })[]>([]);

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('happydonation_user');
    
    // Check for saved users list in localStorage
    const savedUsers = localStorage.getItem('happydonation_users');
    
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('happydonation_user');
      }
    }
    
    if (savedUsers) {
      try {
        setUsers(JSON.parse(savedUsers));
      } catch (error) {
        console.error('Failed to parse saved users:', error);
        // Fallback to initial mock users
        setUsers(initialMockUsers);
        localStorage.setItem('happydonation_users', JSON.stringify(initialMockUsers));
      }
    } else {
      // Initialize with mock users
      setUsers(initialMockUsers);
      localStorage.setItem('happydonation_users', JSON.stringify(initialMockUsers));
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = users.find(u => u.email === email && u.password === password);
      
      if (foundUser) {
        const { password, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        localStorage.setItem('happydonation_user', JSON.stringify(userWithoutPassword));
        toast({
          title: "Success",
          description: "You have successfully logged in!",
        });
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: (error as Error).message || "An error occurred during login",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('happydonation_user');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  const addUser = (newUser: Omit<User, 'id'> & { password: string }) => {
    // Check if email already exists
    if (users.some(u => u.email === newUser.email)) {
      toast({
        title: "Error",
        description: "A user with this email already exists",
        variant: "destructive",
      });
      return;
    }

    const userToAdd = {
      ...newUser,
      id: `user_${Date.now()}`,
    };

    const updatedUsers = [...users, userToAdd];
    setUsers(updatedUsers);
    localStorage.setItem('happydonation_users', JSON.stringify(updatedUsers));

    toast({
      title: "Success",
      description: "User added successfully",
    });
  };

  const deleteUser = (id: string) => {
    // Prevent deleting yourself
    if (user?.id === id) {
      toast({
        title: "Error",
        description: "You cannot delete your own account while logged in",
        variant: "destructive",
      });
      return;
    }

    const updatedUsers = users.filter(u => u.id !== id);
    setUsers(updatedUsers);
    localStorage.setItem('happydonation_users', JSON.stringify(updatedUsers));

    toast({
      title: "Success",
      description: "User deleted successfully",
    });
  };

  const updateUser = (id: string, updates: Partial<Omit<User, 'id'>>) => {
    const userIndex = users.findIndex(u => u.id === id);
    
    if (userIndex === -1) {
      toast({
        title: "Error",
        description: "User not found",
        variant: "destructive",
      });
      return;
    }

    const updatedUsers = [...users];
    updatedUsers[userIndex] = {
      ...updatedUsers[userIndex],
      ...updates,
    };

    setUsers(updatedUsers);
    localStorage.setItem('happydonation_users', JSON.stringify(updatedUsers));

    // If updating the currently logged-in user, update the user state and localStorage
    if (user?.id === id) {
      const { password, ...userWithoutPassword } = updatedUsers[userIndex];
      setUser(userWithoutPassword);
      localStorage.setItem('happydonation_user', JSON.stringify(userWithoutPassword));
    }

    toast({
      title: "Success",
      description: "User updated successfully",
    });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isLoading, 
      users: users.map(({ password, ...user }) => user), // Remove passwords when exposing users
      addUser,
      deleteUser,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
