
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

/**
 * Downloads the receipt as a PDF
 */
export const downloadReceiptAsPDF = (receipt: DonationReceipt) => {
  // For now, we'll just create a printable version that can be saved as PDF using browser print dialog
  // In a production environment, you'd want to use a proper PDF generation library
  const receiptWindow = window.open('', '_blank');
  if (receiptWindow) {
    receiptWindow.document.write(`
      <html>
        <head>
          <title>Donation Receipt - ${receipt.receiptId}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            .receipt { max-width: 800px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; }
            .header { display: flex; justify-content: space-between; margin-bottom: 20px; }
            .title { text-align: center; margin-bottom: 20px; }
            .amount { font-size: 24px; text-align: center; margin: 20px 0; padding: 10px; background: #f9f9f9; }
            .info { margin-bottom: 20px; }
            .row { display: flex; margin-bottom: 10px; }
            .label { font-weight: bold; width: 150px; }
            .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; }
            .btn-print { display: inline-block; margin-top: 20px; padding: 10px 20px; background: #4F9D69; color: white; border: none; cursor: pointer; }
            @media print {
              .btn-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="receipt">
            <div class="header">
              <div>
                <img src="/lovable-uploads/b8adb940-cf0a-4902-89fd-01b317af12a5.png" alt="Happiness Club" style="height: 40px;" />
              </div>
              <div>
                <img src="/lovable-uploads/dc5f60a7-e574-4624-9179-84afebf69ff9.png" alt="Nilgiri College" style="height: 40px;" />
              </div>
            </div>
            
            <div class="title">
              <h1>Donation Receipt</h1>
              <p>Receipt ID: ${receipt.receiptId}</p>
              <p>Date: ${receipt.date.toLocaleDateString()}</p>
            </div>
            
            <div class="amount">
              ₹${receipt.amount.toLocaleString('en-IN')}
            </div>
            
            <div class="info">
              <div class="row">
                <div class="label">Donor Name:</div>
                <div>${receipt.name}</div>
              </div>
              <div class="row">
                <div class="label">Email:</div>
                <div>${receipt.email}</div>
              </div>
              ${receipt.department ? `
              <div class="row">
                <div class="label">Department:</div>
                <div>${receipt.department}</div>
              </div>
              ` : ''}
              ${receipt.year ? `
              <div class="row">
                <div class="label">Year:</div>
                <div>${receipt.year}</div>
              </div>
              ` : ''}
              ${receipt.donorType ? `
              <div class="row">
                <div class="label">Donor Type:</div>
                <div>${receipt.donorType}</div>
              </div>
              ` : ''}
              <div class="row">
                <div class="label">Payment ID:</div>
                <div>${receipt.paymentId}</div>
              </div>
              ${receipt.message ? `
              <div class="row">
                <div class="label">Message:</div>
                <div>${receipt.message}</div>
              </div>
              ` : ''}
            </div>
            
            <div class="footer">
              <p>Thank you for your generous contribution to the Happiness Club at Nilgiri College.</p>
              <p>This receipt serves as confirmation of your donation.</p>
            </div>
            
            <button class="btn-print" onclick="window.print()">Print Receipt</button>
          </div>
        </body>
      </html>
    `);
    receiptWindow.document.close();
    receiptWindow.focus();
  }
};

/**
 * Shares the receipt via web share API or fallback options
 */
export const shareReceipt = async (receipt: DonationReceipt) => {
  // Construct receipt URL for sharing
  const params = new URLSearchParams();
  params.append('id', receipt.receiptId);
  params.append('name', receipt.name);
  params.append('amount', receipt.amount.toString());
  params.append('date', receipt.date.toISOString());
  params.append('email', receipt.email);
  params.append('paymentId', receipt.paymentId);
  if (receipt.department) params.append('department', receipt.department);
  if (receipt.year) params.append('year', receipt.year);
  if (receipt.donorType) params.append('donorType', receipt.donorType);
  if (receipt.anonymous) params.append('anonymous', 'true');
  if (receipt.message) params.append('message', receipt.message);
  
  const receiptUrl = `${window.location.origin}/receipt?${params.toString()}`;
  
  // Try to use Web Share API if available
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Donation Receipt',
        text: `My donation of ₹${receipt.amount} to Happiness Club at Nilgiri College`,
        url: receiptUrl
      });
      return;
    } catch (error) {
      console.error('Error sharing receipt:', error);
      // Fall back to clipboard if share fails
    }
  }
  
  // Fallback to clipboard
  try {
    await navigator.clipboard.writeText(receiptUrl);
    alert('Receipt link copied to clipboard! You can share it manually.');
  } catch (error) {
    console.error('Failed to copy receipt link:', error);
    alert('Could not share receipt. Please try again or manually share this page.');
  }
};
