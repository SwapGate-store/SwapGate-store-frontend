'use client'

import { motion } from 'framer-motion';
import { useExchange } from '@/context/ExchangeContext';
import { useState, useEffect } from 'react';
import Card from '../ui/Card';
import { FaCheckCircle, FaSpinner, FaCheck, FaTimesCircle, FaWhatsapp, FaBank, FaMoneyBillWave, FaGlobe } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

export default function SellOrderSummary() {
  const { nextStep, prevStep, exchangeData } = useExchange();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingText, setProcessingText] = useState('Sending your request...');
  const [processComplete, setProcessComplete] = useState(false);

  // Get data safely
  const sellData = exchangeData?.sellData || {};
  const sellReceipt = exchangeData?.sellReceipt || null;

  // Simulate sending to Telegram with animation
  useEffect(() => {
    if (!isProcessing) return;

    const messages = [
      'Sending your request...',
      'Processing payment details...',
      'Uploading receipt...',
      'Sending to support team...',
      'All messages sent successfully!'
    ];

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < messages.length) {
        setProcessingText(messages[currentIndex]);
        currentIndex++;
      } else {
        setProcessComplete(true);
        clearInterval(interval);
      }
    }, 1200);

    return () => clearInterval(interval);
  }, [isProcessing]);

  const handlePlaceOrder = async () => {
    if (!isConfirmed) {
      toast.error('Please confirm all details are correct');
      return;
    }

    if (!sellData?.bank || !sellData?.amount || !sellReceipt) {
      toast.error('Missing required information. Please go back and complete all fields.');
      return;
    }

    setIsProcessing(true);

    try {
      const formDataToSend = new FormData();
      
      // Add receipt file
      if (sellReceipt instanceof File) {
        formDataToSend.append('receipt', sellReceipt);
      } else {
        throw new Error('Invalid receipt file');
      }
      
      // Add form fields with safe defaults
      formDataToSend.append('bank_name', sellData.bank || '');
      formDataToSend.append('account_number', sellData.accountNumber || '');
      formDataToSend.append('account_holder_name', sellData.accountHolderName || '');
      formDataToSend.append('amount', sellData.amount || '');
      formDataToSend.append('contact_number', sellData.whatsappNumber || '');
      formDataToSend.append('network', sellData.network || '');

      // Simulate processing steps
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Call API
      const response = await fetch('https://swapgate-store-backend.onrender.com/api/sell-send-msg', {
        method: 'POST',
        body: formDataToSend
      });

      if (!response.ok) {
        let errorMessage = 'Failed to submit sell request';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      // Wait for remaining animation
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      toast.success('Order placed successfully!');
      
      // Auto-advance after completion
      setTimeout(() => {
        nextStep();
      }, 2000);
    } catch (error) {
      toast.error(error.message || 'Error placing order. Please try again.');
      console.error('API Error:', error);
      setIsProcessing(false);
    }
  };

  const data = exchangeData.sellData || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            Order Summary
          </h1>
          <p className="text-base text-gray-600">
            Please review all details before placing your order
          </p>
        </motion.div>

        {/* Processing Modal */}
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-lg p-8 max-w-md w-full text-center"
            >
              {!processComplete ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="flex justify-center mb-6"
                  >
                    <FaSpinner size={48} className="text-green-600" />
                  </motion.div>
                  <p className="text-lg font-semibold text-gray-800 mb-4">
                    {processingText}
                  </p>
                  <div className="space-y-2">
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 6 }}
                      className="h-2 bg-green-600 rounded-full origin-left"
                    />
                  </div>
                </>
              ) : (
                <>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="flex justify-center mb-6"
                  >
                    <FaCheckCircle size={48} className="text-green-600" />
                  </motion.div>
                  <p className="text-lg font-semibold text-gray-800">
                    Order Submitted Successfully!
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Redirecting you to confirmation page...
                  </p>
                </>
              )}
            </motion.div>
          </motion.div>
        )}

        {/* Summary Card */}
        {!isProcessing && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-8 mb-8">
              {/* Bank Details Section */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <FaBank className="text-blue-600 mr-3" size={24} />
                  <h2 className="text-xl font-bold text-gray-800">Bank Details</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                    <p className="text-sm text-gray-600 font-semibold">Bank Name</p>
                    <p className="text-lg font-bold text-gray-800 mt-2">{data.bank}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                    <p className="text-sm text-gray-600 font-semibold">Account Number</p>
                    <p className="text-lg font-bold text-gray-800 mt-2">{data.accountNumber}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                    <p className="text-sm text-gray-600 font-semibold">Account Holder</p>
                    <p className="text-lg font-bold text-gray-800 mt-2">{data.accountHolderName}</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                    <p className="text-sm text-gray-600 font-semibold">Contact Number</p>
                    <div className="flex items-center gap-2 mt-2">
                      <FaWhatsapp className="text-green-600" size={20} />
                      <p className="text-lg font-bold text-gray-800">{data.whatsappNumber}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transaction Details Section */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <FaMoneyBillWave className="text-green-600 mr-3" size={24} />
                  <h2 className="text-xl font-bold text-gray-800">Transaction Details</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                    <p className="text-sm text-gray-600 font-semibold">Network</p>
                    <div className="flex items-center gap-2 mt-2">
                      <FaGlobe className="text-purple-600" size={20} />
                      <p className="text-lg font-bold text-gray-800">{data.network}</p>
                    </div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                    <p className="text-sm text-gray-600 font-semibold">Amount (USDT)</p>
                    <p className="text-lg font-bold text-gray-800 mt-2">${data.amount}</p>
                  </div>
                </div>
              </div>

              {/* Receipt Section */}
              <div className="mb-8">
                <p className="text-sm text-gray-600 font-semibold mb-3">Receipt Uploaded</p>
                <div className="bg-green-100 border-2 border-green-400 rounded-lg p-4 flex items-center gap-3">
                  <FaCheckCircle className="text-green-600" size={24} />
                  <p className="text-gray-800 font-semibold">Receipt file has been successfully uploaded</p>
                </div>
              </div>

              {/* Confirmation Checkbox */}
              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-6 mb-8">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={isConfirmed}
                    onChange={(e) => setIsConfirmed(e.target.checked)}
                    className="w-5 h-5 mt-1 cursor-pointer"
                  />
                  <div>
                    <label className="text-gray-800 font-semibold cursor-pointer block">
                      I confirm all details are correct and truthful
                    </label>
                    <p className="text-sm text-gray-600 mt-2">
                      By checking this box, you confirm that all the information provided is accurate and complete. Any false information may result in transaction delays or cancellation.
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-4 pt-6 border-t-2 border-gray-200">
                <button
                  onClick={prevStep}
                  disabled={isProcessing}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 transition-all duration-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={!isConfirmed || isProcessing}
                  className={`flex-1 font-semibold py-3 transition-all duration-300 rounded-lg ${
                    !isConfirmed || isProcessing
                      ? 'bg-gray-400 text-white cursor-not-allowed opacity-50'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center gap-2">
                      <FaSpinner size={18} className="animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    'Place Order'
                  )}
                </button>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
