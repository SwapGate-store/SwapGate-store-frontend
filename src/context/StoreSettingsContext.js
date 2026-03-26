'use client'

import { createContext, useContext, useState, useEffect } from 'react';
import { 
  getStoreMode, 
  updateStoreMode as updateStoreModeFirebase, 
  subscribeToStoreMode,
  getOnetimePurchaseLimit,
  updateOnetimePurchaseLimit as updateOnetimePurchaseLimitFirebase,
  subscribeToOnetimePurchaseLimit
} from '@/utils/firebase';

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
  const [onetimePurchaseLimit, setOnetimePurchaseLimit] = useState(5000000); // 5,000,000 LKR default
  const [isLoading, setIsLoading] = useState(true);
  
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
        // Store open from 9 AM (9) to 11 PM (23)
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
          statusMessage = 'Open (9 AM - 11 PM)';
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
  const updateStoreMode = async (mode) => {
    if (['24x7', 'normal', 'closed'].includes(mode)) {
      setIsLoading(true);
      try {
        const success = await updateStoreModeFirebase(mode);
        if (success) {
          // The real-time listener will update the state
          console.log('Store mode update sent to Firebase');
        } else {
          console.error('Failed to update store mode in Firebase');
          // Keep localStorage as fallback
          localStorage.setItem('storeMode', mode);
          setStoreMode(mode);
        }
      } catch (error) {
        console.error('Error updating store mode:', error);
        // Keep localStorage as fallback
        localStorage.setItem('storeMode', mode);
        setStoreMode(mode);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Admin function to update one-time purchase limit
  const updateOnetimePurchaseLimit = async (limit) => {
    try {
      const success = await updateOnetimePurchaseLimitFirebase(limit);
      if (success) {
        // The real-time listener will update the state
        console.log('One-time purchase limit update sent to Firebase');
        return true;
      } else {
        console.error('Failed to update purchase limit in Firebase');
        // Keep localStorage as fallback
        localStorage.setItem('onetimePurchaseLimitLKR', limit);
        setOnetimePurchaseLimit(parseFloat(limit));
        return false;
      }
    } catch (error) {
      console.error('Error updating purchase limit:', error);
      // Keep localStorage as fallback
      localStorage.setItem('onetimePurchaseLimitLKR', limit);
      setOnetimePurchaseLimit(parseFloat(limit));
      return false;
    }
  };

  // Get display name for store mode
  const getStoreModeDisplay = (mode = storeMode) => {
    switch (mode) {
      case '24x7':
        return '24×7 Open Mode';
      case 'normal':
        return 'Normal Mode (9 AM - 11 PM)';
      case 'closed':
        return 'Completely Closed Mode';
      default:
        return 'Unknown Mode';
    }
  };

  // Load settings from Firebase on mount and subscribe to changes
  useEffect(() => {
    let unsubscribeModeChanges = null;
    let unsubscribeLimitChanges = null;
    
    const initializeStoreSettings = async () => {
      try {
        // First, try to get the current mode from Firebase
        const mode = await getStoreMode();
        setStoreMode(mode);
        
        // Get the one-time purchase limit from Firebase
        const limit = await getOnetimePurchaseLimit();
        setOnetimePurchaseLimit(limit);
        
        // Subscribe to real-time mode updates
        unsubscribeModeChanges = subscribeToStoreMode((newMode) => {
          setStoreMode(newMode);
          // Also update localStorage as backup
          localStorage.setItem('storeMode', newMode);
        });

        // Subscribe to real-time purchase limit updates
        unsubscribeLimitChanges = subscribeToOnetimePurchaseLimit((newLimit) => {
          setOnetimePurchaseLimit(newLimit);
          // Also update localStorage as backup
          localStorage.setItem('onetimePurchaseLimitLKR', newLimit);
        });
        
      } catch (error) {
        console.error('Error initializing store settings:', error);
        
        // Fallback to localStorage if Firebase fails
        const savedMode = localStorage.getItem('storeMode');
        if (savedMode && ['24x7', 'normal', 'closed'].includes(savedMode)) {
          setStoreMode(savedMode);
        }

        const savedLimit = localStorage.getItem('onetimePurchaseLimitLKR');
        if (savedLimit) {
          setOnetimePurchaseLimit(parseFloat(savedLimit));
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeStoreSettings();

    // Cleanup subscriptions on unmount
    return () => {
      if (unsubscribeModeChanges) {
        unsubscribeModeChanges();
      }
      if (unsubscribeLimitChanges) {
        unsubscribeLimitChanges();
      }
    };
  }, []);

  const value = {
    storeMode,
    updateStoreMode,
    onetimePurchaseLimit,
    updateOnetimePurchaseLimit,
    isStoreOpen: isStoreOpen(),
    getStoreStatus,
    getStoreModeDisplay,
    isLoading
  };

  return (
    <StoreSettingsContext.Provider value={value}>
      {children}
    </StoreSettingsContext.Provider>
  );
};