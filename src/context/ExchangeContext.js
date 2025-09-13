'use client'

import { createContext, useContext, useState } from 'react';

const ExchangeContext = createContext();

export function ExchangeProvider({ children }) {
  const [exchangeData, setExchangeData] = useState({
    step: 0,
    exchange: null,
    exchangeId: '',
    lkrAmount: '',
    usdtAmount: '',
    usdtPrice: 0,
    selectedBank: null,
    userInfo: {
      name: '',
      email: '',
      phone: '',
      receipt: null
    }
  });

  const updateExchangeData = (updates) => {
    setExchangeData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    setExchangeData(prev => ({ ...prev, step: prev.step + 1 }));
  };

  const prevStep = () => {
    setExchangeData(prev => ({ ...prev, step: Math.max(0, prev.step - 1) }));
  };

  const resetExchange = () => {
    setExchangeData({
      step: 0,
      exchange: null,
      exchangeId: '',
      lkrAmount: '',
      usdtAmount: '',
      usdtPrice: 0,
      selectedBank: null,
      userInfo: {
        name: '',
        email: '',
        phone: '',
        receipt: null
      }
    });
  };

  return (
    <ExchangeContext.Provider 
      value={{ 
        exchangeData, 
        updateExchangeData, 
        nextStep, 
        prevStep, 
        resetExchange 
      }}
    >
      {children}
    </ExchangeContext.Provider>
  );
}

export function useExchange() {
  const context = useContext(ExchangeContext);
  if (!context) {
    throw new Error('useExchange must be used within an ExchangeProvider');
  }
  return context;
}