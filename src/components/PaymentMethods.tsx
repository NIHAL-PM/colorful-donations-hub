
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, Smartphone, Wallet, CheckCircle2, AlertCircle, Coffee } from 'lucide-react';
import { initiateRazorpayPayment, generateReceiptId, generateDonationReceipt, DonationReceipt } from '@/services/razorpay';
import { toast } from '@/components/ui/use-toast';
import DonationReceiptComponent from './DonationReceipt';

interface PaymentMethodsProps {
  onPaymentComplete: (amount: number, method: string, receiptData?: DonationReceipt) => void;
  amount: number;
  name: string;
  email: string;
  department?: string;
  year?: string;
  donorType?: string;
  anonymous?: boolean;
  message?: string;
}

const DEPARTMENTS = [
  "BCA", "BSc CS", "PSYCHOLOGY", "MULTIMEDIA", 
  "BCOM PA", "BCOM CA", "MSC CS", "MSC PSYCHOLOGY", 
  "MCA", "BBA", "OTHER"
];

const YEARS = ["First Year", "Second Year", "Third Year", "Final Year"];

const DONOR_TYPES = ["Student", "Faculty", "Alumni", "Well-wisher"];

const PaymentMethods: React.FC<PaymentMethodsProps> = ({ 
  onPaymentComplete, 
  amount, 
  name, 
  email, 
  department,
  year,
  donorType,
  anonymous,
  message
}) => {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [upiId, setUpiId] = useState('');
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [paymentError, setPaymentError] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState(department || '');
  const [selectedYear, setSelectedYear] = useState(year || '');
  const [selectedDonorType, setSelectedDonorType] = useState(donorType || 'Student');
  const [showReceipt, setShowReceipt] = useState(false);
  const [receipt, setReceipt] = useState<DonationReceipt | null>(null);

  const formatCardNumber = (value: string) => {
    return value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
  };

  const formatExpiry = (value: string) => {
    return value.replace(/\s/g, '').replace(/^(\d{2})(\d{0,2})/, '$1/$2').trim();
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCardNumber(e.target.value.slice(0, 19));
    setCardNumber(formattedValue);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatExpiry(e.target.value.slice(0, 5));
    setCardExpiry(formattedValue);
  };

  const handlePayment = async () => {
    setPaymentError('');
    setProcessing(true);
    
    try {
      if (paymentMethod === 'razorpay') {
        // Use Razorpay integration
        initiateRazorpayPayment(
          {
            amount: amount,
            currency: 'INR',
            name: 'Happiness Club',
            description: `Donation of ₹${amount}`,
            image: '/lovable-uploads/b8adb940-cf0a-4902-89fd-01b317af12a5.png',
            prefill: {
              name: anonymous ? 'Anonymous Donor' : (name || cardName || 'Donor'),
              email: email || 'donor@example.com',
            },
            notes: {
              address: 'Nilgiri College',
              department: selectedDepartment || department || '',
              year: selectedYear || year || '',
              donorType: selectedDonorType || donorType || '',
              anonymous: anonymous ? 'true' : 'false'
            },
            theme: {
              color: '#4F9D69'
            }
          },
          (response) => {
            // Payment successful
            console.log('Razorpay payment successful:', response);
            toast({
              title: 'Payment Successful',
              description: `Payment ID: ${response.razorpay_payment_id}`,
            });
            
            // Generate receipt
            const receiptData = generateDonationReceipt({
              name: anonymous ? 'Anonymous Donor' : (name || cardName || 'Donor'),
              email: email || 'donor@example.com',
              amount: amount,
              paymentId: response.razorpay_payment_id,
              department: selectedDepartment || department,
              year: selectedYear || year,
              donorType: selectedDonorType || donorType,
              anonymous: anonymous,
              message: message
            });
            
            setReceipt(receiptData);
            setShowReceipt(true);
            onPaymentComplete(amount, 'razorpay', receiptData);
            setProcessing(false);
          },
          (error) => {
            // Payment failed
            console.error('Razorpay payment failed:', error);
            setPaymentError('Payment failed. Please try again or use a different payment method.');
            setProcessing(false);
          }
        );
      } else {
        // Simulate other payment methods
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Simulate a success most of the time
        const randomSuccess = Math.random() > 0.2;
        
        if (randomSuccess) {
          const paymentId = `pay_sim_${Math.random().toString(36).substring(2, 10)}`;
          
          // Generate receipt
          const receiptData = generateDonationReceipt({
            name: anonymous ? 'Anonymous Donor' : (name || cardName || 'Donor'),
            email: email || 'donor@example.com',
            amount: amount,
            paymentId: paymentId,
            department: selectedDepartment || department,
            year: selectedYear || year,
            donorType: selectedDonorType || donorType,
            anonymous: anonymous,
            message: message
          });
          
          setReceipt(receiptData);
          setShowReceipt(true);
          onPaymentComplete(amount, paymentMethod, receiptData);
        } else {
          setPaymentError('Payment failed. Please try again or use a different payment method.');
        }
        setProcessing(false);
      }
    } catch (error) {
      setPaymentError('An unexpected error occurred. Please try again.');
      console.error('Payment failed:', error);
      setProcessing(false);
    }
  };

  const renderDonorTypeFields = () => {
    if (anonymous) return null;
    
    return (
      <div className="space-y-3">
        <div className="space-y-1">
          <Label htmlFor="donorType">I am a</Label>
          <Select 
            value={selectedDonorType} 
            onValueChange={setSelectedDonorType} 
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

        {/* Department field only for students and faculty */}
        {(selectedDonorType === 'Student' || selectedDonorType === 'Faculty') && (
          <div className="space-y-1">
            <Label htmlFor="department">Department</Label>
            <Select 
              value={selectedDepartment} 
              onValueChange={setSelectedDepartment}
              required
            >
              <SelectTrigger 
                id="department" 
                className="w-full mt-1 glass-input border-gray-200 focus:border-donation-primary/50"
              >
                <SelectValue placeholder="Select your department" />
              </SelectTrigger>
              <SelectContent>
                {DEPARTMENTS.map((dept) => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">
              This helps us track donations by department for our leaderboard
            </p>
          </div>
        )}

        {/* Year field only for students */}
        {selectedDonorType === 'Student' && (
          <div className="space-y-1">
            <Label htmlFor="year">Year</Label>
            <Select 
              value={selectedYear} 
              onValueChange={setSelectedYear}
              required
            >
              <SelectTrigger 
                id="year" 
                className="w-full mt-1 glass-input border-gray-200 focus:border-donation-primary/50"
              >
                <SelectValue placeholder="Select your year" />
              </SelectTrigger>
              <SelectContent>
                {YEARS.map((yr) => (
                  <SelectItem key={yr} value={yr}>{yr}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500 mt-1">
              This helps us track donations by year for our leaderboard
            </p>
          </div>
        )}
      </div>
    );
  };

  const isCardPaymentValid = cardNumber.length >= 19 && cardName && cardExpiry.length === 5 && cardCvv.length >= 3;
  const isUpiPaymentValid = upiId.includes('@') && upiId.length > 3;
  const isCashPaymentValid = true;
  const isRazorpayValid = true;

  const getPaymentValidity = () => {
    switch (paymentMethod) {
      case 'card': return isCardPaymentValid;
      case 'upi': return isUpiPaymentValid;
      case 'cash': return isCashPaymentValid;
      case 'razorpay': return isRazorpayValid;
      default: return false;
    }
  };

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  if (showReceipt && receipt) {
    return (
      <DonationReceiptComponent 
        receipt={receipt} 
        onClose={() => setShowReceipt(false)} 
      />
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={variants}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full max-w-md mx-auto border-none shadow-lg overflow-hidden bg-white/40 backdrop-blur-md">
        <CardHeader className="bg-gradient-to-r from-donation-primary to-donation-secondary text-white">
          <CardTitle className="text-xl font-display">Payment Methods</CardTitle>
          <CardDescription className="text-white/90">Choose your preferred payment method</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {paymentError && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }} 
              animate={{ height: 'auto', opacity: 1 }}
              className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-start"
            >
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-red-700 text-sm">{paymentError}</p>
            </motion.div>
          )}
          
          {/* Donor Type Fields */}
          {renderDonorTypeFields()}
          
          <Tabs defaultValue="razorpay" onValueChange={setPaymentMethod} className="mt-4">
            <TabsList className="grid grid-cols-4 mb-6 bg-gray-100/70">
              <TabsTrigger value="razorpay" className="flex items-center gap-2 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Coffee size={16} />
                <span>Razorpay</span>
              </TabsTrigger>
              <TabsTrigger value="card" className="flex items-center gap-2 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <CreditCard size={16} />
                <span>Card</span>
              </TabsTrigger>
              <TabsTrigger value="upi" className="flex items-center gap-2 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Smartphone size={16} />
                <span>UPI</span>
              </TabsTrigger>
              <TabsTrigger value="cash" className="flex items-center gap-2 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Wallet size={16} />
                <span>Cash</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="razorpay" className="space-y-4 animate-slide-up">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start">
                <div className="flex-shrink-0 bg-blue-100 rounded-full p-2 mr-3">
                  <Coffee className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-blue-800">Secure Payment with Razorpay</h4>
                  <p className="text-blue-700 text-sm mt-1">
                    You'll be redirected to Razorpay's secure payment gateway to complete your donation.
                  </p>
                </div>
              </div>
              
              <div className="space-y-3 p-4 rounded-lg border border-gray-200">
                <h4 className="font-medium">Payment Summary</h4>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Donation Amount</span>
                  <span className="font-medium">₹{amount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Processing Fee</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between items-center py-2 text-lg">
                  <span className="font-medium">Total</span>
                  <span className="font-bold text-donation-primary">₹{amount.toLocaleString('en-IN')}</span>
                </div>
              </div>
              
              <div className="flex justify-center mt-2">
                <img src="https://cdn.razorpay.com/static/assets/logo/payment/rzp-logo-with-badge.svg" alt="Razorpay" className="h-12" />
              </div>
            </TabsContent>
            
            <TabsContent value="card" className="space-y-4 animate-slide-up">
              <div className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <CreditCard size={16} />
                    </div>
                    <Input 
                      id="cardNumber" 
                      placeholder="1234 5678 9012 3456" 
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      maxLength={19}
                      className="glass-input pl-9 border-gray-200 focus:border-donation-primary/50"
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="name">Cardholder Name</Label>
                  <Input 
                    id="name" 
                    placeholder="John Doe" 
                    value={cardName}
                    onChange={e => setCardName(e.target.value)}
                    className="glass-input border-gray-200 focus:border-donation-primary/50"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input 
                      id="expiry" 
                      placeholder="MM/YY" 
                      value={cardExpiry}
                      onChange={handleExpiryChange}
                      maxLength={5}
                      className="glass-input border-gray-200 focus:border-donation-primary/50"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input 
                      id="cvv" 
                      placeholder="123" 
                      type="password"
                      value={cardCvv}
                      onChange={e => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      maxLength={4}
                      className="glass-input border-gray-200 focus:border-donation-primary/50"
                    />
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <RadioGroup value={selectedCard || ''} onValueChange={setSelectedCard}>
                  <div className="space-y-3">
                    <motion.div 
                      className="payment-method"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <RadioGroupItem value="visa" id="visa" className="mr-3" />
                      <Label htmlFor="visa" className="flex items-center gap-2 cursor-pointer flex-1">
                        <div className="w-10 h-6 bg-blue-700 rounded flex items-center justify-center text-white text-xs font-bold">VISA</div>
                        <span>Visa ending with 3456</span>
                      </Label>
                    </motion.div>
                    
                    <motion.div 
                      className="payment-method"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <RadioGroupItem value="mastercard" id="mastercard" className="mr-3" />
                      <Label htmlFor="mastercard" className="flex items-center gap-2 cursor-pointer flex-1">
                        <div className="w-10 h-6 bg-red-600 rounded flex items-center justify-center text-white text-xs font-bold">MC</div>
                        <span>Mastercard ending with 8901</span>
                      </Label>
                    </motion.div>
                  </div>
                </RadioGroup>
              </div>
            </TabsContent>
            
            <TabsContent value="upi" className="space-y-4 animate-slide-up">
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="upi-id">UPI ID</Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <Smartphone size={16} />
                    </div>
                    <Input 
                      id="upi-id" 
                      placeholder="username@upi" 
                      value={upiId}
                      onChange={e => setUpiId(e.target.value)}
                      className="glass-input pl-9 border-gray-200 focus:border-donation-primary/50"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Enter your UPI ID (e.g., username@ybl or username@paytm)</p>
                </div>
                
                <div className="pt-4 grid grid-cols-3 gap-3">
                  {[
                    { name: 'Google Pay', icon: '🇬' },
                    { name: 'PhonePe', icon: '🇵' },
                    { name: 'Paytm', icon: '🇵' }
                  ].map((app) => (
                    <motion.div 
                      key={app.name}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="border rounded-lg p-3 text-center cursor-pointer hover:border-donation-primary/50 hover:bg-donation-primary/5 transition-colors"
                      onClick={() => setUpiId(`example@${app.name.toLowerCase().replace(' ', '')}`)}
                    >
                      <div className="w-12 h-12 bg-gray-100 rounded-full mx-auto mb-2 flex items-center justify-center text-xl">
                        {app.icon}
                      </div>
                      <span className="text-sm">{app.name}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="cash" className="space-y-4 animate-slide-up">
              <div className="flex items-center p-4 border border-green-200 rounded-lg bg-green-50">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                <p className="text-green-700">Cash payment will be collected at the Nilgiri College campus</p>
              </div>
              
              <div className="space-y-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                <h4 className="font-medium text-gray-700">How to complete your cash donation:</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p className="flex items-start">
                    <span className="bg-donation-primary/10 text-donation-primary w-5 h-5 rounded-full flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">1</span>
                    Visit the Happiness Club desk at the college main building during opening hours (9 AM - 5 PM).
                  </p>
                  <p className="flex items-start">
                    <span className="bg-donation-primary/10 text-donation-primary w-5 h-5 rounded-full flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">2</span>
                    Mention your online donation registration ID when making the payment.
                  </p>
                  <p className="flex items-start">
                    <span className="bg-donation-primary/10 text-donation-primary w-5 h-5 rounded-full flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">3</span>
                    Keep your receipt safe for future reference.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="flex justify-between bg-gray-50 p-4 border-t border-gray-100">
          <div className="text-lg font-medium">
            Total: <span className="bg-gradient-to-r from-donation-primary to-donation-secondary bg-clip-text text-transparent">₹{amount.toLocaleString('en-IN')}</span>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              onClick={handlePayment}
              disabled={!getPaymentValidity() || processing}
              className={`min-w-[120px] relative overflow-hidden ${processing ? 'opacity-80' : ''}`}
              style={{ 
                background: 'linear-gradient(90deg, #4F9D69 0%, #8FCFD1 100%)',
                boxShadow: '0 4px 6px -1px rgba(79, 157, 105, 0.2)'
              }}
            >
              {processing && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/20 backdrop-blur-sm">
                  <div className="h-5 w-5 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                </div>
              )}
              {processing ? 'Processing...' : 'Pay Now'}
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default PaymentMethods;
