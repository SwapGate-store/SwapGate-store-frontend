'use client'

import { motion } from 'framer-motion';
import { useExchange } from '@/context/ExchangeContext';
import { useStoreSettings } from '@/context/StoreSettingsContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Button from '../ui/Button';
import { FaLock } from 'react-icons/fa';

export default function WelcomePage() {
  const { nextStep } = useExchange();
  const { getStoreStatus } = useStoreSettings();
  const router = useRouter();
  
  const storeStatus = getStoreStatus();

  const handleLogoClick = () => {
    router.push('/admin');
  };

  const handleNext = () => {
    if (storeStatus.isOpen) {
      nextStep();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 relative overflow-hidden">
      {/* Logo in top left corner */}
      <div className="absolute top-6 left-6 z-20">
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="cursor-pointer"
          onClick={handleLogoClick}
        >
          <Image 
            src="/assets/logo.png" 
            alt="SwapGate Logo"
            width={60} 
            height={60}
            className="h-15 w-auto"
          />
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main Logo/Title */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.5, rotateY: -180 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ 
              duration: 1.2, 
              type: "spring", 
              stiffness: 100,
              damping: 15
            }}
            whileHover={{ 
              scale: 1.05,
              textShadow: "0px 0px 20px rgba(255,255,255,0.8)"
            }}
            className="text-6xl md:text-8xl font-pacifico text-white mb-8 drop-shadow-lg cursor-default"
          >
            SwapGate
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              duration: 0.8, 
              delay: 0.5,
              type: "spring",
              stiffness: 120
            }}
            whileHover={{
              scale: 1.02,
              color: "#ffffff"
            }}
            className="text-xl md:text-2xl text-blue-100 mb-8 font-light cursor-default"
          >
            Your Secure USDT/LKR Exchange
          </motion.p>

          {/* Store Status Display */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mb-8"
          >
            {!storeStatus.isOpen ? (
              /* Closed Sign */
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  duration: 0.5, 
                  delay: 1,
                  type: "spring",
                  stiffness: 200
                }}
                className="bg-red-600 text-white px-8 py-4 rounded-lg mx-auto inline-block border-4 border-red-500 shadow-2xl"
              >
                <div className="flex items-center justify-center space-x-3">
                  <FaLock className="text-2xl" />
                  <div className="text-center">
                    <div className="text-2xl font-bold">CLOSED</div>
                    <div className="text-sm opacity-90">{storeStatus.statusMessage}</div>
                  </div>
                </div>
              </motion.div>
            ) : (
              /* Open Status - No display needed */
              null
            )}
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: 0.8, 
              delay: 1.3,
              type: "spring",
              stiffness: 150
            }}
          >
            <motion.button
              onClick={handleNext}
              disabled={!storeStatus.isOpen}
              style={{ 
                backgroundColor: storeStatus.isOpen ? '#ffffff' : '#6b7280', 
                color: storeStatus.isOpen ? '#1e3a8a' : '#9ca3af', 
                fontWeight: '600',
                padding: '12px 32px',
                borderRadius: '25px',
                border: 'none',
                fontSize: '18px',
                cursor: storeStatus.isOpen ? 'pointer' : 'not-allowed',
                boxShadow: storeStatus.isOpen ? '0 10px 25px rgba(0,0,0,0.2)' : '0 5px 15px rgba(0,0,0,0.1)',
                opacity: storeStatus.isOpen ? 1 : 0.6
              }}
              whileHover={storeStatus.isOpen ? { 
                scale: 1.1,
                backgroundColor: '#f0f9ff',
                boxShadow: '0 15px 35px rgba(0,0,0,0.3)',
                rotateZ: 2,
                transition: { duration: 0.2 }
              } : {}}
              whileTap={storeStatus.isOpen ? { 
                scale: 0.95,
                rotateZ: -2
              } : {}}
              initial={{ rotateZ: 0 }}
            >
              <motion.span
                whileHover={storeStatus.isOpen ? {
                  x: 5,
                  transition: { duration: 0.2 }
                } : {}}
                style={{ display: 'inline-block' }}
              >
                {storeStatus.isOpen ? 'Start Exchange →' : 'Store Closed'}
              </motion.span>
            </motion.button>
            
            {!storeStatus.isOpen && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="text-blue-200 text-sm mt-4"
              >
                Please visit us during store hours: 8:00 AM - 11:00 PM
              </motion.p>
            )}
          </motion.div>
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-y-12 -translate-y-1/2"></div>
    </div>
  );
}