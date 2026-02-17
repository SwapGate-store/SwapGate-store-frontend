'use client'

import { motion } from 'framer-motion';
import { useExchange } from '@/context/ExchangeContext';
import { useRouter } from 'next/navigation';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { FaShoppingCart, FaMoneyBillWave } from 'react-icons/fa';

export default function BuyOrSellPage() {
  const { nextStep } = useExchange();
  const router = useRouter();

  const handleBuy = () => {
    nextStep();
  };

  const handleSell = () => {
    window.location.href = 'https://swapgate-sell.onrender.com/';
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
            What would you like to do?
          </h1>
          <p className="text-lg text-gray-600">
            Choose whether you want to buy or sell cryptocurrency
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Buy Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-8 text-center h-full flex flex-col justify-between hover:shadow-lg hover:border-blue-300 transition-all duration-300">
              <div className="mb-8">
                <div className="flex justify-center mb-6">
                  <div className="bg-blue-100 p-6 rounded-full">
                    <FaShoppingCart size={48} className="text-blue-600" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-3">Buy</h2>
                <p className="text-gray-600">
                  Purchase cryptocurrency and convert to your local currency
                </p>
              </div>
              <Button
                onClick={handleBuy}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
              >
                Buy Now
              </Button>
            </Card>
          </motion.div>

          {/* Sell Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-8 text-center h-full flex flex-col justify-between hover:shadow-lg hover:border-green-300 transition-all duration-300">
              <div className="mb-8">
                <div className="flex justify-center mb-6">
                  <div className="bg-green-100 p-6 rounded-full">
                    <FaMoneyBillWave size={48} className="text-green-600" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-3">Sell</h2>
                <p className="text-gray-600">
                  Convert your cryptocurrency back to your local currency
                </p>
              </div>
              <Button
                onClick={handleSell}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3"
              >
                Sell Now
              </Button>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
