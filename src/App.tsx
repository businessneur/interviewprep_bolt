import React, { useState, useEffect } from 'react';
import { ConfigurationScreen } from './components/ConfigurationScreen';
import { InterviewScreen } from './components/InterviewScreen';
import { AnalyticsScreen } from './components/AnalyticsScreen';
import { AuthScreen } from './components/auth/AuthScreen';
import { Header } from './components/layout/Header';
import { InterviewConfig, AppScreen } from './types';
import { AIInterviewSimulator } from './utils/aiSimulator';
import { useAuth } from './hooks/useAuth';
import { Loader2 } from 'lucide-react';

function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('config');
  const [interviewConfig, setInterviewConfig] = useState<InterviewConfig | null>(null);
  const [completedSimulator, setCompletedSimulator] = useState<AIInterviewSimulator | null>(null);
  
  const { user, loading } = useAuth();

  const handleStartInterview = (config: InterviewConfig) => {
    setInterviewConfig(config);
    setCurrentScreen('interview');
  };

  const handleEndInterview = (simulator: AIInterviewSimulator) => {
    setCompletedSimulator(simulator);
    setCurrentScreen('analytics');
  };

  const handleBackToConfig = () => {
    setCurrentScreen('config');
    setInterviewConfig(null);
    setCompletedSimulator(null);
  };

  const handleRetryInterview = () => {
    if (interviewConfig) {
      setCurrentScreen('interview');
      setCompletedSimulator(null);
    }
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show authentication screen if user is not logged in
  if (!user) {
    return <AuthScreen />;
  }

  // Show main application if user is authenticated
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {currentScreen === 'config' && (
          <ConfigurationScreen onStartInterview={handleStartInterview} />
        )}
        
        {currentScreen === 'interview' && interviewConfig && (
          <InterviewScreen
            config={interviewConfig}
            onEndInterview={handleEndInterview}
            onBackToConfig={handleBackToConfig}
          />
        )}
        
        {currentScreen === 'analytics' && completedSimulator && (
          <AnalyticsScreen
            simulator={completedSimulator}
            onBackToConfig={handleBackToConfig}
            onRetryInterview={handleRetryInterview}
          />
        )}
      </main>
    </div>
  );
}

export default App;