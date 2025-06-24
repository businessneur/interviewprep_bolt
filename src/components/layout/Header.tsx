import React, { useState } from 'react';
import { User, LogOut, Settings, ChevronDown } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setShowDropdown(false);
  };

  if (!user) return null;

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
            <span className="text-white font-bold text-sm">AI</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">Interview Practice</h1>
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="text-left">
              <div className="text-sm font-medium text-gray-900">
                {user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'}
              </div>
              <div className="text-xs text-gray-500">{user.email}</div>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
              <button
                onClick={() => setShowDropdown(false)}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Settings className="w-4 h-4 mr-3" />
                Settings
              </button>
              <hr className="my-1" />
              <button
                onClick={handleSignOut}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-3" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};