import { useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleSignInButton } from '../../components/GoogleSignInButton';
import PhoneModal from '../../components/PhoneModal';
import EmailVerification from '../../components/EmailVerification';
import { authAPI } from '../../api/api';

// Google Client ID - Replace with your actual client ID
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  phone: string;
}

const Register = (): JSX.Element => {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    phone: ''
  });
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [googleLoading, setGoogleLoading] = useState<boolean>(false);
  const [showPhoneModal, setShowPhoneModal] = useState<boolean>(false);
  const [phoneLoading, setPhoneLoading] = useState<boolean>(false);
  const [showEmailVerification, setShowEmailVerification] = useState<boolean>(false);
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false);
  const { register, googleAuth, updatePhone } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');
    
    // First, send OTP to verify email
    try {
      const response = await authAPI.sendOtp({ 
        email: formData.email,
        name: formData.name 
      });

      if (response.data.success) {
        setShowEmailVerification(true);
      } else {
        setError(response.data.message || 'Failed to send OTP. Please try again.');
      }
    } catch (err: any) {
      setError('Failed to send OTP. Please try again.');
    }
  };

  const handleEmailVerified = async (): Promise<void> => {
    setIsEmailVerified(true);
    setShowEmailVerification(false);
    
    // Now register the user
    try {
      const response = await authAPI.registerWithVerifiedEmail(formData);
      const data = response.data;
      
      // Save auth data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({
        id: data.userId,
        name: data.name,
        email: data.email,
        role: data.role,
        storeId: data.storeId,
        phone: data.phone
      }));

      navigate('/medicines');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
      setIsEmailVerified(false);
    }
  };

  const handleResendOtp = async (): Promise<void> => {
    try {
      const response = await authAPI.sendOtp({ 
        email: formData.email,
        name: formData.name 
      });

      if (!response.data.success) {
        setError(response.data.message || 'Failed to resend OTP');
      }
    } catch (err) {
      setError('Failed to resend OTP');
    }
  };

  const handleBackToRegister = (): void => {
    setShowEmailVerification(false);
    setError('');
  };

  const handleGoogleError = () => {
    setError('Google sign-up failed. Please try again.');
    setGoogleLoading(false);
  };

  const handlePhoneSubmit = async (phone: string, password: string) => {
    setPhoneLoading(true);
    try {
      const result = await updatePhone(phone, password);
      if (result.success) {
        setShowPhoneModal(false);
        navigate('/medicines');
      } else {
        setError(result.error || 'Failed to save phone number');
      }
    } catch (err) {
      setError('Failed to save phone number');
    } finally {
      setPhoneLoading(false);
    }
  };

  const handlePhoneModalClose = () => {
    setShowPhoneModal(false);
    // Navigate anyway, user can add phone later
    navigate('/medicines');
  };

  // Google Sign-Up handler
  const handleGoogleSignUp = async (credential: string) => {
    setGoogleLoading(true);
    setError('');
    
    try {
      const result = await googleAuth(credential);
      if (result.success) {
        if (result.phoneRequired) {
          // Show phone modal if phone is required
          setShowPhoneModal(true);
        } else {
          navigate('/medicines');
        }
      } else {
        setError(result.error || 'Google sign-up failed');
      }
    } catch (err: any) {
      setError('Google sign-up failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="min-h-screen flex">
      {/* Left Side - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="max-w-md w-full">
          {!showEmailVerification ? (
            <>
          <Link to="/login-user" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Login
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <div className="mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-200">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">Create Account</h1>
              <p className="text-gray-600 text-lg">Join MediMitra for better healthcare</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-red-500 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                  <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                  <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                <div className="relative">
                  <input
                    type="tel"
                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="+91-9876543210"
                    value={formData.phone}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                  <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full px-4 py-3 pl-12 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                  <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl">
                Create Account
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-sm text-gray-500">or</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Google Sign Up */}
            <GoogleSignInButton
              onSuccess={handleGoogleSignUp}
              onError={handleGoogleError}
              text="signup_with"
              disabled={googleLoading}
            />

            {/* Login Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link to="/login-user" className="text-blue-600 hover:text-blue-700 font-semibold">
                  Login Now
                </Link>
              </p>
            </div>
          </motion.div>
            </>
          ) : (
            <EmailVerification
              email={formData.email}
              name={formData.name}
              onVerified={handleEmailVerified}
              onResendOtp={handleResendOtp}
              onBack={handleBackToRegister}
            />
          )}
        </div>
      </div>

      {/* Right Side - Hero Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=1080')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-blue-600/80"></div>
        
        <div className="relative z-10 flex flex-col justify-center items-center text-center p-16 text-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-32 h-32 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mb-8">
              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h2 className="text-4xl font-bold mb-6">Join Our Community</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-md">
              Get access to thousands of medicines, easy ordering, and doorstep delivery
            </p>
            <div className="space-y-4 max-w-md">
              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-3xl">✅</div>
                <div className="text-left">
                  <div className="font-semibold mb-1">Verified Medicines</div>
                  <div className="text-sm text-blue-100">Authentic products from trusted pharmacies</div>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-3xl">🚚</div>
                <div className="text-left">
                  <div className="font-semibold mb-1">Fast Delivery</div>
                  <div className="text-sm text-blue-100">Get your medicines delivered quickly</div>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-3xl">💳</div>
                <div className="text-left">
                  <div className="font-semibold mb-1">Secure Payments</div>
                  <div className="text-sm text-blue-100">Multiple payment options available</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Phone Modal */}
      <PhoneModal
        isOpen={showPhoneModal}
        onClose={handlePhoneModalClose}
        onSubmit={handlePhoneSubmit}
        loading={phoneLoading}
      />
    </div>
    </GoogleOAuthProvider>
  );
};

export default Register;
