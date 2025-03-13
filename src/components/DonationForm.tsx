
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Heart, ArrowRight } from 'lucide-react';
import PaymentMethods from './PaymentMethods';
import { useDonations } from '@/hooks/useDonations';
import { toast } from '@/components/ui/use-toast';

const presetAmounts = [10, 25, 50, 100, 250];

const DonationForm: React.FC = () => {
  const [amount, setAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [step, setStep] = useState(1);
  const { addDonation } = useDonations();

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
      description: `Your donation of $${paidAmount.toFixed(2)} will help make a difference.`,
    });
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
        <h3 className="text-lg font-medium">Select donation amount</h3>
        
        <div className="flex flex-wrap gap-2">
          {presetAmounts.map((preset) => (
            <Button
              key={preset}
              variant="outline"
              onClick={() => handlePresetAmountClick(preset)}
              className={`flex-1 min-w-[80px] transition-all ${
                amount === preset && customAmount === '' 
                  ? 'bg-donation-purple text-white border-donation-purple' 
                  : 'hover:bg-donation-purple/10 hover:border-donation-purple/30'
              }`}
            >
              ${preset}
            </Button>
          ))}
          
          <div className="w-full mt-2">
            <Input
              type="text"
              placeholder="Custom amount"
              value={customAmount}
              onChange={handleCustomAmountChange}
              className="glass-input"
            />
          </div>
        </div>
        
        <div className="pt-4 pb-2">
          <Slider
            defaultValue={[50]}
            max={500}
            min={5}
            step={5}
            value={[amount]}
            onValueChange={handleSliderChange}
            className="py-4"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>$5</span>
            <span>$500+</span>
          </div>
        </div>
        
        <div className="flex items-center justify-center py-4">
          <div className="text-3xl font-bold text-donation-purple">${amount.toFixed(2)}</div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Your information</h3>
        
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
        className="w-full py-6 text-lg bg-gradient-primary hover:opacity-90 transition-opacity"
        disabled={amount <= 0 || !name || !email}
      >
        Continue
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
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
        Your donation of <span className="font-medium text-donation-purple">${amount.toFixed(2)}</span> has been processed successfully. A confirmation email has been sent to {email}.
      </p>
      
      <div className="pt-4">
        <Button onClick={() => window.location.href = '/leaderboard'} variant="outline" className="mx-auto">
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
