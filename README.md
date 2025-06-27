# AI Interview Practice Platform

A comprehensive AI-powered interview practice application that integrates with a Python backend for intelligent question generation and response analysis.

## Features

### 🔐 **Authentication System**
- **Email/Password Authentication** with Supabase
- **Google OAuth Integration** (when configured)
- **Password Reset** via email
- **Email Confirmation** for new accounts
- **Protected Routes** - interview features only available when logged in
- **User Profile Management** with avatar support

### 🤖 **AI-Powered Interviews**
- **Python Backend Integration** for intelligent question generation
- **Dynamic question generation** based on your specific topic, experience level, and interview style
- **Contextual follow-up questions** that adapt to your responses
- **Company-specific scenarios** when target company is provided
- **Real-time response analysis** and feedback

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
- Comprehensive interview session reports

### 🎙️ **Advanced Interface**
- **Text-based interview experience** with speech-to-text support
- Real-time interview simulation with intelligent feedback
- Progress tracking and timer
- Note-taking functionality during interviews
- Responsive design for all devices

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Python backend server (from aceInterview repository)
- Supabase account (for authentication)
- Microphone access for speech-to-text features

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
# Python Backend Configuration
VITE_PYTHON_API_URL=http://localhost:8000/api

# Supabase Configuration for Authentication
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
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

### 4. Python Backend Setup

This frontend is designed to work with the Python backend from the aceInterview repository:

1. Clone the Python backend:
```bash
git clone https://github.com/sandeep066/aceInterview
cd aceInterview
```

2. Follow the Python backend setup instructions in that repository

3. Start the Python backend server (typically on port 8000)

### 5. Start the Frontend Application

```bash
# Start the frontend development server
npm run dev
```

### 6. Access the Application
- Frontend: http://localhost:5173
- Python Backend: http://localhost:8000 (or your configured port)

## Architecture

### Frontend (React + TypeScript + Supabase)
- **Authentication Screens**: Login, register, forgot password with beautiful UI
- **Configuration Screen**: Interview setup and customization
- **Interview Screen**: Text-based interview with speech-to-text support
- **Analytics Screen**: Performance analysis with detailed insights
- **Header Component**: User profile dropdown with sign-out functionality

### Backend Integration (Python)
- **API Service**: Unified interface for Python backend communication
- **Case Conversion**: Automatic conversion between camelCase (frontend) and snake_case (backend)
- **Question Generation**: Dynamic question creation based on user configuration
- **Response Analysis**: AI-powered feedback and scoring
- **Analytics Engine**: Comprehensive performance evaluation

### Database (Supabase PostgreSQL)
- **Authentication**: Built-in Supabase Auth with email/password and OAuth
- **User Profiles**: Custom profiles table with user metadata
- **Row Level Security**: Secure data access with RLS policies

## API Integration

The frontend communicates with the Python backend using a standardized API:

### Key Endpoints
- `POST /api/generate-question` - Generate interview questions
- `POST /api/analyze-response` - Analyze user responses
- `POST /api/generate-analytics` - Generate comprehensive analytics
- `GET /api/health` - Backend health check

### Data Flow
1. Frontend sends requests in camelCase format
2. API service converts to snake_case for Python backend
3. Backend processes and returns data in snake_case
4. Frontend converts back to camelCase for UI

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

### Backend Connection Issues

1. **Python Backend Not Connected**:
   ```
   Error: "Failed to fetch" or connection timeouts
   ```
   **Solution**: 
   - Ensure Python backend is running on the correct port
   - Check VITE_PYTHON_API_URL in .env file
   - Verify CORS settings in Python backend

2. **API Endpoint Errors**:
   ```
   Error: 404 or 500 responses from backend
   ```
   **Solution**:
   - Check Python backend logs for errors
   - Verify API endpoint URLs match between frontend and backend
   - Ensure proper request/response format

### General Issues

1. **Frontend Build Errors**:
   - Ensure all dependencies are installed: `npm install`
   - Check for TypeScript errors: `npm run lint`
   - Clear node_modules and reinstall if needed

2. **Environment Variables**:
   - Verify all required variables are set in .env
   - Restart development server after changing .env
   - Check variable names match exactly (case-sensitive)

## Development

### Project Structure
```
src/
├── components/          # React components
│   ├── auth/           # Authentication components
│   └── layout/         # Layout components
├── hooks/              # Custom React hooks
├── services/           # API services
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── lib/                # External library configurations
```

### Key Files
- `src/services/apiService.ts` - Main API communication layer
- `src/utils/caseConversion.ts` - Data format conversion utilities
- `src/components/InterviewScreen.tsx` - Main interview interface
- `src/utils/aiSimulator.ts` - Interview simulation logic

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues related to:
- **Authentication**: Check Supabase dashboard and logs
- **Python Backend**: Check the aceInterview repository documentation
- **API Integration**: Review network requests in browser dev tools
- **General Support**: Create an issue in this repository