# EUREKA AI Creative Studio - Setup Guide

## 🚀 Getting Started

### 1. Environment Variables
Create a `.env.local` file in the root of your project with:

```bash
# OpenRouter API Configuration
OPENROUTER_API_KEY=your_openrouter_api_key_here

# Anthropic API Configuration
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Site Configuration (optional)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 2. Get Your API Keys
1. **OpenRouter API Key:**
   - Go to [OpenRouter](https://openrouter.ai/)
   - Sign up or log in
   - Navigate to your API keys section
   - Create a new API key

2. **Anthropic API Key:**
   - Go to [Anthropic](https://console.anthropic.com/)
   - Sign up or log in
   - Navigate to your API keys section
   - Create a new API key

### 3. Install Dependencies
```bash
npm install
```

### 4. Start Development Server
```bash
npm run dev
```

## 🎨 Features

### **Intelligent AI Chat Interface (Powered by Anthropic Claude)**
- **Natural conversation** with AI creative assistant
- **Tool-based approach** for executing creative tasks
- **Automatic image generation** using DALL-E 3 through OpenRouter
- **Content analysis** and creative insights
- **Professional creative guidance**

### **Dual Interface Options**
- **🤖 AI Chat Interface**: Full-featured Anthropic-powered chat
- **✨ Simple Input**: Direct image generation interface

### **Advanced Capabilities**
- **Tool calls** for image generation, content analysis
- **Conversation memory** and context awareness
- **Multi-model orchestration** (Claude + DALL-E 3)
- **Professional creative assistance**

## 🔧 How It Works

### **AI Chat Interface:**
1. **User types** natural language requests
2. **Anthropic Claude** analyzes the request
3. **Tool calls** are automatically executed (image generation, analysis)
4. **Results** are returned with context and explanations
5. **Images appear** in the chat with full conversation history

### **Simple Input Interface:**
1. **Direct prompt** input for image generation
2. **Immediate generation** using DALL-E 3
3. **Quick results** without conversation overhead

## 📝 API Endpoints

- `POST /api/anthropic-chat` - Main AI chat interface with tool calls
- `POST /api/generate-image-dalle` - DALL-E 3 image generation
- `POST /api/generate-image` - Gemini Flash image generation (legacy)

## 🛠️ Available Tools

### **generate_image**
- **Purpose**: Create images using DALL-E 3
- **Input**: Detailed prompt + optional style
- **Output**: High-quality generated image

### **analyze_content**
- **Purpose**: Analyze creative content and provide insights
- **Input**: Content + analysis type
- **Output**: Professional creative analysis

## 🎯 Next Steps

- Add video generation capabilities
- Implement image editing features
- Add user authentication
- Expand tool ecosystem
- Add more AI models and providers

## 🐛 Troubleshooting

- **API Key Errors**: Make sure both OpenRouter and Anthropic keys are in `.env.local`
- **Chat Not Working**: Verify Anthropic API key and restart server
- **Image Generation Fails**: Check OpenRouter API key and model availability
- **Tool Calls Fail**: Ensure all environment variables are properly set

## 🔐 Security Notes

- **Never commit** `.env.local` to version control
- **Keep API keys** secure and private
- **Monitor usage** through OpenRouter and Anthropic dashboards
- **Set rate limits** if needed for production use
