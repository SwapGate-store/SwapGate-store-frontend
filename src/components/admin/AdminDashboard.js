'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUSDT } from '@/context/USDTContext';
import { useStoreSettings } from '@/context/StoreSettingsContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { toast } from 'react-hot-toast';
import { FaClock, FaToggleOn, FaToggleOff, FaStore, FaDollarSign, FaListUl } from 'react-icons/fa';

export default function AdminDashboard({ onLogout }) {
  const { 
    availableUSDT, 
    priceRanges, 
    updateAvailableUSDT,
    updatePriceRanges,
    isLoading
  } = useUSDT();

  const {
    storeMode,
    updateStoreMode,
    isStoreOpen,
    getStoreStatus,
    getStoreModeDisplay,
    isLoading: storeSettingsLoading
  } = useStoreSettings();

  const [formData, setFormData] = useState({
    availableUSDT: 0,
    priceRanges: []
  });
  const [savingStates, setSavingStates] = useState({
    usdtAmount: false,
    priceRanges: false,
    storeHours: false
  });

  const storeStatus = getStoreStatus();

  // Store mode update handlers
  const handleStoreModeUpdate = async (mode, successMessage) => {
    try {
      await updateStoreMode(mode);
      toast.success(successMessage);
    } catch (error) {
      console.error('Error updating store mode:', error);
      toast.error('Failed to update store mode. Please try again.');
    }
  };

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
      availableUSDT: parseFloat(value) || 0
    }));
  };

  const handlePriceRangeChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      priceRanges: prev.priceRanges.map((range, i) => 
        i === index ? { ...range, [field]: parseFloat(value) || 0 } : range
      )
    }));
  };

  const saveUSDTAmount = async () => {
    try {
      setSavingStates(prev => ({ ...prev, usdtAmount: true }));
      await updateAvailableUSDT(formData.availableUSDT);
      toast.success('USDT amount updated successfully!');
    } catch (error) {
      console.error('Error updating USDT amount:', error);
      toast.error('Failed to update USDT amount');
    } finally {
      setSavingStates(prev => ({ ...prev, usdtAmount: false }));
    }
  };

  const savePriceRanges = async () => {
    try {
      setSavingStates(prev => ({ ...prev, priceRanges: true }));
      await updatePriceRanges(formData.priceRanges);
      toast.success('Price ranges updated successfully!');
    } catch (error) {
      console.error('Error updating price ranges:', error);
      toast.error('Failed to update price ranges');
    } finally {
      setSavingStates(prev => ({ ...prev, priceRanges: false }));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage USDT availability, pricing, and store settings</p>
          </div>
          <Button variant="secondary" onClick={onLogout}>
            Logout
          </Button>
        </div>

        {/* Store Operation Mode Control */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm p-6 mb-8"
        >
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <FaStore className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Store Operation Mode</h2>
              <p className="text-sm text-gray-600 mt-1">Control store availability and operating hours</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Current Status */}
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                  <FaClock className="mr-2 text-gray-600" />
                  Current Store Status
                </h3>
                <div className="space-y-3">
                  <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                    storeStatus.isOpen 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {storeStatus.isOpen ? '🟢 OPEN' : '🔴 CLOSED'}
                  </div>
                  <p className="text-sm text-gray-600">{storeStatus.statusMessage}</p>
                  <p className="text-xs text-gray-500">Current Time: {storeStatus.currentTime}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">Current Mode</h3>
                <div className="text-sm text-gray-600">
                  <p className="font-medium text-blue-600">{getStoreModeDisplay()}</p>
                </div>
              </div>
            </div>

            {/* Operation Mode Controls */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900 mb-4">Store Operation Modes</h3>
              
              {storeSettingsLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">Loading store settings...</span>
                </div>
              ) : (
                <>
              {/* 24x7 Open Mode */}
              <div className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                storeMode === '24x7' 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-200 hover:border-green-300'
              }`}
              onClick={() => handleStoreModeUpdate('24x7', 'Store set to 24×7 Open Mode - Always available!')}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                      storeMode === '24x7' 
                        ? 'border-green-500 bg-green-500' 
                        : 'border-gray-300'
                    }`}>
                      {storeMode === '24x7' && <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">24×7 Open Mode</h4>
                      <p className="text-sm text-gray-600">Store always available</p>
                    </div>
                  </div>
                  {storeMode === '24x7' && <FaToggleOn className="text-green-600 text-xl" />}
                </div>
              </div>

              {/* Normal Mode */}
              <div className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                storeMode === 'normal' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-blue-300'
              }`}
              onClick={() => handleStoreModeUpdate('normal', 'Store set to Normal Mode - Open 8 AM to 11 PM')}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                      storeMode === 'normal' 
                        ? 'border-blue-500 bg-blue-500' 
                        : 'border-gray-300'
                    }`}>
                      {storeMode === 'normal' && <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Normal Mode</h4>
                      <p className="text-sm text-gray-600">Open 8 AM - 11 PM</p>
                    </div>
                  </div>
                  {storeMode === 'normal' && <FaToggleOn className="text-blue-600 text-xl" />}
                </div>
              </div>

              {/* Completely Closed Mode */}
              <div className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                storeMode === 'closed' 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-200 hover:border-red-300'
              }`}
              onClick={() => handleStoreModeUpdate('closed', 'Store set to Completely Closed Mode')}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                      storeMode === 'closed' 
                        ? 'border-red-500 bg-red-500' 
                        : 'border-gray-300'
                    }`}>
                      {storeMode === 'closed' && <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Completely Closed Mode</h4>
                      <p className="text-sm text-gray-600">Store closed 24×7</p>
                    </div>
                  </div>
                  {storeMode === 'closed' && <FaToggleOn className="text-red-600 text-xl" />}
                </div>
              </div>
                </>
              )}
            </div>
          </div>
        </motion.div>

        {/* USDT Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-sm p-6 mb-8"
        >
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <FaDollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">USDT Management</h2>
              <p className="text-sm text-gray-600 mt-1">Control available USDT amount for trading</p>
            </div>
          </div>
          
          <div className="max-w-md">
            <Input
              label={`Available USDT (Current: ${availableUSDT} USDT)`}
              type="number"
              value={formData.availableUSDT}
              onChange={(e) => handleUSDTAmountChange(e.target.value)}
              placeholder="Enter available USDT amount"
              className="mb-4"
            />
            <Button 
              onClick={saveUSDTAmount}
              disabled={savingStates.usdtAmount || formData.availableUSDT === availableUSDT}
              className={`w-full ${
                formData.availableUSDT !== availableUSDT 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-gray-400'
              }`}
            >
              {savingStates.usdtAmount ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <FaDollarSign className="mr-2" />
                  Save USDT Amount
                </div>
              )}
            </Button>
          </div>
        </motion.div>

        {/* Price Ranges Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <FaListUl className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Price Ranges Management</h2>
                <p className="text-sm text-gray-600 mt-1">Configure USDT to LKR exchange rates for different ranges</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {formData.priceRanges.map((range, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Range {index + 1}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Input
                      label="Minimum USDT"
                      type="number"
                      value={range.min}
                      onChange={(e) => handlePriceRangeChange(index, 'min', e.target.value)}
                      placeholder="Min USDT"
                    />
                  </div>
                  <div>
                    <Input
                      label="Maximum USDT"
                      type="number"
                      value={range.max}
                      onChange={(e) => handlePriceRangeChange(index, 'max', e.target.value)}
                      placeholder="Max USDT"
                    />
                  </div>
                  <div>
                    <Input
                      label="Rate (LKR per USDT)"
                      type="number"
                      step="0.01"
                      value={range.rate}
                      onChange={(e) => handlePriceRangeChange(index, 'rate', e.target.value)}
                      placeholder="Exchange rate"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Button 
              onClick={savePriceRanges}
              disabled={savingStates.priceRanges}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {savingStates.priceRanges ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving Price Ranges...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <FaListUl className="mr-2" />
                  Save Price Ranges
                </div>
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}