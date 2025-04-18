import React from 'react';
import { User } from 'lucide-react';
import { motion } from 'framer-motion';
import { getRandomUserImage } from '../services/api';

interface UserCardProps {
  userId: string;
  userName: string;
  commentCount: number;
  rank: number;
}

const UserCard: React.FC<UserCardProps> = ({ userId, userName, commentCount, rank }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: rank * 0.1 }}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <div className="flex items-center p-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
            <img
              src={getRandomUserImage(userId)}
              alt={userName}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://images.pexels.com/photos/1722198/pexels-photo-1722198.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1';
              }}
            />
          </div>
          <div className="absolute -top-1 -left-1 w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm border-2 border-white">
            {rank}
          </div>
        </div>
        <div className="ml-4 flex-grow">
          <h3 className="text-lg font-semibold text-gray-800">{userName}</h3>
          <div className="flex items-center text-gray-500 text-sm">
            <User className="w-4 h-4 mr-1" />
            <span>ID: {userId}</span>
          </div>
        </div>
        <div className="flex flex-col items-center bg-indigo-50 p-3 rounded-lg">
          <span className="text-2xl font-bold text-indigo-600">{commentCount}</span>
          <span className="text-xs text-indigo-500">Comments</span>
        </div>
      </div>
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2"></div>
    </motion.div>
  );
};

export default UserCard;