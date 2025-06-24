import React, { useState } from 'react';
import { Eye, EyeOff, Loader2, Lock, Mail, User, CheckCircle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { AuthMode } from './AuthScreen';

interface RegisterScreenProps {
  onModeChange: (mode: AuthMode) => void;
  onAuthSuccess?: () => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ onModeChange, onAuthSuccess }) => {
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const { signUp, signInWithGoogle } = useAuth();

  const validateForm = () => {
    if (!email || !confirmEmail || !password || !fullName) {
      setError('All fields are required');
      return false;
    }

    if (email !== confirmEmail) {
      setError('Email addresses do not match');
      return false;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    if (!agreeToTerms) {
      setError('You must agree to the Terms of Use and Privacy Policy');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const { error } = await signUp(email, password, fullName);
    
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
    
    setLoading(false);
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    setError('');

    const { error } = await signInWithGoogle();
    
    if (error) {
      setError(error.message);
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
          We've sent a confirmation link to <strong>{email}</strong>. 
          Please check your email and click the link to activate your account.
        </p>
        <button
          onClick={() => onModeChange('login')}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all"
        >
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
          <User className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h1>
        <p className="text-gray-600">Join us to start your interview practice journey</p>
      </div>

      {/* Google Sign Up */}
      <button
        onClick={handleGoogleSignUp}
        disabled={loading}
        className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all mb-6 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          'REGISTER USING GOOGLE'
        )}
      </button>

      {/* Divider */}
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500">or using email</span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Register Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Enter your full name"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email
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
              placeholder="Enter your email"
            />
          </div>
        </div>

        {/* Re-enter Email */}
        <div>
          <label htmlFor="confirmEmail" className="block text-sm font-medium text-gray-700 mb-2">
            Re-enter Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="confirmEmail"
              type="email"
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
              required
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Confirm your email"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">We promise we won't spam</p>
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="Create a password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="terms"
              type="checkbox"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="terms" className="text-gray-700">
              By registering you agree to the{' '}
              <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                Terms of Use
              </a>{' '}
              and have read the{' '}
              <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                Privacy Policy
              </a>
              .
            </label>
          </div>
        </div>

        {/* Create Account Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
          ) : (
            <User className="w-4 h-4 mr-2" />
          )}
          {loading ? 'Creating Account...' : 'CREATE ACCOUNT'}
        </button>
      </form>

      {/* Login Link */}
      <div className="mt-8 text-center">
        <p className="text-gray-600 text-sm">
          Already registered?{' '}
          <button
            onClick={() => onModeChange('login')}
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            Login here.
          </button>
        </p>
      </div>
    </div>
  );
};