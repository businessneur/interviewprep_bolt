# AI Interview Practice Platform with LiveKit Voice Integration

A comprehensive AI-powered interview practice application that uses Large Language Models (LLMs) and LiveKit for real-time voice interviews, generating dynamic, contextual interview questions and providing intelligent feedback.

## Features

### 🔐 **Authentication System**
- **Email/Password Authentication** with Supabase
- **Google OAuth Integration** (when configured)
- **Password Reset** via email
- **Email Confirmation** for new accounts
- **Protected Routes** - interview features only available when logged in
- **User Profile Management** with avatar support

### 🎙️ **LiveKit Voice Interviews**
- **Real-time voice communication** using LiveKit WebRTC infrastructure
- **AI-powered voice interviewer** that speaks questions and listens to responses
- **Speech-to-text transcription** for response analysis
- **Low-latency audio streaming** for natural conversation flow
- **Connection recovery** and session management
- **Multi-participant support** for group interviews (future enhancement)

### 🤖 **LLM-Powered Question Generation**
- Dynamic question generation based on your specific topic, experience level, and interview style
- Contextual follow-up questions that adapt to your responses
- Company-specific scenarios when target company is provided
- Support for multiple LLM providers (OpenAI GPT-4, Anthropic Claude, Google Gemini)

### 🎯 **Interview Types**
- **Technical Interviews**: Code problems, system design, technical concepts
- **HR Interviews**: Company culture, work-life balance, career goals
- **Behavioral Interviews**: STAR method scenarios, past experiences
- **Salary Negotiation**: Compensation discussions, benefit negotiations
- **Case Study Interviews**: Problem-solving scenarios, business cases

### 📊 **Intelligent Analytics**
- AI-powered response analysis and scoring
- Personalized feedback and improvement suggestions
- Detailed question-by-question review
- Performance tracking across multiple dimensions
- Voice interview session recordings and playback

### 🎙️ **Advanced Interface**
- **Voice-first interview experience** with LiveKit integration
- Speech-to-text input capability with fallback text input
- Real-time interview simulation with audio feedback
- Progress tracking and timer
- Note-taking functionality during voice interviews
- Responsive design for all devices

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- An API key from either OpenAI, Anthropic, or Google Gemini
- LiveKit Cloud account or self-hosted LiveKit server (for voice interviews)
- Supabase account (for authentication)
- Microphone access for voice interviews

### 1. Clone and Install Dependencies
```bash
git clone <repository-url>
cd ai-interview-platform
npm install
```

### 2. Environment Configuration
```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
```env
# Choose your LLM provider
LLM_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key_here

# OR use OpenAI
# LLM_PROVIDER=openai
# OPENAI_API_KEY=your_openai_api_key_here

# OR use Anthropic Claude
# LLM_PROVIDER=anthropic
# ANTHROPIC_API_KEY=your_anthropic_api_key_here

# LiveKit Configuration (required for voice interviews)
LIVEKIT_API_KEY=your_livekit_api_key
LIVEKIT_API_SECRET=your_livekit_api_secret
LIVEKIT_WS_URL=wss://your-livekit-server.com

# Supabase Configuration for Authentication
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Server Configuration
PORT=3001
VITE_API_URL=http://localhost:3001/api
```

### 3. Supabase Setup

#### Create Supabase Project
1. Sign up at [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for initialization (~2 minutes)
4. Go to Settings > API to get your project URL and anon key
5. Add them to your `.env` file

#### Set Up Database Tables
Run this SQL in your Supabase SQL Editor:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
```

#### Configure Google OAuth (Optional)
1. In Supabase dashboard: Authentication > Providers
2. Enable Google provider
3. Add your Google OAuth credentials:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `https://your-project-ref.supabase.co/auth/v1/callback`
4. Copy Client ID and Client Secret to Supabase

### 4. LiveKit Setup (Optional - for Voice Interviews)

#### Option A: LiveKit Cloud (Recommended)
1. Sign up at [LiveKit Cloud](https://cloud.livekit.io/)
2. Create a new project
3. Copy your API Key, Secret Key, and WebSocket URL
4. Add them to your `.env` file

#### Option B: Self-hosted LiveKit
1. Follow the [LiveKit deployment guide](https://docs.livekit.io/deploy/)
2. Configure your server URL in the `.env` file
3. Set up your API credentials

### 5. Start the Application

**Full Mode (with LLM backend, Authentication, and LiveKit):**
```bash
# Terminal 1: Start the backend server
npm run server

# Terminal 2: Start the frontend development server
npm run dev
```

**Text-only Mode (without LiveKit):**
```bash
# Set LIVEKIT_API_KEY="" in .env to disable voice features
npm run server  # Terminal 1
npm run dev     # Terminal 2
```

### 6. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- Health Check: http://localhost:3001/api/health
- LiveKit Config Check: http://localhost:3001/api/livekit/config

## Authentication Flow

### Registration Process
1. User fills out registration form with email, password, and full name
2. System checks for duplicate emails and prevents registration
3. Confirmation email sent to user
4. User clicks confirmation link to activate account
5. User can then sign in

### Sign-In Options
1. **Email/Password**: Traditional authentication
2. **Google OAuth**: One-click sign-in (when configured)

### Error Handling
- Duplicate email registration prevention
- Clear error messages for authentication failures
- Graceful handling of unconfirmed emails
- Google OAuth configuration detection

## Troubleshooting

### Authentication Issues

1. **Google Sign-In Not Working**:
   ```
   Error: "Unsupported provider: provider is not enabled"
   ```
   **Solution**: Configure Google OAuth in Supabase:
   - Go to Supabase Dashboard > Authentication > Providers
   - Enable Google provider
   - Add your Google OAuth credentials

2. **Duplicate Email Registration**:
   ```
   Error: User tries to register with existing email
   ```
   **Solution**: The system now prevents this and shows a helpful error message with a link to the login page.

3. **Email Confirmation Issues**:
   - Check spam folder for confirmation emails
   - Ensure email confirmation is enabled in Supabase settings
   - Verify SMTP settings in Supabase

### LiveKit Issues

1. **LiveKit Connection Failed**:
   ```bash
   # Check LiveKit configuration
   curl http://localhost:3001/api/livekit/config
   
   # Verify environment variables
   echo $LIVEKIT_API_KEY
   echo $LIVEKIT_WS_URL
   ```

2. **Audio Not Working**:
   - Check microphone permissions in browser
   - Verify HTTPS connection (required for microphone access)
   - Test audio devices in browser settings

### General Issues

1. **Backend Not Starting**:
   - Ensure all required environment variables are set
   - Check for port conflicts (default: 3001)
   - Verify API keys are valid

2. **Database Connection Issues**:
   - Verify Supabase URL and anon key
   - Check if profiles table exists
   - Ensure RLS policies are set up correctly

## Architecture

### Frontend (React + TypeScript + Supabase + LiveKit)
- **Authentication Screens**: Login, register, forgot password with beautiful UI
- **Configuration Screen**: Interview setup and voice/text mode selection
- **Voice Interview Screen**: Real-time voice communication with AI interviewer
- **Text Interview Screen**: Traditional text-based interview (fallback)
- **Analytics Screen**: Performance analysis with voice session insights
- **Header Component**: User profile dropdown with sign-out functionality

### Backend (Node.js + Express + LiveKit Server SDK)
- **LLM Service**: Unified interface for multiple LLM providers
- **LiveKit Service**: Room management, token generation, webhook handling
- **Voice Interview Service**: Session management, audio processing, real-time question flow
- **Question Generation**: Context-aware question creation with voice timing
- **Response Analysis**: AI-powered feedback with audio quality metrics
- **Analytics Engine**: Comprehensive performance evaluation including voice metrics

### Database (Supabase PostgreSQL)
- **Authentication**: Built-in Supabase Auth with email/password and OAuth
- **User Profiles**: Custom profiles table with user metadata
- **Row Level Security**: Secure data access with RLS policies

## Security Features

### Authentication Security
- **Supabase Auth**: Industry-standard authentication with JWT tokens
- **Email Verification**: Required for new accounts
- **Password Requirements**: Minimum 6 characters
- **OAuth Security**: Secure Google OAuth integration
- **Session Management**: Automatic token refresh and secure logout

### API Security
- **Protected Routes**: Interview features require authentication
- **CORS Configuration**: Proper cross-origin setup
- **Input Validation**: Comprehensive request validation
- **Rate Limiting**: Protection against API abuse

### LiveKit Security
- **Token-based Authentication**: Secure room access control
- **Time-limited Tokens**: Automatic token expiration
- **Room Isolation**: Secure participant separation
- **Webhook Verification**: Signed webhook payloads

## Deployment

### Production Deployment
1. **Frontend Deployment**:
   ```bash
   npm run build
   # Deploy dist/ folder to your hosting provider
   ```

2. **Backend Deployment**:
   ```bash
   # Deploy to your preferred platform (AWS, GCP, Azure, etc.)
   # Ensure all environment variables are set in production
   ```

3. **Supabase Configuration**:
   - Update allowed origins in Supabase settings
   - Configure production OAuth redirect URLs
   - Set up custom SMTP for production emails

4. **LiveKit Configuration**:
   - Use LiveKit Cloud for production
   - Configure proper CORS and security settings
   - Set up webhook endpoints for monitoring

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for authentication and voice features if applicable
5. Submit a pull request

### Development Setup
```bash
# Install dependencies
npm install

# Start development with hot reload
npm run dev

# Run backend server
npm run server

# Test authentication flow
# Test LiveKit integration
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues related to:
- **Authentication**: Check Supabase dashboard and logs
- **LiveKit Integration**: Check [LiveKit Documentation](https://docs.livekit.io/)
- **Voice Features**: Review browser microphone permissions
- **API Issues**: Check backend logs and health endpoints
- **General Support**: Create an issue in this repository