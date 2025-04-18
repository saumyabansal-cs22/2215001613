import React from 'react';
import { motion } from 'framer-motion';

interface LoadingStateProps {
  message?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="flex space-x-2 mb-4">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: index * 0.2,
            }}
            className="w-4 h-4 rounded-full bg-indigo-500"
          />
        ))}
      </div>
      <p className="text-gray-600">{message}</p>
    </div>
  );
};

export default LoadingState;