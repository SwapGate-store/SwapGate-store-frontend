'use client'

import { createContext, useContext, useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const USDTContext = createContext();

export function USDTProvider({ children }) {
  const [availableUSDT, setAvailableUSDT] = useState(10000);
  const [priceRanges, setPriceRanges] = useState([
    { min: 1000, max: 2000, rate: 320.50 },
    { min: 2000, max: 5000, rate: 321.00 },
    { min: 5000, max: 10000, rate: 321.50 },
    { min: 10000, max: 25000, rate: 322.00 },
    { min: 25000, max: 50000, rate: 322.50 }
  ]);
  const [isLoading, setIsLoading] = useState(true);

  // Load USDT data from Firebase on component mount
  useEffect(() => {
    loadUSDTData();
  }, []);

  const loadUSDTData = async () => {
    try {
      console.log('Loading USDT data from Firebase...');
      const usdtDoc = await getDoc(doc(db, 'settings', 'usdt'));
      if (usdtDoc.exists()) {
        const data = usdtDoc.data();
        console.log('Firebase data loaded:', data);
        
        if (data.availableUSDT !== undefined) {
          setAvailableUSDT(data.availableUSDT);
          console.log('Set availableUSDT:', data.availableUSDT);
        }
        if (data.priceRanges && Array.isArray(data.priceRanges)) {
          setPriceRanges(data.priceRanges);
          console.log('Set priceRanges:', data.priceRanges);
        }
      } else {
        console.log('No existing Firebase document found, using default values');
        // Initialize Firebase with default values
        await setDoc(doc(db, 'settings', 'usdt'), {
          availableUSDT: 10000,
          priceRanges: [
            { min: 1000, max: 2000, rate: 320.50 },
            { min: 2000, max: 5000, rate: 321.00 },
            { min: 5000, max: 10000, rate: 321.50 },
            { min: 10000, max: 25000, rate: 322.00 },
            { min: 25000, max: 50000, rate: 322.50 }
          ],
          lastUpdated: new Date()
        });
        console.log('Initialized Firebase with default values');
      }
    } catch (error) {
      console.error('Error loading USDT data:', error);
      console.error('Error details:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Admin-only function to update available USDT
  const updateAvailableUSDT = async (newAmount) => {
    try {
      console.log('Updating USDT amount to:', newAmount);
      const updateData = {
        availableUSDT: newAmount,
        priceRanges,
        lastUpdated: new Date()
      };
      
      await setDoc(doc(db, 'settings', 'usdt'), updateData, { merge: true });
      
      setAvailableUSDT(newAmount);
      console.log('Successfully updated USDT amount in Firebase');
      return { success: true };
    } catch (error) {
      console.error('Error updating USDT amount:', error);
      return { success: false, error: error.message };
    }
  };

  // Admin-only function to update price ranges
  const updatePriceRanges = async (newRanges) => {
    try {
      console.log('Updating price ranges to:', newRanges);
      const updateData = {
        availableUSDT,
        priceRanges: newRanges,
        lastUpdated: new Date()
      };
      
      await setDoc(doc(db, 'settings', 'usdt'), updateData, { merge: true });
      
      setPriceRanges(newRanges);
      console.log('Successfully updated price ranges in Firebase');
      return { success: true };
    } catch (error) {
      console.error('Error updating price ranges:', error);
      return { success: false, error: error.message };
    }
  };

  // Function to get price for a specific USDT amount
  const getPriceForAmount = (usdtAmount) => {
    const range = priceRanges.find(r => usdtAmount >= r.min && usdtAmount <= r.max);
    return range ? range.rate : priceRanges[0].rate;
  };

  // Function to manually refresh data from Firebase
  const refreshData = async () => {
    setIsLoading(true);
    await loadUSDTData();
  };

  const value = {
    availableUSDT,
    priceRanges,
    isLoading,
    // Admin-only functions
    updateAvailableUSDT,
    updatePriceRanges,
    // Public functions
    getPriceForAmount,
    loadUSDTData,
    refreshData
  };

  return (
    <USDTContext.Provider value={value}>
      {children}
    </USDTContext.Provider>
  );
}

export function useUSDT() {
  const context = useContext(USDTContext);
  if (!context) {
    throw new Error('useUSDT must be used within a USDTProvider');
  }
  return context;
}