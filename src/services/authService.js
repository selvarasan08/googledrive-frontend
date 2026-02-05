import axios from '../utils/axiosConfig';
import emailjs from '@emailjs/browser';

// ✅ EmailJS Configuration - Replace with YOUR actual IDs
const EMAILJS_SERVICE_ID = 'service_22g2r6r'; // Your Service ID from Email Services
const EMAILJS_TEMPLATE_ID_ACTIVATION = 'template_g0na8nd'; // Activation template ID
const EMAILJS_TEMPLATE_ID_RESET = 'template_vu2ual8'; // Password reset template ID
const EMAILJS_PUBLIC_KEY = 'cixd4nyfgjX2Zi3Jp'; // Your Public Key from Account settings

// Register new user
export const register = async (userData) => {
  // Create user in backend
  const response = await axios.post('/auth/register', userData);
  
  if (response.data.success && response.data.activationToken) {
    // Send activation email via EmailJS from frontend
    const activationLink = `${window.location.origin}/activate/${response.data.activationToken}`;
    
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID_ACTIVATION, // ✅ Use activation template
        {
          to_email: userData.email,
          to_name: userData.firstName,
          activation_link: activationLink,
        },
        EMAILJS_PUBLIC_KEY
      );
      console.log('✅ Activation email sent via EmailJS');
    } catch (emailError) {
      console.error('❌ EmailJS error:', emailError);
      // Don't fail registration if email fails
    }
  }
  
  return response.data;
};

// Activate account
export const activateAccount = async (token) => {
  const response = await axios.get(`/auth/activate/${token}`); // ✅ Fixed syntax
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
  
  if (response.data.success && response.data.resetToken) {
    // Send reset email via EmailJS
    const resetLink = `${window.location.origin}/reset-password/${response.data.resetToken}`;
    
    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID_RESET, // ✅ Use password reset template
        {
          to_email: email,
          to_name: response.data.firstName || 'User',
          reset_link: resetLink,
        },
        EMAILJS_PUBLIC_KEY
      );
      console.log('✅ Reset email sent via EmailJS');
    } catch (emailError) {
      console.error('❌ EmailJS error:', emailError);
    }
  }
  
  return response.data;
};

// Reset password
export const resetPassword = async (token, password) => {
  const response = await axios.post(`/auth/reset-password/${token}`, { password }); // ✅ Fixed syntax
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