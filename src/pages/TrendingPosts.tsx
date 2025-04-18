import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { getUsers, getUserPosts } from '../services/api';
import PostCard from '../components/PostCard';
import LoadingState from '../components/LoadingState';
import EmptyState from '../components/EmptyState';

interface PostWithCommentsAndUser {
  post: {
    id: number;
    userid: string;
    content: string;
  };
  userName: string;
  commentCount: number;
}

const TrendingPosts: React.FC = () => {
  const [trendingPosts, setTrendingPosts] = useState<PostWithCommentsAndUser[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);

  // Fetch all users
  const { data: users, isLoading: isLoadingUsers, error: usersError } = useQuery(
    'users',
    getUsers
  );

  // Effect to process user data and find trending posts
  useEffect(() => {
    const calculateTrendingPosts = async () => {
      if (!users) return;
      
      setIsCalculating(true);
      
      try {
        // Store all posts with their comment counts
        const allPosts: PostWithCommentsAndUser[] = [];
        
        // Loop through each user and fetch their posts
        for (const [userId, userName] of Object.entries(users)) {
          try {
            // Fetch posts for this user
            const posts = await getUserPosts(userId);
            
            if (posts && Array.isArray(posts)) {
              // Process each post
              for (const post of posts) {
                // Simulate comment count
                const commentCount = (post.id % 20) + Math.floor(Math.random() * 50);
                
                allPosts.push({
                  post,
                  userName: userName as string,
                  commentCount
                });
              }
            }
          } catch (error) {
            console.error(`Error processing posts for user ${userId}:`, error);
          }
        }
        
        // Sort all posts by comment count (descending)
        allPosts.sort((a, b) => b.commentCount - a.commentCount);
        
        // Find maximum comment count
        if (allPosts.length > 0) {
          const maxComments = allPosts[0].commentCount;
          
          // Get all posts with the maximum comment count
          const maxCommentPosts = allPosts.filter(post => post.commentCount === maxComments);
          
          // Take the top trending posts (all with maximum comments)
          setTrendingPosts(maxCommentPosts);
        }
      } catch (error) {
        console.error('Error calculating trending posts:', error);
      } finally {
        setIsCalculating(false);
      }
    };
    
    if (users) {
      calculateTrendingPosts();
    }
  }, [users]);

  if (isLoadingUsers || isCalculating) {
    return <LoadingState message="Finding trending posts..." />;
  }

  if (usersError) {
    return (
      <EmptyState 
        message="Error loading posts" 
        subMessage="There was an error fetching the post data. Please try again later." 
      />
    );
  }

  if (!trendingPosts.length) {
    return (
      <EmptyState 
        message="No trending posts available" 
        subMessage="We couldn't find any posts with comments." 
      />
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Trending Posts</h1>
        <p className="text-gray-600">Posts with the most comments</p>
      </div>
      
      <div className="space-y-6">
        {trendingPosts.map((item, index) => (
          <PostCard
            key={item.post.id}
            post={item.post}
            userName={item.userName}
            commentCount={item.commentCount}
            isTrending={true}
            rank={index + 1}
          />
        ))}
      </div>
    </div>
  );
};

export default TrendingPosts;