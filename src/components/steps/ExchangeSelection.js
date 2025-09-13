'use client'

import { motion } from 'framer-motion';
import { useExchange } from '@/context/ExchangeContext';
import { useState } from 'react';
import Image from 'next/image';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { FaCheckCircle } from 'react-icons/fa';

export default function ExchangeSelection() {
  const { nextStep, prevStep, updateExchangeData, exchangeData } = useExchange();
  const [selectedExchange, setSelectedExchange] = useState(null);
  const [exchangeId, setExchangeId] = useState('');

  const exchanges = [
    {
      id: 'binance',
      logo: '/assets/Binance-Logo.png',
      placeholder: 'Enter Binance User ID'
    },
    {
      id: 'mexc',
      logo: '/assets/mexclogo.png',
      placeholder: 'Enter TRC20 Address'
    },
    {
      id: 'bybit',
      logo: '/assets/bybitlogo.png',
      placeholder: 'Enter TRC20 Address'
    }
  ];

  const selectExchange = (exchange) => {
    setSelectedExchange(exchange);
    setExchangeId('');
  };

  const handleNext = () => {
    if (selectedExchange && exchangeId.trim()) {
      updateExchangeData({ 
        exchange: selectedExchange.id,
        exchangeId: exchangeId.trim()
      });
      nextStep();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Select Your Exchange
          </h1>
          <p className="text-lg text-gray-600">
            Choose the cryptocurrency exchange you want to use
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {exchanges.map((exchange, index) => (
            <motion.div
              key={exchange.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className={`relative p-8 cursor-pointer text-center transition-all duration-300 transform ${
                  selectedExchange?.id === exchange.id 
                    ? 'border-2 border-blue-500 bg-blue-50 shadow-lg shadow-blue-200 scale-105 ring-2 ring-blue-300 ring-opacity-50' 
                    : 'border border-gray-200 hover:border-blue-300 hover:shadow-md hover:scale-102'
                }`}
                onClick={() => selectExchange(exchange)}
              >
                {/* Selection Indicator */}
                {selectedExchange?.id === exchange.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-4 right-4 text-blue-500"
                  >
                    <FaCheckCircle size={24} />
                  </motion.div>
                )}
                
                <div className="mb-4">
                  <Image 
                    src={exchange.logo} 
                    alt={`${exchange.id} logo`}
                    width={96}
                    height={96}
                    className="h-24 mx-auto object-contain"
                  />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Input Field */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-md mx-auto mb-8"
        >
          <Input
            label={`Enter your ${selectedExchange?.id === 'binance' ? 'Binance User ID' : 'Exchange ID or TRC20 Address'}`}
            value={exchangeId}
            onChange={(e) => setExchangeId(e.target.value)}
            className="text-center text-black font-semibold text-lg tracking-wide"
            disabled={!selectedExchange}
          />
        </motion.div>

        <div className="flex justify-between items-center">
          <Button variant="secondary" onClick={prevStep}>
            ← Back
          </Button>
          
          <Button 
            variant="secondary"
            onClick={handleNext}
            disabled={!selectedExchange || !exchangeId.trim()}
            className={`${
              !selectedExchange || !exchangeId.trim() 
                ? 'opacity-100 cursor-not-allowed' 
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