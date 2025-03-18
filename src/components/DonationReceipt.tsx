
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Share, Printer, Copy, Download, ThumbsUp } from 'lucide-react';
import { DonationReceipt as Receipt } from '@/services/razorpay';
import { downloadReceiptAsPDF, shareReceipt } from '@/services/razorpay';
import { toast } from '@/components/ui/use-toast';

interface DonationReceiptProps {
  receipt: Receipt;
  onClose?: () => void;
}

const DonationReceipt: React.FC<DonationReceiptProps> = ({ receipt, onClose }) => {
  const handlePrint = () => {
    downloadReceiptAsPDF(receipt);
  };

  const handleShare = async () => {
    await shareReceipt(receipt);
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(receipt.receiptId)
      .then(() => {
        toast({
          title: "Receipt ID Copied",
          description: "You can use this to track your donation",
        });
      });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="border-2 border-donation-primary/20 overflow-hidden shadow-xl bg-white relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-donation-primary to-donation-secondary"></div>
        
        <CardHeader className="bg-gradient-to-r from-donation-primary/10 to-donation-secondary/10 border-b border-donation-primary/10 pb-4">
          <div className="flex justify-between items-center mb-1">
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <img 
                src="/lovable-uploads/b8adb940-cf0a-4902-89fd-01b317af12a5.png" 
                alt="Happiness Club" 
                className="h-8" 
              />
            </motion.div>
            
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-right"
            >
              <img 
                src="/lovable-uploads/dc5f60a7-e574-4624-9179-84afebf69ff9.png" 
                alt="Nilgiri College" 
                className="h-8" 
              />
            </motion.div>
          </div>
          
          <CardTitle className="text-center text-lg md:text-xl font-semibold text-donation-primary">
            Donation Receipt
          </CardTitle>
          
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <span>Receipt ID: {receipt.receiptId}</span>
            <button 
              onClick={handleCopyId} 
              className="text-donation-primary hover:text-donation-secondary"
              title="Copy Receipt ID"
            >
              <Copy size={12} />
            </button>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6 space-y-4">
          <div className="bg-donation-primary/5 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-600 mb-1">Donation Amount</p>
            <motion.p 
              className="text-3xl font-bold text-donation-primary"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            >
              ₹{receipt.amount.toLocaleString('en-IN')}
            </motion.p>
          </div>
          
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Donor Name</p>
                <p className="font-medium">{receipt.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Date</p>
                <p className="font-medium">{receipt.date.toLocaleDateString()}</p>
              </div>
            </div>
            
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="font-medium">{receipt.email}</p>
            </div>
            
            {receipt.department && (
              <div>
                <p className="text-xs text-gray-500">Department</p>
                <p className="font-medium">{receipt.department}</p>
              </div>
            )}
            
            <div>
              <p className="text-xs text-gray-500">Payment ID</p>
              <p className="font-medium font-mono text-sm">{receipt.paymentId}</p>
            </div>
            
            {receipt.message && (
              <div>
                <p className="text-xs text-gray-500">Message</p>
                <p className="text-sm italic bg-gray-50 p-2 rounded">"{receipt.message}"</p>
              </div>
            )}
          </div>
          
          <div className="pt-2 text-center">
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <ThumbsUp className="h-12 w-12 mx-auto text-donation-primary opacity-20" />
              <p className="text-sm text-gray-600 mt-2">
                Thank you for your generous contribution!
              </p>
            </motion.div>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-3 bg-gray-50 border-t">
          <div className="w-full grid grid-cols-2 gap-3">
            <Button
              onClick={handlePrint}
              variant="outline"
              className="flex items-center gap-2 border-donation-primary/30 text-donation-primary hover:bg-donation-primary/10"
            >
              <Printer size={16} />
              <span>Print</span>
            </Button>
            
            <Button
              onClick={handleShare}
              className="flex items-center gap-2 bg-donation-primary hover:bg-donation-primary/90"
            >
              <Share size={16} />
              <span>Share</span>
            </Button>
          </div>
          
          {onClose && (
            <Button
              onClick={onClose}
              variant="ghost"
              className="w-full text-gray-500 hover:text-gray-700"
            >
              Close
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default DonationReceipt;
