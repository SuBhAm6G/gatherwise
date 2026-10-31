# GatherWise Deployment Guide

GatherWise is architected for seamless zero-configuration continuous deployment on **Vercel** and containerized environments.

🌐 **Production URL**: [https://gatherwise-wheat.vercel.app](https://gatherwise-wheat.vercel.app)

## 1. Prerequisites
- Node.js >= 20.0.0
- npm >= 10.0.0
- Google Gemini API Key from [Google AI Studio](https://aistudio.google.com/)

## 2. Environment Variables Configuration
Set the following environment variables in your Vercel Project Settings or local `.env.local`:

| Variable | Description | Default / Example |
|---|---|---|
| `GEMINI_API_KEY` | Google Gemini API Secret Key | `AIzaSy...` |
| `GEMINI_MODEL` | Primary model identifier | `gemini-3.1-flash-lite` |
| `AI_MAX_TOKENS` | Max completion tokens | `2048` |
| `AI_TIMEOUT_MS` | Server-side API timeout | `30000` |
| `NEXT_PUBLIC_APP_URL`| Production deployment origin | `https://gatherwise-wheat.vercel.app` |

## 3. Vercel Configuration (`vercel.json`)
GatherWise includes an automated Vercel deployment manifest:
```json
{
  "framework": "nextjs",
  "installCommand": "npm install --legacy-peer-deps"
}
```

## 4. Build & Production Verification
```bash
# Verify TypeScript strict types, linting, and tests
npm run check

# Build production bundle
npm run build

# Start local production server
npm run start
```

