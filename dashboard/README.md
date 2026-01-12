# Notebook CP - CLIP Knowledge Dashboard

A NotebookLM-style knowledge management interface for the Credit Line Increase Program (CLIP). This dashboard provides an interactive way to explore, query, and learn from CLIP documentation.

## Overview

Notebook CP transforms static CLIP documentation into an interactive knowledge base with AI-powered Q&A, training modules, operational insights, and more.

## Features

| Feature | Description |
|---------|-------------|
| **Notebook Tab** | Browse all source documents with AI-powered content generation |
| **Chat Tab** | Ask questions and get answers from the knowledge base |
| **Value Stream** | Visualize the end-to-end CLIP process flow |
| **Operations** | Access KPIs, team responsibilities, and runbooks |
| **Gap Analysis** | Review identified gaps and improvement recommendations |
| **Training** | Complete training modules for internal and external users |
| **Browse** | Search and explore all documentation |

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Ollama (optional, for AI-powered Q&A)

### Installation

```bash
# Navigate to dashboard directory
cd CLIP/dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3003`

### With AI Chat (Ollama)

For AI-powered Q&A functionality:

```bash
# Install Ollama (see OLLAMA-SETUP.md for details)
curl -fsSL https://ollama.com/install.sh | sh

# Pull a model
ollama pull llama3.2

# Start Ollama service
ollama serve

# In a new terminal, start the backend
cd server && npm start

# In another terminal, start the frontend
npm run dev
```

## Project Structure

```
dashboard/
├── src/
│   ├── components/
│   │   └── CLIPKnowledgeDashboard.jsx  # Main dashboard component
│   ├── data/
│   │   └── clipDocuments.js            # Knowledge base content
│   ├── utils/
│   │   └── vectorSearch.js             # Search functionality
│   ├── App.jsx                         # App entry point
│   ├── main.jsx                        # React mount point
│   └── index.css                       # Global styles
├── server/
│   └── index.js                        # Backend API for Ollama integration
├── dist/                               # Production build output
├── docs/                               # Additional documentation
├── OLLAMA-SETUP.md                     # Ollama setup guide
├── package.json                        # Dependencies and scripts
├── tailwind.config.js                  # Tailwind CSS configuration
├── vite.config.js                      # Vite build configuration
└── README.md                           # This file
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## Configuration

### Tailwind Theme

Custom colors are defined in `tailwind.config.js`:

```javascript
colors: {
  clip: {
    primary: '#2563eb',    // Blue
    secondary: '#7c3aed',  // Purple
    accent: '#0ea5e9',     // Sky blue
    dark: '#1e293b'        // Slate
  }
}
```

### Dark Mode

Dark mode is enabled by default and respects system preferences. Users can toggle it manually, and the preference is saved to localStorage.

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `1-7` | Switch between tabs |
| `Ctrl+K` | Focus chat input |
| `Ctrl+D` | Toggle dark mode |
| `?` | Show keyboard shortcuts help |

## Architecture

### Frontend
- **React 18** with functional components and hooks
- **Tailwind CSS** for styling with dark mode support
- **Lucide React** for icons
- **React Markdown** for content rendering

### Backend (Optional)
- **Express.js** server for API endpoints
- **Ollama** integration for AI-powered Q&A
- **TF-IDF fallback** when Ollama is unavailable

### Data Flow
1. User asks a question in the Chat tab
2. Backend retrieves relevant documents using keyword matching
3. If Ollama is available, it generates a natural language answer
4. Sources are displayed with relevance scores and excerpts

## Training Modules

### Internal Training (11 modules)
- CLIP Program Overview
- Products & Eligibility Criteria
- Data Requirements & Preparation
- Alteryx Workflow Training
- TransUnion Integration
- Folder Setup & File Management
- Troubleshooting Common Issues
- Client Onboarding Process
- Quality Assurance & Validation
- Advanced Configuration Options
- Reporting & Analytics

### External Training (7 modules)
- Getting Started with CLIP
- Preparing Your Data
- Understanding Your Results
- Best Practices
- Frequently Asked Questions
- Implementation Guide
- Security & Compliance

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Related Documentation

- [OLLAMA-SETUP.md](./OLLAMA-SETUP.md) - Detailed Ollama setup instructions
- [CLIP Complete Documentation](../docs/CLIP-Complete-Documentation.md)
- [CLIP Gap Analysis](../docs/CLIP_Gap_Analysis.md)
- [CLIP Training Guide](../docs/CLIP_Training_Guide.md)

## License

ISC License - See parent project for details.
