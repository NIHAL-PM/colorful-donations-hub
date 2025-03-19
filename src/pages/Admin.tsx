
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AdminDashboard from '@/components/AdminDashboard';
import Navbar from '@/components/Navbar';
import AnimatedBackground from '@/components/AnimatedBackground';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Admin = () => {
  const { user, isLoading } = useAuth();
  const [isMakingAdmin, setIsMakingAdmin] = useState(false);
  
  useEffect(() => {
    const makeUserAdmin = async () => {
      // This only runs once when the component loads
      try {
        setIsMakingAdmin(true);
        
        const { data, error } = await supabase.functions.invoke('set-admin', {
          body: { email: 'mailnihalpm@gmail.com' }
        });
        
        if (error) {
          console.error('Error making user admin:', error);
        } else {
          console.log('Admin user set successfully:', data);
        }
      } catch (err) {
        console.error('Error calling set-admin function:', err);
      } finally {
        setIsMakingAdmin(false);
      }
    };
    
    // Uncomment this line to make the user admin when the page loads
    // makeUserAdmin();
  }, []);
  
  const handleMakeAdmin = async () => {
    try {
      setIsMakingAdmin(true);
      
      const { data, error } = await supabase.functions.invoke('set-admin', {
        body: { email: 'mailnihalpm@gmail.com' }
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Success",
        description: data.message || "User is now an admin",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to set admin status",
        variant: "destructive",
      });
    } finally {
      setIsMakingAdmin(false);
    }
  };
  
  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <AnimatedBackground />
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-donation-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Redirect non-admin users to home page
  if (!user || !user.isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <AnimatedBackground />
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex-grow relative z-10 flex items-center justify-center">
          <div className="bg-white/80 backdrop-blur-md p-8 rounded-xl shadow-lg max-w-md w-full">
            <h1 className="text-2xl font-bold mb-4">Admin Access Required</h1>
            <p className="text-gray-600 mb-6">You need admin privileges to access this page.</p>
            
            <Button 
              onClick={handleMakeAdmin} 
              disabled={isMakingAdmin}
              className="w-full"
            >
              {isMakingAdmin ? 'Setting Admin Status...' : 'Make mailnihalpm@gmail.com Admin'}
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <AnimatedBackground />
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-grow relative z-10">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">HappyDonation Admin</h1>
          <p className="text-gray-600">Welcome back, {user.name}!</p>
        </div>
        
        <AdminDashboard />
      </div>
    </div>
  );
};

export default Admin;
