'use client'

import { motion } from 'framer-motion';
import { useExchange } from '@/context/ExchangeContext';
import { useState, useEffect } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { FaUniversity, FaUserCircle, FaWhatsapp, FaGlobe, FaDollarSign, FaExclamationTriangle, FaSearch } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

export default function SellFlowPage() {
  const { nextStep, prevStep, updateExchangeData, exchangeData } = useExchange();
  
  const bankList = [
    "Amana Bank",
    "Bank of Ceylon (BOC)",
    "Bank of China",
    "Cargills Bank",
    "Citibank N.A.",
    "Commercial Bank of Ceylon",
    "DFCC Bank",
    "Deutsche Bank",
    "Hatton National Bank (HNB)",
    "Housing Development Finance Corporation (HDFC)",
    "ICICI Bank",
    "Indian Bank",
    "Indian Overseas Bank",
    "Lankaputhra Development Bank",
    "National Development Bank (NDB)",
    "National Savings Bank",
    "Nations Trust Bank",
    "Pan Asia Banking Corporation",
    "People's Bank",
    "Public Bank Berhad",
    "Regional Development Bank (RDB)",
    "Sampath Bank",
    "Sanasa Development Bank",
    "Seylan Bank",
    "Standard Chartered Bank",
    "State Bank of India",
    "State Mortgage & Investment Bank",
    "Union Bank of Colombo",
    "Women's Development Bank"
  ];

  const networks = ["TRC20 (Tron Network)", "BEP20", "Binance Pay"];
  
  const bankLogos = {
    "Bank of Ceylon (BOC)": "/assets/bank logo/BOC.jpg",
    "People's Bank": "/assets/bank logo/Peoples-Bank.jpg",
    "Commercial Bank of Ceylon": "/assets/bank logo/commercial.png",
    "Hatton National Bank (HNB)": "/assets/bank logo/HNB.png",
    "Sampath Bank": "/assets/bank logo/sampath.png",
    "National Development Bank (NDB)": "/assets/bank logo/NDB Bank.png",
    "Seylan Bank": "/assets/bank logo/Saylan.png",
    "DFCC Bank": "/assets/bank logo/DFCC.jpeg",
    "Nations Trust Bank": "/assets/bank logo/Nations trust.jpg",
    "Pan Asia Banking Corporation": "/assets/bank logo/Pan Asia.jpg",
    "Union Bank of Colombo": "/assets/bank logo/UNion bank.png",
    "Amana Bank": "/assets/bank logo/AMANA Bank.png"
  };
  
  const quickBanks = [
    "Bank of Ceylon (BOC)",
    "People's Bank",
    "Commercial Bank of Ceylon",
    "Hatton National Bank (HNB)",
    "Sampath Bank",
    "National Development Bank (NDB)",
    "Seylan Bank",
    "DFCC Bank",
    "Nations Trust Bank",
    "Pan Asia Banking Corporation",
    "Union Bank of Colombo",
    "Amana Bank"
  ];

  const [formData, setFormData] = useState({
    bank: '',
    accountNumber: '',
    accountHolderName: '',
    whatsappNumber: '',
    network: '',
    amount: ''
  });

  // Load saved data from context on mount
  useEffect(() => {
    if (exchangeData?.sellData) {
      setFormData(exchangeData.sellData);
    }
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isNextButtonDisabled = () => {
    if (!formData.bank.trim() || 
        !formData.accountNumber.trim() || 
        !formData.accountHolderName.trim() || 
        !formData.whatsappNumber.trim() || 
        !formData.network || 
        !formData.amount.trim()) {
      return true;
    }
    const amount = parseFloat(formData.amount);
    return isNaN(amount) || amount < 2;
  };

  const getDisabledReason = () => {
    if (!formData.bank.trim()) {
      return 'Please select a bank';
    }
    if (!formData.accountNumber.trim()) {
      return 'Please enter your account number';
    }
    if (!formData.accountHolderName.trim()) {
      return 'Please enter the account holder name';
    }
    if (!formData.whatsappNumber.trim()) {
      return 'Please enter your WhatsApp number';
    }
    if (!formData.network) {
      return 'Please select a network';
    }
    if (!formData.amount.trim()) {
      return 'Please enter the USDT amount';
    }
    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount < 2) {
      return 'Minimum USDT amount is 2';
    }
    return null;
  };

  const handleNext = () => {
    if (!formData.bank.trim()) {
      toast.error('Please select a bank');
      return;
    }
    if (!formData.accountNumber.trim()) {
      toast.error('Please enter your account number');
      return;
    }
    if (!formData.accountHolderName.trim()) {
      toast.error('Please enter the account holder name');
      return;
    }
    if (!formData.whatsappNumber.trim()) {
      toast.error('Please enter your WhatsApp number');
      return;
    }
    if (!formData.network) {
      toast.error('Please select a network');
      return;
    }
    if (!formData.amount.trim()) {
      toast.error('Please enter the USDT amount');
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount < 2) {
      toast.error('Minimum USDT amount is 2');
      return;
    }

    const dataToSave = { ...formData };
    updateExchangeData({
      sellData: dataToSave
    });
    nextStep();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            Deposit USDT
          </h1>
          <p className="text-base text-gray-600 mb-4">
            Please fill in the correct details to receive your funds
          </p>
        </motion.div>

        {/* Instructions Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200">
            <div className="flex items-start">
              <FaExclamationTriangle className="text-green-600 mr-3 mt-1 flex-shrink-0" size={20} />
              <div>
                <p className="text-gray-700 font-semibold mb-2">Important Instructions:</p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  ඔබට USDT Sell කර මුදල් ලබා ගැනීමට අවශ්‍ය නිවැරදි දත්ත පුරවන්න
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  අඩුම usdt 2 සිට sell කිරීමට හැකියාවක් ඇත ।
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-8">
            {/* Bank Selection */}
            <div className="mb-8">
              <div className="flex items-center mb-3">
                <FaUniversity className="text-green-600 mr-2" size={20} />
                <label className="text-lg font-semibold text-gray-800">Select Bank</label>
              </div>
              <div className="relative">
                <select
                  value={formData.bank}
                  onChange={(e) => handleInputChange('bank', e.target.value)}
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none bg-white text-gray-800 font-medium appearance-none"
                >
                  <option value="">Choose a bank...</option>
                  {bankList.map((bank, index) => (
                    <option key={index} value={bank}>
                      {bank}
                    </option>
                  ))}
                </select>
                <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 pointer-events-none" size={18} />
              </div>
              
              {/* Quick Bank Access */}
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-3 font-medium">Quick Access:</p>
                <div className="flex flex-wrap gap-3">
                  {quickBanks.map((bank, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleInputChange('bank', bank)}
                      className={`px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-300 border-2 flex items-center gap-2 ${
                        formData.bank === bank
                          ? 'bg-green-500 text-white border-green-600 shadow-lg'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-green-400'
                      }`}
                    >
                      <img 
                        src={bankLogos[bank]} 
                        alt={bank}
                        className="h-7 w-7 object-contain"
                        onError={(e) => e.target.style.display = 'none'}
                      />
                      <span>{bank.replace(/\s*\([^)]*\)\s*/g, '').substring(0, 12)}</span>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Account Number */}
            <div className="mb-8">
              <Input
                label="Account Number"
                value={formData.accountNumber}
                onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                placeholder="Enter your account number"
                className="text-gray-800"
              />
            </div>

            {/* Account Holder Name */}
            <div className="mb-8">
              <div className="flex items-center mb-3">
                <FaUserCircle className="text-blue-600 mr-2" size={20} />
                <label className="text-lg font-semibold text-gray-800">Account Holder Name</label>
              </div>
              <input
                type="text"
                value={formData.accountHolderName}
                onChange={(e) => handleInputChange('accountHolderName', e.target.value)}
                placeholder="Enter account holder name"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none bg-white text-gray-800 font-medium"
              />
            </div>

            {/* WhatsApp Number */}
            <div className="mb-8">
              <div className="flex items-center mb-3">
                <FaWhatsapp className="text-green-600 mr-2" size={20} />
                <label className="text-lg font-semibold text-gray-800">WhatsApp Number</label>
              </div>
              <input
                type="text"
                value={formData.whatsappNumber}
                onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
                placeholder="Enter your WhatsApp number (e.g., +94xxxxxxxxx)"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none bg-white text-gray-800 font-medium"
              />
            </div>

            {/* Network Selection */}
            <div className="mb-8">
              <div className="flex items-center mb-3">
                <FaGlobe className="text-purple-600 mr-2" size={20} />
                <label className="text-lg font-semibold text-gray-800">Network</label>
              </div>
              <select
                value={formData.network}
                onChange={(e) => handleInputChange('network', e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none bg-white text-gray-800 font-medium"
              >
                <option value="">Choose a network...</option>
                {networks.map((net, index) => (
                  <option key={index} value={net}>
                    {net}
                  </option>
                ))}
              </select>
            </div>

            {/* Amount */}
            <div className="mb-10">
              <div className="flex items-center mb-3">
                <FaDollarSign className="text-yellow-600 mr-2" size={20} />
                <label className="text-lg font-semibold text-gray-800">Amount (USDT)</label>
              </div>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                placeholder="Enter USDT amount (minimum 2)"
                min="2"
                step="0.01"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-yellow-500 focus:outline-none bg-white text-gray-800 font-medium"
              />
              <p className="text-sm text-gray-500 mt-2">Minimum: 2 USDT</p>
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col gap-4 pt-6 border-t-2 border-gray-200">
              {isNextButtonDisabled() && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-50 border-2 border-red-300 rounded-lg flex items-start"
                >
                  <FaExclamationTriangle className="text-red-500 mr-3 mt-0.5 flex-shrink-0" size={16} />
                  <p className="text-sm text-red-600 font-medium">{getDisabledReason()}</p>
                </motion.div>
              )}
              <div className="flex gap-4">
                <button
                  onClick={prevStep}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 transition-all duration-300 rounded-lg"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={isNextButtonDisabled()}
                  className={`flex-1 font-semibold py-3 transition-all duration-300 rounded-lg ${
                    isNextButtonDisabled()
                      ? 'bg-gray-400 text-white cursor-not-allowed opacity-50'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
