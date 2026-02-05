import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { resetPassword } from '../../services/authService';
import { FaLock, FaShieldAlt, FaCheckCircle, FaArrowLeft, FaKey, FaEye, FaEyeSlash } from 'react-icons/fa';
import { HiLockClosed, HiShieldCheck } from 'react-icons/hi';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { password, confirmPassword } = formData;

    if (!password || !confirmPassword) {
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
      const response = await resetPassword(token, password);
      if (response.success) {
        toast.success(response.message);
        setSuccess(true);
        setTimeout(() => navigate('/login'), 3000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Password reset failed');
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
          {!success ? (
            <>
              {/* Header with Animated Icon */}
              <div className="text-center mb-8">
                <div className="relative inline-flex items-center justify-center mb-6">
                  {/* Pulsing rings */}
                  <div className="absolute w-24 h-24 rounded-full animate-ping opacity-20" style={{ backgroundColor: '#bfdbfe' }}></div>
                  <div className="absolute w-20 h-20 rounded-full animate-pulse opacity-30" style={{ backgroundColor: '#93c5fd' }}></div>
                  
                  {/* Main icon */}
                  <div className="relative w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg transform transition-transform hover:scale-110 hover:rotate-6" style={{ background: 'linear-gradient(to bottom right, #1d4ed8, #1e40af)' }}>
                    <FaKey className="text-white text-4xl" />
                  </div>
                </div>

                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3" style={{ background: 'linear-gradient(to right, #1d4ed8, #1d4ed8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  Reset Password
                </h2>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-sm mx-auto">
                  Create a strong new password for your account
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
                    New Password
                  </label>
                  <div className="relative group">
                    <HiLockClosed className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400 text-xl transition-colors pointer-events-none" 
                      style={{ color: formData.password ? '#1d4ed8' : undefined }}
                    />
                    <input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter new password"
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

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">
                    Confirm New Password
                  </label>
                  <div className="relative group">
                    <HiShieldCheck className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400 text-xl transition-colors pointer-events-none" 
                      style={{ color: formData.confirmPassword ? '#1d4ed8' : undefined }}
                    />
                    <input
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm new password"
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
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
                      <span>Resetting...</span>
                    </>
                  ) : (
                    <>
                      <FaLock className="text-lg" />
                      <span>Reset Password</span>
                    </>
                  )}
                </button>
              </form>

              {/* Back to Login */}
              <div className="mt-6 text-center">
                <Link 
                  to="/login" 
                  className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors group"
                  onMouseEnter={(e) => e.currentTarget.style.color = '#1d4ed8'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#4b5563'}
                >
                  <FaArrowLeft className="text-xs group-hover:-translate-x-1 transition-transform" />
                  <span>Back to Sign In</span>
                </Link>
              </div>

              {/* Password Requirements */}
              <div className="mt-8 bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-5 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm">Password Requirements:</h4>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <p className="text-xs text-gray-700">At least 6 characters long</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <p className="text-xs text-gray-700">Mix of letters and numbers recommended</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <p className="text-xs text-gray-700">Avoid common passwords</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center animate-fade-in">
              {/* Success Animation */}
              <div className="relative inline-flex items-center justify-center mb-6">
                {/* Animated rings */}
                <div className="absolute w-32 h-32 border-4 border-green-200 rounded-full animate-ping opacity-20"></div>
                <div className="absolute w-28 h-28 border-4 border-green-300 rounded-full animate-pulse opacity-30"></div>
                
                {/* Check icon */}
                <div className="relative w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl">
                  <FaCheckCircle className="text-white text-5xl animate-bounce-slow" />
                </div>
              </div>

              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Password Reset Successful!
              </h3>
              <p className="text-gray-600 mb-8 text-sm md:text-base">
                Your password has been successfully reset.<br />
                Redirecting you to sign in...
              </p>

              {/* Success Message Card */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 mb-6 border-2 border-green-200">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <FaShieldAlt className="text-green-600 text-2xl" />
                  <h4 className="font-semibold text-gray-900">Your account is secure</h4>
                </div>
                <p className="text-sm text-gray-700">
                  You can now sign in with your new password
                </p>
              </div>

              {/* Manual Button */}
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                style={{ background: '#1d4ed8' }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#1e40af'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#1d4ed8'}
              >
                <FaArrowLeft />
                <span>Go to Sign In</span>
              </Link>
            </div>
          )}
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
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ResetPassword;