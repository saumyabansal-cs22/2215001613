import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { getUsers, getUserPosts } from '../services/api';
import PostCard from '../components/PostCard';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';
import { RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

interface PostWithCommentsAndUser {
  post: {
    id: number;
    userid: string;
    content: string;
  };
  userName: string;
  commentCount: number;
  timestamp: number; // For sorting by newest
}

const Feed: React.FC = () => {
  const [feed, setFeed] = useState<PostWithCommentsAndUser[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  // const refreshTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch all users
  const { data: users, isLoading: isLoadingUsers, error: usersError } = useQuery(
    'users',
    getUsers
  );

  // Function to process posts and create feed
  const processFeed = async () => {
    if (!users) return;
    
    setIsCalculating(true);
    
    try {
      // Store all posts with their comment counts and usernames
      const allPosts: PostWithCommentsAndUser[] = [];
      
      // Process a random subset of users for better performance
      // In a real app, you'd use pagination or server-side filtering
      const userIds = Object.keys(users);
      const selectedUserIds = userIds.sort(() => 0.5 - Math.random()).slice(0, 5);
      
      for (const userId of selectedUserIds) {
        try {
          // Fetch posts for this user
          const posts = await getUserPosts(userId);
          
          if (posts && Array.isArray(posts)) {
            // Process each post
            for (const post of posts) {
              // Simulate comment count
              const commentCount = (post.id % 15) + Math.floor(Math.random() * 30);
              
              allPosts.push({
                post,
                userName: users[userId] as string,
                commentCount,
                timestamp: Date.now() - Math.floor(Math.random() * 86400000) // Random time in last 24h
              });
            }
          }
        } catch (error) {
          console.error(`Error processing posts for user ${userId}:`, error);
        }
      }
      
      // Sort posts by timestamp (newest first)
      allPosts.sort((a, b) => b.timestamp - a.timestamp);
      
      // Update feed with new posts
      setFeed(prevFeed => {
        // Combine with existing feed, removing duplicates
        const combinedFeed = [...allPosts, ...prevFeed];
        const uniqueFeed = Array.from(
          new Map(combinedFeed.map(item => [item.post.id, item])).values()
        );
        
        // Resort by timestamp and return
        return uniqueFeed.sort((a, b) => b.timestamp - a.timestamp);
      });
    } catch (error) {
      console.error('Error calculating feed:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  // Initial feed generation
  useEffect(() => {
    if (users) {
      processFeed();
    }
    
    // Setup periodic refresh
    // refreshTimeoutRef.current = setInterval(() => {
    //   if (users) {
    //     setIsRefreshing(true);
    //     processFeed().then(() => {
    //       setTimeout(() => setIsRefreshing(false), 500);
    //     });
    //   }
    // }, 30000); // Refresh every 30 seconds
    
    return () => {
      // if (refreshTimeoutRef.current) {
      //   clearInterval(refreshTimeoutRef.current);
      // }
    };
  }, [users]);

  // Manual refresh handler
  const handleRefresh = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    await processFeed();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  if (isLoadingUsers && !feed.length) {
    return <LoadingState message="Loading feed..." />;
  }

  if (usersError) {
    return (
      <EmptyState 
        message="Error loading feed" 
        subMessage="There was an error fetching the feed data. Please try again later." 
      />
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Feed</h1>
          <p className="text-gray-600">Latest posts from your network</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className={`p-2 rounded-full ${
            isRefreshing 
              ? 'bg-indigo-100 text-indigo-400' 
              : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
          } transition-colors`}
        >
          <RefreshCw 
            className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} 
          />
        </button>
      </div>
      
      {isRefreshing && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-md mb-4 text-sm flex items-center"
        >
          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          Refreshing feed...
        </motion.div>
      )}
      
      {feed.length === 0 && !isCalculating ? (
        <EmptyState 
          message="Your feed is empty" 
          subMessage="There are no posts to display right now." 
        />
      ) : (
        <div className="space-y-6">
          {feed.map((item) => (
            <PostCard
              key={item.post.id}
              post={item.post}
              userName={item.userName}
              commentCount={item.commentCount}
            />
          ))}
        </div>
      )}
      
      {isCalculating && feed.length > 0 && (
        <div className="py-4 flex justify-center">
          <LoadingState message="Loading more posts..." />
        </div>
      )}
    </div>
  );
};

export default Feed;