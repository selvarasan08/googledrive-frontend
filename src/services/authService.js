import axios from '../utils/axiosConfig';
import emailjs from '@emailjs/browser';

// ✅ EmailJS Configuration - Replace with YOUR actual IDs
const EMAILJS_SERVICE_ID = 'service_22g2r6r'; // Your Service ID from Email Services
const EMAILJS_TEMPLATE_ID_ACTIVATION = 'template_g0na8nd'; // Activation template ID
const EMAILJS_TEMPLATE_ID_RESET = 'template_vu2ual8'; // Password reset template ID
const EMAILJS_PUBLIC_KEY = 'cixd4nyfgjX2Zi3Jp'; // Your Public Key from Account settings

/**
 * Register new user and send activation email
 */
export const register = async (userData) => {
  try {
    // Create user in backend
    const response = await axios.post('/auth/register', userData);
    
    if (response.data.success && response.data.activationToken) {
      // Send activation email via EmailJS from frontend
      const activationLink = `${window.location.origin}/activate/${response.data.activationToken}`;
      
      try {
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID_ACTIVATION,
          {
            to_email: userData.email,
            to_name: userData.firstName,
            activation_link: activationLink,
          },
          EMAILJS_PUBLIC_KEY
        );
        console.log('✅ Activation email sent via EmailJS');
      } catch (emailError) {
        console.error('❌ EmailJS activation email error:', emailError);
        // Don't fail registration if email fails - user can request resend
      }
    }
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Activate account using token
 */
export const activateAccount = async (token) => {
  try {
    const response = await axios.get(`/auth/activate/${token}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Login user
 */
export const login = async (credentials) => {
  try {
    const response = await axios.post('/auth/login', credentials);
    if (response.data.success) {
      localStorage.setItem('token', response.data.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.data.user));
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Logout user
 */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

/**
 * Forgot password - request reset link
 */
export const forgotPassword = async (email) => {
  try {
    const response = await axios.post('/auth/forgot-password', { email });
    
    if (response.data.success && response.data.resetToken) {
      // Send reset email via EmailJS
      const resetLink = `${window.location.origin}/reset-password/${response.data.resetToken}`;
      
      try {
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID_RESET,
          {
            to_email: email,
            to_name: response.data.firstName || 'User',
            reset_link: resetLink,
          },
          EMAILJS_PUBLIC_KEY
        );
        console.log('✅ Reset email sent via EmailJS');
      } catch (emailError) {
        console.error('❌ EmailJS reset email error:', emailError);
        // Don't fail the request if email fails
      }
    }
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Reset password using token
 */
export const resetPassword = async (token, password) => {
  try {
    const response = await axios.post(`/auth/reset-password/${token}`, { password });
    
    // Password reset successful - no confirmation email needed
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Verify JWT token
 */
export const verifyToken = async () => {
  try {
    const response = await axios.get('/auth/verify');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get current user from localStorage
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};