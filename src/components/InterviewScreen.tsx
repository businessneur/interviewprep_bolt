import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Square, 
  MessageCircle,
  Clock,
  FileText,
  Send,
  Loader,
  Wifi,
  WifiOff,
  AlertCircle,
  Monitor,
  Brain,
  Zap,
  StopCircle
} from 'lucide-react';
import { InterviewConfig } from '../types';
import { AIInterviewSimulator } from '../utils/aiSimulator';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { APIService } from '../services/apiService';

interface InterviewScreenProps {
  config: InterviewConfig;
  onEndInterview: (simulator: AIInterviewSimulator) => void;
  onBackToConfig: () => void;
}

export const InterviewScreen: React.FC<InterviewScreenProps> = ({
  config,
  onEndInterview,
  onBackToConfig
}) => {
  // Only show text interview mode since Python backend doesn't support LiveKit
  return (
    <TextInterviewScreen
      config={config}
      onEndInterview={onEndInterview}
      onBackToConfig={onBackToConfig}
    />
  );
};

// Text Interview Component (optimized for Python backend)
const TextInterviewScreen: React.FC<InterviewScreenProps> = ({
  config,
  onEndInterview,
  onBackToConfig
}) => {
  const [simulator] = useState(() => new AIInterviewSimulator(config));
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [textResponse, setTextResponse] = useState('');
  const [notes, setNotes] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isThinking, setIsThinking] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionChecked, setConnectionChecked] = useState(false);
  const [showConnectionInfo, setShowConnectionInfo] = useState(false);
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);
  const [isSubmittingResponse, setIsSubmittingResponse] = useState(false);
  const [showEndConfirmation, setShowEndConfirmation] = useState(false);
  
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript,
    isSupported: speechSupported
  } = useSpeechRecognition();

  const responseRef = useRef<HTMLTextAreaElement>(null);
  const notesRef = useRef<HTMLTextAreaElement>(null);

  // Check backend connection on mount
  useEffect(() => {
    checkBackendConnection();
  }, []);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isInterviewActive && startTime) {
      interval = setInterval(() => {
        setElapsedTime(Date.now() - startTime);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isInterviewActive, startTime]);

  // Update text response when speech transcript changes
  useEffect(() => {
    if (transcript) {
      setTextResponse(transcript);
    }
  }, [transcript]);

  const checkBackendConnection = async () => {
    try {
      const healthy = await APIService.checkHealth();
      setIsConnected(healthy);
      setConnectionChecked(true);
      
      if (!healthy && !showConnectionInfo) {
        setShowConnectionInfo(true);
        setTimeout(() => setShowConnectionInfo(false), 8000);
      }
    } catch (error) {
      setIsConnected(false);
      setConnectionChecked(true);
    }
  };

  const formatTime = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const startInterview = () => {
    setIsInterviewActive(true);
    setStartTime(Date.now());
    loadNextQuestion();
  };

  const pauseInterview = () => {
    setIsInterviewActive(false);
    stopListening();
  };

  const resumeInterview = () => {
    setIsInterviewActive(true);
  };

  const endInterview = () => {
    setIsInterviewActive(false);
    stopListening();
    simulator.endInterviewEarly();
    onEndInterview(simulator);
  };

  const handleEndInterviewClick = () => {
    if (simulator.getProgress().current > 1) {
      setShowEndConfirmation(true);
    } else {
      endInterview();
    }
  };

  const confirmEndInterview = () => {
    setShowEndConfirmation(false);
    endInterview();
  };

  const cancelEndInterview = () => {
    setShowEndConfirmation(false);
  };

  const loadNextQuestion = async () => {
    setIsThinking(true);
    setIsLoadingQuestion(true);
    
    try {
      console.log('🔄 Loading next question...');
      const startTime = Date.now();
      
      const question = await simulator.getNextQuestion();
      
      const duration = Date.now() - startTime;
      console.log(`⏱️ Question loaded in ${duration}ms`);
      
      if (question) {
        setCurrentQuestion(question);
        setTextResponse('');
        resetTranscript();
        console.log('✅ Question set successfully');
      } else {
        console.log('🏁 No more questions, ending interview');
        endInterview();
      }
    } catch (error) {
      console.error('❌ Error loading question:', error);
      simulator.forceFallbackMode();
      try {
        const fallbackQuestion = await simulator.getNextQuestion();
        if (fallbackQuestion) {
          setCurrentQuestion(fallbackQuestion);
          setTextResponse('');
          resetTranscript();
        } else {
          endInterview();
        }
      } catch (fallbackError) {
        console.error('❌ Even fallback failed:', fallbackError);
        endInterview();
      }
    } finally {
      setIsThinking(false);
      setIsLoadingQuestion(false);
    }
  };

  const submitResponse = async () => {
    if (!textResponse.trim()) return;

    setIsSubmittingResponse(true);
    stopListening();
    
    try {
      console.log('📝 Submitting response...');
      const startTime = Date.now();
      
      await simulator.submitResponse(textResponse.trim());
      
      const duration = Date.now() - startTime;
      console.log(`✅ Response submitted in ${duration}ms`);
      
      if (simulator.isInterviewComplete()) {
        endInterview();
      } else {
        await loadNextQuestion();
      }
    } catch (error) {
      console.error('Error submitting response:', error);
    } finally {
      setIsSubmittingResponse(false);
    }
  };

  const toggleMicrophone = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const progress = simulator.getProgress();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-6xl mx-auto">
          {/* End Interview Confirmation Modal */}
          {showEndConfirmation && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl p-8 max-w-md mx-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <StopCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">End Interview Early?</h3>
                  <p className="text-gray-600 mb-6">
                    You've completed {progress.current - 1} out of {progress.total} questions. 
                    Are you sure you want to end the interview now? You'll still receive analytics based on your responses.
                  </p>
                  <div className="flex space-x-4">
                    <button
                      onClick={cancelEndInterview}
                      className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-colors"
                    >
                      Continue Interview
                    </button>
                    <button
                      onClick={confirmEndInterview}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                    >
                      End & Analyze
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Monitor className="w-6 h-6 mr-2 text-blue-600" />
                  Interview Practice - {config.style.charAt(0).toUpperCase() + config.style.slice(1).replace('-', ' ')}
                </h1>
                <p className="text-gray-600">Topic: {config.topic}</p>
                {config.companyName && (
                  <p className="text-gray-600">Company: {config.companyName}</p>
                )}
              </div>
              <div className="text-right">
                <div className="flex items-center text-lg font-semibold text-blue-600 mb-2">
                  <Clock className="w-5 h-5 mr-2" />
                  {formatTime(elapsedTime)}
                </div>
                <div className="text-sm text-gray-600">
                  Duration: {config.duration} minutes
                </div>
                <div className="flex items-center mt-2">
                  {connectionChecked && (
                    <>
                      {isConnected ? (
                        <div className="flex items-center text-green-600 text-sm">
                          <Brain className="w-4 h-4 mr-1" />
                          Python Backend Connected
                        </div>
                      ) : (
                        <div className="flex items-center text-amber-600 text-sm">
                          <WifiOff className="w-4 h-4 mr-1" />
                          Offline Mode
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Connection Info Alert */}
            {showConnectionInfo && !isConnected && (
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div className="text-blue-800 text-sm">
                    <p className="font-medium mb-1">Running in Offline Mode</p>
                    <p className="mb-2">
                      The Python backend is not connected. You can still practice with pre-defined questions, 
                      or start the Python backend server for AI-powered interviews.
                    </p>
                    <p className="text-xs text-blue-600">
                      To enable AI features: Start your Python backend server on port 8000.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowConnectionInfo(false)}
                    className="ml-auto text-blue-600 hover:text-blue-800 text-sm"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}

            {/* Loading Question Alert */}
            {isLoadingQuestion && (
              <div className="mb-4 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-center">
                  <Brain className="w-5 h-5 text-purple-600 mr-3 animate-pulse" />
                  <div className="text-purple-800 text-sm">
                    <p className="font-medium">AI is generating your question...</p>
                    <p className="text-xs text-purple-600 mt-1">
                      This may take a moment for the best quality questions
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Question {progress.current} of {progress.total}
                </span>
                <span className="text-sm text-gray-600">
                  {Math.round(progress.percentage)}% Complete
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {!isInterviewActive ? (
                  <button
                    onClick={startInterview}
                    disabled={isLoadingQuestion}
                    className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {startTime ? 'Resume' : 'Start'} Interview
                  </button>
                ) : (
                  <button
                    onClick={pauseInterview}
                    disabled={isLoadingQuestion}
                    className="inline-flex items-center px-6 py-3 bg-yellow-600 text-white font-semibold rounded-xl hover:bg-yellow-700 focus:outline-none focus:ring-4 focus:ring-yellow-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                  </button>
                )}
                
                <button
                  onClick={handleEndInterviewClick}
                  className="inline-flex items-center px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 transition-all"
                >
                  <Square className="w-4 h-4 mr-2" />
                  End Interview
                </button>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-3 rounded-xl transition-all ${
                    isMuted ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>

                <button
                  onClick={checkBackendConnection}
                  className="p-3 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all"
                  title="Check Backend Connection"
                >
                  <Wifi className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* AI Interviewer */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-4">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">AI Interviewer</h3>
                    <p className="text-sm text-gray-600">
                      {isConnected ? 'Python Backend AI Assistant' : 'Practice Interview Assistant'}
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 min-h-[200px]">
                  {isThinking || isLoadingQuestion ? (
                    <div className="flex items-center justify-center h-full">
                      <Loader className="w-6 h-6 text-blue-600 animate-spin mr-3" />
                      <span className="text-gray-600">
                        {isLoadingQuestion 
                          ? 'AI is crafting your personalized question...' 
                          : isConnected 
                            ? 'AI is generating your next question...' 
                            : 'Preparing next question...'
                        }
                      </span>
                    </div>
                  ) : currentQuestion ? (
                    <div>
                      <p className="text-lg text-gray-800 leading-relaxed">{currentQuestion}</p>
                      {isInterviewActive && (
                        <div className="mt-4 flex items-center text-sm text-blue-600">
                          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse mr-2"></div>
                          Waiting for your response...
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <MessageCircle className="w-8 h-8 mr-3" />
                      <span>Click "Start Interview" to begin</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Response Input */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Response</h3>
                
                <div className="space-y-4">
                  <textarea
                    ref={responseRef}
                    value={textResponse}
                    onChange={(e) => setTextResponse(e.target.value)}
                    placeholder="Type your response here or use the microphone to speak..."
                    className="w-full h-32 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-colors"
                    disabled={!isInterviewActive || isLoadingQuestion || isSubmittingResponse}
                  />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {speechSupported && (
                        <button
                          onClick={toggleMicrophone}
                          disabled={!isInterviewActive || isLoadingQuestion || isSubmittingResponse}
                          className={`p-3 rounded-xl transition-all ${
                            isListening
                              ? 'bg-red-100 text-red-600 animate-pulse'
                              : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                          } disabled:opacity-50`}
                        >
                          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                        </button>
                      )}
                      
                      {isListening && (
                        <div className="flex items-center text-sm text-red-600">
                          <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse mr-2"></div>
                          Recording...
                        </div>
                      )}

                      {isSubmittingResponse && (
                        <div className="flex items-center text-sm text-blue-600">
                          <Loader className="w-4 h-4 animate-spin mr-2" />
                          Processing response...
                        </div>
                      )}
                    </div>

                    <button
                      onClick={submitResponse}
                      disabled={!isInterviewActive || !textResponse.trim() || isLoadingQuestion || isSubmittingResponse}
                      className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      {isSubmittingResponse ? (
                        <Loader className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4 mr-2" />
                      )}
                      Submit Response
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <FileText className="w-5 h-5 text-gray-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Interview Notes</h3>
              </div>
              
              <textarea
                ref={notesRef}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Jot down key points, thoughts, or reminders during the interview..."
                className="w-full h-64 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-colors"
              />
              
              <div className="mt-4 text-xs text-gray-500">
                Your notes will be saved and available in the analytics section.
              </div>

              {/* Backend Connection Status */}
              <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                <h4 className="font-medium text-blue-900 mb-2">Backend Status</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Python Backend:</span>
                    <span className={isConnected ? 'text-green-600' : 'text-red-600'}>
                      {isConnected ? 'Connected' : 'Disconnected'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">AI Mode:</span>
                    <span className="text-blue-900 font-medium">
                      {isConnected ? 'Python AI' : 'Fallback'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Max Questions:</span>
                    <span className="text-blue-900 font-medium">{progress.total}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};