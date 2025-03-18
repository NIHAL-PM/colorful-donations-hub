
import { toast } from '@/components/ui/use-toast';

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
}

export interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface DonationReceipt {
  receiptId: string;
  paymentId: string;
  name: string;
  email: string;
  amount: number;
  date: Date;
  department?: string;
  message?: string;
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
  const scriptLoaded = await loadRazorpayScript();
  
  if (!scriptLoaded) {
    onError(new Error('Failed to load Razorpay SDK'));
    return;
  }

  try {
    // Set default Razorpay key for development
    // In production, you should get this from an environment variable or server
    const defaultKey = 'rzp_test_bUcvzDQD7fGITt';
    const razorpayOptions: RazorpayOptions = {
      ...options,
      key: options.key || defaultKey,
      // Convert amount to paise (smallest currency unit)
      amount: options.amount * 100,
      currency: options.currency || 'INR',
      name: options.name || 'Happy Donation',
      description: options.description || 'Donation to Happiness Club',
      theme: {
        color: '#4F9D69',
        ...options.theme,
      },
      handler: function (response: RazorpaySuccessResponse) {
        onSuccess(response);
      },
    };

    const razorpay = new window.Razorpay(razorpayOptions);
    razorpay.open();
  } catch (error) {
    onError(error);
  }
};

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

// Function to generate donation receipt
export const generateDonationReceipt = (donationData: {
  name: string;
  email: string;
  amount: number;
  paymentId: string;
  department?: string;
  message?: string;
}): DonationReceipt => {
  return {
    receiptId: generateReceiptId(),
    paymentId: donationData.paymentId,
    name: donationData.name,
    email: donationData.email,
    amount: donationData.amount,
    date: new Date(),
    department: donationData.department,
    message: donationData.message
  };
};

// Function to create a shareable receipt URL (for demo purposes)
export const createShareableReceiptUrl = (receipt: DonationReceipt): string => {
  // In a real implementation, you might generate a unique URL to a receipt page
  // For demo purposes, we'll create a URL with receipt data encoded in query parameters
  const baseUrl = window.location.origin + '/receipt';
  const params = new URLSearchParams({
    id: receipt.receiptId,
    name: receipt.name,
    amount: receipt.amount.toString(),
    date: receipt.date.toISOString(),
    department: receipt.department || ''
  });
  
  return `${baseUrl}?${params.toString()}`;
};

// Function to download receipt as PDF (simplified version)
export const downloadReceiptAsPDF = (receipt: DonationReceipt): void => {
  // Create a receipt HTML template
  const receiptTemplate = `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; border: 1px solid #ddd;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #4F9D69;">Donation Receipt</h2>
        <p>Happiness Club - Nilgiri College</p>
      </div>
      
      <div style="margin-bottom: 15px;">
        <p><strong>Receipt ID:</strong> ${receipt.receiptId}</p>
        <p><strong>Date:</strong> ${receipt.date.toLocaleDateString()}</p>
        <p><strong>Payment ID:</strong> ${receipt.paymentId}</p>
      </div>
      
      <div style="margin-bottom: 15px;">
        <p><strong>Donor Name:</strong> ${receipt.name}</p>
        <p><strong>Email:</strong> ${receipt.email}</p>
        ${receipt.department ? `<p><strong>Department:</strong> ${receipt.department}</p>` : ''}
      </div>
      
      <div style="background-color: #f8f8f8; padding: 15px; margin-bottom: 20px;">
        <h3 style="margin-top: 0; color: #4F9D69;">Donation Amount: ₹${receipt.amount.toLocaleString('en-IN')}</h3>
        ${receipt.message ? `<p><strong>Message:</strong> ${receipt.message}</p>` : ''}
      </div>
      
      <div style="font-size: 14px; color: #666; margin-top: 30px; text-align: center;">
        <p>Thank you for your generous donation to Happiness Club!</p>
        <p>This receipt is generated automatically and is valid without a signature.</p>
      </div>
    </div>
  `;
  
  // Create a popup window with receipt content
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Donation Receipt - ${receipt.receiptId}</title>
        </head>
        <body>
          ${receiptTemplate}
          <div style="text-align: center; margin-top: 20px;">
            <button onclick="window.print();" style="padding: 10px 20px; background: #4F9D69; color: white; border: none; border-radius: 4px; cursor: pointer;">
              Print Receipt
            </button>
            <button onclick="window.close();" style="padding: 10px 20px; margin-left: 10px; background: #f0f0f0; border: none; border-radius: 4px; cursor: pointer;">
              Close
            </button>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  } else {
    toast({
      title: "Error",
      description: "Unable to open receipt. Please check your popup blocker settings.",
      variant: "destructive",
    });
  }
};

// Share receipt via available sharing mechanisms
export const shareReceipt = async (receipt: DonationReceipt): Promise<void> => {
  // Create share data
  const shareData = {
    title: `Donation Receipt - ${receipt.receiptId}`,
    text: `Thank you ${receipt.name} for your donation of ₹${receipt.amount.toLocaleString('en-IN')} to Happiness Club at Nilgiri College!`,
    url: createShareableReceiptUrl(receipt)
  };
  
  // Check if the Web Share API is available
  if (navigator.share) {
    try {
      await navigator.share(shareData);
    } catch (error) {
      console.error('Error sharing receipt:', error);
      fallbackShareReceipt(receipt);
    }
  } else {
    fallbackShareReceipt(receipt);
  }
};

// Fallback sharing when Web Share API is not available
const fallbackShareReceipt = (receipt: DonationReceipt): void => {
  // Create a receipt URL (for demo purposes)
  const receiptUrl = createShareableReceiptUrl(receipt);
  
  // Copy link to clipboard
  navigator.clipboard.writeText(receiptUrl)
    .then(() => {
      toast({
        title: "Link Copied",
        description: "Receipt link copied to clipboard. You can now paste it to share.",
      });
    })
    .catch(() => {
      toast({
        title: "Unable to Copy",
        description: "Please manually share your receipt ID: " + receipt.receiptId,
        variant: "destructive",
      });
    });
};
