'use client'

import { motion } from 'framer-motion';
import { useExchange } from '@/context/ExchangeContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Button from '../ui/Button';

export default function WelcomePage() {
  const { nextStep } = useExchange();
  const router = useRouter();

  const handleLogoClick = () => {
    router.push('/admin');
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
            className="text-xl md:text-2xl text-blue-100 mb-12 font-light cursor-default"
          >
            Your Secure USDT/LKR Exchange
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              duration: 0.8, 
              delay: 1,
              type: "spring",
              stiffness: 150
            }}
          >
            
            <motion.button
              onClick={nextStep}
              style={{ 
                backgroundColor: '#ffffff', 
                color: '#1e3a8a', 
                fontWeight: '600',
                padding: '12px 32px',
                borderRadius: '25px',
                border: 'none',
                fontSize: '18px',
                cursor: 'pointer',
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
              }}
              className=""
              whileHover={{ 
                scale: 1.1,
                backgroundColor: '#f0f9ff',
                boxShadow: '0 15px 35px rgba(0,0,0,0.3)',
                rotateZ: 2,
                transition: { duration: 0.2 }
              }}
              whileTap={{ 
                scale: 0.95,
                rotateZ: -2
              }}
              initial={{ rotateZ: 0 }}
            >
              <motion.span
                whileHover={{
                  x: 5,
                  transition: { duration: 0.2 }
                }}
                style={{ display: 'inline-block' }}
              >
                Next →
              </motion.span>
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-y-12 -translate-y-1/2"></div>
    </div>
  );
}