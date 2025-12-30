'use client'

import { motion } from 'framer-motion';
import { useExchange } from '@/context/ExchangeContext';
import Button from '../ui/Button';
import { FaTelegramPlane, FaTiktok, FaEnvelope, FaCheckCircle } from 'react-icons/fa';

export default function ThankYouPage() {
  const { resetExchange } = useExchange();

  const socialLinks = [
    {
      name: 'TikTok',
      icon: FaTiktok,
      color: 'bg-black hover:bg-gray-800',
      href: 'https://www.tiktok.com/@sri.lanka.swap.ga?_t=ZS-8zghB3qtaGl&_r=1'
    },
    {
      name: 'Email',
      icon: FaEnvelope,
      color: 'bg-blue-500 hover:bg-blue-600',
      href: 'mailto:contact.swapgate@gmail.com'
    },
    {
      name: 'Telegram',
      icon: FaTelegramPlane,
      color: 'bg-blue-400 hover:bg-blue-500',
      href: 'http://t.me/Swap_owner'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="text-center mb-8"
        >
          
        </motion.div>

        {/* Thank You Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-8"
        >
          <h1 className="text-6xl md:text-7xl font-bold text-gray-800 mb-4">
            Thank You!
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-green-600 mb-6">
            Order Submitted Successfully
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your exchange order has been received and is being processed. Our team will contact you shortly to complete the transaction. You should have received an invoice download.
          </p>
        </motion.div>

        {/* Social Media Contact Icons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mb-12"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-6">
            Contact Us On
          </h3>
          <div className="flex justify-center gap-6 mb-6">
            {socialLinks.map((social, index) => (
              <motion.a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className={`inline-flex items-center justify-center w-16 h-16 rounded-full text-white transition-all duration-200 ${social.color}`}
                title={social.name}
              >
                <social.icon size={28} />
              </motion.a>
            ))}
          </div>
          <p className="text-sm text-gray-500">
            Choose your preferred method to get in touch with our support team
          </p>
        </motion.div>

        {/* Start New Exchange Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="text-center"
        >
          <Button 
            variant="secondary" 
            onClick={resetExchange}
            className="px-8 py-4 text-lg font-semibold"
          >
            Start New Exchange
          </Button>
          <p className="text-sm text-gray-500 mt-3">
            Need to make another exchange? Click here to start over
          </p>
        </motion.div>
      </div>
    </div>
  );
}