'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useExchange } from '@/context/ExchangeContext';
import { useUSDT } from '@/context/USDTContext';
import { getUSDTPrice } from '@/utils/firebase';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';

export default function AmountCalculator() {
  const { nextStep, prevStep, updateExchangeData, exchangeData } = useExchange();
  const { availableUSDT, getPriceForAmount, isLoading } = useUSDT();
  const [lkrAmount, setLkrAmount] = useState('');
  const [usdtAmount, setUsdtAmount] = useState('');

  // Get USDT price based on LKR amount from admin-controlled pricing
  const getUSDTPriceForLKR = (lkrValue) => {
    return getPriceForAmount(lkrValue);
  };

  // Convert LKR to USDT
  const convertLKRToUSDT = (lkrValue) => {
    if (!lkrValue || lkrValue <= 0) return '';
    const usdtPrice = getUSDTPriceForLKR(lkrValue);
    return (lkrValue / usdtPrice).toFixed(6);
  };

  // Handle key press for LKR input - only allow numbers and decimal
  const handleLKRKeyPress = (e) => {
    const charCode = e.which ? e.which : e.keyCode;
    // Allow: backspace, delete, tab, escape, enter, decimal point
    if ([8, 9, 27, 13, 46].indexOf(charCode) !== -1 ||
        // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
        (charCode === 65 && e.ctrlKey === true) ||
        (charCode === 67 && e.ctrlKey === true) ||
        (charCode === 86 && e.ctrlKey === true) ||
        (charCode === 88 && e.ctrlKey === true)) {
      return;
    }
    // Ensure that it is a number or decimal point and stop the keypress
    if ((charCode < 48 || charCode > 57) && charCode !== 46) {
      e.preventDefault();
    }
    // Only allow one decimal point
    if (charCode === 46 && lkrAmount.indexOf('.') !== -1) {
      e.preventDefault();
    }
  };

  // Handle LKR input change
  const handleLKRChange = (e) => {
    const value = e.target.value;
    
    // Only allow numbers and decimal point
    const numericValue = value.replace(/[^0-9.]/g, '');
    
    // Prevent multiple decimal points
    const parts = numericValue.split('.');
    const validValue = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : numericValue;
    
    setLkrAmount(validValue);
    const convertedUSDT = convertLKRToUSDT(parseFloat(validValue));
    setUsdtAmount(convertedUSDT);
  };

  // Validate and proceed
  const handleNext = () => {
    const usdtValue = parseFloat(usdtAmount);
    const lkrValue = parseFloat(lkrAmount);
    
    if (usdtValue > 0 && lkrValue > 0 && lkrValue <= 50000 && usdtValue <= availableUSDT) {
      updateExchangeData({
        lkrAmount: lkrValue,
        usdtAmount: usdtValue,
        usdtPrice: getUSDTPriceForLKR(lkrValue)
      });
      nextStep();
    }
  };

  // Get current exchange rate display
  const getCurrentRate = () => {
    if (lkrAmount) {
      return `1 USDT = ${getUSDTPriceForLKR(parseFloat(lkrAmount))} LKR`;
    }
    return '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Available USDT Display */}
        <div className="text-center mb-8">
          <div className="bg-white rounded-lg shadow-md p-4 inline-block">
            <p className="text-sm text-gray-600 mb-1">Available USDT Amount</p>
            <p className="text-2xl font-bold text-green-600">{availableUSDT} USDT</p>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Amount Calculator
          </h1>
          <p className="text-lg text-gray-600">
            Convert LKR to USDT with dynamic pricing
            (USDT මිලදී ගැනීමට අවශ්‍ය රුපියල් ප්‍රමානය ඇතුලත් කරන්න )
          </p>
          <p className="text-lg text-red-600"> <b>MEXC</b> හා <b>ByBit</b> සඳහා Deposit කලහැකි අවමය 10 USDT වේ.</p>
        </div>

        {/* Converter */}
        <Card className="p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* LKR Input */}
            <div>
              <Input
                label="LKR Amount"
                type="number"
                value={lkrAmount}
                onChange={handleLKRChange}
                onKeyPress={handleLKRKeyPress}
                className="text-center font-bold text-lg text-black"
                error={parseFloat(lkrAmount) > 50000 ? 'One time purchase limit is 50,000 maximum' : ''}
              />
            </div>

            {/* USDT Input */}
            <div>
              <Input
                label="USDT Amount (You will receive)"
                type="number"
                value={usdtAmount}
                className="text-center font-bold text-lg text-black"
                readOnly
                error={parseFloat(usdtAmount) > availableUSDT ? 'Exceeds available USDT' : ''}
              />
            </div>
          </div>

          {/* Exchange Rate Display */}
          <div className="text-center mt-6">
            <div className="bg-gray-100 rounded-lg p-4">
             </div>
          </div>
        </Card>

        <div className="flex justify-between">
          <Button variant="secondary" onClick={prevStep}>
            ← Back
          </Button>
          <Button 
            variant="secondary"
            onClick={handleNext}
            disabled={!lkrAmount || !usdtAmount || parseFloat(usdtAmount) > availableUSDT || parseFloat(usdtAmount) <= 0 || parseFloat(lkrAmount) > 50000}
            className={`${
              !lkrAmount || !usdtAmount || parseFloat(usdtAmount) > availableUSDT || parseFloat(usdtAmount) <= 0 || parseFloat(lkrAmount) > 50000
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