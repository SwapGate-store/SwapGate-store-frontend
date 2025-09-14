'use client'

import { createContext, useContext, useState, useEffect } from 'react';

const StoreSettingsContext = createContext();

export const useStoreSettings = () => {
  const context = useContext(StoreSettingsContext);
  if (!context) {
    throw new Error('useStoreSettings must be used within a StoreSettingsProvider');
  }
  return context;
};

export const StoreSettingsProvider = ({ children }) => {
  // Store operation modes: '24x7', 'normal', 'closed'
  const [storeMode, setStoreMode] = useState('normal');
  
  // Check if store is currently open based on the selected mode
  const isStoreOpen = () => {
    switch (storeMode) {
      case '24x7':
        return true;
      case 'closed':
        return false;
      case 'normal':
        const now = new Date();
        const currentHour = now.getHours();
        // Store open from 8 AM (8) to 11 PM (23)
        return currentHour >= 8 && currentHour < 23;
      default:
        return false;
    }
  };

  // Get store status info
  const getStoreStatus = () => {
    const isOpen = isStoreOpen();
    const now = new Date();
    
    let statusMessage = '';
    let badgeColor = '';
    
    switch (storeMode) {
      case '24x7':
        statusMessage = 'Always Open';
        badgeColor = 'bg-green-500';
        break;
      case 'closed':
        statusMessage = 'Closed';
        badgeColor = 'bg-red-500';
        break;
      case 'normal':
        if (isOpen) {
          statusMessage = 'Open (8 AM - 11 PM)';
          badgeColor = 'bg-green-500';
        } else {
          statusMessage = 'Closed';
          badgeColor = 'bg-red-500';
        }
        break;
      default:
        statusMessage = 'Unknown';
        badgeColor = 'bg-gray-500';
    }

    return {
      isOpen,
      statusMessage,
      badgeColor,
      mode: storeMode,
      currentTime: now.toLocaleTimeString('en-US', {
        hour12: true,
        hour: 'numeric',
        minute: '2-digit'
      })
    };
  };

  // Admin function to update store mode
  const updateStoreMode = (mode) => {
    if (['24x7', 'normal', 'closed'].includes(mode)) {
      setStoreMode(mode);
      localStorage.setItem('storeMode', mode);
    }
  };

  // Get display name for store mode
  const getStoreModeDisplay = (mode = storeMode) => {
    switch (mode) {
      case '24x7':
        return '24×7 Open Mode';
      case 'normal':
        return 'Normal Mode (8 AM - 11 PM)';
      case 'closed':
        return 'Completely Closed Mode';
      default:
        return 'Unknown Mode';
    }
  };

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedMode = localStorage.getItem('storeMode');
    if (savedMode && ['24x7', 'normal', 'closed'].includes(savedMode)) {
      setStoreMode(savedMode);
    }
  }, []);

  const value = {
    storeMode,
    updateStoreMode,
    isStoreOpen: isStoreOpen(),
    getStoreStatus,
    getStoreModeDisplay
  };

  return (
    <StoreSettingsContext.Provider value={value}>
      {children}
    </StoreSettingsContext.Provider>
  );
};