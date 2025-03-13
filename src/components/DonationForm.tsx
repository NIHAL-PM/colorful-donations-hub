
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Heart, ArrowRight } from 'lucide-react';
import PaymentMethods from './PaymentMethods';
import { useDonations } from '@/hooks/useDonations';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const presetAmounts = [500, 1000, 2000, 5000, 10000];

const DonationForm: React.FC = () => {
  const [amount, setAmount] = useState(1000);
  const [customAmount, setCustomAmount] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [step, setStep] = useState(1);
  const { addDonation } = useDonations();
  const navigate = useNavigate();

  const handlePresetAmountClick = (value: number) => {
    setAmount(value);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setCustomAmount(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      setAmount(numValue);
    }
  };

  const handleSliderChange = (value: number[]) => {
    setAmount(value[0]);
    setCustomAmount('');
  };

  const handleContinue = () => {
    if (amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid donation amount",
        variant: "destructive",
      });
      return;
    }
    
    if (!name || !email || !email.includes('@')) {
      toast({
        title: "Missing information",
        description: "Please provide your name and a valid email address",
        variant: "destructive",
      });
      return;
    }
    
    setStep(2);
  };

  const handlePaymentComplete = (paidAmount: number, method: string) => {
    addDonation({
      name,
      email,
      amount: paidAmount,
      method,
      date: new Date().toISOString(),
    });
    
    setStep(3);
    toast({
      title: "Thank you for your donation!",
      description: `Your donation of ₹${paidAmount.toFixed(0)} will help make a difference.`,
    });
  };

  const navigateToLeaderboard = () => {
    navigate('/leaderboard');
  };

  const renderStepOne = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-center">Select donation amount</h3>
        
        <div className="flex flex-wrap gap-2">
          {presetAmounts.map((preset) => (
            <Button
              key={preset}
              variant="outline"
              onClick={() => handlePresetAmountClick(preset)}
              className={`flex-1 min-w-[80px] transition-all ${
                amount === preset && customAmount === '' 
                  ? 'bg-donation-primary text-white border-donation-primary' 
                  : 'hover:bg-donation-primary/10 hover:border-donation-primary/30'
              }`}
            >
              ₹{preset}
            </Button>
          ))}
          
          <div className="w-full mt-2">
            <Input
              type="text"
              placeholder="Custom amount"
              value={customAmount}
              onChange={handleCustomAmountChange}
              className="glass-input text-center"
            />
          </div>
        </div>
        
        <div className="pt-4 pb-2">
          <Slider
            defaultValue={[1000]}
            max={20000}
            min={100}
            step={100}
            value={[amount]}
            onValueChange={handleSliderChange}
            className="py-4"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>₹100</span>
            <span>₹20,000+</span>
          </div>
        </div>
        
        <div className="flex items-center justify-center py-4">
          <div className="text-4xl font-bold text-donation-primary">₹{amount.toLocaleString('en-IN')}</div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-center">Your information</h3>
        
        <div className="space-y-3">
          <Input
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="glass-input"
          />
          
          <Input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="glass-input"
          />
        </div>
      </div>
      
      <Button 
        onClick={handleContinue}
        className="w-full py-6 text-lg font-bold bg-donation-primary hover:bg-donation-primary/90 transition-all duration-300 shadow-lg transform hover:scale-105 animate-pulse-soft"
        disabled={amount <= 0 || !name || !email}
      >
        <Heart className="mr-2" fill="white" />
        <span>Donate ₹{amount.toLocaleString('en-IN')}</span>
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
      
      <p className="text-center text-sm text-gray-500">
        Your donation helps support the Happiness Club's initiatives at Nilgiri College
      </p>
    </motion.div>
  );

  const renderStepTwo = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <PaymentMethods onPaymentComplete={handlePaymentComplete} amount={amount} />
    </motion.div>
  );

  const renderStepThree = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="text-center py-10 space-y-6"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 10 }}
        className="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center"
      >
        <Heart className="h-10 w-10 text-green-600" fill="rgba(22, 163, 74, 0.5)" />
      </motion.div>
      
      <h2 className="text-2xl font-bold">Thank You!</h2>
      
      <p className="text-gray-600 max-w-md mx-auto">
        Your donation of <span className="font-medium text-donation-primary">₹{amount.toLocaleString('en-IN')}</span> has been processed successfully. A confirmation email has been sent to {email}.
      </p>
      
      <div className="pt-4">
        <Button onClick={navigateToLeaderboard} variant="outline" className="mx-auto">
          View Leaderboard
        </Button>
      </div>
    </motion.div>
  );

  return (
    <div className="w-full max-w-md mx-auto glass-card p-6">
      {step === 1 && renderStepOne()}
      {step === 2 && renderStepTwo()}
      {step === 3 && renderStepThree()}
    </div>
  );
};

export default DonationForm;
