import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { register } from '../../services/authService';
import { FaUser, FaEye, FaEyeSlash, FaUserPlus } from 'react-icons/fa';
import { HiMail, HiLockClosed, HiShieldCheck } from 'react-icons/hi';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstName, lastName, email, password, confirmPassword } = formData;

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const response = await register({ firstName, lastName, email, password });
      if (response.success) {
        toast.success(response.message);
        setTimeout(() => navigate('/login'), 1500);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-12 relative overflow-hidden">
      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-30 blur-3xl animate-blob" style={{ background: 'linear-gradient(to bottom right, #dbeafe, #93c5fd)' }}></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full opacity-30 blur-3xl animation-delay-2000" style={{ background: 'linear-gradient(to bottom right, #bfdbfe, #60a5fa)' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full opacity-20 blur-3xl animation-delay-4000" style={{ background: 'linear-gradient(to bottom right, #dbeafe, #93c5fd)' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white border border-gray-200 rounded-3xl shadow-2xl p-8 md:p-10 transform transition-all duration-500 hover:shadow-3xl">
          {/* Header with Animated Icon */}
          <div className="text-center mb-8">
            <div className="relative inline-flex items-center justify-center mb-6">
              {/* Pulsing rings */}
              <div className="absolute w-24 h-24 rounded-full animate-ping opacity-20" style={{ backgroundColor: '#bfdbfe' }}></div>
              <div className="absolute w-20 h-20 rounded-full animate-pulse opacity-30" style={{ backgroundColor: '#93c5fd' }}></div>
              
              {/* Main icon */}
              <div className="relative w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg transform transition-transform hover:scale-110 hover:rotate-6" style={{ background: 'linear-gradient(to bottom right, #1d4ed8, #1e40af)' }}>
                <FaUserPlus className="text-white text-4xl" />
              </div>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3" style={{ background: 'linear-gradient(to right, #1d4ed8, #1d4ed8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Create Account
            </h2>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-sm mx-auto">
              Join us today and start managing your files securely
            </p>
          </div>

      

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
                  First Name
                </label>
                <div className="relative group">
                  <FaUser className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400 text-lg transition-colors pointer-events-none" 
                    style={{ color: formData.firstName ? '#1d4ed8' : undefined }}
                  />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First Name"
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl outline-none transition-all duration-200 text-gray-900 placeholder:text-gray-400"
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#1d4ed8';
                      e.currentTarget.style.boxShadow = '0 0 0 4px rgba(29, 78, 216, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#e5e7eb';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
                  Last Name
                </label>
                <div className="relative group">
                  <FaUser className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400 text-lg transition-colors pointer-events-none" 
                    style={{ color: formData.lastName ? '#1d4ed8' : undefined }}
                  />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                    className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl outline-none transition-all duration-200 text-gray-900 placeholder:text-gray-400"
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#1d4ed8';
                      e.currentTarget.style.boxShadow = '0 0 0 4px rgba(29, 78, 216, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#e5e7eb';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <HiMail className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400 text-xl transition-colors pointer-events-none" 
                  style={{ color: formData.email ? '#1d4ed8' : undefined }}
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl outline-none transition-all duration-200 text-gray-900 placeholder:text-gray-400"
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#1d4ed8';
                    e.currentTarget.style.boxShadow = '0 0 0 4px rgba(29, 78, 216, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
                Password
              </label>
              <div className="relative group">
                <HiLockClosed className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400 text-xl transition-colors pointer-events-none" 
                  style={{ color: formData.password ? '#1d4ed8' : undefined }}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-xl outline-none transition-all duration-200 text-gray-900 placeholder:text-gray-400"
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#1d4ed8';
                    e.currentTarget.style.boxShadow = '0 0 0 4px rgba(29, 78, 216, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <FaEyeSlash className="text-lg" /> : <FaEye className="text-lg" />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1.5 ml-1">Must be at least 6 characters</p>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
                Confirm Password
              </label>
              <div className="relative group">
                <HiShieldCheck className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400 text-xl transition-colors pointer-events-none" 
                  style={{ color: formData.confirmPassword ? '#1d4ed8' : undefined }}
                />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-xl outline-none transition-all duration-200 text-gray-900 placeholder:text-gray-400"
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#1d4ed8';
                    e.currentTarget.style.boxShadow = '0 0 0 4px rgba(29, 78, 216, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? <FaEyeSlash className="text-lg" /> : <FaEye className="text-lg" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2 mt-6"
              style={{ background: loading ? '#1d4ed8' : '#1d4ed8' }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.background = '#1e40af')}
              onMouseLeave={(e) => !loading && (e.currentTarget.style.background = '#1d4ed8')}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <FaUserPlus className="text-lg" />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <span className="text-sm text-gray-600">Already have an account? </span>
            <Link 
              to="/login" 
              className="text-sm font-semibold underline underline-offset-2"
              style={{ color: '#1d4ed8' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#1e40af'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#1d4ed8'}
            >
              Sign in
            </Link>
          </div>

          {/* Features */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <div className="text-2xl mb-1">🔒</div>
                <p className="text-xs text-gray-600 font-medium">Encrypted</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1">☁️</div>
                <p className="text-xs text-gray-600 font-medium">Cloud Storage</p>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-1">⚡</div>
                <p className="text-xs text-gray-600 font-medium">Fast Access</p>
              </div>
            </div>
          </div>
        </div>

       
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(20px, -20px) scale(1.1);
          }
          50% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          75% {
            transform: translate(20px, 20px) scale(1.05);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Register;