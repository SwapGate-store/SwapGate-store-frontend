'use client'

import { motion } from 'framer-motion';
import { useStoreSettings } from '@/context/StoreSettingsContext';
import { FaStore, FaClock } from 'react-icons/fa';

export default function StoreStatusBadge() {
  const { getStoreStatus } = useStoreSettings();
  const storeStatus = getStoreStatus();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed top-4 right-4 z-50"
    >
      <div className={`
        px-4 py-2 rounded-full shadow-lg border-2 backdrop-blur-sm
        ${storeStatus.isOpen 
          ? 'bg-green-500/90 border-green-400 text-white' 
          : 'bg-red-500/90 border-red-400 text-white'
        }
        transition-all duration-300 hover:scale-105
      `}>
        <div className="flex items-center space-x-2">
          <FaStore className="text-sm" />
          <span className="text-sm font-semibold">
            {storeStatus.isOpen ? 'OPEN' : 'CLOSED'}
          </span>
          {!storeStatus.isOpen && (
            <FaClock className="text-xs" />
          )}
        </div>
        
        {/* Status Details Tooltip */}
        <div className="absolute top-full right-0 mt-2 w-48 opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none hover:pointer-events-auto">
          <div className="bg-gray-900 text-white text-xs rounded-lg p-3 shadow-xl">
            <p className="font-medium mb-1">{storeStatus.statusMessage}</p>
            <p className="text-gray-300">Current Time: {storeStatus.currentTime}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}