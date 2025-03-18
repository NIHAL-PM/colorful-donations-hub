
// Razorpay integration utilities
interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
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
  handler?: (response: any) => void;
}

interface Window {
  Razorpay: any;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface DonationReceipt {
  receiptId: string;
  name: string;
  amount: number;
  date: Date;
  email: string;
  paymentId: string;
  anonymous?: boolean;
  department?: string;
  year?: string;
  donorType?: string;
  message?: string;
}

interface GenerateDonationReceiptOptions {
  name: string;
  email: string;
  amount: number;
  paymentId: string;
  anonymous?: boolean;
  department?: string;
  year?: string;
  donorType?: string;
  message?: string;
}

/**
 * Generates a unique receipt ID
 */
export const generateReceiptId = (): string => {
  const timestamp = new Date().getTime().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `REC-${timestamp}-${randomStr}`.toUpperCase();
};

/**
 * Loads the Razorpay script dynamically
 */
export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

/**
 * Initiates a Razorpay payment
 */
export const initiateRazorpayPayment = async (
  options: Omit<RazorpayOptions, 'key'>, 
  onSuccess: (response: any) => void,
  onError: (error: any) => void
) => {
  try {
    // Load Razorpay script if not already loaded
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      throw new Error('Failed to load Razorpay script');
    }

    // Convert amount to paise (Razorpay expects amount in smallest currency unit)
    const amountInPaise = Math.round(options.amount * 100);

    // Initialize Razorpay
    const razorpay = new window.Razorpay({
      key: 'rzp_test_nHS4Drpp1iPZ0w', // Replace with your actual Razorpay key
      ...options,
      amount: amountInPaise,
      handler: onSuccess,
    });

    // Open Razorpay payment form
    razorpay.open();
  } catch (error) {
    console.error('Error initiating payment:', error);
    onError(error);
  }
};

/**
 * Generates a donation receipt
 */
export const generateDonationReceipt = (options: GenerateDonationReceiptOptions): DonationReceipt => {
  return {
    receiptId: generateReceiptId(),
    name: options.anonymous ? 'Anonymous Donor' : options.name,
    email: options.email,
    amount: options.amount,
    date: new Date(),
    paymentId: options.paymentId,
    anonymous: options.anonymous,
    department: options.department,
    year: options.year,
    donorType: options.donorType,
    message: options.message
  };
};
