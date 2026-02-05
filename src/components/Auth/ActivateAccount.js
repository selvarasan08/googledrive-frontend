import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { activateAccount } from '../../services/authService';
import { FaCheckCircle, FaTimesCircle, FaShieldAlt, FaArrowLeft, FaUserCheck } from 'react-icons/fa';
import { HiMail } from 'react-icons/hi';

const ActivateAccount = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const activate = async () => {
      try {
        const response = await activateAccount(token);
        
        // Check for success in response
        if (response && response.success) {
          setStatus('success');
          setMessage(response.message || 'Your account has been successfully activated!');
        } else {
          // Handle unexpected response format
          setStatus('error');
          setMessage(response?.message || 'Activation failed. Please try again.');
        }
      } catch (error) {
        console.error('Activation error:', error);
        
        // Handle different error scenarios
        if (error.response) {
          // Server responded with error status
          const errorMessage = error.response.data?.message || 'Activation failed';
          
          // Check if already activated (treat as success)
          if (errorMessage.includes('already activated')) {
            setStatus('success');
            setMessage('Your account is already activated!');
          } else {
            setStatus('error');
            setMessage(errorMessage);
          }
        } else if (error.request) {
          // Request made but no response
          setStatus('error');
          setMessage('Unable to connect to server. Please check your internet connection.');
        } else {
          // Something else happened
          setStatus('error');
          setMessage('An unexpected error occurred. Please try again.');
        }
      }
    };

    if (token) {
      activate();
    } else {
      setStatus('error');
      setMessage('No activation token provided');
    }
  }, [token]);

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
          
          {/* Loading State */}
          {status === 'loading' && (
            <div className="text-center">
              {/* Header with Animated Icon */}
              <div className="relative inline-flex items-center justify-center mb-6">
                {/* Pulsing rings */}
                <div className="absolute w-24 h-24 rounded-full animate-ping opacity-20" style={{ backgroundColor: '#bfdbfe' }}></div>
                <div className="absolute w-20 h-20 rounded-full animate-pulse opacity-30" style={{ backgroundColor: '#93c5fd' }}></div>
                
                {/* Main icon */}
                <div className="relative w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(to bottom right, #1d4ed8, #1e40af)' }}>
                  <HiMail className="text-white text-4xl animate-pulse" />
                </div>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3" style={{ background: 'linear-gradient(to right, #1d4ed8, #1d4ed8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Account Activation
              </h2>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-8">
                Activating your account, please wait...
              </p>

              {/* Spinner */}
              <div className="flex justify-center mb-6">
                <svg className="animate-spin h-12 w-12" style={{ color: '#1d4ed8' }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-5 border border-gray-200">
                <p className="text-sm text-gray-700">
                  🔐 Verifying your account credentials
                </p>
              </div>
            </div>
          )}

          {/* Success State */}
          {status === 'success' && (
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
                Activation Successful!
              </h3>
              <p className="text-gray-600 mb-4 text-sm md:text-base">
                {message}
              </p>

              {/* Success Badge */}
              <div className="inline-flex items-center gap-2 px-5 py-3 mb-8 rounded-xl" style={{ background: 'linear-gradient(to right, #d1fae5, #a7f3d0)', border: '2px solid #6ee7b7' }}>
                <FaUserCheck className="text-xl" style={{ color: '#059669' }} />
                <strong className="text-gray-900 text-sm md:text-base">Account Verified</strong>
              </div>

              {/* Success Message Card */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 mb-6 border-2 border-green-200">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <FaShieldAlt className="text-green-600 text-2xl" />
                  <h4 className="font-semibold text-gray-900">Ready to Go!</h4>
                </div>
                <p className="text-sm text-gray-700">
                  You can now sign in and start using Cloud Drive
                </p>
              </div>

              {/* Sign In Button */}
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 mb-4 w-full"
                style={{ background: '#1d4ed8' }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#1e40af'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#1d4ed8'}
              >
                <FaArrowLeft />
                <span>Sign In Now</span>
              </Link>

              {/* Info Cards */}
              <div className="mt-6 grid grid-cols-3 gap-3">
                <div className="text-center p-3 rounded-xl border transform transition-transform hover:scale-105" style={{ background: 'linear-gradient(to bottom right, #dbeafe, #bfdbfe)', borderColor: '#93c5fd' }}>
                  <div className="text-2xl mb-1">✓</div>
                  <p className="text-xs font-medium text-gray-700">Verified</p>
                </div>
                <div className="text-center p-3 rounded-xl border transform transition-transform hover:scale-105" style={{ background: 'linear-gradient(to bottom right, #dbeafe, #bfdbfe)', borderColor: '#93c5fd' }}>
                  <div className="text-2xl mb-1">🔐</div>
                  <p className="text-xs font-medium text-gray-700">Secure</p>
                </div>
                <div className="text-center p-3 rounded-xl border transform transition-transform hover:scale-105" style={{ background: 'linear-gradient(to bottom right, #dbeafe, #bfdbfe)', borderColor: '#93c5fd' }}>
                  <div className="text-2xl mb-1">🚀</div>
                  <p className="text-xs font-medium text-gray-700">Active</p>
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {status === 'error' && (
            <div className="text-center animate-fade-in">
              {/* Error Animation */}
              <div className="relative inline-flex items-center justify-center mb-6">
                {/* Animated rings */}
                <div className="absolute w-32 h-32 border-4 border-red-200 rounded-full animate-ping opacity-20"></div>
                <div className="absolute w-28 h-28 border-4 border-red-300 rounded-full animate-pulse opacity-30"></div>
                
                {/* Error icon */}
                <div className="relative w-24 h-24 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center shadow-2xl">
                  <FaTimesCircle className="text-white text-5xl animate-bounce-slow" />
                </div>
              </div>

              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                Activation Failed
              </h3>
              <p className="text-gray-600 mb-8 text-sm md:text-base">
                {message}
              </p>

              {/* Error Message Card */}
              <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-6 mb-6 border-2 border-red-200">
                <h4 className="font-semibold text-gray-900 mb-3">Possible Reasons:</h4>
                <div className="space-y-2 text-left">
                  <div className="flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">•</span>
                    <p className="text-sm text-gray-700">Activation link has expired</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">•</span>
                    <p className="text-sm text-gray-700">Link has already been used</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">•</span>
                    <p className="text-sm text-gray-700">Invalid activation token</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">•</span>
                    <p className="text-sm text-gray-700">Server connection issue</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 w-full"
                  style={{ background: '#1d4ed8' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#1e40af'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#1d4ed8'}
                >
                  <span>Register Again</span>
                </Link>

                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 font-semibold rounded-xl transition-all duration-300 w-full border-2"
                  style={{ borderColor: '#1d4ed8', color: '#1d4ed8' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#1d4ed8';
                    e.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#1d4ed8';
                  }}
                >
                  <FaArrowLeft />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Help Text */}
        <p className="text-center text-xs text-gray-500 mt-6">
          Need help? Contact{' '}
          <a 
            href="mailto:support@clouddrive.com" 
            className="hover:underline font-medium"
            style={{ color: '#1d4ed8' }}
          >
            support@clouddrive.com
          </a>
        </p>
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

export default ActivateAccount;