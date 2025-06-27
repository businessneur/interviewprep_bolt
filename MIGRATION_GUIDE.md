# Migration Guide: Moving Authentication to aceInterview Repository

## Overview
This guide helps you integrate the Supabase authentication system we built into your existing `aceInterview` repository with Python backend.

## Step 1: Copy Frontend Authentication Files

Copy these files from this project to your `aceInterview` repository:

### Authentication Components
```
src/components/auth/
├── AuthScreen.tsx
├── LoginScreen.tsx
├── RegisterScreen.tsx
└── ForgotPasswordScreen.tsx
```

### Authentication Hook
```
src/hooks/useAuth.ts
```

### Supabase Configuration
```
src/lib/supabase.ts
```

### Layout Components
```
src/components/layout/Header.tsx
```

## Step 2: Update Your Main App Component

Replace or update your main App.tsx with authentication integration:

```typescript
import React, { useState, useEffect } from 'react';
import { AuthScreen } from './components/auth/AuthScreen';
import { Header } from './components/layout/Header';
import { useAuth } from './hooks/useAuth';
import { Loader2 } from 'lucide-react';

// Your existing components
import YourExistingComponents from './your-components';

function App() {
  const { user, loading } = useAuth();

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
        {/* Your existing application components */}
        <YourExistingComponents />
      </main>
    </div>
  );
}

export default App;
```

## Step 3: Install Required Dependencies

Add these dependencies to your `package.json`:

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.39.0",
    "lucide-react": "^0.344.0"
  }
}
```

Then run:
```bash
npm install
```

## Step 4: Environment Variables

Add to your `.env` file:

```env
# Supabase Configuration for Authentication
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Step 5: Supabase Setup

1. **Create Supabase Project:**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Get your project URL and anon key

2. **Create Database Tables:**
   Run this SQL in Supabase SQL Editor:

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

## Step 6: Integrate with Python Backend

### Option A: Keep Supabase for Auth Only
- Use Supabase only for authentication
- Your Python backend handles all other features
- Pass JWT tokens from frontend to Python backend for verification

### Option B: Hybrid Approach
- Supabase for user authentication and profiles
- Python backend for interview logic, AI features, etc.
- Frontend communicates with both services

### Example: Protecting Python API Routes

```python
# Python backend - example middleware
import jwt
from functools import wraps
from flask import request, jsonify

def verify_supabase_token(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'No token provided'}), 401
        
        try:
            # Remove 'Bearer ' prefix
            token = token.replace('Bearer ', '')
            # Verify with Supabase JWT secret
            decoded = jwt.decode(token, SUPABASE_JWT_SECRET, algorithms=['HS256'])
            request.user_id = decoded['sub']
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401
        
        return f(*args, **kwargs)
    return decorated_function

# Protected route example
@app.route('/api/protected-endpoint')
@verify_supabase_token
def protected_endpoint():
    user_id = request.user_id
    # Your logic here
    return jsonify({'message': 'Success', 'user_id': user_id})
```

## Step 7: Frontend API Integration

Update your API calls to include authentication:

```typescript
// src/services/apiService.ts
import { supabase } from '../lib/supabase';

class APIService {
  private async getAuthHeaders() {
    const { data: { session } } = await supabase.auth.getSession();
    return {
      'Authorization': `Bearer ${session?.access_token}`,
      'Content-Type': 'application/json'
    };
  }

  async makeAuthenticatedRequest(url: string, options: RequestInit = {}) {
    const headers = await this.getAuthHeaders();
    
    return fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers
      }
    });
  }

  // Example: Call your Python backend
  async callPythonAPI(endpoint: string, data?: any) {
    const response = await this.makeAuthenticatedRequest(
      `http://your-python-backend.com/api/${endpoint}`,
      {
        method: 'POST',
        body: JSON.stringify(data)
      }
    );
    return response.json();
  }
}
```

## Step 8: Testing

1. Start your Python backend
2. Start your React frontend with `npm run dev`
3. Test authentication flow:
   - Registration
   - Login
   - Google OAuth (if configured)
   - Protected routes
   - API calls to Python backend

## Step 9: Deployment Considerations

### Frontend Deployment:
- Build with `npm run build`
- Deploy to Vercel, Netlify, or your preferred platform
- Set environment variables in deployment platform

### Backend Integration:
- Ensure CORS is configured for your frontend domain
- Set up proper JWT verification in Python backend
- Configure environment variables for production

## Troubleshooting

### Common Issues:

1. **CORS Errors:**
   ```python
   # In your Python backend
   from flask_cors import CORS
   CORS(app, origins=['http://localhost:3000', 'https://your-frontend-domain.com'])
   ```

2. **JWT Verification:**
   - Get Supabase JWT secret from project settings
   - Use proper JWT library for Python
   - Handle token expiration and refresh

3. **Environment Variables:**
   - Ensure all required variables are set
   - Use different configs for development/production

## Next Steps

1. Copy the authentication files to your repository
2. Set up Supabase project and database
3. Configure environment variables
4. Test authentication flow
5. Integrate with your Python backend
6. Deploy and test in production

This migration will give you a production-ready authentication system that works seamlessly with your existing Python backend!