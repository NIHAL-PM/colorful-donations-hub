export interface DonationReceipt {
  receiptId: string;
  name: string;
  email: string;
  amount: number;
  date: Date;
  paymentId: string;
  department?: string;
  message?: string;
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
