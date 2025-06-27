# Frontend Integration with aceInterview Repository

## Overview
This frontend is designed to work with your existing aceInterview Python backend. Here's how to properly integrate them:

## Option 1: Separate Repositories (Recommended)
Keep the frontend and backend as separate repositories:

### Frontend Repository (this one)
```bash
# Clone or download this frontend
git clone <this-frontend-repo>
cd ai-interview-frontend
npm install
```

### Backend Repository (your aceInterview)
```bash
# Your existing repository
git clone https://github.com/sandeep066/aceInterview
cd aceInterview
# Follow your Python setup instructions
```

### Configuration
1. **Frontend .env file:**
```env
VITE_PYTHON_API_URL=http://localhost:8000/api
VITE_SUPABASE_URL=https://mzmocmlkfevnvkxkiura.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im16bW9jbWxrZmV2bnZreGtpdXJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3NTI2MDMsImV4cCI6MjA2NjMyODYwM30.Pugk0dtJ11nx63Y3LTdOFgdigL0nXM_gvRgd_AyoC58
```

2. **Start both servers:**
```bash
# Terminal 1: Python Backend
cd aceInterview
python manage.py runserver 8000

# Terminal 2: React Frontend
cd ai-interview-frontend
npm run dev
```

## Option 2: Integrate into aceInterview Repository
Move this frontend into your aceInterview repository:

### Steps:
1. **Copy frontend files to aceInterview:**
```bash
# In your aceInterview repository
mkdir frontend
# Copy all files from this frontend into the frontend/ directory
```

2. **Update aceInterview structure:**
```
aceInterview/
├── backend/          # Your existing Python code
├── frontend/         # This React frontend
│   ├── src/
│   ├── package.json
│   └── ...
├── README.md
└── requirements.txt
```

3. **Update package.json scripts:**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "start:backend": "cd ../backend && python manage.py runserver 8000",
    "start:full": "concurrently \"npm run start:backend\" \"npm run dev\""
  }
}
```

## Required Backend API Endpoints
Your Python backend needs these endpoints for the frontend to work:

### Authentication (handled by Supabase)
- Frontend handles auth via Supabase
- Backend can verify Supabase JWT tokens if needed

### Interview API Endpoints
```python
# Required endpoints in your Django/FastAPI backend:

POST /api/generate-question
POST /api/analyze-response  
POST /api/generate-analytics
GET /api/health

# Optional interview session management:
POST /api/interview/start
POST /api/interview/submit-answer
GET /api/interview/{id}/next-question
POST /api/interview/{id}/end
GET /api/interview/{id}/results
```

### CORS Configuration
Make sure your Python backend allows CORS from the frontend:

```python
# Django settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Vite dev server
    "http://localhost:3000",  # Alternative port
]

# Or for FastAPI
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Data Format Conversion
The frontend automatically converts between:
- **Frontend**: camelCase (JavaScript convention)
- **Backend**: snake_case (Python convention)

This is handled automatically by the `caseConversion.ts` utility.

## Next Steps
1. Choose integration approach (separate repos vs single repo)
2. Ensure your Python backend has the required API endpoints
3. Configure CORS in your Python backend
4. Test the connection between frontend and backend
5. Update your aceInterview README with frontend setup instructions

## Troubleshooting
- **Connection Error**: Check if Python backend is running on port 8000
- **CORS Error**: Verify CORS configuration in Python backend
- **API Errors**: Check backend logs for endpoint implementation
- **Auth Issues**: Verify Supabase configuration