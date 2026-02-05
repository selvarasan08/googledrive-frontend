import axios from 'axios';

// Create axios instance with backend URL
const api = axios.create({
  baseURL: 'https://googledrive-backend-17kt.onrender.com/',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 60000, // 60 seconds for cold starts
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Retry logic for cold starts (but NOT for validation errors like 400)
const retryRequest = async (fn, retries = 2) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      // Don't retry on 400 errors (validation errors)
      if (error.response && error.response.status === 400) {
        throw error;
      }
      
      // If it's a timeout and we have retries left, try again
      if (error.code === 'ECONNABORTED' && i < retries - 1) {
        console.log(`Request timeout, retrying... (${i + 1}/${retries})`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        continue;
      }
      throw error;
    }
  }
};

// Wake up the server
export const wakeUpServer = async () => {
  try {
    console.log('Waking up server...');
    await axios.get('https://googledrive-backend-17kt.onrender.com/health', {
      timeout: 60000
    });
    console.log('Server is awake!');
    return true;
  } catch (error) {
    console.log('Server wake-up attempt completed');
    return false;
  }
};

// Register new user
export const register = async (userData) => {
  try {
    // First, try to wake up the server
    await wakeUpServer();
    
    // Log what we're sending
    console.log('Registering with data:', {
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      hasPassword: !!userData.password
    });
    
    // Then make the actual request with retry logic
    const response = await retryRequest(async () => {
      return await api.post('/auth/register', userData);
    });
    
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    console.error('Error response:', error.response?.data);
    
    // Provide better error messages
    if (error.code === 'ECONNABORTED') {
      const err = new Error('Server is taking too long to respond. Please try again in a moment.');
      err.response = error.response;
      throw err;
    }
    
    // Pass through the error with response data
    if (error.response?.data) {
      const err = new Error(error.response.data.message || 'Registration failed');
      err.response = error.response;
      throw err;
    }
    
    throw error;
  }
};

// Activate account
export const activateAccount = async (token) => {
  try {
    const response = await retryRequest(async () => {
      return await api.get(`/auth/activate/${token}`);
    });
    return response.data;
  } catch (error) {
    console.error('Activation error:', error);
    console.error('Error response:', error.response?.data);
    
    if (error.code === 'ECONNABORTED') {
      const err = new Error('Server is taking too long to respond. Please try again.');
      err.response = error.response;
      throw err;
    }
    
    throw error;
  }
};

// Login user
export const login = async (credentials) => {
  try {
    // Wake up server before login
    await wakeUpServer();
    
    const response = await retryRequest(async () => {
      return await api.post('/auth/login', credentials);
    });
    
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    console.error('Error response:', error.response?.data);
    
    if (error.code === 'ECONNABORTED') {
      const err = new Error('Server is taking too long to respond. Please try again.');
      err.response = error.response;
      throw err;
    }
    
    throw error;
  }
};

// Logout user
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Forgot password
export const forgotPassword = async (email) => {
  try {
    const response = await retryRequest(async () => {
      return await api.post('/auth/forgot-password', { email });
    });
    return response.data;
  } catch (error) {
    console.error('Forgot password error:', error);
    console.error('Error response:', error.response?.data);
    
    if (error.code === 'ECONNABORTED') {
      const err = new Error('Server is taking too long to respond. Please try again.');
      err.response = error.response;
      throw err;
    }
    
    throw error;
  }
};

// Reset password
export const resetPassword = async (token, password) => {
  try {
    const response = await retryRequest(async () => {
      return await api.post(`/auth/reset-password/${token}`, { password });
    });
    return response.data;
  } catch (error) {
    console.error('Reset password error:', error);
    console.error('Error response:', error.response?.data);
    
    if (error.code === 'ECONNABORTED') {
      const err = new Error('Server is taking too long to respond. Please try again.');
      err.response = error.response;
      throw err;
    }
    
    throw error;
  }
};

// Verify token
export const verifyToken = async () => {
  try {
    const response = await api.get('/auth/verify');
    return response.data;
  } catch (error) {
    console.error('Verify token error:', error);
    throw error;
  }
};

// Get current user from localStorage
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};