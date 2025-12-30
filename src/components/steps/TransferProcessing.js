'use client'

import { motion } from 'framer-motion';
import { useExchange } from '@/context/ExchangeContext';
import { useEffect, useState } from 'react';
import { FaExclamationTriangle, FaSync } from 'react-icons/fa';

export default function TransferProcessing() {
  const { nextStep } = useExchange();
  const [isTransferComplete, setIsTransferComplete] = useState(false);

  useEffect(() => {
    // Prevent browser closing while transfer is in progress
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
      return '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Simulate transfer process (adjust timing as needed)
    const timer = setTimeout(() => {
      setIsTransferComplete(true);
      // Remove the beforeunload listener once transfer is complete
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // Auto-advance to thank you page after 3 seconds
      const autoAdvanceTimer = setTimeout(() => {
        nextStep();
      }, 3000);
      return () => clearTimeout(autoAdvanceTimer);
    }, 5000); // 5 seconds of processing

    return () => {
      clearTimeout(timer);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [nextStep]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 py-12 px-4 flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center">
        {/* Warning Header */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="mb-8"
        >
          <div className="inline-flex items-center justify-center w-24 h-24 bg-red-600 rounded-full mb-6">
            <FaExclamationTriangle className="text-white" size={48} />
          </div>
        </motion.div>

        {/* Main Warning Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-red-700 mb-6">
            ⚠️ DO NOT CLOSE
          </h1>
          <h2 className="text-3xl md:text-5xl font-bold text-red-600 mb-8">
            UNTIL TRANSFER COMPLETES
          </h2>
          <div className="bg-red-100 border-4 border-red-600 rounded-xl p-8 mb-8">
            <p className="text-2xl font-bold text-red-700 mb-4">
              Your transfer is in progress...
            </p>
            <p className="text-lg text-red-600">
              Closing the browser or leaving this page will interrupt the transfer and your documents may not be processed correctly.
            </p>
          </div>
        </motion.div>

        {/* Processing Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <div className="inline-flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="text-5xl text-red-600"
            >
              <FaSync size={64} />
            </motion.div>
          </div>
          <p className="text-xl text-red-700 font-semibold mt-6">
            Processing your transfer...
          </p>
        </motion.div>

        {/* Status Messages */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="space-y-3"
        >
          <div className="bg-white rounded-lg p-4 border-2 border-red-300">
            <p className="text-gray-700">✓ Order received and verified</p>
          </div>
          <div className="bg-white rounded-lg p-4 border-2 border-red-300">
            <p className="text-gray-700">⏳ Documents being transferred...</p>
          </div>
          <div className="bg-white rounded-lg p-4 border-2 border-red-300">
            <p className="text-gray-700">⏳ Processing payment details...</p>
          </div>
        </motion.div>

        {/* Completion Message */}
        {isTransferComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="mt-12 p-8 bg-green-100 border-4 border-green-600 rounded-xl"
          >
            <p className="text-2xl font-bold text-green-700 mb-2">
              ✓ Transfer Complete!
            </p>
            <p className="text-lg text-green-600">
              Redirecting you to confirmation page...
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
