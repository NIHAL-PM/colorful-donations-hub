
import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AdminDashboard from '@/components/AdminDashboard';
import Navbar from '@/components/Navbar';
import AnimatedBackground from '@/components/AnimatedBackground';
import { toast } from '@/components/ui/use-toast';

const Admin = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoading && user === null) {
      toast({
        title: "Access Denied",
        description: "Please login to access the admin dashboard",
        variant: "destructive",
      });
      navigate('/login');
    } else if (!isLoading && user && !user.isAdmin) {
      toast({
        title: "Permission Denied",
        description: "You need admin privileges to access this page",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [user, isLoading, navigate]);
  
  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <AnimatedBackground />
        <div className="text-center p-8 glass-card rounded-xl">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-donation-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }
  
  // Redirect non-admin users to home page
  if (!user || !user.isAdmin) {
    return null; // We handle the redirection in useEffect
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white to-gray-100">
      <AnimatedBackground />
      <Navbar />
      <div className="container mx-auto px-4 py-8 mt-16 flex-grow relative z-10">
        <div className="mb-6 glass-card p-6 rounded-xl bg-white/80 backdrop-blur-md shadow-lg">
          <h1 className="text-3xl font-bold text-donation-primary">HappyDonation Admin</h1>
          <p className="text-gray-600">Welcome back, {user.name}!</p>
        </div>
        
        <AdminDashboard />
      </div>
    </div>
  );
};

export default Admin;
