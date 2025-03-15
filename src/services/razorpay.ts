
// Types for Razorpay
declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface RazorpayOptions {
  key: string;
  amount: number; // in smallest currency unit (paise for INR)
  currency: string;
  name: string;
  description?: string;
  image?: string;
  order_id?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
  handler?: (response: RazorpaySuccessResponse) => void;
}

export interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error("Failed to load Razorpay script");
      toast({
        title: 'Payment Gateway Error',
        description: 'Failed to load payment gateway. Please try again later.',
        variant: 'destructive',
      });
      resolve(false);
    };
    
    document.body.appendChild(script);
  });
};

export const initiateRazorpayPayment = async (
  options: RazorpayOptions,
  onSuccess: (response: RazorpaySuccessResponse) => void,
  onError: (error: any) => void
): Promise<void> => {
  try {
    const scriptLoaded = await loadRazorpayScript();
    
    if (!scriptLoaded) {
      console.error("Razorpay script failed to load");
      onError(new Error('Failed to load Razorpay SDK'));
      return;
    }

    console.log("Razorpay script loaded successfully");

    // Set default Razorpay key for development
    // In production, you should get this from an environment variable or server
    const defaultKey = 'rzp_test_bUcvzDQD7fGITt';
    
    // Convert amount to paise (smallest currency unit in India)
    const amountInPaise = Math.round(options.amount * 100);
    
    console.log("Preparing Razorpay payment with amount:", options.amount, "converted to paise:", amountInPaise);
    
    const razorpayOptions: RazorpayOptions = {
      ...options,
      key: options.key || defaultKey,
      amount: amountInPaise, // Ensure it's in paise
      currency: options.currency || 'INR',
      name: options.name || 'Happy Donation',
      description: options.description || 'Donation to Happiness Club',
      theme: {
        color: '#8B5CF6', // Updated to match our new purple primary color
        ...options.theme,
      },
      handler: function (response: RazorpaySuccessResponse) {
        console.log("Razorpay payment successful:", response);
        onSuccess(response);
      },
    };

    console.log("Opening Razorpay payment form with options:", razorpayOptions);
    
    const razorpay = new window.Razorpay(razorpayOptions);
    razorpay.on('payment.failed', function (response: any) {
      console.error("Razorpay payment failed:", response.error);
      onError(response.error);
    });
    razorpay.open();
  } catch (error) {
    console.error("Error initiating Razorpay payment:", error);
    onError(error);
  }
};

// Import toast
import { toast } from '@/components/ui/use-toast';

// Function to verify Razorpay payment - this would typically be done on your server
export const verifyRazorpayPayment = async (
  paymentId: string,
  orderId: string,
  signature: string
): Promise<boolean> => {
  // In a real implementation, this would make a server call to verify the payment
  // For demo purposes, we're just returning true
  console.log('Verifying payment:', { paymentId, orderId, signature });
  
  // Simulate verification success
  return true;
};

// Helper to generate receipt numbers
export const generateReceiptId = (): string => {
  return `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};
