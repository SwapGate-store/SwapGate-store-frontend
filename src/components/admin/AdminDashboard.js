'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUSDT } from '@/context/USDTContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { toast } from 'react-hot-toast';

export default function AdminDashboard({ onLogout }) {
  const { 
    availableUSDT, 
    priceRanges, 
    updateAvailableUSDT,
    updatePriceRanges,
    isLoading
  } = useUSDT();

  const [formData, setFormData] = useState({
    availableUSDT: 0,
    priceRanges: []
  });
  const [savingStates, setSavingStates] = useState({
    usdtAmount: false,
    priceRanges: false
  });

  // Initialize form data when context loads
  useEffect(() => {
    if (!isLoading) {
      setFormData({
        availableUSDT: availableUSDT,
        priceRanges: priceRanges.map(range => ({ ...range }))
      });
    }
  }, [availableUSDT, priceRanges, isLoading]);

  const handleUSDTAmountChange = (value) => {
    setFormData(prev => ({
      ...prev,
      availableUSDT: value // Store as string to preserve user input
    }));
  };

  const handlePriceRangeChange = (index, value) => {
    const updatedRanges = [...formData.priceRanges];
    updatedRanges[index] = {
      ...updatedRanges[index],
      rate: parseFloat(value) || 0
    };
    
    setFormData(prev => ({
      ...prev,
      priceRanges: updatedRanges
    }));
  };

  const handleSaveUSDTAmount = async () => {
    setSavingStates(prev => ({ ...prev, usdtAmount: true }));
    
    try {
      // Convert to number for validation
      const usdtAmount = parseFloat(formData.availableUSDT) || 0;
      
      // Validate data
      if (usdtAmount < 0) {
        toast.error('USDT amount cannot be negative');
        return;
      }

      // Update USDT amount
      const usdtResult = await updateAvailableUSDT(usdtAmount);
      if (!usdtResult.success) {
        throw new Error(usdtResult.error);
      }

      toast.success('USDT amount saved successfully!');
      
    } catch (error) {
      console.error('Error saving USDT amount:', error);
      toast.error('Failed to save USDT amount: ' + error.message);
    } finally {
      setSavingStates(prev => ({ ...prev, usdtAmount: false }));
    }
  };

  const handleSavePriceRanges = async () => {
    setSavingStates(prev => ({ ...prev, priceRanges: true }));
    
    try {
      // Validate price ranges
      for (let i = 0; i < formData.priceRanges.length; i++) {
        const range = formData.priceRanges[i];
        if (range.rate <= 0) {
          toast.error(`Invalid rate for range ${i + 1}: Rate must be greater than zero`);
          return;
        }
      }

      // Update price ranges
      const rangesResult = await updatePriceRanges(formData.priceRanges);
      if (!rangesResult.success) {
        throw new Error(rangesResult.error);
      }

      toast.success('Price ranges saved successfully!');
      
    } catch (error) {
      console.error('Error saving price ranges:', error);
      toast.error('Failed to save price ranges: ' + error.message);
    } finally {
      setSavingStates(prev => ({ ...prev, priceRanges: false }));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 bg-white rounded-lg shadow-sm p-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage USDT exchange settings</p>
          </div>
          <Button
            variant="outline"
            onClick={onLogout}
            className="flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </Button>
        </div>

        {/* USDT Amount Control */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-sm p-6 mb-8"
        >
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Available USDT Control</h2>
              <p className="text-sm text-gray-600 mt-1">Manage the total available USDT amount</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Available USDT
              </label>
              <div className="text-3xl font-bold text-green-600 mb-4">
                {availableUSDT.toLocaleString()} USDT
              </div>
            </div>
            
            <div>
              <Input
                label="Update Available USDT"
                type="number"
                value={formData.availableUSDT}
                onChange={(e) => handleUSDTAmountChange(e.target.value)}
                placeholder="Enter new USDT amount"
                min="0"
                step="0.01"
              />
              <div className="mt-4">
                <Button
                  onClick={handleSaveUSDTAmount}
                  variant="primary"
                  size="default"
                  disabled={savingStates.usdtAmount}
                  className="w-full"
                >
                  {savingStates.usdtAmount ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Save USDT Amount
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Price Ranges Control */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm p-6 mt-8"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Price Range Controls</h2>
                <p className="text-sm text-gray-600 mt-1">Configure exchange rates for different USDT amount tiers</p>
              </div>
            </div>
            <Button
              onClick={handleSavePriceRanges}
              variant="primary"
              size="default"
              disabled={savingStates.priceRanges}
              className="flex items-center"
            >
              {savingStates.priceRanges ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 718-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </div>
              ) : (
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Price Ranges
                </div>
              )}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {formData.priceRanges.map((range, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="relative p-6 border-2 border-gray-200 rounded-xl bg-gradient-to-br from-gray-50 to-white hover:border-purple-300 transition-all duration-200"
              >
                {/* Range Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-white font-bold text-sm">{index + 1}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Range {index + 1}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {range.min.toLocaleString()} - {range.max.toLocaleString()} USDT
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-purple-600">
                      {range.rate.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">LKR per USDT</div>
                  </div>
                </div>

                {/* Current Values Display */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-xs font-medium text-blue-600 uppercase tracking-wide">Min Amount</div>
                    <div className="text-lg font-bold text-blue-800">
                      {range.min.toLocaleString()}
                    </div>
                    <div className="text-xs text-blue-600">USDT (Fixed)</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-xs font-medium text-green-600 uppercase tracking-wide">Max Amount</div>
                    <div className="text-lg font-bold text-green-800">
                      {range.max.toLocaleString()}
                    </div>
                    <div className="text-xs text-green-600">USDT (Fixed)</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-xs font-medium text-purple-600 uppercase tracking-wide">Rate</div>
                    <div className="text-lg font-bold text-purple-800">
                      {range.rate.toFixed(2)}
                    </div>
                    <div className="text-xs text-purple-600">per USDT</div>
                  </div>
                </div>

                {/* Rate Input Field */}
                <div className="space-y-4">
                  <Input
                    label="Exchange Rate (LKR per USDT)"
                    type="number"
                    value={range.rate}
                    onChange={(e) => handlePriceRangeChange(index, e.target.value)}
                    min="0"
                    step="0.01"
                    className="text-center font-medium text-lg"
                  />
                  <p className="text-sm text-gray-500 text-center">
                    Min/Max amounts are fixed. Only rates can be modified.
                  </p>
                </div>

                {/* Range Status Indicator */}
                <div className="mt-4 flex items-center justify-between text-xs">
                  <span className="text-gray-500">
                    Range {index + 1} of {formData.priceRanges.length}
                  </span>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                    <span className="text-green-600 font-medium">Active</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary Section */}
          <div className="mt-8 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
            <h4 className="font-semibold text-gray-900 mb-2">Price Range Summary</h4>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">
              {formData.priceRanges.map((range, index) => (
                <div key={index} className="text-center">
                  <div className="font-medium text-gray-700">Range {index + 1}</div>
                  <div className="text-purple-600 font-semibold">
                    {range.rate.toFixed(2)} LKR
                  </div>
                  <div className="text-xs text-gray-500">
                    ({range.min.toLocaleString()} - {range.max.toLocaleString()})
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}