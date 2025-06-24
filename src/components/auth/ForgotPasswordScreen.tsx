import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { AuthMode } from './AuthScreen';

interface ForgotPasswordScreenProps {
  onModeChange: (mode: AuthMode) => void;
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ onModeChange }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await resetPassword(email);
    
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
    
    setLoading(false);
  };

  if (success) {
    return (
      <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-2xl mb-4">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h1>
        <p className="text-gray-600 mb-6">
          We've sent a password reset link to <strong>{email}</strong>. 
          Please check your email and follow the instructions to reset your password.
        </p>
        <button
          onClick={() => onModeChange('login')}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Login
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl mb-4">
          <Mail className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Reset Password</h1>
        <p className="text-gray-600">Enter your email address and we'll send you a link to reset your password</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Reset Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter your email address"
            />
          </div>
        </div>

        {/* Reset Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <Mail className="w-4 h-4 mr-2" />
          )}
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>

      {/* Back to Login */}
      <div className="mt-8 text-center">
        <button
          onClick={() => onModeChange('login')}
          className="inline-flex items-center text-gray-600 hover:text-gray-700 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Login
        </button>
      </div>
    </div>
  );
};