
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Heart, ArrowRight, CreditCard, Share2, CheckCircle } from 'lucide-react';
import PaymentMethods from './PaymentMethods';
import { useDonations } from '@/hooks/useDonations';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { DonationReceipt } from '@/services/razorpay';
import DonationReceiptComponent from './DonationReceipt';

const presetAmounts = [500, 1000, 2000, 5000, 10000];

const DEPARTMENTS = [
  "BCA", "BSc CS", "PSYCHOLOGY", "MULTIMEDIA", 
  "BCOM PA", "BCOM CA", "MSC CS", "MSC PSYCHOLOGY", 
  "MCA", "BBA", "OTHER"
];

const YEARS = ["First Year", "Second Year", "Third Year", "Final Year"];

const DONOR_TYPES = ["Student", "Faculty", "Alumni", "Well-wisher"];

const DonationForm: React.FC = () => {
  const [amount, setAmount] = useState(1000);
  const [customAmount, setCustomAmount] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('');
  const [donorType, setDonorType] = useState('Student');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [step, setStep] = useState(1);
  const [receipt, setReceipt] = useState<DonationReceipt | null>(null);
  const { addDonation } = useDonations();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Prefill form if user is logged in
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, [user]);

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
    
    if (!isAnonymous && (!name || !email || !email.includes('@'))) {
      toast({
        title: "Missing information",
        description: "Please provide your name and a valid email address or choose to donate anonymously",
        variant: "destructive",
      });
      return;
    }
    
    if (!department && donorType === 'Student') {
      toast({
        title: "Department required",
        description: "Please select your department",
        variant: "destructive",
      });
      return;
    }
    
    if (!year && donorType === 'Student') {
      toast({
        title: "Year required",
        description: "Please select your year of study",
        variant: "destructive",
      });
      return;
    }
    
    setStep(2);
  };

  const handlePaymentComplete = (paidAmount: number, method: string, receiptData?: DonationReceipt) => {
    addDonation({
      name,
      email,
      amount: paidAmount,
      method,
      date: new Date().toISOString(),
      message: message,
      department: department,
      year: year,
      donorType: donorType,
      anonymous: isAnonymous
    });
    
    if (receiptData) {
      setReceipt(receiptData);
    }
    
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
    <AnimatePresence mode="wait">
      <motion.div
        key="step1"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-xl font-medium bg-gradient-to-r from-donation-primary to-donation-secondary bg-clip-text text-transparent mb-1">Select donation amount</h3>
            <div className="w-20 h-1 bg-gradient-to-r from-donation-primary to-donation-secondary rounded-full mx-auto mb-4"></div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 mb-4">
            {presetAmounts.map((preset) => (
              <Button
                key={preset}
                type="button"
                onClick={() => handlePresetAmountClick(preset)}
                className={`rounded-xl transition-all duration-300 border-2 ${
                  amount === preset && customAmount === '' 
                    ? 'bg-donation-primary text-white border-donation-primary shadow-md shadow-donation-primary/20 scale-105' 
                    : 'bg-white/30 hover:bg-donation-primary/10 border-donation-primary/30 hover:border-donation-primary/60'
                }`}
              >
                ₹{preset.toLocaleString('en-IN')}
              </Button>
            ))}
          </div>
          
          <div className="relative mt-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">₹</span>
            </div>
            <Input
              type="text"
              placeholder="Custom amount"
              value={customAmount}
              onChange={handleCustomAmountChange}
              className="pl-8 glass-input text-center backdrop-blur-md border-donation-primary/20 focus:border-donation-primary/40"
            />
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
          
          <motion.div 
            className="flex items-center justify-center py-4"
            animate={{ scale: [1, 1.05, 1], opacity: [0.9, 1, 0.9] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <div className="relative px-8 py-3 rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-donation-primary/10 to-donation-secondary/10 rounded-lg"></div>
              <div className="relative text-4xl font-bold bg-gradient-to-r from-donation-primary to-donation-secondary bg-clip-text text-transparent">
                ₹{amount.toLocaleString('en-IN')}
              </div>
            </div>
          </motion.div>
        </div>
        
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-xl font-medium bg-gradient-to-r from-donation-primary to-donation-secondary bg-clip-text text-transparent mb-1">Your information</h3>
            <div className="w-20 h-1 bg-gradient-to-r from-donation-primary to-donation-secondary rounded-full mx-auto mb-4"></div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-2 mb-2">
              <Checkbox id="anonymous" checked={isAnonymous} onCheckedChange={(checked) => setIsAnonymous(checked === true)} />
              <Label htmlFor="anonymous" className="cursor-pointer">Donate anonymously</Label>
            </div>
            
            {!isAnonymous && (
              <>
                <Input
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="glass-input backdrop-blur-md border-donation-primary/20 focus:border-donation-primary/40"
                />
                
                <Input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glass-input backdrop-blur-md border-donation-primary/20 focus:border-donation-primary/40"
                />
              </>
            )}
            
            {/* Only shown if not anonymous */}
            {!isAnonymous && (
              <div className="space-y-1">
                <Label htmlFor="donorType">I am a</Label>
                <Select 
                  value={donorType} 
                  onValueChange={setDonorType}
                >
                  <SelectTrigger 
                    id="donorType" 
                    className="glass-input backdrop-blur-md border-donation-primary/20 focus:border-donation-primary/40"
                  >
                    <SelectValue placeholder="Select donor type" />
                  </SelectTrigger>
                  <SelectContent>
                    {DONOR_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Show department and year only for students */}
            {donorType === 'Student' && !isAnonymous && (
              <>
                <div className="space-y-1">
                  <Label htmlFor="department">Department</Label>
                  <Select 
                    value={department} 
                    onValueChange={setDepartment}
                  >
                    <SelectTrigger 
                      id="department" 
                      className="glass-input backdrop-blur-md border-donation-primary/20 focus:border-donation-primary/40"
                    >
                      <SelectValue placeholder="Select your department" />
                    </SelectTrigger>
                    <SelectContent>
                      {DEPARTMENTS.map((dept) => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="year">Year</Label>
                  <Select 
                    value={year} 
                    onValueChange={setYear}
                  >
                    <SelectTrigger 
                      id="year" 
                      className="glass-input backdrop-blur-md border-donation-primary/20 focus:border-donation-primary/40"
                    >
                      <SelectValue placeholder="Select your year" />
                    </SelectTrigger>
                    <SelectContent>
                      {YEARS.map((yr) => (
                        <SelectItem key={yr} value={yr}>{yr}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {/* Only show department for faculty */}
            {donorType === 'Faculty' && !isAnonymous && (
              <div className="space-y-1">
                <Label htmlFor="department">Department</Label>
                <Select 
                  value={department} 
                  onValueChange={setDepartment}
                >
                  <SelectTrigger 
                    id="department" 
                    className="glass-input backdrop-blur-md border-donation-primary/20 focus:border-donation-primary/40"
                  >
                    <SelectValue placeholder="Select your department" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEPARTMENTS.map((dept) => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <Input
              placeholder="Optional message (why you're donating)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="glass-input backdrop-blur-md border-donation-primary/20 focus:border-donation-primary/40"
            />
          </div>
        </div>
        
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button 
            onClick={handleContinue}
            className="w-full py-6 text-lg font-bold relative overflow-hidden group"
            style={{ 
              background: 'linear-gradient(90deg, #4F9D69 0%, #8FCFD1 100%)',
              boxShadow: '0 10px 15px -3px rgba(79, 157, 105, 0.2), 0 4px 6px -2px rgba(79, 157, 105, 0.1)'
            }}
            disabled={amount <= 0 || (!isAnonymous && (!name || !email))}
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-shimmer -translate-x-full group-hover:translate-x-full transition-all duration-1000"></div>
            <div className="flex items-center justify-center gap-2">
              <Heart className="mr-2" fill="white" />
              <span>Donate ₹{amount.toLocaleString('en-IN')}</span>
              <ArrowRight className="ml-2 h-5 w-5" />
            </div>
          </Button>
        </motion.div>
        
        <p className="text-center text-sm text-gray-600 italic">
          Your donation helps support the Happiness Club's initiatives at Nilgiri College
        </p>
      </motion.div>
    </AnimatePresence>
  );

  const renderStepTwo = () => (
    <AnimatePresence mode="wait">
      <motion.div
        key="step2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <PaymentMethods 
          onPaymentComplete={handlePaymentComplete} 
          amount={amount} 
          name={isAnonymous ? 'Anonymous Donor' : name}
          email={email}
          department={department}
          year={year}
          donorType={donorType}
          anonymous={isAnonymous}
          message={message}
        />
        <Button 
          variant="outline"
          className="mt-4 w-full border-donation-primary/30 text-donation-primary hover:bg-donation-primary/10"
          onClick={() => setStep(1)}
        >
          Go Back
        </Button>
      </motion.div>
    </AnimatePresence>
  );

  const renderStepThree = () => (
    <AnimatePresence mode="wait">
      <motion.div
        key="step3"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center py-6 space-y-6"
      >
        {receipt ? (
          <DonationReceiptComponent receipt={receipt} />
        ) : (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 10 }}
              className="w-24 h-24 bg-gradient-to-br from-green-100 to-donation-primary/20 rounded-full mx-auto flex items-center justify-center shadow-lg"
            >
              <CheckCircle className="h-12 w-12 text-donation-primary" />
            </motion.div>
            
            <h2 className="text-3xl font-bold bg-gradient-to-r from-donation-primary to-donation-secondary bg-clip-text text-transparent">Thank You!</h2>
            
            <p className="text-gray-600 max-w-md mx-auto">
              Your donation of <span className="font-medium text-donation-primary">₹{amount.toLocaleString('en-IN')}</span> has been processed successfully. A confirmation email has been sent to {email}.
            </p>
          </>
        )}
        
        <div className="pt-4 flex gap-4 justify-center">
          <Button 
            onClick={navigateToLeaderboard} 
            className="bg-gradient-to-r from-donation-primary/80 to-donation-secondary/80 hover:from-donation-primary hover:to-donation-secondary transition-all"
          >
            View Leaderboard
          </Button>
          <Button 
            onClick={() => navigate('/')} 
            variant="outline"
            className="border-donation-primary/30 text-donation-primary hover:bg-donation-primary/10"
          >
            Return Home
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );

  return (
    <div className="w-full max-w-md mx-auto backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-donation-primary/80 to-donation-secondary/80 p-4 text-white">
        <div className="flex items-center justify-center gap-2">
          {step === 1 && <CreditCard className="h-5 w-5" />}
          {step === 2 && <Heart className="h-5 w-5" />}
          {step === 3 && <Heart className="h-5 w-5" fill="white" />}
          <h2 className="text-xl font-medium">
            {step === 1 && "Make a Donation"}
            {step === 2 && "Payment Information"}
            {step === 3 && "Donation Complete"}
          </h2>
        </div>
      </div>
      <div className="p-6">
        {step === 1 && renderStepOne()}
        {step === 2 && renderStepTwo()}
        {step === 3 && renderStepThree()}
      </div>
    </div>
  );
};

export default DonationForm;
