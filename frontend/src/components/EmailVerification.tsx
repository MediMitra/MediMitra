import { useState, FormEvent, ChangeEvent, useEffect } from 'react';
import { motion } from 'framer-motion';
import { authAPI } from '../api/api';

interface EmailVerificationProps {
  email: string;
  name: string;
  onVerified: () => void;
  onResendOtp: () => void;
  onBack: () => void;
}

const EmailVerification = ({ email, name, onVerified, onResendOtp, onBack }: EmailVerificationProps): JSX.Element => {
  const [otp, setOtp] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [resendDisabled, setResendDisabled] = useState<boolean>(true);
  const [countdown, setCountdown] = useState<number>(60);

  useEffect(() => {
    // Start countdown for resend button
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setResendDisabled(false);
    }
  }, [countdown]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.verifyOtp({ email, otp });
      
      if (response.data.success) {
        onVerified();
      } else {
        setError(response.data.message || 'Invalid OTP. Please try again.');
      }
    } catch (err: any) {
      setError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async (): Promise<void> => {
    setError('');
    setResendDisabled(true);
    setCountdown(60);
    onResendOtp();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-200">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">Verify Your Email</h1>
        <p className="text-gray-600 text-lg">
          We've sent a 6-digit OTP to <span className="font-semibold text-blue-600">{email}</span>
        </p>
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

      {/* OTP Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Enter OTP</label>
          <div className="relative">
            <input
              type="text"
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-center text-2xl tracking-widest font-semibold"
              placeholder="000000"
              value={otp}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                setOtp(value);
              }}
              maxLength={6}
              required
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <p className="text-xs text-gray-500 mt-2">OTP is valid for 10 minutes</p>
        </div>

        <button
          type="submit"
          disabled={loading || otp.length !== 6}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Verifying...' : 'Verify Email'}
        </button>
      </form>

      {/* Resend OTP */}
      <div className="mt-6 text-center">
        <p className="text-gray-600 mb-2">Didn't receive the code?</p>
        <button
          type="button"
          onClick={handleResend}
          disabled={resendDisabled}
          className="text-blue-600 hover:text-blue-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {resendDisabled ? `Resend OTP in ${countdown}s` : 'Resend OTP'}
        </button>
      </div>

      {/* Back Button */}
      <div className="mt-8 text-center">
        <button
          type="button"
          onClick={onBack}
          className="text-gray-600 hover:text-gray-900 font-semibold"
        >
          ← Back to Registration
        </button>
      </div>
    </motion.div>
  );
};

export default EmailVerification;
