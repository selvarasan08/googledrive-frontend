import axios from '../utils/axiosConfig';

// Register new user
export const register = async (userData) => {
  const response = await axios.post('/auth/register', userData);
  return response.data;
};

// Activate account
export const activateAccount = async (token) => {
  const response = await axios.get(`/auth/activate/${token}`);
  return response.data;
};

// Login user
export const login = async (credentials) => {
  const response = await axios.post('/auth/login', credentials);
  if (response.data.success) {
    localStorage.setItem('token', response.data.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.data.user));
  }
  return response.data;
};

// Logout user
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Forgot password
export const forgotPassword = async (email) => {
  const response = await axios.post('/auth/forgot-password', { email });
  return response.data;
};

// Reset password
export const resetPassword = async (token, password) => {
  const response = await axios.post(`/auth/reset-password/${token}`, { password });
  return response.data;
};

// Verify token
export const verifyToken = async () => {
  const response = await axios.get('/auth/verify');
  return response.data;
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