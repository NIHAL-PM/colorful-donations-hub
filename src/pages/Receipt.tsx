
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { DonationReceipt as Receipt } from '@/services/razorpay';
import DonationReceipt from '@/components/DonationReceipt';
import Navbar from '@/components/Navbar';
import { Home } from 'lucide-react';

const ReceiptPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [receipt, setReceipt] = useState<Receipt | null>(null);
  
  useEffect(() => {
    // Extract receipt data from URL parameters
    const id = searchParams.get('id');
    const name = searchParams.get('name');
    const amount = searchParams.get('amount');
    const dateStr = searchParams.get('date');
    const department = searchParams.get('department');
    
    if (id && name && amount && dateStr) {
      setReceipt({
        receiptId: id,
        name: name,
        amount: parseFloat(amount),
        date: new Date(dateStr),
        email: searchParams.get('email') || 'donor@example.com',
        paymentId: searchParams.get('paymentId') || 'pay_demo',
        department: department || undefined,
        message: searchParams.get('message') || undefined
      });
    }
  }, [searchParams]);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-donation-primary to-donation-secondary bg-clip-text text-transparent">
              Donation Receipt
            </h1>
            <p className="text-gray-600 mt-2">
              Thank you for supporting the Happiness Club initiative
            </p>
          </div>
          
          {receipt ? (
            <DonationReceipt receipt={receipt} />
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <h2 className="text-xl font-medium text-gray-800 mb-4">Receipt Not Found</h2>
              <p className="text-gray-600 mb-6">
                The receipt you're looking for could not be found or has invalid information.
              </p>
              <Button
                onClick={() => navigate('/')}
                className="bg-donation-primary hover:bg-donation-primary/90"
              >
                <Home className="mr-2 h-4 w-4" />
                Return Home
              </Button>
            </div>
          )}
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              This receipt serves as confirmation of your donation to Happiness Club at Nilgiri College
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ReceiptPage;
