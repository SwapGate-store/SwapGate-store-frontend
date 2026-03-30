'use client'

import { useExchange } from '@/context/ExchangeContext';
import { useState, useEffect } from 'react';
import { FaCheckCircle, FaSpinner, FaWhatsapp, FaMoneyBillWave, FaGlobe, FaBuilding } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

export default function SellOrderSummary() {
  const { prevStep, exchangeData, updateExchangeData } = useExchange();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingText, setProcessingText] = useState('Sending your request...');
  const [processComplete, setProcessComplete] = useState(false);

  // Get data safely
  const sellData = exchangeData?.sellData || {};
  const sellReceipt = exchangeData?.sellReceipt || null;

  // Animation for processing messages
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
      
      if (sellReceipt instanceof File) {
        formDataToSend.append('receipt', sellReceipt);
      } else {
        throw new Error('Invalid receipt file');
      }
      
      formDataToSend.append('bank_name', sellData.bank || '');
      formDataToSend.append('account_number', sellData.accountNumber || '');
      formDataToSend.append('account_holder_name', sellData.accountHolderName || '');
      formDataToSend.append('amount', sellData.amount || '');
      formDataToSend.append('contact_number', sellData.whatsappNumber || '');
      formDataToSend.append('network', sellData.network || '');

      await new Promise(resolve => setTimeout(resolve, 2000));

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
          errorMessage = `Server error: ${response.status}`;
        }
        throw new Error(errorMessage);
      }

      await new Promise(resolve => setTimeout(resolve, 4000));
      toast.success('Order placed successfully!');
      
      // Redirect to thank you page after a brief delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsProcessing(false);
      updateExchangeData({ step: 7 });
    } catch (error) {
      toast.error(error.message || 'Error placing order');
      console.error('Order error:', error);
      setIsProcessing(false);
    }
  };

  const data = sellData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Processing Modal */}
        {isProcessing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-lg p-8 max-w-md w-full text-center">
              {!processComplete ? (
                <>
                  <div className="flex justify-center mb-6 animate-spin">
                    <FaSpinner size={48} className="text-green-600" />
                  </div>
                  <p className="text-lg font-semibold text-gray-800 mb-4">{processingText}</p>
                  <div className="h-2 bg-green-600 rounded-full w-full" />
                </>
              ) : (
                <>
                  <div className="flex justify-center mb-6">
                    <FaCheckCircle size={48} className="text-green-600" />
                  </div>
                  <p className="text-lg font-semibold text-gray-800">Order Submitted Successfully!</p>
                  <p className="text-sm text-gray-600 mt-2">Redirecting you to confirmation...</p>
                </>
              )}
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-3">Order Summary</h1>
          <p className="text-base text-gray-600">Please review all details before placing your order</p>
        </div>

        {/* Summary Card */}
        {!isProcessing && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 mb-8">
            {/* Bank Details */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <FaBuilding className="text-blue-600 mr-3" size={24} />
                <h2 className="text-xl font-bold text-gray-800">Bank Details</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                  <p className="text-sm text-gray-600 font-semibold">Bank Name</p>
                  <p className="text-lg font-bold text-gray-800 mt-2">{data.bank || '-'}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                  <p className="text-sm text-gray-600 font-semibold">Account Number</p>
                  <p className="text-lg font-bold text-gray-800 mt-2">{data.accountNumber || '-'}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                  <p className="text-sm text-gray-600 font-semibold">Account Holder</p>
                  <p className="text-lg font-bold text-gray-800 mt-2">{data.accountHolderName || '-'}</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                  <p className="text-sm text-gray-600 font-semibold">WhatsApp</p>
                  <div className="flex items-center gap-2 mt-2">
                    <FaWhatsapp className="text-green-600" size={20} />
                    <p className="text-lg font-bold text-gray-800">{data.whatsappNumber || '-'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Transaction Details */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <FaMoneyBillWave className="text-green-600 mr-3" size={24} />
                <h2 className="text-xl font-bold text-gray-800">Transaction</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                  <p className="text-sm text-gray-600 font-semibold">Network</p>
                  <div className="flex items-center gap-2 mt-2">
                    <FaGlobe className="text-purple-600" size={20} />
                    <p className="text-lg font-bold text-gray-800">{data.network || '-'}</p>
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                  <p className="text-sm text-gray-600 font-semibold">Amount</p>
                  <p className="text-lg font-bold text-gray-800 mt-2">${data.amount || '0'} USDT</p>
                </div>
              </div>
            </div>

            {/* Receipt Confirmation */}
            <div className="mb-8">
              <p className="text-sm text-gray-600 font-semibold mb-3">Receipt Status</p>
              <div className="bg-green-100 border-2 border-green-400 rounded-lg p-4 flex items-center gap-3">
                <FaCheckCircle className="text-green-600" size={24} />
                <p className="text-gray-800 font-semibold">Receipt uploaded successfully</p>
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
                  <label className="text-gray-800 font-semibold cursor-pointer">
                    I confirm all details are correct and truthful
                  </label>
                  <p className="text-sm text-gray-600 mt-2">
                    By checking this box, you confirm all information is accurate. False information may result in delays or cancellation.
                  </p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-6 border-t-2 border-gray-200">
              <button
                onClick={prevStep}
                disabled={isProcessing}
                className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-lg transition-all"
              >
                Back
              </button>
              <button
                onClick={handlePlaceOrder}
                disabled={!isConfirmed || isProcessing}
                className={`flex-1 font-semibold py-3 rounded-lg transition-all ${
                  !isConfirmed || isProcessing
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {isProcessing ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
