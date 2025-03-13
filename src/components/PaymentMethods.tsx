
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreditCard, Smartphone, Wallet, CheckCircle2 } from 'lucide-react';

interface PaymentMethodsProps {
  onPaymentComplete: (amount: number, method: string) => void;
  amount: number;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({ onPaymentComplete, amount }) => {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [upiId, setUpiId] = useState('');
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');

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
    setProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      onPaymentComplete(amount, paymentMethod);
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setProcessing(false);
    }
  };

  const isCardPaymentValid = cardNumber.length >= 19 && cardName && cardExpiry.length === 5 && cardCvv.length >= 3;
  const isUpiPaymentValid = upiId.includes('@') && upiId.length > 3;
  const isCashPaymentValid = true;

  const getPaymentValidity = () => {
    switch (paymentMethod) {
      case 'card': return isCardPaymentValid;
      case 'upi': return isUpiPaymentValid;
      case 'cash': return isCashPaymentValid;
      default: return false;
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto border-none shadow-card overflow-hidden">
      <CardHeader className="bg-gradient-payment text-white">
        <CardTitle className="text-xl font-display">Payment Methods</CardTitle>
        <CardDescription className="text-white/80">Choose your preferred payment method</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs defaultValue="card" onValueChange={setPaymentMethod}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="card" className="flex items-center gap-2 py-2">
              <CreditCard size={16} />
              <span>Card</span>
            </TabsTrigger>
            <TabsTrigger value="upi" className="flex items-center gap-2 py-2">
              <Smartphone size={16} />
              <span>UPI</span>
            </TabsTrigger>
            <TabsTrigger value="cash" className="flex items-center gap-2 py-2">
              <Wallet size={16} />
              <span>Cash</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="card" className="space-y-4 animate-slide-up">
            <div className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input 
                  id="cardNumber" 
                  placeholder="1234 5678 9012 3456" 
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  maxLength={19}
                  className="glass-input"
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="name">Cardholder Name</Label>
                <Input 
                  id="name" 
                  placeholder="John Doe" 
                  value={cardName}
                  onChange={e => setCardName(e.target.value)}
                  className="glass-input"
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
                    className="glass-input"
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
                    className="glass-input"
                  />
                </div>
              </div>
            </div>
            
            <div className="pt-4">
              <RadioGroup value={selectedCard || ''} onValueChange={setSelectedCard}>
                <div className="space-y-2">
                  <div className="payment-method">
                    <RadioGroupItem value="visa" id="visa" className="mr-3" />
                    <Label htmlFor="visa" className="flex items-center gap-2 cursor-pointer flex-1">
                      <div className="w-8 h-6 bg-blue-700 rounded flex items-center justify-center text-white text-xs font-bold">VISA</div>
                      <span>Visa ending with 3456</span>
                    </Label>
                  </div>
                  
                  <div className="payment-method">
                    <RadioGroupItem value="mastercard" id="mastercard" className="mr-3" />
                    <Label htmlFor="mastercard" className="flex items-center gap-2 cursor-pointer flex-1">
                      <div className="w-8 h-6 bg-red-600 rounded flex items-center justify-center text-white text-xs font-bold">MC</div>
                      <span>Mastercard ending with 8901</span>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </TabsContent>
          
          <TabsContent value="upi" className="space-y-4 animate-slide-up">
            <div className="space-y-2">
              <Label htmlFor="upi-id">UPI ID</Label>
              <Input 
                id="upi-id" 
                placeholder="username@upi" 
                value={upiId}
                onChange={e => setUpiId(e.target.value)}
                className="glass-input"
              />
              <p className="text-sm text-gray-500">Enter your UPI ID (e.g., username@ybl or username@paytm)</p>
            </div>
            
            <div className="pt-4 grid grid-cols-3 gap-3">
              {['BHIM', 'Google Pay', 'PhonePe'].map((app) => (
                <div key={app} className="border rounded-lg p-3 text-center cursor-pointer hover:border-donation-primary/50 hover:bg-donation-primary/5 transition-colors">
                  <div className="w-12 h-12 bg-gray-100 rounded-full mx-auto mb-2"></div>
                  <span className="text-sm">{app}</span>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="cash" className="space-y-4 animate-slide-up">
            <div className="flex items-center p-4 border border-green-200 rounded-lg bg-green-50">
              <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
              <p className="text-green-700">Cash payment will be collected at the Nilgiri College campus</p>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-gray-500">
                Visit the Happiness Club desk at the college to make your cash donation.
              </p>
              <p className="text-sm text-gray-500">
                Make sure to keep a copy of your donation receipt.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between bg-gray-50 p-4">
        <div className="text-lg font-medium">
          Total: <span className="text-donation-primary">₹{amount.toLocaleString('en-IN')}</span>
        </div>
        <Button 
          onClick={handlePayment}
          disabled={!getPaymentValidity() || processing}
          className={`min-w-[120px] ${processing ? 'opacity-80' : ''}`}
          style={{ background: 'linear-gradient(90deg, #4F9D69 0%, #8FCFD1 100%)' }}
        >
          {processing ? 'Processing...' : 'Pay Now'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PaymentMethods;
