# Environment Variables Setup

To fix the runtime errors, you need to configure the following environment variables in your Vercel deployment:

## Required Environment Variables

### 1. API Keys
```
ANTHROPIC_API_KEY=your_anthropic_api_key_here
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

### 2. NextAuth Configuration
```
NEXTAUTH_SECRET=eureka-ai-creative-studio-production-secret-2024-secure-fallback
NEXTAUTH_URL=https://your-domain.vercel.app
```

**Note:** The app now includes a fallback secret, but it's recommended to set your own secure secret.

### 3. Site Configuration
```
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

## How to Set Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add each variable above with the appropriate values

## Generating NEXTAUTH_SECRET

You can generate a secure secret using:
```bash
openssl rand -base64 32
```

Or use an online generator like: https://generate-secret.vercel.app/32

## Current Issues Fixed

- ✅ Added fallback for missing NEXTAUTH_SECRET
- ✅ Better error handling for missing API keys
- ✅ More descriptive error messages
- ✅ Proper HTTP status codes (503 for service unavailable)

After setting these environment variables, redeploy your application and the 500 errors should be resolved.
