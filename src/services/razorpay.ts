
export interface DonationReceipt {
  receiptId: string;
  name: string;
  email: string;
  amount: number;
  date: Date;
  paymentId: string;
  department?: string;
  message?: string;
  year?: string;
  donorType?: string;
  anonymous?: boolean;
}

export const downloadReceiptAsPDF = (receipt: DonationReceipt) => {
  // Implementation for downloading receipt as PDF
  console.log('Downloading receipt as PDF', receipt);
  // In a real implementation, this would generate and download a PDF
  alert(`Receipt download started for payment ${receipt.paymentId}`);
};

export const shareReceipt = async (receipt: DonationReceipt) => {
  // Implementation for sharing receipt
  console.log('Sharing receipt', receipt);
  
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Donation Receipt',
        text: `Thank you for your donation of ₹${receipt.amount} to Nilgiri College!`,
        url: window.location.href,
      });
    } catch (error) {
      console.error('Error sharing receipt:', error);
    }
  } else {
    // Fallback for browsers that don't support the Web Share API
    alert('Sharing is not supported on your browser');
  }
};

// Generate a unique receipt ID
export const generateReceiptId = () => {
  return `REC-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

// Generate a donation receipt
export interface DonationReceiptParams {
  name: string;
  email: string;
  amount: number;
  paymentId: string;
  department?: string;
  year?: string;
  donorType?: string;
  anonymous?: boolean;
  message?: string;
}

export const generateDonationReceipt = (params: DonationReceiptParams): DonationReceipt => {
  return {
    receiptId: generateReceiptId(),
    name: params.name,
    email: params.email,
    amount: params.amount,
    date: new Date(),
    paymentId: params.paymentId,
    department: params.department,
    year: params.year,
    donorType: params.donorType,
    anonymous: params.anonymous,
    message: params.message
  };
};

// Initialize Razorpay payment
interface RazorpayOptions {
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  prefill: {
    name: string;
    email: string;
  };
  notes?: {
    [key: string]: string;
  };
  theme?: {
    color: string;
  };
}

export const initiateRazorpayPayment = (
  options: RazorpayOptions,
  onSuccess: (response: any) => void,
  onError: (error: any) => void
) => {
  // Create a script to load Razorpay
  const script = document.createElement('script');
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  document.body.appendChild(script);

  script.onload = () => {
    const razorpayOptions = {
      key: 'rzp_test_1DP5mmOlF5G5ag', // This should be a real key in production
      amount: options.amount * 100, // Razorpay takes amount in smallest currency unit
      currency: options.currency,
      name: options.name,
      description: options.description,
      image: options.image,
      handler: function (response: any) {
        onSuccess(response);
      },
      prefill: options.prefill,
      notes: options.notes,
      theme: options.theme
    };

    const paymentObject = new (window as any).Razorpay(razorpayOptions);
    paymentObject.on('payment.failed', function (response: any) {
      onError(response.error);
    });
    paymentObject.open();
  };

  script.onerror = () => {
    onError(new Error('Failed to load Razorpay SDK'));
    document.body.removeChild(script);
  };
};
