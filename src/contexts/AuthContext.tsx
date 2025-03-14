
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  users: UserProfile[];
  addUser: (user: { email: string; password: string; name: string; isAdmin: boolean }) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  updateUser: (id: string, updates: Partial<Omit<UserProfile, 'id'>>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<UserProfile[]>([]);

  useEffect(() => {
    // Check for current user session on load
    const getCurrentUser = async () => {
      try {
        setIsLoading(true);
        
        // Get the session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }
        
        if (session?.user) {
          // Get profile for additional user info like admin status
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (profileError) {
            console.error('Error fetching profile:', profileError);
          }
          
          if (profile) {
            setUser({
              id: session.user.id,
              name: profile.name,
              email: profile.email,
              isAdmin: profile.is_admin
            });
          }
        }
        
        // Set up auth state listener
        const { data: { subscription } } = await supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (session?.user) {
              // Get profile for additional user info like admin status
              const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
                
              if (profileError) {
                console.error('Error fetching profile:', profileError);
              }
              
              if (profile) {
                setUser({
                  id: session.user.id,
                  name: profile.name,
                  email: profile.email,
                  isAdmin: profile.is_admin
                });
              }
            } else {
              setUser(null);
            }
          }
        );
        
        // Clean up the subscription
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error in auth setup:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    getCurrentUser();
  }, []);
  
  useEffect(() => {
    // Get all users (admin only)
    const fetchUsers = async () => {
      if (user?.isAdmin) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*');
          
          if (error) {
            throw error;
          }
          
          if (data) {
            setUsers(data.map(profile => ({
              id: profile.id,
              name: profile.name,
              email: profile.email,
              isAdmin: profile.is_admin
            })));
          }
        } catch (error) {
          console.error('Error fetching users:', error);
          toast({
            title: 'Error',
            description: 'Failed to load users data',
            variant: 'destructive',
          });
        }
      }
    };
    
    fetchUsers();
  }, [user]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Success",
        description: "You have successfully logged in!",
      });
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "An error occurred during login",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      setUser(null);
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to log out: " + error.message,
        variant: "destructive",
      });
    }
  };

  const addUser = async (userData: { email: string; password: string; name: string; isAdmin: boolean }) => {
    if (!user?.isAdmin) {
      toast({
        title: "Permission denied",
        description: "Only administrators can add new users",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Create user in Supabase Auth
      const { data, error } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        email_confirm: true,
        user_metadata: { name: userData.name }
      });
      
      if (error) {
        throw error;
      }
      
      if (data.user) {
        // Set admin status if needed
        if (userData.isAdmin) {
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ is_admin: true })
            .eq('id', data.user.id);
          
          if (updateError) {
            throw updateError;
          }
        }
        
        toast({
          title: "Success",
          description: "User added successfully",
        });
        
        // Refresh user list
        if (user?.isAdmin) {
          const { data: profiles, error: fetchError } = await supabase
            .from('profiles')
            .select('*');
          
          if (fetchError) {
            throw fetchError;
          }
          
          if (profiles) {
            setUsers(profiles.map(profile => ({
              id: profile.id,
              name: profile.name,
              email: profile.email,
              isAdmin: profile.is_admin
            })));
          }
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to add user: " + error.message,
        variant: "destructive",
      });
    }
  };

  const deleteUser = async (id: string) => {
    if (!user?.isAdmin) {
      toast({
        title: "Permission denied",
        description: "Only administrators can delete users",
        variant: "destructive",
      });
      return;
    }
    
    // Prevent deleting yourself
    if (user.id === id) {
      toast({
        title: "Error",
        description: "You cannot delete your own account while logged in",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Delete user in Supabase Auth
      const { error } = await supabase.auth.admin.deleteUser(id);
      
      if (error) {
        throw error;
      }
      
      // Update state
      setUsers(prev => prev.filter(u => u.id !== id));
      
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete user: " + error.message,
        variant: "destructive",
      });
    }
  };

  const updateUser = async (id: string, updates: Partial<Omit<UserProfile, 'id'>>) => {
    if (!user?.isAdmin && user?.id !== id) {
      toast({
        title: "Permission denied",
        description: "You can only update your own profile unless you're an admin",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Update profile in database
      const { error } = await supabase
        .from('profiles')
        .update({
          name: updates.name,
          email: updates.email,
          is_admin: updates.isAdmin,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      // If this is the current user, update state
      if (user?.id === id) {
        setUser(prev => prev ? { ...prev, ...updates } : null);
      }
      
      // Update users list
      setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
      
      toast({
        title: "Success",
        description: "User updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update user: " + error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isLoading, 
      users,
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
