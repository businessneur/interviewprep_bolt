# Quick Setup Guide

## 1. Environment Configuration

1. Copy the `.env` file and update with your actual API keys:
   ```bash
   # Update these with your actual keys:
   GEMINI_API_KEY=your_actual_gemini_api_key
   LIVEKIT_API_KEY=your_actual_livekit_api_key
   LIVEKIT_API_SECRET=your_actual_livekit_secret
   LIVEKIT_WS_URL=wss://your-actual-livekit-server.com
   ```

## 2. Getting API Keys

### Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy and paste into `GEMINI_API_KEY`

### LiveKit Keys
1. Sign up at [LiveKit Cloud](https://cloud.livekit.io/)
2. Create a new project
3. Go to Settings → Keys
4. Copy:
   - API Key → `LIVEKIT_API_KEY`
   - Secret Key → `LIVEKIT_API_SECRET`
   - WebSocket URL → `LIVEKIT_WS_URL`

## 3. Start the Application

```bash
# Install dependencies
npm install

# Start backend server (Terminal 1)
npm run server

# Start frontend (Terminal 2)
npm run dev
```

## 4. Features Available

- ✅ **Text Interviews**: AI-powered question generation with Gemini
- ✅ **Voice Interviews**: Real-time voice communication with LiveKit
- ✅ **Agentic AI**: Advanced multi-agent question generation and analysis
- ✅ **Comprehensive Analytics**: Detailed performance analysis
- ✅ **Multiple Interview Types**: Technical, HR, Behavioral, Case Study, Salary Negotiation

## 5. Health Check

Visit `http://localhost:3001/api/health` to verify all services are running correctly.

## 6. Troubleshooting

- **Gemini not working**: Check API key and ensure billing is enabled
- **LiveKit not connecting**: Verify WebSocket URL format (must start with `wss://`)
- **Voice interviews unavailable**: Check LiveKit configuration in health endpoint