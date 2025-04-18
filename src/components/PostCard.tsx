import React, { useState } from 'react';
import { MessageSquare, Heart, Share2, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getRandomPostImage, getRandomUserImage } from '../services/api';

interface PostCardProps {
  post: {
    id: number;
    userid: string;
    content: string;
  };
  userName: string;
  commentCount: number;
  isTrending?: boolean;
  rank?: number;
}

const PostCard: React.FC<PostCardProps> = ({ 
  post, 
  userName, 
  commentCount, 
  isTrending = false,
  rank
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  
  // Determine if content should be truncated
  const shouldTruncate = post.content.length > 150;
  const displayContent = shouldTruncate && !isExpanded 
    ? post.content.substring(0, 150) + '...' 
    : post.content;

  // Fake time ago (would be calculated from actual timestamp in real app)
  const timeAgo = `${Math.floor(Math.random() * 24)}h ago`;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: rank ? rank * 0.1 : 0 }}
      className={`bg-white rounded-lg shadow-md overflow-hidden ${
        isTrending ? 'border-2 border-yellow-400' : ''
      }`}
    >
      {isTrending && (
        <div className="bg-yellow-400 text-yellow-800 px-4 py-1 text-sm font-semibold">
          🔥 Trending
        </div>
      )}
      
      <div className="p-4">
        {/* User info */}
        <div className="flex items-center mb-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
            <img
              src={getRandomUserImage(post.userid)}
              alt={userName}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://images.pexels.com/photos/1722198/pexels-photo-1722198.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1';
              }}
            />
          </div>
          <div className="ml-3">
            <h3 className="text-base font-semibold text-gray-800">{userName}</h3>
            <p className="text-xs text-gray-500">{timeAgo}</p>
          </div>
        </div>
        
        {/* Post content */}
        <p className="text-gray-700 mb-3">{displayContent}</p>
        
        {/* Read more button */}
        {shouldTruncate && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center mb-3"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4 mr-1" /> Show less
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4 mr-1" /> Read more
              </>
            )}
          </button>
        )}
        
        {/* Post image */}
        <div className="rounded-lg overflow-hidden bg-gray-100 mb-3">
          <img
            src={getRandomPostImage(post.id)}
            alt="Post content"
            className="w-full h-48 object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1';
            }}
          />
        </div>
        
        {/* Engagement stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <div className="flex items-center">
            <Heart className={`w-4 h-4 mr-1 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
            <span>{Math.floor(Math.random() * 50) + 5} likes</span>
          </div>
          <div className="flex items-center">
            <MessageSquare className="w-4 h-4 mr-1" />
            <span>{commentCount} comments</span>
          </div>
          <div className="flex items-center">
            <Share2 className="w-4 h-4 mr-1" />
            <span>{Math.floor(Math.random() * 10)} shares</span>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex border-t pt-3">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`flex-1 flex items-center justify-center py-2 rounded-md transition-colors ${
              isLiked 
                ? 'text-red-500 bg-red-50' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Heart className={`w-5 h-5 mr-2 ${isLiked ? 'fill-red-500' : ''}`} />
            Like
          </button>
          <button className="flex-1 flex items-center justify-center py-2 text-gray-600 rounded-md hover:bg-gray-100 transition-colors">
            <MessageSquare className="w-5 h-5 mr-2" />
            Comment
          </button>
          <button className="flex-1 flex items-center justify-center py-2 text-gray-600 rounded-md hover:bg-gray-100 transition-colors">
            <Share2 className="w-5 h-5 mr-2" />
            Share
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PostCard;