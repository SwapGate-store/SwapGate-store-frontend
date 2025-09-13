'use client'

import { motion } from 'framer-motion';

export default function Card({ 
  children, 
  className = '',
  hover = true,
  ...props 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={hover ? { y: -2, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" } : {}}
      className={`bg-white rounded-xl shadow-lg border border-gray-100 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}