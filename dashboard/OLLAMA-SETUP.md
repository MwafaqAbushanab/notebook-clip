# Ollama Setup for CLIP Knowledge Dashboard

## Quick Start

### 1. Install Ollama

**Windows:**
Download from https://ollama.com/download/windows

**Linux/WSL:**
```bash
curl -fsSL https://ollama.com/install.sh | sh
```

**Mac:**
```bash
brew install ollama
```

### 2. Start Ollama Service

```bash
ollama serve
```

### 3. Download a Model

For best results with knowledge-base Q&A:
```bash
# Recommended - Good balance of speed and quality
ollama pull llama3.2

# Alternative - Smaller/faster
ollama pull phi3

# Alternative - More capable but slower
ollama pull mistral
```

### 4. Start the Dashboard

```bash
# Terminal 1 - Start backend
cd server
npm start

# Terminal 2 - Start frontend
npm run dev
```

### 5. Verify Connection

Open http://localhost:3003 and check the status indicator:
- **Green "AI Connected"** = Ollama working
- **Yellow "Local Mode"** = Using fallback TF-IDF search

## Troubleshooting

### Ollama not connecting

1. Check if Ollama is running:
   ```bash
   curl http://localhost:11434/api/tags
   ```

2. If not running, start it:
   ```bash
   ollama serve
   ```

3. Verify a model is installed:
   ```bash
   ollama list
   ```

### WSL-Specific Issues

If running in WSL, Ollama must be installed in WSL (not Windows):
```bash
# Inside WSL terminal
curl -fsSL https://ollama.com/install.sh | sh
ollama serve &
ollama pull llama3.2
```

### Change Model

Edit `server/index.js` line ~195:
```javascript
model: 'llama3.2',  // Change to your preferred model
```

## How It Works

1. **User asks a question**
2. **Backend retrieves relevant CLIP documents** using keyword matching
3. **Ollama LLM receives the question + context** with strict instructions
4. **LLM generates a natural answer** using ONLY the provided context
5. **If no relevant context** → Returns "I don't have that information"

The system prompt explicitly constrains the LLM:
> "Answer ONLY using the provided context. NEVER make up information or use outside knowledge."

## Resource Requirements

| Model | RAM | Speed | Quality |
|-------|-----|-------|---------|
| phi3 | ~4GB | Fast | Good |
| llama3.2 | ~5GB | Medium | Better |
| mistral | ~6GB | Medium | Better |
| llama3:8b | ~8GB | Slower | Best |

## Fallback Mode

When Ollama is not running, the dashboard uses a TF-IDF based search that:
- Returns the most relevant document chunks
- Works entirely offline
- No AI reasoning/synthesis
- Still useful for finding information
