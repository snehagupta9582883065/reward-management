import React from 'react';
import { motion } from 'framer-motion';

function Card({ children, className = '', hover = true }) {
  return (
    <motion.div
      whileHover={hover ? { y: -5 } : {}}
      transition={{ type: "spring", stiffness: 300 }}
      className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100 ${className}`}
    >
      {children}
    </motion.div>
  );
}

export default Card;