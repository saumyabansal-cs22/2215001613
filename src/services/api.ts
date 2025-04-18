import axios from 'axios';

const BASE_URL = 'http://20.244.56.144/evaluation-service';

// Create an axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
});

// Removed the request interceptor that adds the token to all requests
// as no authentication is required now.



// Get all users
const dummyUsers = {
  "1": "Alice",
  "2": "Bob",
  "3": "Charlie",
  "4": "Diana",
  "5": "Eve"
};

export const getUsers = async () => {
  try {
    const response = await api.get('/users');
    return response.data.users;
  } catch (error) {
    console.error('Error fetching users:', error);
    // Return dummy users on error
    return dummyUsers;
  }
};

// Get posts by user ID
const dummyPosts = {
  "1": [
    { id: 101, userid: "1", content: "Alice's first post" },
    { id: 102, userid: "1", content: "Alice's second post" }
  ],
  "2": [
    { id: 201, userid: "2", content: "Bob's first post" }
  ],
  "3": [
    { id: 301, userid: "3", content: "Charlie's post" }
  ],
  "4": [
    { id: 401, userid: "4", content: "Diana's post" }
  ],
  "5": [
    { id: 501, userid: "5", content: "Eve's post" }
  ]
};

export const getUserPosts = async (userId: string) => {
  try {
    const response = await api.get(`/users/${userId}/posts`);
    return response.data.posts;
  } catch (error) {
    console.error(`Error fetching posts for user ${userId}:`, error);
    // Return dummy posts for user on error
    return dummyPosts[userId as keyof typeof dummyPosts] || [];
  }
};

// Get comments for a post (hypothetical endpoint)
export const getPostComments = async (postId: number) => {
  try {
    const response = await api.get(`/posts/${postId}/comments`);
    return response.data.comments;
  } catch (error) {
    console.error(`Error fetching comments for post ${postId}:`, error);
    throw error;
  }
};

// Check if token needs refresh
export const checkAndRefreshToken = async () => {
  const tokenExpiry = localStorage.getItem('tokenExpiry');
  const currentTime = Math.floor(Date.now() / 1000);
  
  if (tokenExpiry && currentTime > parseInt(tokenExpiry)) {
    // Token expired, needs refresh
    // In a real app, we would call a refresh token endpoint
    // For this demo, we'll just clear it
    localStorage.removeItem('accessToken');
    localStorage.removeItem('tokenExpiry');
    return false;
  }
  
  return true;
};

// Mock function to get a random image - in real app, would use actual user images
export const getRandomUserImage = (userId: string) => {
  return `https://images.pexels.com/photos/${1000 + parseInt(userId) * 13}/pexels-photo-${1000 + parseInt(userId) * 13}.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1`;
};

// Mock function to get a random post image
export const getRandomPostImage = (postId: number) => {
  return `https://images.pexels.com/photos/${5000 + postId * 7}/pexels-photo-${5000 + postId * 7}.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1`;
};

export default api;