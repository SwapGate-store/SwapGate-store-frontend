'use client'

import { motion } from 'framer-motion';
import { useExchange } from '@/context/ExchangeContext';
import { useState } from 'react';
import Image from 'next/image';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { FaCheckCircle, FaCopy } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

export default function BankSelection() {
  const { nextStep, prevStep, updateExchangeData } = useExchange();
  const [selectedBank, setSelectedBank] = useState(null);

  const banks = [
    {
      id: 'hnb',
      name: 'HNB Bank',
      logo: '/assets/HNB.png',
      accountNumber: '098020371866',
      accountName: 'T D Hathurusingha',
      branch: 'Kottawa'
    },
    {
      id: 'commercial',
      name: 'Commercial Bank',
      logo: '/assets/commercial.png',
      accountNumber: '8027597114',
      accountName: 'T D Hathurusingha',
      branch: 'Kottawa'
    },
    {
      id: 'sampath',
      name: 'Sampath Bank',
      logo: '/assets/sampath.png',
      accountNumber: '105255196555',
      accountName: 'T D Hathurusingha',
      branch: 'Kottawa'
    },
    {
      id: 'dfcc',
      name: 'DFCC Bank',
      logo: '/assets/DFCC.jpeg',
      accountNumber: '102002675231',
      accountName: 'T D Hathurusingha',
      branch: 'Kottawa'
    }
  ];

  const selectBank = (bank) => {
    setSelectedBank(bank);
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${type} copied to clipboard!`);
    }).catch(() => {
      toast.error('Failed to copy to clipboard');
    });
  };

  const handleNext = () => {
    if (selectedBank) {
      updateExchangeData({ 
        selectedBank: selectedBank.id,
        bankDetails: selectedBank
      });
      nextStep();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            Select Your Bank
          </h1>
          <p className="text-base text-gray-600">
            Choose the bank where you&apos;ll make the payment
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {banks.map((bank, index) => (
            <motion.div
              key={bank.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className={`relative p-4 cursor-pointer transition-all duration-300 transform ${
                  selectedBank?.id === bank.id 
                    ? 'border-2 border-blue-500 bg-blue-50 shadow-lg shadow-blue-200 scale-102 ring-2 ring-blue-300 ring-opacity-50' 
                    : 'border border-gray-200 hover:border-blue-300 hover:shadow-md hover:scale-101'
                }`}
                onClick={() => selectBank(bank)}
              >
                {/* Selection Indicator */}
                {selectedBank?.id === bank.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-3 right-3 text-blue-500"
                  >
                    <FaCheckCircle size={20} />
                  </motion.div>
                )}
                
                <div className="flex items-center mb-3">
                  <Image 
                    src={bank.logo} 
                    alt={`${bank.name} logo`}
                    width={bank.id === 'hnb' ? 56 : 48}
                    height={bank.id === 'hnb' ? 56 : 48}
                    className={`object-contain mr-3 ${
                      bank.id === 'hnb' ? 'h-14 w-14' : 'h-12 w-12'
                    }`}
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{bank.name}</h3>
                    <p className="text-sm text-gray-600">Branch: {bank.branch}</p>
                  </div>
                </div>

                {/* Account Details */}
                <div className="space-y-2">
                  {/* Account Number */}
                  <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                    <div>
                      <p className="text-xs text-gray-600">Account Number</p>
                      <p className="font-mono font-semibold text-sm text-gray-800">{bank.accountNumber}</p>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(bank.accountNumber, 'Account number');
                      }}
                      className="ml-2 px-2 py-1 text-xs"
                    >
                      <FaCopy size={12} />
                    </Button>
                  </div>

                  {/* Account Name */}
                  <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                    <div>
                      <p className="text-xs text-gray-600">Account Name</p>
                      <p className="font-medium text-sm text-gray-800">{bank.accountName}</p>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(bank.accountName, 'Account name');
                      }}
                      className="ml-2 px-2 py-1 text-xs"
                    >
                      <FaCopy size={12} />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>        <div className="flex justify-between items-center">
          <Button variant="secondary" onClick={prevStep}>
            ← Back
          </Button>
          
          <Button 
            variant="secondary"
            onClick={handleNext}
            disabled={!selectedBank}
            className={`${
              !selectedBank 
                ? 'opacity-50 cursor-not-allowed' 
                : ''
            }`}
          >
            Next →
          </Button>
        </div>
      </div>
    </div>
  );
}