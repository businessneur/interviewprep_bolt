import React, { useState } from 'react';
import { LoginScreen } from './LoginScreen';
import { RegisterScreen } from './RegisterScreen';
import { ForgotPasswordScreen } from './ForgotPasswordScreen';

export type AuthMode = 'login' | 'register' | 'forgot-password' | 'reset-password';

interface AuthScreenProps {
  onAuthSuccess?: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState<AuthMode>('login');

  const handleModeChange = (newMode: AuthMode) => {
    setMode(newMode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {mode === 'login' && (
          <LoginScreen 
            onModeChange={handleModeChange}
            onAuthSuccess={onAuthSuccess}
          />
        )}
        {mode === 'register' && (
          <RegisterScreen 
            onModeChange={handleModeChange}
            onAuthSuccess={onAuthSuccess}
          />
        )}
        {mode === 'forgot-password' && (
          <ForgotPasswordScreen 
            onModeChange={handleModeChange}
          />
        )}
      </div>
    </div>
  );
};