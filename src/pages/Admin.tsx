
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AdminDashboard from '@/components/AdminDashboard';
import Navbar from '@/components/Navbar';
import AnimatedBackground from '@/components/AnimatedBackground';

const Admin = () => {
  const { user, isLoading } = useAuth();
  
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
    return <Navigate to="/" replace />;
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
