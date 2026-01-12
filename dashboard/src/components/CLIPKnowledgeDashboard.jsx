import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  BookOpen, MessageSquare, GitBranch, Settings, Search, Send,
  ChevronRight, FileText, Database, Shield, Clock, DollarSign,
  Users, AlertTriangle, CheckCircle, XCircle, Info, Lightbulb,
  Sun, Moon, Home, List, HelpCircle, Workflow, Zap, Target,
  CreditCard, Building, Phone, Mail, ExternalLink, Copy, Check,
  ChevronDown, ChevronUp, Filter, BarChart3, TrendingUp, Layers,
  Volume2, VolumeX, Play, Pause, FileQuestion, GraduationCap,
  Briefcase, Calendar, Sparkles, RefreshCw, Download, Share2,
  Mic, Radio, BookMarked, ListChecks, Map, Quote, Plus, X, Upload,
  Video, Link2, Globe, Image, FileAudio, Trash2, Eye, UploadCloud,
  GitMerge, ShieldAlert, FileWarning, Activity, Gauge, ClipboardList,
  UserCheck, Projector, TestTube, BookOpenCheck, ArrowRight, ArrowDown
} from 'lucide-react';
import { clipDocuments, sources, categories } from '../data/clipDocuments';
import { searchDocuments, keywordSearch, getDocumentsByCategory } from '../utils/vectorSearch';

const CLIPKnowledgeDashboard = () => {
  // State management
  const [activeTab, setActiveTab] = useState('notebook');
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedSources, setSelectedSources] = useState([]);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioContent, setAudioContent] = useState(null);
  const [studyGuide, setStudyGuide] = useState(null);
  const [briefingDoc, setBriefingDoc] = useState(null);
  const [timeline, setTimeline] = useState(null);
  const [generatedFAQ, setGeneratedFAQ] = useState(null);
  const [valueStream, setValueStream] = useState(null);
  const [gapAnalysis, setGapAnalysis] = useState(null);
  const [processImprovements, setProcessImprovements] = useState(null);
  const [riskAssessment, setRiskAssessment] = useState(null);
  const [showSourcePanel, setShowSourcePanel] = useState(true);
  const [activeGeneration, setActiveGeneration] = useState(null);
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [externalLinks, setExternalLinks] = useState([]);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [showAddSourceModal, setShowAddSourceModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [exportFormat, setExportFormat] = useState('confluence');
  const [confluenceSpace, setConfluenceSpace] = useState('');
  const [confluenceParentPage, setConfluenceParentPage] = useState('');
  const [knowledgeStats, setKnowledgeStats] = useState({ builtInChunks: 0, uploadedDocuments: 0, totalChunks: 0 });

  const chatEndRef = useRef(null);
  const speechSynthRef = useRef(null);
  const fileInputRef = useRef(null);
  const mediaInputRef = useRef(null);
  const folderInputRef = useRef(null);
  const documentInputRef = useRef(null);

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Fetch knowledge base stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/stats');
        if (response.ok) {
          const stats = await response.json();
          setKnowledgeStats(stats);
        }
      } catch (e) {
        console.log('Backend not available, using local knowledge base');
      }
    };
    fetchStats();
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  // Generate response from knowledge base ONLY
  const generateKnowledgeBaseResponse = useCallback((query) => {
    // Search the knowledge base
    const relevantDocs = searchDocuments(query, 5);

    if (relevantDocs.length === 0) {
      return {
        answer: "I couldn't find information about that in the CLIP knowledge base. Please ask about topics covered in the documentation such as:\n\n• CLIP parameters and eligibility criteria\n• Credit line increase tiers\n• TransUnion integration\n• Process workflow steps\n• File paths and folder setup\n• KPIs and metrics",
        sources: []
      };
    }

    // Build response from the most relevant documents
    const topDocs = relevantDocs.slice(0, 3);
    let response = "";
    const citedSources = [];

    topDocs.forEach((doc, idx) => {
      if (doc.score > 0.1) {
        response += doc.content + "\n\n";
        if (!citedSources.find(s => s.source === doc.source)) {
          citedSources.push({ source: doc.source, title: doc.title, category: doc.category });
        }
      }
    });

    if (!response.trim()) {
      // Fallback to keyword search
      const keywordResults = keywordSearch(query, 3);
      keywordResults.forEach(doc => {
        response += doc.content + "\n\n";
        if (!citedSources.find(s => s.source === doc.source)) {
          citedSources.push({ source: doc.source, title: doc.title, category: doc.category });
        }
      });
    }

    return {
      answer: response.trim() || "I found some related information but couldn't construct a complete answer. Try rephrasing your question or ask about specific CLIP topics.",
      sources: citedSources
    };
  }, []);

  // State for Ollama connection
  const [ollamaConnected, setOllamaConnected] = useState(false);
  const [useOllama, setUseOllama] = useState(true);

  // Check Ollama connection on mount
  useEffect(() => {
    const checkOllama = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/health');
        const data = await response.json();
        setOllamaConnected(data.ollama);
      } catch {
        setOllamaConnected(false);
      }
    };
    checkOllama();
    // Check every 30 seconds
    const interval = setInterval(checkOllama, 30000);
    return () => clearInterval(interval);
  }, []);

  // Handle chat message - uses Ollama backend if available
  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = { role: 'user', content: chatInput };
    setChatMessages(prev => [...prev, userMessage]);
    const currentInput = chatInput;
    setChatInput('');
    setIsTyping(true);

    // Helper function to use fallback
    const useFallback = () => {
      const { answer, sources: citedSources } = generateKnowledgeBaseResponse(currentInput);
      const assistantMessage = {
        role: 'assistant',
        content: answer,
        sources: citedSources,
        mode: 'local'
      };
      setChatMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    };

    // Try Ollama backend first if enabled
    if (useOllama) {
      try {
        const response = await fetch('http://localhost:3001/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: currentInput })
        });

        if (response.ok) {
          const data = await response.json();
          const assistantMessage = {
            role: 'assistant',
            content: data.response,
            sources: data.sources?.map(s => ({ source: s, title: s })) || [],
            mode: data.mode
          };
          setChatMessages(prev => [...prev, assistantMessage]);
          setIsTyping(false);
          return;
        } else {
          console.log('Backend returned non-ok status, using fallback');
          useFallback();
          return;
        }
      } catch (error) {
        console.log('Ollama backend not available, using fallback:', error.message);
        useFallback();
        return;
      }
    }

    // Fallback to local TF-IDF search (when useOllama is false)
    setTimeout(() => {
      useFallback();
    }, 300);
  };

  // Generate Audio Overview
  const generateAudioOverview = (format = 'deep-dive') => {
    setActiveGeneration('audio');

    // Build audio script from knowledge base
    const overviewDocs = getDocumentsByCategory('Overview');
    const paramsDocs = getDocumentsByCategory('Parameters');
    const processDocs = getDocumentsByCategory('Process Workflow');

    let script = "";

    if (format === 'deep-dive') {
      script = `Welcome to the CLIP Knowledge Audio Overview. Today we're doing a deep dive into the Credit Line Increase Program.

${overviewDocs.map(d => d.content).join(' ')}

Let's talk about the key parameters. ${paramsDocs.slice(0, 3).map(d => d.content).join(' ')}

Now for the process workflow. ${processDocs.slice(0, 2).map(d => d.content).join(' ')}

That's our deep dive into CLIP. Remember, this program has been helping credit unions increase member credit lines since 2015.`;
    } else if (format === 'brief') {
      script = `Quick CLIP Overview: ${overviewDocs[0]?.content || ''} Key point: minimum FICO score is 650, maximum credit limit is $20,000, and turnaround is 2-3 business days.`;
    }

    setAudioContent({
      format,
      script,
      duration: Math.ceil(script.split(' ').length / 150) + ' minutes'
    });
    setActiveGeneration(null);
  };

  // Text-to-Speech
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      if (audioPlaying) {
        window.speechSynthesis.cancel();
        setAudioPlaying(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.onend = () => setAudioPlaying(false);

      window.speechSynthesis.speak(utterance);
      setAudioPlaying(true);
      speechSynthRef.current = utterance;
    }
  };

  // Handle Media File Upload (Audio/Video)
  const handleMediaUpload = async (event) => {
    const files = Array.from(event.target.files);

    for (const file of files) {
      const isAudio = file.type.startsWith('audio/');
      const isVideo = file.type.startsWith('video/');

      if (!isAudio && !isVideo) {
        alert('Please upload audio or video files only');
        continue;
      }

      const mediaFile = {
        id: `media_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type: isAudio ? 'audio' : 'video',
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        url: URL.createObjectURL(file),
        uploadedAt: new Date().toISOString(),
        status: 'uploaded',
        transcript: null
      };

      setMediaFiles(prev => [...prev, mediaFile]);
    }
  };

  // Handle Document Upload (PDF, Word, Text files)
  const handleDocumentUpload = async (event) => {
    const files = Array.from(event.target.files);
    await processDocumentFiles(files);
  };

  // Handle Folder Upload (multiple documents AND media at once)
  const handleFolderUpload = async (event) => {
    const files = Array.from(event.target.files);

    // Supported file types
    const documentExtensions = ['.pdf', '.doc', '.docx', '.txt', '.md', '.rtf', '.csv', '.xlsx', '.xls'];
    const mediaExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.flac', '.mp4', '.mov', '.webm', '.avi', '.mkv', '.wmv', '.aac'];

    // Separate files by type
    const documentFiles = [];
    const mediaFilesToAdd = [];

    for (const file of files) {
      const ext = '.' + file.name.split('.').pop().toLowerCase();
      if (documentExtensions.includes(ext)) {
        documentFiles.push(file);
      } else if (mediaExtensions.includes(ext)) {
        mediaFilesToAdd.push(file);
      }
    }

    if (documentFiles.length === 0 && mediaFilesToAdd.length === 0) {
      alert('No supported files found in the folder.\n\nSupported documents: PDF, Word, Text, Markdown, CSV, Excel\nSupported media: MP3, WAV, OGG, M4A, FLAC, MP4, MOV, WebM, AVI, MKV');
      return;
    }

    // Process document files
    if (documentFiles.length > 0) {
      await processDocumentFiles(documentFiles);
    }

    // Process media files (audio/video)
    if (mediaFilesToAdd.length > 0) {
      const newMediaFiles = mediaFilesToAdd.map(file => {
        const isVideo = ['.mp4', '.mov', '.webm', '.avi', '.mkv', '.wmv'].includes('.' + file.name.split('.').pop().toLowerCase());
        return {
          id: `media_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          type: isVideo ? 'video' : 'audio',
          size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
          duration: null,
          url: URL.createObjectURL(file),
          status: 'uploaded',
          transcript: null,
          path: file.webkitRelativePath || file.name
        };
      });

      setMediaFiles(prev => [...prev, ...newMediaFiles]);
    }

    // Show combined summary
    const docCount = documentFiles.length;
    const mediaCount = mediaFilesToAdd.length;
    let summaryMsg = `📁 Folder Upload Complete!\n\n`;
    if (docCount > 0) summaryMsg += `📄 ${docCount} document(s)\n`;
    if (mediaCount > 0) summaryMsg += `🎬 ${mediaCount} media file(s)\n`;
    summaryMsg += `\nCheck Sources panel for details.`;
    alert(summaryMsg);

    // Refresh knowledge base stats
    try {
      const response = await fetch('http://localhost:3001/api/stats');
      if (response.ok) {
        const stats = await response.json();
        setKnowledgeStats(stats);
      }
    } catch (e) {
      console.log('Could not refresh stats');
    }
  };

  // Process uploaded document files - sends to backend for parsing (PDF, Word, etc.)
  const processDocumentFiles = async (files) => {
    const newDocs = [];

    // First, add all files to the UI immediately
    for (const file of files) {
      const ext = file.name.split('.').pop().toLowerCase();
      let docType = 'document';

      if (['pdf'].includes(ext)) docType = 'pdf';
      else if (['doc', 'docx'].includes(ext)) docType = 'word';
      else if (['txt', 'md', 'rtf'].includes(ext)) docType = 'text';
      else if (['csv', 'xlsx', 'xls'].includes(ext)) docType = 'spreadsheet';

      const doc = {
        id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        type: docType,
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        path: file.webkitRelativePath || file.name,
        uploadedAt: new Date().toISOString(),
        status: 'uploading',
        chunks: 0,
        summary: null
      };

      newDocs.push(doc);
    }

    setUploadedDocs(prev => [...prev, ...newDocs]);

    // Send all files to backend for parsing (including PDF and Word)
    let indexedCount = 0;
    let errorCount = 0;
    const results = [];

    try {
      const formData = new FormData();
      for (const file of files) {
        formData.append('files', file);
      }

      const response = await fetch('http://localhost:3001/api/upload', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        indexedCount = result.processed || 0;
        errorCount = result.failed || 0;
        results.push(...(result.results || []));

        // Update docs with their chunk counts
        setUploadedDocs(prev => prev.map(doc => {
          const backendResult = result.results?.find(r => r.name === doc.name);
          if (backendResult) {
            return {
              ...doc,
              status: 'indexed',
              chunks: backendResult.chunks || 0
            };
          }
          const errorResult = result.errors?.find(e => e.name === doc.name);
          if (errorResult) {
            return {
              ...doc,
              status: 'error',
              error: errorResult.error
            };
          }
          return doc;
        }));

        // Refresh knowledge base stats
        const statsResponse = await fetch('http://localhost:3001/api/stats');
        if (statsResponse.ok) {
          const stats = await statsResponse.json();
          setKnowledgeStats(stats);
        }
      }
    } catch (e) {
      console.error('Error uploading to backend:', e);
      // Mark all as error
      setUploadedDocs(prev => prev.map(doc =>
        newDocs.find(nd => nd.id === doc.id)
          ? { ...doc, status: 'error', error: 'Backend not available' }
          : doc
      ));
    }

    // Only show alert if called directly (not from folder upload)
    if (files.length > 0 && !window._folderUploadInProgress) {
      const totalChunks = results.reduce((sum, r) => sum + (r.chunks || 0), 0);
      const uploadMsg = files.length === 1 ? `1 file` : `${files.length} files`;
      const indexMsg = indexedCount > 0 ? `\n✅ ${indexedCount} parsed & indexed (${totalChunks} chunks)` : '';
      const errorMsg = errorCount > 0 ? `\n❌ ${errorCount} failed to parse` : '';
      alert(`Uploaded ${uploadMsg}${indexMsg}${errorMsg}`);
    }

    return { indexed: indexedCount, errors: errorCount };
  };

  // Transcribe Media File using Web Speech API
  const transcribeMedia = async (mediaId) => {
    const media = mediaFiles.find(m => m.id === mediaId);
    if (!media) return;

    setIsTranscribing(true);
    setMediaFiles(prev => prev.map(m =>
      m.id === mediaId ? { ...m, status: 'transcribing' } : m
    ));

    // Simulate transcription (in production, use Whisper API or similar)
    // For demo purposes, we'll use a mock transcription
    setTimeout(() => {
      const mockTranscript = `[Transcription of ${media.name}]

This is a simulated transcript of the uploaded ${media.type} file. In a production environment, this would use:

1. OpenAI Whisper API for accurate transcription
2. Azure Speech Services
3. Google Cloud Speech-to-Text
4. AWS Transcribe

The transcript would be automatically added to the CLIP knowledge base and become searchable.

Key topics detected: CLIP process, credit line increases, TransUnion integration, eligibility criteria.

Duration: ${media.type === 'audio' ? '5:32' : '12:45'}
Speaker count: ${Math.floor(Math.random() * 3) + 1}
Confidence: 94.7%`;

      setMediaFiles(prev => prev.map(m =>
        m.id === mediaId ? { ...m, status: 'transcribed', transcript: mockTranscript } : m
      ));
      setIsTranscribing(false);
    }, 2000);
  };

  // Add External Link (Lucidspark, diagrams, etc.)
  const addExternalLink = () => {
    if (!newLinkUrl.trim()) return;

    // Detect link type
    let linkType = 'webpage';
    if (newLinkUrl.includes('lucidspark') || newLinkUrl.includes('lucidchart')) {
      linkType = 'lucidspark';
    } else if (newLinkUrl.includes('miro.com')) {
      linkType = 'miro';
    } else if (newLinkUrl.includes('figma.com')) {
      linkType = 'figma';
    } else if (newLinkUrl.includes('confluence')) {
      linkType = 'confluence';
    } else if (newLinkUrl.includes('sharepoint') || newLinkUrl.includes('onedrive')) {
      linkType = 'sharepoint';
    } else if (newLinkUrl.includes('youtube') || newLinkUrl.includes('youtu.be')) {
      linkType = 'youtube';
    } else if (newLinkUrl.includes('loom.com')) {
      linkType = 'loom';
    }

    const link = {
      id: `link_${Date.now()}`,
      url: newLinkUrl,
      title: newLinkTitle || extractTitleFromUrl(newLinkUrl),
      type: linkType,
      addedAt: new Date().toISOString(),
      thumbnail: null,
      content: null // Would be fetched/scraped in production
    };

    setExternalLinks(prev => [...prev, link]);
    setNewLinkUrl('');
    setNewLinkTitle('');
  };

  // Extract title from URL
  const extractTitleFromUrl = (url) => {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/').filter(p => p);
      return pathParts[pathParts.length - 1]?.replace(/-/g, ' ') || urlObj.hostname;
    } catch {
      return 'External Link';
    }
  };

  // Get icon for link type
  const getLinkIcon = (type) => {
    switch (type) {
      case 'lucidspark': return <Sparkles className="w-4 h-4 text-orange-500" />;
      case 'miro': return <Layers className="w-4 h-4 text-yellow-500" />;
      case 'figma': return <Image className="w-4 h-4 text-purple-500" />;
      case 'confluence': return <FileText className="w-4 h-4 text-blue-500" />;
      case 'sharepoint': return <UploadCloud className="w-4 h-4 text-cyan-500" />;
      case 'youtube': return <Video className="w-4 h-4 text-red-500" />;
      case 'loom': return <Video className="w-4 h-4 text-purple-500" />;
      default: return <Globe className="w-4 h-4 text-gray-500" />;
    }
  };

  // Export to Confluence
  const exportToConfluence = async () => {
    if (!confluenceSpace) {
      alert('Please enter a Confluence space key');
      return;
    }

    setActiveGeneration('export');

    // Build the content for Confluence
    const content = buildConfluenceContent();

    // In production, this would call the Confluence API
    // For now, we'll generate the content and show export options
    setTimeout(() => {
      setActiveGeneration(null);
      downloadConfluenceExport(content);
    }, 1500);
  };

  // Build Confluence-compatible content
  const buildConfluenceContent = () => {
    const sections = [];

    // Source Documents & Resources section (FIRST - as requested by user)
    const docSources = sources.filter(s => s.type !== 'video');
    const videoSources = sources.filter(s => s.type === 'video');

    sections.push({
      title: 'Source Documents & Resources',
      content: `This knowledge base was built from the following source documents and recordings:\n\n` +
        `*Documentation (${docSources.length} files):*\n` +
        docSources.map(s => `- *${s.name}* (${s.type})\n  ${s.description || 'N/A'}\n  Knowledge chunks: ${clipDocuments.filter(d => d.source === s.name || (s.type === 'knowledge' && d.source === 'Operational Knowledge')).length}`).join('\n') +
        `\n\n*Meeting Recordings (${videoSources.length} videos):*\n` +
        videoSources.map(s => `- *${s.name}*\n  ${s.description || 'N/A'}\n  Duration: ${s.duration || 'N/A'} | Size: ${s.size || 'N/A'}\n  File: ${s.file || 'N/A'}`).join('\n') +
        (uploadedDocs.length > 0 ? `\n\n*User Uploaded Documents:*\n${uploadedDocs.map(d => `- ${d.name} (${d.type}, ${d.size})`).join('\n')}` : '') +
        (mediaFiles.length > 0 ? `\n\n*User Uploaded Media/Recordings:*\n${mediaFiles.map(m => `- ${m.name} (${m.type}, ${m.size})${m.transcript ? ' - Transcribed' : ''}`).join('\n')}` : '') +
        (externalLinks.length > 0 ? `\n\n*External Links:*\n${externalLinks.map(l => `- [${l.title}|${l.url}] (${l.type})`).join('\n')}` : '')
    });

    // Overview section
    sections.push({
      title: 'CLIP Overview',
      content: clipDocuments.filter(d => d.category === 'Overview').map(d => d.content).join('\n\n')
    });

    // Products section
    sections.push({
      title: 'Products',
      content: clipDocuments.filter(d => d.category === 'Products').map(d => d.content).join('\n\n')
    });

    // Parameters section
    sections.push({
      title: 'Eligibility Parameters',
      content: clipDocuments.filter(d => d.category === 'Parameters').map(d => d.content).join('\n\n')
    });

    // Increase Tiers section
    sections.push({
      title: 'Credit Line Increase Tiers',
      content: clipDocuments.filter(d => d.category === 'Increase Tiers').map(d => d.content).join('\n\n')
    });

    // Aggregate Limits section
    sections.push({
      title: 'Aggregate Limits',
      content: clipDocuments.filter(d => d.category === 'Aggregate Limits').map(d => d.content).join('\n\n')
    });

    // Exclusions section
    sections.push({
      title: 'Exclusion Criteria',
      content: clipDocuments.filter(d => d.category === 'Exclusions').map(d => d.content).join('\n\n')
    });

    // TransUnion section
    sections.push({
      title: 'TransUnion Integration',
      content: clipDocuments.filter(d => d.category === 'TransUnion').map(d => d.content).join('\n\n')
    });

    // Process section
    sections.push({
      title: 'Process Workflow',
      content: clipDocuments.filter(d => d.category === 'Process Workflow').map(d => d.content).join('\n\n')
    });

    // Data Requirements section
    sections.push({
      title: 'Data Requirements',
      content: clipDocuments.filter(d => d.category === 'Data Requirements' || d.category === 'Data Sources').map(d => d.content).join('\n\n')
    });

    // Automation section
    sections.push({
      title: 'Automation Framework',
      content: clipDocuments.filter(d => d.category.includes('Automation')).map(d => d.content).join('\n\n')
    });

    // KPIs section
    sections.push({
      title: 'KPIs & Metrics',
      content: clipDocuments.filter(d => d.category === 'KPIs').map(d => d.content).join('\n\n')
    });

    // Risks section
    sections.push({
      title: 'Risks',
      content: clipDocuments.filter(d => d.category === 'Risks').map(d => d.content).join('\n\n')
    });

    // Gaps section
    sections.push({
      title: 'Known Gaps',
      content: clipDocuments.filter(d => d.category === 'Gaps').map(d => d.content).join('\n\n')
    });

    // Include media transcripts
    if (mediaFiles.some(m => m.transcript)) {
      sections.push({
        title: 'Recorded Sessions & Transcripts',
        content: mediaFiles.filter(m => m.transcript).map(m =>
          `### ${m.name}\n${m.transcript}`
        ).join('\n\n')
      });
    }

    return sections;
  };

  // Download Confluence export
  const downloadConfluenceExport = (sections) => {
    let confluenceMarkup = `{panel:title=CLIP Knowledge Base|borderStyle=solid|borderColor=#ccc|titleBGColor=#f0f0f0|bgColor=#fff}
This documentation was auto-generated from the CLIP Knowledge Dashboard.
Generated: ${new Date().toLocaleString()}
{panel}\n\n`;

    sections.forEach(section => {
      confluenceMarkup += `h1. ${section.title}\n\n${section.content}\n\n----\n\n`;
    });

    // Create download
    const blob = new Blob([confluenceMarkup], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CLIP_Knowledge_Confluence_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setShowExportModal(false);
  };

  // Delete media file
  const deleteMediaFile = (mediaId) => {
    setMediaFiles(prev => prev.filter(m => m.id !== mediaId));
  };

  // Delete external link
  const deleteExternalLink = (linkId) => {
    setExternalLinks(prev => prev.filter(l => l.id !== linkId));
  };

  // Generate Study Guide
  const generateStudyGuide = () => {
    setActiveGeneration('study');

    const guide = {
      title: "CLIP Study Guide",
      sections: [
        {
          name: "Core Concepts",
          items: [
            { term: "CLIP", definition: "Credit Line Increase Program - automated CLI analysis service for credit unions" },
            { term: "CLI", definition: "Credit Line Increase" },
            { term: "Eligibility", definition: "Min FICO 650, Min Income $20K, Max DTI 50%, Min Age 21" },
            { term: "Turnaround", definition: "2-3 business days standard" }
          ]
        },
        {
          name: "Credit Score Tiers",
          items: [
            { term: "Excellent (776-850)", definition: "$25,000 max aggregate limit" },
            { term: "Good (726-775)", definition: "$18,000 max aggregate limit" },
            { term: "Fair (650-725)", definition: "$13,000 max aggregate limit" },
            { term: "Below 650", definition: "Not eligible" }
          ]
        },
        {
          name: "Increase Tiers",
          items: [
            { term: "<$1,000", definition: "Increases to $1,500" },
            { term: "$1K-$2K", definition: "Increases to $3,000" },
            { term: "$5K-$7.5K", definition: "Increases to $10,000" },
            { term: "$10K-$15K", definition: "Increases to $20,000 (max)" }
          ]
        },
        {
          name: "Key Process Steps",
          items: [
            { term: "Phase 1", definition: "Data Preparation - Input setup, account age formula, CORP ID lookup" },
            { term: "Phase 2", definition: "TransUnion Integration - Upload to DEG, download response, run Step 2" },
            { term: "Phase 3", definition: "Parameter Configuration - Credit metrics, exclusions, CLI rules" },
            { term: "Phase 4", definition: "Aggregate Limits - Multi-product handling, credit limit buckets" }
          ]
        }
      ],
      quizQuestions: [
        { q: "What is the minimum FICO score for CLIP eligibility?", a: "650" },
        { q: "What is the maximum credit limit per product?", a: "$20,000" },
        { q: "How many fields does TransUnion provide?", a: "419 fields" },
        { q: "What is the standard turnaround time?", a: "2-3 business days" },
        { q: "What is the max aggregate limit for Excellent credit (776-850)?", a: "$25,000" }
      ]
    };

    setTimeout(() => {
      setStudyGuide(guide);
      setActiveGeneration(null);
    }, 1000);
  };

  // Generate Briefing Doc
  const generateBriefingDoc = () => {
    setActiveGeneration('briefing');

    const briefing = {
      title: "CLIP Executive Briefing",
      date: new Date().toLocaleDateString(),
      sections: [
        {
          heading: "Program Overview",
          content: "CLIP (Credit Line Increase Program) is Trellance/Rise Analytics' automated credit line increase analysis service for credit unions, operating since 2015-2016 with 60-70% typical approval rate."
        },
        {
          heading: "Key Metrics",
          bullets: [
            "Turnaround: 2-3 business days",
            "Target CLI Approval Rate: 65-75%",
            "Average Credit Line Increase: $2,500+",
            "Processing Accuracy Target: <1% error rate"
          ]
        },
        {
          heading: "Eligibility Requirements",
          bullets: [
            "Minimum FICO Score: 650",
            "Minimum Income: $20,000",
            "Maximum DTI: 50%",
            "Account Age: >12 months",
            "Days Past Due: 0"
          ]
        },
        {
          heading: "Products Supported",
          bullets: [
            "Credit Cards (most common)",
            "Unsecured Lines of Credit",
            "HELOCs (Home Equity Lines of Credit)"
          ]
        },
        {
          heading: "Technology Stack",
          bullets: [
            "Current: Alteryx workflows",
            "Credit Bureau: TransUnion (419 fields)",
            "Data Storage: Snowflake TR_ANALYTICS_*",
            "Future: Python/dbt migration planned"
          ]
        }
      ]
    };

    setTimeout(() => {
      setBriefingDoc(briefing);
      setActiveGeneration(null);
    }, 1000);
  };

  // Generate Timeline
  const generateTimeline = () => {
    setActiveGeneration('timeline');

    const timelineData = {
      title: "CLIP Process Timeline",
      events: [
        { day: "Day 1", phase: "Data Receipt", items: ["Receive member data from CU", "Input file setup", "Run initial workflow", "Submit to TransUnion DEG"] },
        { day: "Day 2", phase: "Processing", items: ["Download TU response", "Run CLIP Step 2", "Configure parameters", "Apply exclusion criteria"] },
        { day: "Day 3", phase: "Delivery", items: ["Run aggregate limits", "QA review", "Generate outputs", "Deliver to client"] }
      ],
      milestones: [
        { year: "2015-2016", event: "CLIP Program launched" },
        { year: "Current", event: "Alteryx-based processing" },
        { year: "Future", event: "Python/dbt migration planned" }
      ]
    };

    setTimeout(() => {
      setTimeline(timelineData);
      setActiveGeneration(null);
    }, 1000);
  };

  // Generate FAQ
  const generateFAQ = () => {
    setActiveGeneration('faq');

    const faq = {
      title: "Auto-Generated FAQ",
      questions: [
        { q: "What is CLIP?", a: "CLIP (Credit Line Increase Program) is Trellance/Rise Analytics' automated credit line increase analysis service for credit unions, identifying members eligible for credit line increases across Credit Cards, Unsecured LOCs, and HELOCs." },
        { q: "What are the eligibility requirements?", a: "Minimum FICO: 650, Minimum Income: $20,000, Maximum DTI: 50%, Minimum Age: 21, Account Age: >12 months, Days Past Due: 0" },
        { q: "How long does processing take?", a: "Standard turnaround is 2-3 business days. Rush processing available for 1 business day with additional fee." },
        { q: "What credit bureau is used?", a: "TransUnion, providing 419 available fields. Batch submission via Data Exchange Gateway (DEG)." },
        { q: "What are the credit score tiers?", a: "Excellent (776-850): $25K max, Good (726-775): $18K max, Fair (650-725): $13K max, Below 650: Not eligible" },
        { q: "What causes exclusion?", a: "Bankruptcy, charged-off accounts, active collections, delinquencies, fraud alerts, credit freeze, overlimit status, recent CLI within 6-12 months" },
        { q: "Who are the TransUnion contacts?", a: "Primary: Jen Werkley (jen.werkley@transunion.com), Secondary: Abbie Jeremiah (Abbie.Jeremiah@transunion.com)" },
        { q: "Where are files stored?", a: "S: drive at S:\\Products\\CLIP (Credit Line Increase Program)\\, with client sharing via Box at trellance.app.box.com" }
      ]
    };

    setTimeout(() => {
      setGeneratedFAQ(faq);
      setActiveGeneration(null);
    }, 1000);
  };

  // Generate Value Stream Map
  const generateValueStream = () => {
    setActiveGeneration('valuestream');

    const valueStreamData = {
      title: "CLIP Value Stream Map",
      description: "End-to-end value delivery from member data to credit line increase approval",
      stages: [
        {
          name: "Member Data Collection",
          activities: ["Receive CU member data", "Validate required fields", "Quality check SSN/DOB"],
          leadTime: "0.5 days",
          processTime: "2 hours",
          valueAdd: true,
          owner: "Credit Union"
        },
        {
          name: "Data Preparation",
          activities: ["Configure input tool", "Update account age formula", "Look up CORP ID", "Generate TU submission file"],
          leadTime: "0.5 days",
          processTime: "3 hours",
          valueAdd: true,
          owner: "Rise Analytics"
        },
        {
          name: "TransUnion Processing",
          activities: ["Submit to DEG", "Batch credit pulls", "Download response files"],
          leadTime: "1 day",
          processTime: "4-24 hours",
          valueAdd: true,
          owner: "TransUnion"
        },
        {
          name: "Analysis & Scoring",
          activities: ["Merge TU data", "Apply eligibility rules", "Calculate risk scores", "Determine increase amounts"],
          leadTime: "0.5 days",
          processTime: "4 hours",
          valueAdd: true,
          owner: "Rise Analytics (Alteryx)"
        },
        {
          name: "Aggregate Limits",
          activities: ["Handle multi-product members", "Apply credit limit buckets", "Prioritize CC over LOC"],
          leadTime: "0.25 days",
          processTime: "2 hours",
          valueAdd: true,
          owner: "Rise Analytics"
        },
        {
          name: "Output & Delivery",
          activities: ["Generate output files", "QA review", "Upload to Box", "Notify client"],
          leadTime: "0.25 days",
          processTime: "1 hour",
          valueAdd: true,
          owner: "Rise Analytics"
        }
      ],
      metrics: {
        totalLeadTime: "2-3 days",
        totalProcessTime: "16-36 hours",
        valueAddRatio: "45-60%",
        handoffs: 4,
        waitTime: "40-55%"
      },
      opportunities: [
        "Automate CORP ID lookup to eliminate manual search",
        "Pre-validate member data at CU level to reduce rework",
        "Implement real-time TransUnion API vs batch processing",
        "Add automated QA checks to reduce manual review"
      ]
    };

    setTimeout(() => {
      setValueStream(valueStreamData);
      setActiveGeneration(null);
    }, 1500);
  };

  // Generate Gap Analysis
  const generateGapAnalysis = () => {
    setActiveGeneration('gaps');

    // Extract gaps from knowledge base
    const gapDocs = clipDocuments.filter(d =>
      d.category === 'Gaps' || d.content.toLowerCase().includes('gap') || d.content.toLowerCase().includes('missing')
    );

    const gapAnalysisData = {
      title: "CLIP Gap Analysis",
      summary: "Analysis of documentation, process, and capability gaps identified in the CLIP knowledge base",
      gaps: [
        {
          id: 1,
          category: "Documentation",
          title: "TransUnion Field Mapping",
          description: "Complete documentation of all 419 TransUnion fields and their usage in CLIP calculations",
          severity: "Critical",
          impact: "Unable to fully understand or modify scoring logic",
          recommendation: "Create comprehensive field mapping document with business definitions",
          effort: "Medium",
          priority: 1
        },
        {
          id: 2,
          category: "Compliance",
          title: "Adverse Action Letters",
          description: "Templates and procedures for notifying declined members per FCRA/ECOA requirements",
          severity: "Critical",
          impact: "Regulatory risk if not properly documented and followed",
          recommendation: "Document adverse action process and letter templates",
          effort: "High",
          priority: 1
        },
        {
          id: 3,
          category: "Process",
          title: "Credit Freeze Handling",
          description: "Process for handling members with credit freezes on their TransUnion file",
          severity: "Critical",
          impact: "Members with freezes may be incorrectly excluded",
          recommendation: "Define process for freeze detection and member notification",
          effort: "Medium",
          priority: 2
        },
        {
          id: 4,
          category: "Data",
          title: "Income Verification Process",
          description: "How income is verified for DTI calculation and what sources are accepted",
          severity: "Critical",
          impact: "DTI calculations may be inaccurate",
          recommendation: "Document income verification sources and validation rules",
          effort: "Low",
          priority: 2
        },
        {
          id: 5,
          category: "Operations",
          title: "Rush Processing Details",
          description: "Pricing, SLA, and process for rush CLI requests",
          severity: "Medium",
          impact: "Inconsistent rush handling and pricing",
          recommendation: "Create rush processing SOP with pricing matrix",
          effort: "Low",
          priority: 3
        },
        {
          id: 6,
          category: "Governance",
          title: "Parameter Change Approval",
          description: "Who approves parameter changes and the approval workflow",
          severity: "Medium",
          impact: "Unauthorized changes could affect program integrity",
          recommendation: "Define change control board and approval process",
          effort: "Medium",
          priority: 3
        },
        {
          id: 7,
          category: "Operations",
          title: "Data Retention Policy",
          description: "How long data is kept and archival/purge procedures",
          severity: "Medium",
          impact: "Compliance and storage cost issues",
          recommendation: "Define retention periods per data type and implement automation",
          effort: "Medium",
          priority: 4
        },
        {
          id: 8,
          category: "Technology",
          title: "DR/BC Plan",
          description: "Disaster Recovery and Business Continuity plan for CLIP operations",
          severity: "Medium",
          impact: "Extended outage if primary systems fail",
          recommendation: "Document recovery procedures and test annually",
          effort: "High",
          priority: 4
        }
      ],
      statistics: {
        total: 8,
        critical: 4,
        medium: 4,
        low: 0,
        byCategory: {
          "Documentation": 1,
          "Compliance": 1,
          "Process": 1,
          "Data": 1,
          "Operations": 2,
          "Governance": 1,
          "Technology": 1
        }
      }
    };

    setTimeout(() => {
      setGapAnalysis(gapAnalysisData);
      setActiveGeneration(null);
    }, 1500);
  };

  // Generate Process Improvements
  const generateProcessImprovement = () => {
    setActiveGeneration('improvements');

    const improvementsData = {
      title: "CLIP Process Improvement Opportunities",
      description: "AI-identified opportunities to improve efficiency, quality, and member experience",
      improvements: [
        {
          id: 1,
          area: "Automation",
          title: "Migrate from Alteryx to Python/dbt",
          currentState: "Manual Alteryx workflow execution with multiple steps",
          futureState: "Automated Python/dbt pipeline with scheduled runs",
          benefits: ["Reduce processing time by 40%", "Eliminate manual errors", "Enable real-time processing"],
          effort: "High",
          impact: "High",
          timeline: "6-12 months",
          dependencies: ["Data engineering resources", "Snowflake infrastructure"]
        },
        {
          id: 2,
          area: "Data Quality",
          title: "Implement Pre-Processing Validation",
          currentState: "Data issues discovered during processing",
          futureState: "Automated data validation at intake",
          benefits: ["Reduce rework by 60%", "Faster turnaround", "Better CU experience"],
          effort: "Medium",
          impact: "High",
          timeline: "2-3 months",
          dependencies: ["Validation rule definition"]
        },
        {
          id: 3,
          area: "Integration",
          title: "Real-Time TransUnion API",
          currentState: "Batch processing with 24-hour turnaround",
          futureState: "Real-time credit pulls for immediate decisions",
          benefits: ["Instant CLI decisions", "Better member experience", "Competitive advantage"],
          effort: "High",
          impact: "High",
          timeline: "6-9 months",
          dependencies: ["TransUnion API contract", "Infrastructure changes"]
        },
        {
          id: 4,
          area: "Analytics",
          title: "ML-Based Risk Scoring",
          currentState: "Rule-based eligibility with fixed thresholds",
          futureState: "Machine learning model for dynamic risk assessment",
          benefits: ["Higher approval rates", "Lower default risk", "Personalized limits"],
          effort: "High",
          impact: "High",
          timeline: "9-12 months",
          dependencies: ["Historical performance data", "Data science resources"]
        },
        {
          id: 5,
          area: "Self-Service",
          title: "CU Parameter Configuration Portal",
          currentState: "Email-based parameter change requests",
          futureState: "Self-service portal for CU administrators",
          benefits: ["Faster parameter updates", "Reduced support tickets", "Better audit trail"],
          effort: "Medium",
          impact: "Medium",
          timeline: "3-6 months",
          dependencies: ["Web development resources"]
        },
        {
          id: 6,
          area: "Reporting",
          title: "Real-Time Dashboard",
          currentState: "Post-processing summary statistics",
          futureState: "Live dashboard with processing status and KPIs",
          benefits: ["Visibility into processing", "Proactive issue detection", "Better SLA management"],
          effort: "Medium",
          impact: "Medium",
          timeline: "2-4 months",
          dependencies: ["BI tool selection"]
        }
      ],
      priorityMatrix: {
        quickWins: ["Pre-Processing Validation", "Real-Time Dashboard"],
        majorProjects: ["Python/dbt Migration", "Real-Time TransUnion API", "ML Risk Scoring"],
        fillIns: ["CU Parameter Portal"]
      },
      estimatedROI: {
        costSavings: "$150,000-250,000/year",
        timeReduction: "40-60%",
        qualityImprovement: "30% fewer errors",
        memberImpact: "15% higher approval rates"
      }
    };

    setTimeout(() => {
      setProcessImprovements(improvementsData);
      setActiveGeneration(null);
    }, 1500);
  };

  // Generate Risk Assessment
  const generateRiskAssessment = () => {
    setActiveGeneration('risks');

    const riskData = {
      title: "CLIP Risk Assessment",
      description: "Comprehensive risk analysis based on knowledge base documentation",
      risks: [
        {
          id: 1,
          category: "Operational",
          title: "Single Point of Failure in Processing",
          description: "CLIP processing relies on individual Alteryx workflows that require manual execution",
          likelihood: "Medium",
          impact: "High",
          riskScore: "High",
          currentControls: ["Documented procedures", "Backup personnel training"],
          mitigations: ["Automate workflows", "Implement monitoring", "Cross-train team members"],
          owner: "Operations Lead"
        },
        {
          id: 2,
          category: "Compliance",
          title: "FCRA/ECOA Violation Risk",
          description: "Adverse action documentation and processes not fully documented",
          likelihood: "Low",
          impact: "Critical",
          riskScore: "High",
          currentControls: ["Standard output letters"],
          mitigations: ["Document adverse action process", "Legal review", "Annual compliance audit"],
          owner: "Compliance Officer"
        },
        {
          id: 3,
          category: "Data Security",
          title: "PII Data Exposure",
          description: "Member SSN and financial data handled across multiple systems",
          likelihood: "Low",
          impact: "Critical",
          riskScore: "High",
          currentControls: ["Access controls", "Encryption at rest"],
          mitigations: ["Implement data masking", "Enhanced logging", "Regular security audits"],
          owner: "Security Team"
        },
        {
          id: 4,
          category: "Vendor",
          title: "TransUnion Dependency",
          description: "100% reliance on TransUnion for credit data with no backup bureau",
          likelihood: "Low",
          impact: "High",
          riskScore: "Medium",
          currentControls: ["SLA monitoring", "Relationship management"],
          mitigations: ["Evaluate secondary bureau", "Negotiate SLA terms", "Incident response plan"],
          owner: "Vendor Management"
        },
        {
          id: 5,
          category: "Technology",
          title: "Legacy Technology Stack",
          description: "Alteryx workflows aging and dependent on specific versions",
          likelihood: "Medium",
          impact: "Medium",
          riskScore: "Medium",
          currentControls: ["Version control", "Testing procedures"],
          mitigations: ["Modernization roadmap", "Python migration", "Documentation"],
          owner: "Technology Lead"
        },
        {
          id: 6,
          category: "Financial",
          title: "Credit Loss from Incorrect CLI",
          description: "Risk of extending credit to ineligible members due to processing errors",
          likelihood: "Low",
          impact: "High",
          riskScore: "Medium",
          currentControls: ["QA review process", "Parameter validation"],
          mitigations: ["Automated validation rules", "Dual approval for large increases", "Regular audits"],
          owner: "Risk Management"
        }
      ],
      summary: {
        totalRisks: 6,
        highRisks: 3,
        mediumRisks: 3,
        lowRisks: 0,
        overallRiskRating: "Medium-High",
        recommendedActions: [
          "Address adverse action documentation immediately",
          "Accelerate technology modernization",
          "Implement enhanced monitoring and alerting",
          "Conduct quarterly risk reviews"
        ]
      }
    };

    setTimeout(() => {
      setRiskAssessment(riskData);
      setActiveGeneration(null);
    }, 1500);
  };

  // Notebook Tab (Main NotebookLM-style interface)
  const NotebookTab = () => (
    <div className="flex h-[calc(100vh-140px)]">
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={mediaInputRef}
        onChange={handleMediaUpload}
        accept="audio/*,video/*"
        multiple
        className="hidden"
      />
      <input
        type="file"
        ref={documentInputRef}
        onChange={handleDocumentUpload}
        accept=".pdf,.doc,.docx,.txt,.md,.rtf,.csv,.xlsx,.xls"
        multiple
        className="hidden"
      />
      <input
        type="file"
        ref={folderInputRef}
        onChange={handleFolderUpload}
        {...{ webkitdirectory: "", directory: "" }}
        multiple
        className="hidden"
      />

      {/* Sources Panel */}
      {showSourcePanel && (
        <div className="w-80 border-r dark:border-gray-700 bg-white dark:bg-gray-800 overflow-y-auto">
          <div className="p-4 border-b dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4" /> Sources
              </h3>
              <button
                onClick={() => setShowAddSourceModal(true)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <Plus className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {sources.length + uploadedDocs.length + mediaFiles.length + externalLinks.length} sources loaded
            </p>
            {/* Knowledge Base Stats */}
            <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-xs font-medium text-green-700 dark:text-green-300">
                📚 Knowledge Base: {knowledgeStats.totalChunks} chunks indexed
              </p>
              <p className="text-xs text-green-600 dark:text-green-400">
                {knowledgeStats.builtInChunks} built-in • {knowledgeStats.uploadedDocuments} uploaded
              </p>
            </div>
          </div>

          {/* Quick Add Buttons */}
          <div className="p-3 border-b dark:border-gray-700 space-y-2">
            <button
              onClick={() => documentInputRef.current?.click()}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            >
              <FileText className="w-4 h-4" />
              Upload Documents
            </button>
            <button
              onClick={() => folderInputRef.current?.click()}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
            >
              <UploadCloud className="w-4 h-4" />
              Upload Folder
            </button>
            <button
              onClick={() => mediaInputRef.current?.click()}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
            >
              <Mic className="w-4 h-4" />
              Upload Recording (Audio/Video)
            </button>
            <button
              onClick={() => setShowAddSourceModal(true)}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
            >
              <Link2 className="w-4 h-4" />
              Add Link (Lucidspark, etc.)
            </button>
          </div>

          {/* Document Sources */}
          <div className="p-2">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 px-2 py-1 uppercase">Documents & Recordings ({sources.length})</p>
            {sources.map((source, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg mb-2 cursor-pointer transition-colors ${
                  selectedSources.includes(source.id)
                    ? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700 border border-transparent'
                }`}
                onClick={() => {
                  if (selectedSources.includes(source.id)) {
                    setSelectedSources(prev => prev.filter(s => s !== source.id));
                  } else {
                    setSelectedSources(prev => [...prev, source.id]);
                  }
                }}
              >
                <div className="flex items-center gap-2">
                  {source.type === 'video' ? (
                    <Video className="w-4 h-4 text-purple-500" />
                  ) : (
                    <FileText className={`w-4 h-4 ${source.type === 'pdf' ? 'text-red-500' : source.type === 'knowledge' ? 'text-green-500' : 'text-blue-500'}`} />
                  )}
                  <span className="text-sm font-medium dark:text-white truncate">{source.name}</span>
                </div>
                {source.description && (
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-1 line-clamp-2">
                    {source.description}
                  </div>
                )}
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2 flex-wrap">
                  <span className={`px-1.5 py-0.5 rounded ${source.type === 'video' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' : 'bg-gray-100 dark:bg-gray-700'}`}>{source.type}</span>
                  {source.duration && <span className="text-purple-600 dark:text-purple-400">{source.duration}</span>}
                  {source.size && <span>{source.size}</span>}
                  {source.type !== 'video' && <span>{clipDocuments.filter(d => d.source === source.name || (source.type === 'knowledge' && d.source === 'Operational Knowledge')).length} chunks</span>}
                </div>
              </div>
            ))}
          </div>

          {/* Uploaded Documents */}
          {uploadedDocs.length > 0 && (
            <div className="p-2 border-t dark:border-gray-700">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 px-2 py-1 uppercase">
                Uploaded ({uploadedDocs.length})
              </p>
              {uploadedDocs.map((doc) => (
                <div key={doc.id} className="p-3 rounded-lg mb-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium dark:text-white truncate flex-1" title={doc.path || doc.name}>
                      {doc.name}
                    </span>
                    <button
                      onClick={() => setUploadedDocs(prev => prev.filter(d => d.id !== doc.id))}
                      className="p-1 hover:bg-blue-200 dark:hover:bg-blue-800 rounded"
                    >
                      <Trash2 className="w-3 h-3 text-blue-500" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-blue-600 dark:text-blue-400">{doc.size} • {doc.type}</span>
                    {doc.status === 'processed' && (
                      <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Indexed
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Media Files (Audio/Video) */}
          {mediaFiles.length > 0 && (
            <div className="p-2 border-t dark:border-gray-700">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 px-2 py-1 uppercase">Recordings</p>
              {mediaFiles.map((media) => (
                <div key={media.id} className="p-3 rounded-lg mb-2 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center gap-2 mb-2">
                    {media.type === 'audio' ? (
                      <FileAudio className="w-4 h-4 text-purple-500" />
                    ) : (
                      <Video className="w-4 h-4 text-purple-500" />
                    )}
                    <span className="text-sm font-medium dark:text-white truncate flex-1">{media.name}</span>
                    <button
                      onClick={() => deleteMediaFile(media.id)}
                      className="p-1 hover:bg-purple-200 dark:hover:bg-purple-800 rounded"
                    >
                      <Trash2 className="w-3 h-3 text-purple-500" />
                    </button>
                  </div>
                  <div className="text-xs text-purple-600 dark:text-purple-400 mb-2">{media.size}</div>
                  {media.status === 'uploaded' && (
                    <button
                      onClick={() => transcribeMedia(media.id)}
                      className="text-xs px-2 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
                    >
                      Transcribe
                    </button>
                  )}
                  {media.status === 'transcribing' && (
                    <div className="flex items-center gap-2 text-xs text-purple-600">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      Transcribing...
                    </div>
                  )}
                  {media.status === 'transcribed' && (
                    <div className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Transcribed & Indexed
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* External Links */}
          {externalLinks.length > 0 && (
            <div className="p-2 border-t dark:border-gray-700">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 px-2 py-1 uppercase">External Links</p>
              {externalLinks.map((link) => (
                <div key={link.id} className="p-3 rounded-lg mb-2 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                  <div className="flex items-center gap-2">
                    {getLinkIcon(link.type)}
                    <span className="text-sm font-medium dark:text-white truncate flex-1">{link.title}</span>
                    <button
                      onClick={() => deleteExternalLink(link.id)}
                      className="p-1 hover:bg-orange-200 dark:hover:bg-orange-800 rounded"
                    >
                      <Trash2 className="w-3 h-3 text-orange-500" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs px-2 py-0.5 bg-orange-100 dark:bg-orange-800 text-orange-700 dark:text-orange-300 rounded capitalize">
                      {link.type}
                    </span>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-orange-600 hover:underline flex items-center gap-1"
                    >
                      Open <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Generation Options */}
        <div className="p-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">Generate:</span>

            <button
              onClick={() => generateAudioOverview('deep-dive')}
              disabled={activeGeneration === 'audio'}
              className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors disabled:opacity-50"
            >
              <Radio className="w-4 h-4" />
              {activeGeneration === 'audio' ? 'Generating...' : 'Audio Overview'}
            </button>

            <button
              onClick={generateStudyGuide}
              disabled={activeGeneration === 'study'}
              className="flex items-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors disabled:opacity-50"
            >
              <GraduationCap className="w-4 h-4" />
              {activeGeneration === 'study' ? 'Generating...' : 'Study Guide'}
            </button>

            <button
              onClick={generateBriefingDoc}
              disabled={activeGeneration === 'briefing'}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors disabled:opacity-50"
            >
              <Briefcase className="w-4 h-4" />
              {activeGeneration === 'briefing' ? 'Generating...' : 'Briefing Doc'}
            </button>

            <button
              onClick={generateTimeline}
              disabled={activeGeneration === 'timeline'}
              className="flex items-center gap-2 px-3 py-1.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-sm hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors disabled:opacity-50"
            >
              <Calendar className="w-4 h-4" />
              {activeGeneration === 'timeline' ? 'Generating...' : 'Timeline'}
            </button>

            <button
              onClick={generateFAQ}
              disabled={activeGeneration === 'faq'}
              className="flex items-center gap-2 px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full text-sm hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors disabled:opacity-50"
            >
              <HelpCircle className="w-4 h-4" />
              {activeGeneration === 'faq' ? 'Generating...' : 'FAQ'}
            </button>

            <button
              onClick={generateValueStream}
              disabled={activeGeneration === 'valuestream'}
              className="flex items-center gap-2 px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors disabled:opacity-50"
            >
              <Workflow className="w-4 h-4" />
              {activeGeneration === 'valuestream' ? 'Generating...' : 'Value Stream'}
            </button>

            <button
              onClick={generateGapAnalysis}
              disabled={activeGeneration === 'gaps'}
              className="flex items-center gap-2 px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full text-sm hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors disabled:opacity-50"
            >
              <AlertTriangle className="w-4 h-4" />
              {activeGeneration === 'gaps' ? 'Generating...' : 'Gap Analysis'}
            </button>

            <button
              onClick={generateProcessImprovement}
              disabled={activeGeneration === 'improvements'}
              className="flex items-center gap-2 px-3 py-1.5 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 rounded-full text-sm hover:bg-teal-200 dark:hover:bg-teal-900/50 transition-colors disabled:opacity-50"
            >
              <TrendingUp className="w-4 h-4" />
              {activeGeneration === 'improvements' ? 'Generating...' : 'Improvements'}
            </button>

            <button
              onClick={generateRiskAssessment}
              disabled={activeGeneration === 'risks'}
              className="flex items-center gap-2 px-3 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 rounded-full text-sm hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors disabled:opacity-50"
            >
              <Shield className="w-4 h-4" />
              {activeGeneration === 'risks' ? 'Generating...' : 'Risk Assessment'}
            </button>
          </div>
        </div>

        {/* Generated Content Display */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Audio Overview */}
          {audioContent && (
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-4 text-white">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <Radio className="w-5 h-5" /> Audio Overview ({audioContent.format})
                </h3>
                <span className="text-sm opacity-80">{audioContent.duration}</span>
              </div>
              <div className="bg-white/20 rounded-lg p-3 mb-3 max-h-32 overflow-y-auto text-sm">
                {audioContent.script.substring(0, 300)}...
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => speakText(audioContent.script)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                >
                  {audioPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {audioPlaying ? 'Pause' : 'Play'}
                </button>
                <button
                  onClick={() => setAudioContent(null)}
                  className="p-2 hover:bg-white/20 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Study Guide */}
          {studyGuide && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 overflow-hidden">
              <div className="bg-green-500 text-white px-4 py-3 flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" /> {studyGuide.title}
                </h3>
                <button onClick={() => setStudyGuide(null)} className="p-1 hover:bg-white/20 rounded">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4 space-y-4">
                {studyGuide.sections.map((section, idx) => (
                  <div key={idx}>
                    <h4 className="font-medium text-green-600 dark:text-green-400 mb-2">{section.name}</h4>
                    <div className="space-y-2">
                      {section.items.map((item, i) => (
                        <div key={i} className="flex text-sm">
                          <span className="font-medium dark:text-white w-40 flex-shrink-0">{item.term}</span>
                          <span className="text-gray-600 dark:text-gray-400">{item.definition}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="border-t dark:border-gray-700 pt-4 mt-4">
                  <h4 className="font-medium text-green-600 dark:text-green-400 mb-2">Quiz Yourself</h4>
                  {studyGuide.quizQuestions.map((q, idx) => (
                    <details key={idx} className="mb-2">
                      <summary className="cursor-pointer text-sm dark:text-white hover:text-green-600">{q.q}</summary>
                      <p className="text-sm text-gray-600 dark:text-gray-400 pl-4 mt-1">Answer: {q.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Briefing Doc */}
          {briefingDoc && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 overflow-hidden">
              <div className="bg-blue-500 text-white px-4 py-3 flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
                  <Briefcase className="w-5 h-5" /> {briefingDoc.title}
                </h3>
                <button onClick={() => setBriefingDoc(null)} className="p-1 hover:bg-white/20 rounded">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4 space-y-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">Generated: {briefingDoc.date}</p>
                {briefingDoc.sections.map((section, idx) => (
                  <div key={idx}>
                    <h4 className="font-medium text-blue-600 dark:text-blue-400 mb-2">{section.heading}</h4>
                    {section.content && <p className="text-sm text-gray-600 dark:text-gray-300">{section.content}</p>}
                    {section.bullets && (
                      <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-300 space-y-1">
                        {section.bullets.map((b, i) => <li key={i}>{b}</li>)}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timeline */}
          {timeline && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 overflow-hidden">
              <div className="bg-orange-500 text-white px-4 py-3 flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
                  <Calendar className="w-5 h-5" /> {timeline.title}
                </h3>
                <button onClick={() => setTimeline(null)} className="p-1 hover:bg-white/20 rounded">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  {timeline.events.map((event, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="w-16 flex-shrink-0">
                        <div className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-2 py-1 rounded text-sm font-medium text-center">
                          {event.day}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h5 className="font-medium dark:text-white">{event.phase}</h5>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 mt-1 space-y-1">
                          {event.items.map((item, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <ChevronRight className="w-3 h-3" /> {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t dark:border-gray-700 pt-4 mt-4">
                  <h4 className="font-medium text-orange-600 dark:text-orange-400 mb-2">Historical Milestones</h4>
                  <div className="flex gap-4 overflow-x-auto pb-2">
                    {timeline.milestones.map((m, idx) => (
                      <div key={idx} className="flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded-lg p-3 min-w-[150px]">
                        <div className="text-sm font-medium text-orange-600 dark:text-orange-400">{m.year}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">{m.event}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Generated FAQ */}
          {generatedFAQ && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 overflow-hidden">
              <div className="bg-yellow-500 text-white px-4 py-3 flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
                  <HelpCircle className="w-5 h-5" /> {generatedFAQ.title}
                </h3>
                <button onClick={() => setGeneratedFAQ(null)} className="p-1 hover:bg-white/20 rounded">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4 space-y-3">
                {generatedFAQ.questions.map((item, idx) => (
                  <details key={idx} className="border dark:border-gray-700 rounded-lg overflow-hidden">
                    <summary className="cursor-pointer px-4 py-3 bg-gray-50 dark:bg-gray-700/50 font-medium text-sm dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                      {item.q}
                    </summary>
                    <p className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800">
                      {item.a}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          )}

          {/* Value Stream Map */}
          {valueStream && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 overflow-hidden">
              <div className="bg-indigo-500 text-white px-4 py-3 flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
                  <Workflow className="w-5 h-5" /> {valueStream.title}
                </h3>
                <button onClick={() => setValueStream(null)} className="p-1 hover:bg-white/20 rounded">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{valueStream.description}</p>

                {/* Value Stream Visual */}
                <div className="flex overflow-x-auto pb-4 gap-2">
                  {valueStream.stages.map((stage, idx) => (
                    <div key={idx} className="flex-shrink-0 w-48">
                      <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-3 h-full border-2 border-indigo-200 dark:border-indigo-700">
                        <div className="text-sm font-medium text-indigo-700 dark:text-indigo-300 mb-2">{stage.name}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                          {stage.activities.map((a, i) => (
                            <div key={i} className="flex items-start gap-1 mb-1">
                              <ChevronRight className="w-3 h-3 mt-0.5 flex-shrink-0" />
                              <span>{a}</span>
                            </div>
                          ))}
                        </div>
                        <div className="text-xs text-indigo-600 dark:text-indigo-400 pt-2 border-t border-indigo-200 dark:border-indigo-700">
                          <div>Lead: {stage.leadTime}</div>
                          <div>Process: {stage.processTime}</div>
                          <div className="font-medium">{stage.owner}</div>
                        </div>
                      </div>
                      {idx < valueStream.stages.length - 1 && (
                        <div className="flex justify-center my-2">
                          <ChevronRight className="w-6 h-6 text-indigo-400" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="text-center">
                    <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{valueStream.metrics.totalLeadTime}</div>
                    <div className="text-xs text-gray-500">Total Lead Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{valueStream.metrics.totalProcessTime}</div>
                    <div className="text-xs text-gray-500">Process Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{valueStream.metrics.valueAddRatio}</div>
                    <div className="text-xs text-gray-500">Value-Add Ratio</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{valueStream.metrics.handoffs}</div>
                    <div className="text-xs text-gray-500">Handoffs</div>
                  </div>
                </div>

                {/* Opportunities */}
                <div className="mt-4">
                  <h4 className="font-medium text-indigo-600 dark:text-indigo-400 mb-2">Improvement Opportunities</h4>
                  <ul className="space-y-1">
                    {valueStream.opportunities.map((opp, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <Lightbulb className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                        {opp}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Gap Analysis */}
          {gapAnalysis && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 overflow-hidden">
              <div className="bg-red-500 text-white px-4 py-3 flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" /> {gapAnalysis.title}
                </h3>
                <button onClick={() => setGapAnalysis(null)} className="p-1 hover:bg-white/20 rounded">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{gapAnalysis.summary}</p>

                {/* Statistics */}
                <div className="flex gap-4 mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{gapAnalysis.statistics.critical}</div>
                    <div className="text-xs text-red-500">Critical</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{gapAnalysis.statistics.medium}</div>
                    <div className="text-xs text-orange-500">Medium</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{gapAnalysis.statistics.low}</div>
                    <div className="text-xs text-green-500">Low</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">{gapAnalysis.statistics.total}</div>
                    <div className="text-xs text-gray-500">Total</div>
                  </div>
                </div>

                {/* Gap List */}
                <div className="space-y-3">
                  {gapAnalysis.gaps.map((gap) => (
                    <div key={gap.id} className={`border rounded-lg p-3 ${
                      gap.severity === 'Critical' ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/10' :
                      'border-orange-300 dark:border-orange-700 bg-orange-50 dark:bg-orange-900/10'
                    }`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            gap.severity === 'Critical' ? 'bg-red-200 text-red-800' : 'bg-orange-200 text-orange-800'
                          }`}>
                            {gap.severity}
                          </span>
                          <span className="text-xs text-gray-500">{gap.category}</span>
                        </div>
                        <span className="text-xs text-gray-400">Priority #{gap.priority}</span>
                      </div>
                      <h4 className="font-medium dark:text-white mb-1">{gap.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{gap.description}</p>
                      <div className="text-xs text-gray-500">
                        <strong>Impact:</strong> {gap.impact}
                      </div>
                      <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                        <strong>Recommendation:</strong> {gap.recommendation}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Process Improvements */}
          {processImprovements && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 overflow-hidden">
              <div className="bg-teal-500 text-white px-4 py-3 flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" /> {processImprovements.title}
                </h3>
                <button onClick={() => setProcessImprovements(null)} className="p-1 hover:bg-white/20 rounded">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{processImprovements.description}</p>

                {/* ROI Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 p-3 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
                  <div className="text-center">
                    <div className="text-sm font-bold text-teal-600">{processImprovements.estimatedROI.costSavings}</div>
                    <div className="text-xs text-gray-500">Cost Savings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-teal-600">{processImprovements.estimatedROI.timeReduction}</div>
                    <div className="text-xs text-gray-500">Time Reduction</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-teal-600">{processImprovements.estimatedROI.qualityImprovement}</div>
                    <div className="text-xs text-gray-500">Quality Improvement</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-teal-600">{processImprovements.estimatedROI.memberImpact}</div>
                    <div className="text-xs text-gray-500">Member Impact</div>
                  </div>
                </div>

                {/* Improvements List */}
                <div className="space-y-3">
                  {processImprovements.improvements.map((imp) => (
                    <details key={imp.id} className="border dark:border-gray-700 rounded-lg overflow-hidden">
                      <summary className="cursor-pointer px-4 py-3 bg-gray-50 dark:bg-gray-700/50 font-medium text-sm dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${imp.impact === 'High' ? 'bg-teal-500' : 'bg-teal-300'}`} />
                          {imp.title}
                        </span>
                        <span className="text-xs text-gray-500">{imp.area} • {imp.timeline}</span>
                      </summary>
                      <div className="px-4 py-3 bg-white dark:bg-gray-800 space-y-2">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-xs font-medium text-gray-500">Current State</div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">{imp.currentState}</div>
                          </div>
                          <div>
                            <div className="text-xs font-medium text-gray-500">Future State</div>
                            <div className="text-sm text-teal-600 dark:text-teal-400">{imp.futureState}</div>
                          </div>
                        </div>
                        <div>
                          <div className="text-xs font-medium text-gray-500 mb-1">Benefits</div>
                          <ul className="text-sm text-gray-600 dark:text-gray-300">
                            {imp.benefits.map((b, i) => (
                              <li key={i} className="flex items-center gap-1">
                                <CheckCircle className="w-3 h-3 text-green-500" /> {b}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="flex gap-4 text-xs">
                          <span className={`px-2 py-1 rounded ${imp.effort === 'High' ? 'bg-red-100 text-red-700' : imp.effort === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                            Effort: {imp.effort}
                          </span>
                          <span className={`px-2 py-1 rounded ${imp.impact === 'High' ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-700'}`}>
                            Impact: {imp.impact}
                          </span>
                        </div>
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Risk Assessment */}
          {riskAssessment && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 overflow-hidden">
              <div className="bg-amber-500 text-white px-4 py-3 flex items-center justify-between">
                <h3 className="font-semibold flex items-center gap-2">
                  <Shield className="w-5 h-5" /> {riskAssessment.title}
                </h3>
                <button onClick={() => setRiskAssessment(null)} className="p-1 hover:bg-white/20 rounded">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{riskAssessment.description}</p>

                {/* Summary */}
                <div className="flex items-center gap-6 mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{riskAssessment.summary.highRisks}</div>
                    <div className="text-xs text-gray-500">High Risks</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{riskAssessment.summary.mediumRisks}</div>
                    <div className="text-xs text-gray-500">Medium Risks</div>
                  </div>
                  <div className="flex-1 text-right">
                    <div className="text-sm font-medium text-amber-600">Overall Rating</div>
                    <div className="text-lg font-bold text-amber-700">{riskAssessment.summary.overallRiskRating}</div>
                  </div>
                </div>

                {/* Recommended Actions */}
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-medium text-blue-700 dark:text-blue-400 mb-2">Recommended Actions</h4>
                  <ul className="space-y-1">
                    {riskAssessment.summary.recommendedActions.map((action, idx) => (
                      <li key={idx} className="text-sm text-blue-600 dark:text-blue-300 flex items-start gap-2">
                        <span className="font-medium">{idx + 1}.</span> {action}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Risk List */}
                <div className="space-y-3">
                  {riskAssessment.risks.map((risk) => (
                    <div key={risk.id} className={`border rounded-lg p-3 ${
                      risk.riskScore === 'High' ? 'border-red-300 dark:border-red-700' :
                      'border-yellow-300 dark:border-yellow-700'
                    }`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                            risk.riskScore === 'High' ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'
                          }`}>
                            {risk.riskScore} Risk
                          </span>
                          <span className="text-xs text-gray-500">{risk.category}</span>
                        </div>
                        <span className="text-xs text-gray-400">{risk.owner}</span>
                      </div>
                      <h4 className="font-medium dark:text-white mb-1">{risk.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{risk.description}</p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-gray-500">Likelihood:</span>
                          <span className={`ml-1 ${risk.likelihood === 'Low' ? 'text-green-600' : risk.likelihood === 'Medium' ? 'text-yellow-600' : 'text-red-600'}`}>
                            {risk.likelihood}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Impact:</span>
                          <span className={`ml-1 ${risk.impact === 'Critical' ? 'text-red-600' : risk.impact === 'High' ? 'text-orange-600' : 'text-yellow-600'}`}>
                            {risk.impact}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 pt-2 border-t dark:border-gray-700">
                        <div className="text-xs text-gray-500 mb-1">Mitigations:</div>
                        <div className="flex flex-wrap gap-1">
                          {risk.mitigations.map((m, i) => (
                            <span key={i} className="text-xs px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded">
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!audioContent && !studyGuide && !briefingDoc && !timeline && !generatedFAQ && !valueStream && !gapAnalysis && !processImprovements && !riskAssessment && (
            <div className="text-center py-12">
              <Sparkles className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-medium dark:text-white mb-2">Generate insights from your sources</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                Click one of the buttons above to generate Audio Overview, Study Guide, Briefing Doc, Timeline, FAQ, Value Stream Map, Gap Analysis, Process Improvements, or Risk Assessment from your CLIP knowledge base.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Value Stream Tab - Full CLIP Value Stream Map
  const ValueStreamTab = () => {
    const [selectedPhase, setSelectedPhase] = useState(null);

    const valueStreamPhases = [
      {
        id: 1,
        name: 'Sales & Onboarding',
        duration: '1-5 days',
        actors: ['Sales Team', 'Account Manager', 'CU Lending Manager'],
        activities: [
          'Initial client contact and discovery',
          'Requirements gathering and scoping',
          'Parameter configuration and agreement',
          'Contract and SOW execution',
          'TransUnion credentialing setup'
        ],
        automationOpportunities: [
          { item: 'Self-service parameter configuration portal', priority: 'HIGH', effort: 'Medium' },
          { item: 'Automated contract generation from templates', priority: 'MEDIUM', effort: 'Low' },
          { item: 'Digital signature integration (DocuSign)', priority: 'MEDIUM', effort: 'Low' }
        ],
        inputs: ['Client requirements', 'Risk appetite', 'Product selection'],
        outputs: ['Signed SOW', 'Configured parameters', 'TU credentials'],
        waitTime: 'Variable (client response)',
        processTime: '2-4 hours active work'
      },
      {
        id: 2,
        name: 'Data Collection',
        duration: '2-4 hours',
        actors: ['CU IT/Data Team', 'Data Analyst'],
        activities: [
          'Receive member/account data from CU',
          'Validate data format and completeness',
          'Clean and transform data',
          'Create unique identifiers (SSN + DOB)',
          'Stage files for processing'
        ],
        automationOpportunities: [
          { item: 'Automated data validation rules', priority: 'HIGH', effort: 'Medium' },
          { item: 'Self-service data upload portal (MDPA)', priority: 'HIGH', effort: 'High' },
          { item: 'Real-time format validation feedback', priority: 'HIGH', effort: 'Medium' },
          { item: 'Automated unique ID generation', priority: 'MEDIUM', effort: 'Low' }
        ],
        inputs: ['Raw member data', 'Account balances', 'Credit history'],
        outputs: ['Cleaned dataset', 'Validation report', 'Staged files'],
        waitTime: '0-24 hours (queue)',
        processTime: '2-4 hours'
      },
      {
        id: 3,
        name: 'Credit Bureau Pull',
        duration: '4-8 hours',
        actors: ['TransUnion', 'Data Analyst'],
        activities: [
          'Submit batch to TransUnion DEG',
          'API connection and authentication',
          'Retrieve 419 credit fields',
          'Parse and validate response',
          'Merge with member data'
        ],
        automationOpportunities: [
          { item: 'Scheduled automated batch submission', priority: 'HIGH', effort: 'Medium' },
          { item: 'Auto-retry on API failures', priority: 'HIGH', effort: 'Low' },
          { item: 'Real-time processing status dashboard', priority: 'MEDIUM', effort: 'Medium' },
          { item: 'Automated file naming and archival', priority: 'LOW', effort: 'Low' }
        ],
        inputs: ['Staged member data', 'TU credentials'],
        outputs: ['Credit data (419 fields)', 'Consumer statements', 'Merged dataset'],
        waitTime: '0-4 hours (batch processing)',
        processTime: '4-8 hours'
      },
      {
        id: 4,
        name: 'Analysis & Decision',
        duration: '4-8 hours',
        actors: ['Data Analyst', 'QA Reviewer'],
        activities: [
          'Apply eligibility parameters',
          'Calculate utilization metrics',
          'Perform risk scoring',
          'Generate CLI recommendations',
          'Compliance and validation checks',
          'Handle multi-product prioritization'
        ],
        automationOpportunities: [
          { item: 'Modular macro-driven analysis framework', priority: 'CRITICAL', effort: 'High' },
          { item: 'Automated parameter application', priority: 'HIGH', effort: 'Medium' },
          { item: 'Real-time eligibility screening', priority: 'HIGH', effort: 'Medium' },
          { item: 'Automated aggregate limit calculations', priority: 'HIGH', effort: 'Medium' },
          { item: 'ML-based risk scoring enhancement', priority: 'LOW', effort: 'High' }
        ],
        inputs: ['Merged credit data', 'CU parameters', 'Exclusion lists'],
        outputs: ['Approved list', 'Rejection log', 'Risk scores'],
        waitTime: '0-2 hours (analyst availability)',
        processTime: '4-8 hours'
      },
      {
        id: 5,
        name: 'Output & Delivery',
        duration: '2-4 hours',
        actors: ['Data Analyst', 'Account Manager'],
        activities: [
          'Generate approved members list',
          'Create rejection report with reasons',
          'Produce executive summary',
          'Quality assurance review',
          'Email delivery to client',
          'Archive files and update tracking'
        ],
        automationOpportunities: [
          { item: 'Automated report generation', priority: 'HIGH', effort: 'Medium' },
          { item: 'Templated executive summaries', priority: 'MEDIUM', effort: 'Low' },
          { item: 'Automated email with attachments', priority: 'HIGH', effort: 'Low' },
          { item: 'Client portal for self-service download', priority: 'MEDIUM', effort: 'Medium' }
        ],
        inputs: ['Analysis results', 'Report templates'],
        outputs: ['Approved list (CSV)', 'Analysis report (XLSX)', 'Executive summary (PDF)'],
        waitTime: '0-1 hour (review queue)',
        processTime: '2-4 hours'
      },
      {
        id: 6,
        name: 'Post-Delivery Operations',
        duration: 'Ongoing',
        actors: ['Account Manager', 'Support Team', 'Product Team'],
        activities: [
          'Client follow-up and questions',
          'Implementation support',
          'Performance monitoring',
          'Issue resolution',
          'Feedback collection',
          'Recurring run scheduling'
        ],
        automationOpportunities: [
          { item: 'Automated performance dashboards', priority: 'MEDIUM', effort: 'Medium' },
          { item: 'Self-service FAQ and knowledge base', priority: 'MEDIUM', effort: 'Low' },
          { item: 'Automated recurring run scheduling', priority: 'HIGH', effort: 'Medium' },
          { item: 'Client feedback surveys (automated)', priority: 'LOW', effort: 'Low' }
        ],
        inputs: ['Delivered outputs', 'Client feedback'],
        outputs: ['Support tickets resolved', 'Recurring schedules', 'Improvement backlog'],
        waitTime: 'Variable',
        processTime: 'Ongoing'
      }
    ];

    const metrics = {
      current: { leadTime: '2-3 days', touchpoints: '8-12', errorRate: '2-5%', throughput: '5-10 CUs/week' },
      target: { leadTime: '4-8 hours', touchpoints: '2-3', errorRate: '<0.5%', throughput: '20-30 CUs/week' }
    };

    return (
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <GitMerge className="w-7 h-7" />
            CLIP Value Stream Map
          </h2>
          <p className="mt-2 text-purple-100">End-to-end process from intake to delivery with automation opportunities</p>
        </div>

        {/* Metrics Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Current Lead Time', current: metrics.current.leadTime, target: metrics.target.leadTime, icon: Clock },
            { label: 'Manual Touchpoints', current: metrics.current.touchpoints, target: metrics.target.touchpoints, icon: Users },
            { label: 'Error Rate', current: metrics.current.errorRate, target: metrics.target.errorRate, icon: AlertTriangle },
            { label: 'Throughput', current: metrics.current.throughput, target: metrics.target.throughput, icon: TrendingUp }
          ].map((metric, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl p-4 border dark:border-gray-700">
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-2">
                <metric.icon className="w-4 h-4" />
                <span className="text-sm">{metric.label}</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-lg font-bold text-red-500">{metric.current}</span>
                  <span className="text-xs text-gray-400 ml-1">current</span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400" />
                <div>
                  <span className="text-lg font-bold text-green-500">{metric.target}</span>
                  <span className="text-xs text-gray-400 ml-1">target</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Value Stream Flow */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 overflow-hidden">
          <div className="p-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
            <h3 className="font-semibold dark:text-white flex items-center gap-2">
              <Workflow className="w-5 h-5 text-purple-500" />
              Process Phases (Click to expand)
            </h3>
          </div>
          <div className="p-4">
            <div className="flex overflow-x-auto gap-2 pb-4">
              {valueStreamPhases.map((phase, idx) => (
                <div key={phase.id} className="flex items-center">
                  <button
                    onClick={() => setSelectedPhase(selectedPhase === phase.id ? null : phase.id)}
                    className={`min-w-[160px] p-4 rounded-lg border-2 transition-all ${
                      selectedPhase === phase.id
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-200 dark:border-gray-600 hover:border-purple-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="w-10 h-10 mx-auto rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 font-bold mb-2">
                        {phase.id}
                      </div>
                      <h4 className="font-medium text-sm dark:text-white">{phase.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">{phase.duration}</p>
                    </div>
                  </button>
                  {idx < valueStreamPhases.length - 1 && (
                    <ArrowRight className="w-6 h-6 text-gray-300 mx-2 flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Phase Details */}
        {selectedPhase && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 overflow-hidden">
            {(() => {
              const phase = valueStreamPhases.find(p => p.id === selectedPhase);
              return (
                <>
                  <div className="p-4 border-b dark:border-gray-700 bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                    <h3 className="text-lg font-semibold">Phase {phase.id}: {phase.name}</h3>
                    <p className="text-sm text-purple-100">Duration: {phase.duration}</p>
                  </div>
                  <div className="p-4 grid md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-sm text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
                          <Users className="w-4 h-4" /> Actors
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {phase.actors.map((actor, i) => (
                            <span key={i} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-sm">
                              {actor}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
                          <ListChecks className="w-4 h-4" /> Activities
                        </h4>
                        <ul className="space-y-1">
                          {phase.activities.map((activity, i) => (
                            <li key={i} className="text-sm dark:text-gray-300 flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              {activity}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-sm text-gray-500 dark:text-gray-400 mb-2">Inputs</h4>
                          <ul className="text-sm dark:text-gray-300 space-y-1">
                            {phase.inputs.map((input, i) => (
                              <li key={i}>• {input}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium text-sm text-gray-500 dark:text-gray-400 mb-2">Outputs</h4>
                          <ul className="text-sm dark:text-gray-300 space-y-1">
                            {phase.outputs.map((output, i) => (
                              <li key={i}>• {output}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    {/* Right Column - Automation Opportunities */}
                    <div>
                      <h4 className="font-medium text-sm text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-yellow-500" /> Automation Opportunities
                      </h4>
                      <div className="space-y-2">
                        {phase.automationOpportunities.map((opp, i) => (
                          <div key={i} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <div className="flex items-start justify-between">
                              <span className="text-sm dark:text-white">{opp.item}</span>
                              <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                                opp.priority === 'CRITICAL' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                opp.priority === 'HIGH' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                                opp.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-300'
                              }`}>
                                {opp.priority}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">Effort: {opp.effort}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/30 border-t dark:border-gray-700 grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <span className="text-xs text-gray-500">Wait Time</span>
                      <p className="font-medium dark:text-white">{phase.waitTime}</p>
                    </div>
                    <div className="text-center">
                      <span className="text-xs text-gray-500">Process Time</span>
                      <p className="font-medium dark:text-white">{phase.processTime}</p>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </div>
    );
  };

  // Operations Tab - Risks, KPIs, Responsibilities, Runbooks
  const OperationsTab = () => {
    const [activeSection, setActiveSection] = useState('responsibilities');

    // Team Responsibilities Matrix
    const responsibilities = [
      {
        team: 'ART (Agile Release Train)',
        role: 'Strategic oversight and cross-team coordination',
        responsibilities: [
          'Prioritize CLIP enhancements in PI planning',
          'Coordinate dependencies across teams',
          'Review and approve major process changes',
          'Track program-level KPIs and metrics'
        ],
        trainingNeeds: ['CLIP overview', 'Value stream understanding', 'KPI interpretation']
      },
      {
        team: 'Implementation',
        role: 'Client onboarding and setup',
        responsibilities: [
          'New client onboarding and configuration',
          'Parameter setup and validation',
          'TransUnion credential management',
          'Initial training for CU staff'
        ],
        trainingNeeds: ['Full CLIP process', 'Parameter configuration', 'TU credentialing', 'Client communication']
      },
      {
        team: 'Support',
        role: 'Ongoing client support and issue resolution',
        responsibilities: [
          'Tier 1/2 issue triage and resolution',
          'Client questions and clarifications',
          'Escalation to appropriate teams',
          'Knowledge base maintenance'
        ],
        trainingNeeds: ['Troubleshooting guide', 'Common issues', 'Escalation procedures']
      },
      {
        team: 'Product',
        role: 'Product strategy and roadmap',
        responsibilities: [
          'Feature prioritization and roadmap',
          'Requirements gathering and documentation',
          'Stakeholder communication',
          'Product showcases and demos'
        ],
        trainingNeeds: ['Full CLIP lifecycle', 'Competitive landscape', 'Client needs analysis']
      },
      {
        team: 'Data Analytics',
        role: 'Core analysis and processing',
        responsibilities: [
          'Execute CLIP analysis runs',
          'Configure CU-specific parameters',
          'Quality assurance and validation',
          'Report generation and delivery'
        ],
        trainingNeeds: ['Alteryx workflows', 'Parameter tuning', 'TU data interpretation', 'QA procedures']
      }
    ];

    // Risk Register
    const risks = [
      { id: 'R001', category: 'Operational', risk: 'Credit Risk Exposure - Members default after CLI', likelihood: 'MEDIUM', impact: 'HIGH', mitigation: 'Conservative parameters, post-CLI monitoring, delinquency tracking' },
      { id: 'R002', category: 'Compliance', risk: 'ECOA/FCRA Violations - Adverse action requirements', likelihood: 'LOW', impact: 'CRITICAL', mitigation: 'Documented adverse action notices, compliance review process' },
      { id: 'R003', category: 'Operational', risk: 'Data Quality Issues - Bad input causes bad recommendations', likelihood: 'MEDIUM', impact: 'HIGH', mitigation: 'Input validation framework, data quality alerts' },
      { id: 'R004', category: 'Technical', risk: 'TransUnion API Failure - Cannot complete processing', likelihood: 'LOW', impact: 'HIGH', mitigation: 'Retry logic, manual fallback procedures, SLA monitoring' },
      { id: 'R005', category: 'Operational', risk: 'Parameter Misconfiguration - Wrong thresholds applied', likelihood: 'MEDIUM', impact: 'HIGH', mitigation: 'Config validation, peer review, version control' },
      { id: 'R006', category: 'Operational', risk: 'Duplicate Handling Errors - Same member multiple offers', likelihood: 'MEDIUM', impact: 'MEDIUM', mitigation: 'Deduplication macro, unique ID validation' },
      { id: 'R007', category: 'Technical', risk: 'Version Control Issues - Lost workflow changes', likelihood: 'MEDIUM', impact: 'MEDIUM', mitigation: 'Git implementation, backup procedures' },
      { id: 'R008', category: 'Security', risk: 'PII/Data Breach - Unauthorized access to member data', likelihood: 'LOW', impact: 'CRITICAL', mitigation: 'Encryption at rest/transit, access controls, audit logging' },
      { id: 'R009', category: 'Operational', risk: 'Key Person Dependency - Staff leaves with knowledge', likelihood: 'MEDIUM', impact: 'HIGH', mitigation: 'Documentation, cross-training, knowledge base' },
      { id: 'R010', category: 'Operational', risk: 'SLA Miss - Processing delays exceed commitments', likelihood: 'MEDIUM', impact: 'MEDIUM', mitigation: 'Automation, capacity planning, monitoring' }
    ];

    // KPIs
    const kpis = [
      { category: 'Quality', name: 'CLI Approval Rate', target: '60-70%', description: 'Percentage of eligible members approved for CLI', frequency: 'Per run' },
      { category: 'Quality', name: 'Processing Accuracy', target: '>99%', description: 'Correct recommendations vs total processed', frequency: 'Monthly' },
      { category: 'Efficiency', name: 'Turnaround Time', target: '2-3 days', description: 'Time from data receipt to delivery', frequency: 'Per run' },
      { category: 'Efficiency', name: 'Throughput', target: '20+ CUs/week', description: 'Number of credit unions processed per week', frequency: 'Weekly' },
      { category: 'Efficiency', name: 'Manual Touchpoints', target: '<3', description: 'Number of human interventions per run', frequency: 'Per run' },
      { category: 'Financial', name: 'Average CLI Amount', target: 'Track trend', description: 'Average credit line increase per approved member', frequency: 'Monthly' },
      { category: 'Financial', name: 'Incremental Exposure', target: 'Track trend', description: 'Total new credit extended', frequency: 'Monthly' },
      { category: 'Client', name: 'Client Satisfaction', target: '>4.5/5', description: 'Post-delivery satisfaction score', frequency: 'Quarterly' },
      { category: 'Risk', name: 'Post-CLI Delinquency', target: '<2%', description: '90-day delinquency rate for CLI recipients', frequency: 'Quarterly' },
      { category: 'Risk', name: 'Error Rate', target: '<0.5%', description: 'Processing errors requiring correction', frequency: 'Monthly' }
    ];

    // Product Showcases
    const showcases = [
      { title: 'Monthly CLIP Performance Review', audience: 'All teams', frequency: 'Monthly', topics: ['KPI review', 'Client feedback', 'Process improvements'] },
      { title: 'New Feature Demo', audience: 'Sales, Implementation, Support', frequency: 'As needed', topics: ['Feature walkthrough', 'Use cases', 'Q&A'] },
      { title: 'Quarterly Business Review', audience: 'Leadership, Product', frequency: 'Quarterly', topics: ['Financial performance', 'Roadmap', 'Strategic initiatives'] },
      { title: 'Technical Deep Dive', audience: 'Data Analytics, Engineering', frequency: 'Monthly', topics: ['Workflow changes', 'Automation updates', 'Technical debt'] }
    ];

    return (
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-xl p-6 text-white">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Activity className="w-7 h-7" />
            CLIP Operations Center
          </h2>
          <p className="mt-2 text-green-100">Risks, KPIs, team responsibilities, and operational runbooks</p>
        </div>

        {/* Section Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {[
            { id: 'responsibilities', label: 'Team Responsibilities', icon: UserCheck },
            { id: 'risks', label: 'Risk Register', icon: ShieldAlert },
            { id: 'kpis', label: 'KPIs & Metrics', icon: Gauge },
            { id: 'showcases', label: 'Product Showcases', icon: Projector },
            { id: 'runbooks', label: 'Runbooks', icon: BookOpenCheck }
          ].map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeSection === section.id
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
              }`}
            >
              <section.icon className="w-4 h-4" />
              {section.label}
            </button>
          ))}
        </div>

        {/* Team Responsibilities */}
        {activeSection === 'responsibilities' && (
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h3 className="font-medium text-blue-800 dark:text-blue-300 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Responsibility Matrix (RACI)
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                Clear ownership enables shared understanding and streamlined handoffs across the CLIP lifecycle.
              </p>
            </div>
            <div className="grid gap-4">
              {responsibilities.map((team, idx) => (
                <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 overflow-hidden">
                  <div className="p-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                    <h4 className="font-semibold dark:text-white flex items-center gap-2">
                      <Users className="w-5 h-5 text-green-500" />
                      {team.team}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{team.role}</p>
                  </div>
                  <div className="p-4 grid md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Key Responsibilities</h5>
                      <ul className="space-y-1">
                        {team.responsibilities.map((resp, i) => (
                          <li key={i} className="text-sm dark:text-gray-300 flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            {resp}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Training Needs</h5>
                      <div className="flex flex-wrap gap-2">
                        {team.trainingNeeds.map((need, i) => (
                          <span key={i} className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-xs">
                            {need}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Risk Register */}
        {activeSection === 'risks' && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 overflow-hidden">
            <div className="p-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
              <h3 className="font-semibold dark:text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-500" />
                Risk Register
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Category</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Risk Description</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Likelihood</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Impact</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Mitigation</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-gray-700">
                  {risks.map((risk) => (
                    <tr key={risk.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                      <td className="px-4 py-3 text-sm font-mono dark:text-gray-300">{risk.id}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          risk.category === 'Security' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                          risk.category === 'Compliance' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                          risk.category === 'Technical' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                          'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                        }`}>
                          {risk.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm dark:text-gray-300">{risk.risk}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          risk.likelihood === 'LOW' ? 'bg-green-100 text-green-700' :
                          risk.likelihood === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {risk.likelihood}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          risk.impact === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                          risk.impact === 'HIGH' ? 'bg-orange-100 text-orange-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {risk.impact}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm dark:text-gray-300">{risk.mitigation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* KPIs */}
        {activeSection === 'kpis' && (
          <div className="space-y-4">
            {['Quality', 'Efficiency', 'Financial', 'Client', 'Risk'].map(category => (
              <div key={category} className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 overflow-hidden">
                <div className="p-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                  <h4 className="font-semibold dark:text-white">{category} Metrics</h4>
                </div>
                <div className="p-4 grid md:grid-cols-2 gap-4">
                  {kpis.filter(k => k.category === category).map((kpi, idx) => (
                    <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium dark:text-white">{kpi.name}</h5>
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-sm font-medium">
                          {kpi.target}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{kpi.description}</p>
                      <p className="text-xs text-gray-400 mt-2">Frequency: {kpi.frequency}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Product Showcases */}
        {activeSection === 'showcases' && (
          <div className="grid md:grid-cols-2 gap-4">
            {showcases.map((showcase, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-4">
                <h4 className="font-semibold dark:text-white flex items-center gap-2">
                  <Projector className="w-5 h-5 text-purple-500" />
                  {showcase.title}
                </h4>
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-500 dark:text-gray-400">Audience:</span>
                    <span className="dark:text-gray-300">{showcase.audience}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-500 dark:text-gray-400">Frequency:</span>
                    <span className="dark:text-gray-300">{showcase.frequency}</span>
                  </div>
                  <div className="mt-3">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Topics:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {showcase.topics.map((topic, i) => (
                        <span key={i} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Runbooks */}
        {activeSection === 'runbooks' && (
          <div className="space-y-4">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <h3 className="font-medium text-yellow-800 dark:text-yellow-300 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Operational Runbooks
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                Step-by-step procedures for common operational tasks. Click to expand each runbook.
              </p>
            </div>
            {[
              { title: 'Standard CLIP Run', steps: ['Receive and validate data', 'Stage files in FilesToProcess', 'Execute Run CLIP workflow', 'Submit to TransUnion', 'Process response and apply parameters', 'Generate outputs and deliver'] },
              { title: 'Rush Processing', steps: ['Confirm rush pricing with client', 'Prioritize in queue', 'Direct TU submission (not batch)', 'Expedited QA review', 'Immediate delivery upon completion'] },
              { title: 'New Client Onboarding', steps: ['Complete parameter worksheet', 'Set up Box folder', 'Configure TU credentials', 'Create CU-specific workflow', 'Run test batch', 'Deliver training'] },
              { title: 'Issue Escalation', steps: ['Document issue details', 'Attempt standard troubleshooting', 'Escalate to appropriate team', 'Track in ticketing system', 'Follow up with client'] }
            ].map((runbook, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-4">
                <h4 className="font-semibold dark:text-white flex items-center gap-2 mb-3">
                  <BookOpenCheck className="w-5 h-5 text-green-500" />
                  {runbook.title}
                </h4>
                <ol className="space-y-2">
                  {runbook.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm dark:text-gray-300">
                      <span className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 flex items-center justify-center text-xs font-medium flex-shrink-0">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Gaps Tab - Gap Analysis with Action Items
  const GapsTab = () => {
    const [filterPriority, setFilterPriority] = useState('all');
    const [filterCategory, setFilterCategory] = useState('all');

    const gaps = [
      // Documentation Gaps
      { id: 'G001', category: 'Documentation', title: 'Fragmented Documentation', priority: 'HIGH', status: 'In Progress', description: 'Documentation scattered across SharePoint, Box, local drives', recommendation: 'Consolidate to single repository with version control', owner: 'TBD' },
      { id: 'G002', category: 'Documentation', title: 'Missing Role Definitions (RACI)', priority: 'HIGH', status: 'Not Started', description: 'No formal role definitions for CLIP activities', recommendation: 'Create RACI matrix for all activities', owner: 'TBD' },
      { id: 'G003', category: 'Documentation', title: 'Incomplete Technical Docs', priority: 'MEDIUM', status: 'Not Started', description: 'TransUnion 419 fields not formally documented', recommendation: 'Document all TU fields with data types and meanings', owner: 'TBD' },
      { id: 'G004', category: 'Documentation', title: 'No Operational Runbooks', priority: 'HIGH', status: 'In Progress', description: 'Procedures exist informally but not documented', recommendation: 'Create step-by-step runbooks for all procedures', owner: 'TBD' },

      // Process Gaps
      { id: 'G005', category: 'Process', title: 'Multi-Product Prioritization Rules', priority: 'HIGH', status: 'Not Started', description: 'No formal criteria for prioritizing when member has multiple products', recommendation: 'Define prioritization algorithm (highest utilization, risk, etc.)', owner: 'TBD' },
      { id: 'G006', category: 'Process', title: 'Manual Duplicate Handling', priority: 'HIGH', status: 'Not Started', description: 'Duplicates identified but handling varies by analyst', recommendation: 'Implement standardized deduplication macro', owner: 'TBD' },
      { id: 'G007', category: 'Process', title: 'No Rush Processing SLA', priority: 'MEDIUM', status: 'Not Started', description: 'Rush requests handled ad-hoc without formal pricing', recommendation: 'Define rush tiers (24hr, same-day) with pricing', owner: 'TBD' },
      { id: 'G008', category: 'Process', title: 'End-to-End Testing Framework', priority: 'HIGH', status: 'Not Started', description: 'No formalized testing and validation process', recommendation: 'Create test cases and validation checklists', owner: 'TBD' },

      // Technology Gaps
      { id: 'G009', category: 'Technology', title: 'No Automation Framework', priority: 'CRITICAL', status: 'Planning', description: 'Manual Alteryx workflow execution per CU', recommendation: 'Implement modular macro-driven automation per POC', owner: 'TBD' },
      { id: 'G010', category: 'Technology', title: 'Limited Monitoring & Alerting', priority: 'HIGH', status: 'Not Started', description: 'Manual log review, no proactive alerts', recommendation: 'Implement real-time monitoring dashboard', owner: 'TBD' },
      { id: 'G011', category: 'Technology', title: 'No Version Control for Workflows', priority: 'HIGH', status: 'Not Started', description: 'Alteryx workflows on shared drive, no audit trail', recommendation: 'Migrate to Git repository with PR workflow', owner: 'TBD' },
      { id: 'G012', category: 'Technology', title: 'Missing Data Quality Framework', priority: 'HIGH', status: 'Not Started', description: 'Manual data validation, inconsistent checks', recommendation: 'Implement Great Expectations or similar DQ framework', owner: 'TBD' },

      // Training Gaps
      { id: 'G013', category: 'Training', title: 'No Formal Training Program', priority: 'HIGH', status: 'In Progress', description: 'Tribal knowledge, shadowing, meeting recordings only', recommendation: 'Develop structured training curriculum with certification', owner: 'TBD' },
      { id: 'G014', category: 'Training', title: 'Missing Cross-Training', priority: 'MEDIUM', status: 'Not Started', description: 'Specialists siloed by function', recommendation: 'Implement cross-training rotation program', owner: 'TBD' },
      { id: 'G015', category: 'Training', title: 'No Knowledge Base', priority: 'MEDIUM', status: 'In Progress', description: 'Questions via Slack/email, lost to history', recommendation: 'Create searchable KB (this app!)', owner: 'TBD' },
      { id: 'G016', category: 'Training', title: 'Product Showcase Program', priority: 'MEDIUM', status: 'Not Started', description: 'No recurring knowledge sharing sessions', recommendation: 'Establish recurring product showcases', owner: 'TBD' },

      // Security & Compliance
      { id: 'G017', category: 'Security', title: 'No Encryption Documentation', priority: 'HIGH', status: 'Not Started', description: 'Encryption assumed but not documented', recommendation: 'Document encryption standards (at-rest, in-transit)', owner: 'TBD' },
      { id: 'G018', category: 'Security', title: 'Incomplete Audit Trail', priority: 'HIGH', status: 'Not Started', description: 'Partial logging, manual audit assembly', recommendation: 'Implement comprehensive automated audit logging', owner: 'TBD' },

      // Operational Gaps
      { id: 'G019', category: 'Operational', title: 'No Capacity Planning', priority: 'MEDIUM', status: 'Not Started', description: 'Reactive resource allocation', recommendation: 'Implement capacity planning dashboard', owner: 'TBD' },
      { id: 'G020', category: 'Operational', title: 'Missing Performance Metrics Dashboard', priority: 'MEDIUM', status: 'Not Started', description: 'Limited KPI tracking visibility', recommendation: 'Create comprehensive performance dashboard', owner: 'TBD' },
      { id: 'G021', category: 'Operational', title: 'No Client Feedback Loop', priority: 'LOW', status: 'Not Started', description: 'Ad-hoc feedback collection', recommendation: 'Implement post-delivery survey, quarterly reviews', owner: 'TBD' }
    ];

    const categories = ['all', ...new Set(gaps.map(g => g.category))];
    const priorities = ['all', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

    const filteredGaps = gaps.filter(g =>
      (filterPriority === 'all' || g.priority === filterPriority) &&
      (filterCategory === 'all' || g.category === filterCategory)
    );

    const gapStats = {
      total: gaps.length,
      critical: gaps.filter(g => g.priority === 'CRITICAL').length,
      high: gaps.filter(g => g.priority === 'HIGH').length,
      inProgress: gaps.filter(g => g.status === 'In Progress').length,
      notStarted: gaps.filter(g => g.status === 'Not Started').length
    };

    return (
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-xl p-6 text-white">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <FileWarning className="w-7 h-7" />
            CLIP Gap Analysis
          </h2>
          <p className="mt-2 text-orange-100">Identified gaps with recommendations for process improvements</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border dark:border-gray-700 text-center">
            <div className="text-3xl font-bold text-gray-800 dark:text-white">{gapStats.total}</div>
            <div className="text-sm text-gray-500">Total Gaps</div>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-200 dark:border-red-800 text-center">
            <div className="text-3xl font-bold text-red-600">{gapStats.critical}</div>
            <div className="text-sm text-red-500">Critical</div>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 border border-orange-200 dark:border-orange-800 text-center">
            <div className="text-3xl font-bold text-orange-600">{gapStats.high}</div>
            <div className="text-sm text-orange-500">High Priority</div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800 text-center">
            <div className="text-3xl font-bold text-blue-600">{gapStats.inProgress}</div>
            <div className="text-sm text-blue-500">In Progress</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 border dark:border-gray-600 text-center">
            <div className="text-3xl font-bold text-gray-600 dark:text-gray-300">{gapStats.notStarted}</div>
            <div className="text-sm text-gray-500">Not Started</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Priority:</span>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-1.5 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-sm dark:text-white"
            >
              {priorities.map(p => (
                <option key={p} value={p}>{p === 'all' ? 'All Priorities' : p}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">Category:</span>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-1.5 rounded-lg border dark:border-gray-600 bg-white dark:bg-gray-700 text-sm dark:text-white"
            >
              {categories.map(c => (
                <option key={c} value={c}>{c === 'all' ? 'All Categories' : c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Gap Cards */}
        <div className="grid gap-4">
          {filteredGaps.map((gap) => (
            <div key={gap.id} className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 overflow-hidden">
              <div className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono text-sm text-gray-400">{gap.id}</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        gap.category === 'Security' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                        gap.category === 'Technology' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                        gap.category === 'Training' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                        gap.category === 'Process' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        gap.category === 'Documentation' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        'bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-300'
                      }`}>
                        {gap.category}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        gap.priority === 'CRITICAL' ? 'bg-red-500 text-white' :
                        gap.priority === 'HIGH' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                        gap.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {gap.priority}
                      </span>
                    </div>
                    <h4 className="font-semibold dark:text-white">{gap.title}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{gap.description}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      gap.status === 'In Progress' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                      gap.status === 'Planning' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                      'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                    }`}>
                      {gap.status}
                    </span>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-xs font-medium text-green-700 dark:text-green-400">Recommendation:</span>
                      <p className="text-sm text-green-800 dark:text-green-300">{gap.recommendation}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Browse Tab
  const BrowseTab = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search knowledge base..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
          />
        </div>
      </div>

      {searchQuery ? (
        <div className="space-y-4">
          <h3 className="font-semibold dark:text-white">Search Results</h3>
          {searchDocuments(searchQuery, 10).map((doc, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg p-4 border dark:border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded text-xs">
                  {doc.category}
                </span>
                <span className="text-xs text-gray-500">Score: {doc.score?.toFixed(3)}</span>
              </div>
              <h4 className="font-medium dark:text-white mb-2">{doc.title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">{doc.content.substring(0, 300)}...</p>
              <p className="text-xs text-gray-500 mt-2">Source: {doc.source}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => {
            const docs = getDocumentsByCategory(category);
            return (
              <div key={category} className="bg-white dark:bg-gray-800 rounded-lg p-4 border dark:border-gray-700 hover:shadow-lg transition-shadow">
                <h3 className="font-semibold dark:text-white mb-2">{category}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{docs.length} documents</p>
                <div className="space-y-1">
                  {docs.slice(0, 3).map((doc, idx) => (
                    <p key={idx} className="text-sm text-gray-600 dark:text-gray-300 truncate">
                      • {doc.title}
                    </p>
                  ))}
                  {docs.length > 3 && (
                    <p className="text-xs text-blue-500">+{docs.length - 3} more</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  // Training Tab Component
  const TrainingTab = () => {
    const [trainingAudience, setTrainingAudience] = useState('internal');
    const [activeSetupStep, setActiveSetupStep] = useState(null);

    // End-to-End CLIP Setup Steps
    const setupSteps = [
      {
        step: 1,
        title: "Receive Client Request",
        duration: "Day 1",
        description: "Credit union submits CLIP analysis request",
        tasks: [
          "Receive request via email or ticketing system",
          "Confirm credit union is an existing client",
          "Verify products to be analyzed (Credit Cards, LOC, HELOC)",
          "Confirm turnaround expectations (standard: 2-3 business days)"
        ],
        tips: "Always confirm the peer number and credit union name match our records"
      },
      {
        step: 2,
        title: "Create Folder Structure",
        duration: "Day 1",
        description: "Set up S: Drive and Box folders for the client",
        tasks: [
          "Create S: Drive folder: S:\\Products\\CLIP\\Inputs\\Direct Source Files\\PeerNumber_CUName\\",
          "Create Box folder using naming convention: PeerNumber_CreditUnionName",
          "Set up File Request in Box for secure client upload",
          "Send File Request link to credit union contact"
        ],
        tips: "Use the File Request feature so clients can upload without needing Box accounts"
      },
      {
        step: 3,
        title: "Receive & Validate Input Data",
        duration: "Day 1-2",
        description: "Client uploads data, we validate format and completeness",
        tasks: [
          "Download files from Box to S: Drive folder",
          "Verify required columns are present (Account ID, Member ID, Current Limit, etc.)",
          "Check for data quality issues (nulls, invalid formats)",
          "Confirm minimum record count for analysis viability"
        ],
        tips: "Common issues: Missing income data, incorrect date formats, duplicate records"
      },
      {
        step: 4,
        title: "Prepare TransUnion File",
        duration: "Day 2",
        description: "Format data for TransUnion credit bureau pull",
        tasks: [
          "Run input preparation workflow in Alteryx",
          "Generate DEG-formatted file for TransUnion",
          "Validate SSN formats and member information",
          "Upload file to TransUnion DEG portal"
        ],
        tips: "DEG files must follow exact field specifications - check the 419-field mapping"
      },
      {
        step: 5,
        title: "Process TransUnion Response",
        duration: "Day 2-3",
        description: "Download and merge credit bureau data",
        tasks: [
          "Download response file from TransUnion DEG",
          "Check for consumer statements or disputes",
          "Handle any error records or no-hits",
          "Merge TU data with original input file"
        ],
        tips: "Consumer statements require manual review - flag these for CU decision"
      },
      {
        step: 6,
        title: "Run CLIP Analysis Workflow",
        duration: "Day 3",
        description: "Execute Alteryx workflow with all business rules",
        tasks: [
          "Open CLIP Alteryx workflow (.yxmd file)",
          "Update input file paths for this client",
          "Configure CU-specific parameters if any",
          "Run workflow and monitor for errors"
        ],
        tips: "Key formulas: Tool 64 (Account Age), Tool 67 (Score Classification), Tool 72-74 (Business Rules)"
      },
      {
        step: 7,
        title: "Apply Eligibility Filters",
        duration: "Day 3",
        description: "Filter members based on CLIP criteria",
        tasks: [
          "Minimum FICO score: 650",
          "Minimum income: $20,000",
          "Maximum DTI: 50%",
          "Account age: > 1 year since origination",
          "No delinquencies, bankruptcies, or charge-offs"
        ],
        tips: "60-70% of members typically qualify after all filters applied"
      },
      {
        step: 8,
        title: "Calculate Increase Tiers",
        duration: "Day 3",
        description: "Determine recommended credit line increases",
        tasks: [
          "Apply tier logic based on current limit",
          "Check aggregate limits by FICO tier",
          "Cap increases at $20,000 maximum",
          "Handle multi-product scenarios"
        ],
        tips: "Tier ranges: <$1K→$1.5K, $1-2K→$3K, $2-3K→$5K, $3-5K→$7.5K, etc."
      },
      {
        step: 9,
        title: "Generate Output Files",
        duration: "Day 3",
        description: "Create deliverable files for the credit union",
        tasks: [
          "Generate recommendations file with all eligible members",
          "Create summary statistics report",
          "Prepare exclusion file with reasons",
          "Export to client-friendly Excel format"
        ],
        tips: "Include column descriptions and a README for first-time clients"
      },
      {
        step: 10,
        title: "Quality Check & Delivery",
        duration: "Day 3",
        description: "Final validation and client delivery",
        tasks: [
          "Spot-check sample records for accuracy",
          "Verify totals match expected counts",
          "Upload final files to Box client folder",
          "Send completion email with summary metrics"
        ],
        tips: "Include: Total analyzed, % eligible, total increase amount, average increase per member"
      }
    ];

    // State for expanded training modules
    const [expandedModule, setExpandedModule] = useState(null);

    const internalTraining = [
      {
        title: "CLIP Program Overview",
        duration: "15 min",
        description: "Introduction to the Credit Line Increase Program - what it is, who it serves, and key metrics",
        topics: ["What is CLIP?", "Value proposition", "Key statistics", "Products supported"],
        content: `**What is CLIP?**
CLIP (Credit Line Increase Program) is Trellance/Rise Analytics' automated credit line increase analysis service for credit unions. Operating since 2015-2016, CLIP identifies members eligible for credit line increases across multiple lending products.

**Value Proposition:**
• For Credit Unions: Increase revenue, improve member satisfaction, optimize credit portfolio
• For Members: Access to additional credit, recognition of good payment history
• For Trellance: Recurring revenue stream, strengthened client relationships

**Key Statistics:**
• Program Age: Since 2015-2016
• Standard Turnaround: 2-3 business days
• Typical Approval Rate: 60-70% of eligible
• Credit Bureau: TransUnion (419 fields)`
      },
      {
        title: "Products & Eligibility Criteria",
        duration: "25 min",
        description: "Deep dive into supported products, eligibility thresholds, and exclusion criteria",
        topics: ["Credit Cards", "LOC", "HELOCs", "Score tiers", "Exclusions"],
        content: `**Supported Products:**

1. Credit Cards - Most common for CLI analysis
   • Minimum 1 year since origination
   • Maximum individual limit: $20,000

2. Unsecured Lines of Credit - Variable terms, higher risk tier

3. HELOCs - Collateralized, different risk profile

**Credit Score Tier Limits:**
• 776-850 (Excellent): $25,000 max aggregate
• 726-775 (Good): $18,000 max aggregate
• 650-725 (Fair): $13,000 max aggregate
• Below 650: Not Eligible

**Standard Eligibility Thresholds:**
• Minimum Income: $20,000
• Minimum FICO: 650
• Maximum DTI: 50%
• Minimum Age: 21 years
• Account Age: > 1 year
• Days Past Due: 0

**Hard Exclusions:**
• Bankruptcy (active or within lookback)
• Charged-off accounts, Active collections
• 30/60/90 day delinquencies
• Fraud alerts, deceased indicator, credit freeze
• Recent CLI (within 6-12 months)`
      },
      {
        title: "Data Requirements & Preparation",
        duration: "20 min",
        description: "Required data fields, sources, and unique identifier creation",
        topics: ["Required fields", "Data sources", "Unique IDs", "Quality checks"],
        content: `**Critical Required Fields:**
• Account Number, SSN, First Name, Last Name
• Date of Birth, Current Credit Limit, Current Balance

**Important Fields:**
• Income, DTI, Days Past Due, Product Type
• Origination Date, FICO Score, Payment History

**Data Sources:**
1. MDPA Portal - Self-service, standardized format
2. Consulting Engagements - Custom, flexible formats
3. Direct Snowflake Connection - Enterprise clients

**Creating Unique Identifiers:**
Unique ID = Last 4 SSN + Date of Birth (MMDDYYYY)
Example: 1234 + 03151985 = 123403151985

This allows duplicate detection and aggregate exposure calculation.`
      },
      {
        title: "Alteryx Workflow Training",
        duration: "45 min",
        description: "Detailed walkthrough of the CLIP Alteryx workflow and critical formula tools",
        topics: ["Workflow stages", "Formula tools", "Parameter config", "Output generation"],
        content: `**Key Workflow Files:**
• Run CLIP: S:\\Prod\\Workflows\\Tools\\Run CLIP.yxwz
• CLIP Step 2: S:\\Prod\\Workflows\\Chained Apps\\Clip Step2.yxwz

**Critical Formula Tools:**
• Tool 64: Account age calculation, CLIP CR Limit Max
• Tool 67: Credit metrics configuration
• Tool 72: Exclusion criteria (bankruptcies, repos)
• Tool 73: Monthly income & payment calculations
• Tool 74: Proposed new limits (nested IFs)
• Tool 144: CLIP Cycle Date (YYYY-MM)
• Select 260: Supplemental fields

**Workflow Steps:**
1. Verify inbound file meta fields
2. Review agreed parameters
3. Create preliminary data cleanse workflow
4. Validate prelim data cleanse
5. Output file preparation (CSV with CORP ID)
6. Stage file in FilesToProcess folder`
      },
      {
        title: "TransUnion Integration",
        duration: "30 min",
        description: "DEG portal, file submission, response processing, and credentialing",
        topics: ["DEG portal", "File submission", "Response files", "Credentialing"],
        content: `**TransUnion Contacts:**
• Jen Werkley: jen.werkley@transunion.com
• Abbie Jeremiah: Abbie.Jeremiah@transunion.com

**Submission Process:**
1. Log in to TU DEG (Data Exchange Gateway)
2. Navigate to 'Send File to TU'
3. Select mailbox: /ToTU/olb.edtin.twntwodt.inputa
4. Browse and select CSV file
5. Click 'Go' to submit

**CRITICAL: Submit ONE FILE AT A TIME**
Output always named: OLB.EDTOUT.TWNTWCDT.OUTPUT

**Response Files:**
1. Consumer File → Save to Consumer Statements folder
2. Output File → Leave in Transunion Received folder

**Credentialing Scenarios:**
• Active Subscriber Code: Proceed directly
• Inactive Code: Email TU for reactivation
• New to TU: 3-4 weeks for onboarding`
      },
      {
        title: "Folder Setup & File Management",
        duration: "20 min",
        description: "S: Drive structure, Box setup, and file sharing with clients",
        topics: ["S: Drive", "Box folders", "File requests", "Naming conventions"],
        content: `**S: Drive Structure:**
Base: S:\\Products\\CLIP\\Inputs\\Direct Source Files\\

Client folder: PeerNumber_CreditUnionName
Example: 0558_Interfaith
Subfolders: Year folder + Workflows folder

**Key File Paths:**
• Files To Process: ...\\FilesToProcess
• TU Consumer Statements: ...\\Consumer Statements
• CORP ID Reference: S:\\Prod\\Inputs\\Reference and Control Tables\\CU Master for Providers.xlsx

**Box Setup:**
URL: https://trellance.app.box.com/folder/305984505328

**Creating File Request:**
1. Right-click folder > Options > File Request
2. Copy link (optional: set expiration)
3. Email link to client

Clients can upload without needing Box accounts!`
      },
      {
        title: "Troubleshooting Common Issues",
        duration: "25 min",
        description: "Diagnosing and resolving common CLIP processing problems",
        topics: ["Low approval rate", "Missing TU data", "Duplicates", "Config errors"],
        content: `**Issue: Low Approval Rate (<50%)**
Causes: Parameters too restrictive, poor data quality
Solutions: Review thresholds, check data completeness

**Issue: Missing TransUnion Data**
Causes: SSN format issues, name mismatch, credit freeze
Solutions: Validate SSN format, check name standardization

**Issue: Duplicate Records**
Causes: Multi-product members, missing unique ID
Solutions: Apply unique ID logic (SSN+DOB)

**Error Codes:**
• E001: Database connection failed
• E002: Invalid config file
• E003: TU batch timeout
• E004: Missing required field
• E005: Duplicate processing`
      },
      {
        title: "Client Onboarding Process",
        duration: "20 min",
        description: "End-to-end onboarding workflow for new CLIP clients",
        topics: ["Onboarding steps", "Key contacts", "Access requests"],
        content: `**Onboarding Workflow:**
1. PM/AM Request - Contract confirmed
2. Project Opening - Resources allocated
3. IM Assignment - Technical lead
4. Kick-Off Meeting - Scope & timeline
5. Environment Prep - Access provisioned
6. Load Client Files - Initial validation
7. Internal Validation - QA review
8. User Portal Admin Training
9. Push Data to Dashboards
10. Final Checks & Sign-off
11. Client Data Review
12. Close Project

**Key Contacts:**
• Onboarding Lead: John W
• Support: Kayla, Paolo
• Workspace Admin: Rob-Logan
• Shared Drive: Manish`
      }
    ];

    const externalTraining = [
      {
        title: "Getting Started with CLIP",
        duration: "10 min",
        description: "Quick introduction to CLIP for credit union partners",
        topics: ["What CLIP does", "Benefits for members", "Turnaround times", "What to expect"],
        content: `**What is CLIP?**
CLIP (Credit Line Increase Program) analyzes your member data to identify those eligible for credit line increases on credit cards, lines of credit, and HELOCs.

**Benefits:**
• Increase member loyalty and satisfaction
• Generate additional interest income
• Proactive credit management
• Risk-assessed recommendations

**Timeline:**
• Standard turnaround: 2-3 business days
• Rush processing available (additional fee)

**What to Expect:**
1. You provide member data
2. We analyze against 20+ criteria
3. TransUnion credit pull (419 fields)
4. Recommendations delivered
5. 60-70% typical approval rate`
      },
      {
        title: "Preparing Your Data",
        duration: "15 min",
        description: "How to format and submit your member data for CLIP analysis",
        topics: ["Required fields", "File formats", "Naming conventions", "Box upload"],
        content: `**Required Fields:**
• Account Number
• Member SSN (last 4 or full)
• First Name, Last Name
• Date of Birth
• Current Credit Limit
• Current Balance

**Recommended Fields:**
• Income (annual gross)
• Days Past Due
• Origination Date
• Product Type

**File Format:**
• CSV or Excel (.xlsx)
• One header row
• No special characters in data

**Submitting:**
1. You'll receive a Box File Request link
2. Click link to upload directly
3. No Box account needed
4. Files automatically secure`
      },
      {
        title: "Understanding Your Results",
        duration: "20 min",
        description: "How to interpret CLIP analysis results and recommendations",
        topics: ["Output files", "Approval tiers", "Rejection reasons", "Next steps"],
        content: `**You'll Receive:**
1. Approved List - Members eligible for increases
2. Rejection Report - Members not eligible (with reasons)
3. Executive Summary - Key metrics

**Approved List Fields:**
• Member ID, Current Limit, New Limit
• Increase Amount, Credit Score
• Risk Band, Confidence Score

**Increase Tiers:**
• <$1K → $1,500
• $1K-$2K → $3,000
• $2K-$3K → $5,000
• $3K-$5K → $7,500
• $5K-$7.5K → $10,000
• $7.5K-$10K → $15,000
• $10K-$15K → $20,000 (max)

**Aggregate Limits by Score:**
• 776-850: $25,000 max
• 726-775: $18,000 max
• 650-725: $13,000 max`
      },
      {
        title: "Best Practices",
        duration: "15 min",
        description: "Tips for maximizing CLIP effectiveness at your credit union",
        topics: ["Optimal timing", "Member communication", "Follow-up", "Success metrics"],
        content: `**Optimal Timing:**
• Run quarterly for best results
• Avoid major holiday periods
• Allow 2-3 business days turnaround

**Member Communication:**
• Proactive outreach after approval
• Clear offer letter with terms
• Easy acceptance process
• Follow-up for non-responders

**Success Metrics to Track:**
• Approval rate (target: 60-70%)
• Accept rate (member uptake)
• Utilization increase
• Delinquency rates post-increase

**Data Quality Tips:**
• Validate SSNs before submission
• Use consistent date formats
• Include income data when available
• Update member addresses`
      }
    ];

    const currentTraining = trainingAudience === 'internal' ? internalTraining : externalTraining;

    return (
      <div className="p-6 space-y-6">
        {/* Audience Toggle */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold dark:text-white">Training Materials</h2>
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setTrainingAudience('internal')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                trainingAudience === 'internal'
                  ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800'
              }`}
            >
              <Briefcase className="w-4 h-4 inline mr-2" />
              Internal Users
            </button>
            <button
              onClick={() => setTrainingAudience('external')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                trainingAudience === 'external'
                  ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800'
              }`}
            >
              <Building className="w-4 h-4 inline mr-2" />
              Credit Union Partners
            </button>
          </div>
        </div>

        {/* Description */}
        <div className={`p-4 rounded-lg ${
          trainingAudience === 'internal'
            ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
            : 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
        }`}>
          <p className={`text-sm ${
            trainingAudience === 'internal'
              ? 'text-blue-700 dark:text-blue-300'
              : 'text-green-700 dark:text-green-300'
          }`}>
            {trainingAudience === 'internal'
              ? '🎓 Internal training for Rise Analytics / Trellance team members working on CLIP processing and support.'
              : '🏦 Training materials for credit union partners who submit data and receive CLIP analysis results.'}
          </p>
        </div>

        {/* Training Modules */}
        <div className="grid gap-4">
          {currentTraining.map((module, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        trainingAudience === 'internal'
                          ? 'bg-blue-100 dark:bg-blue-900/30'
                          : 'bg-green-100 dark:bg-green-900/30'
                      }`}>
                        <GraduationCap className={`w-5 h-5 ${
                          trainingAudience === 'internal'
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-green-600 dark:text-green-400'
                        }`} />
                      </div>
                      <div>
                        <h3 className="font-semibold dark:text-white">{module.title}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {module.duration}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{module.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {module.topics.map((topic, tidx) => (
                        <span key={tidx} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    trainingAudience === 'internal'
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}>
                    <Play className="w-4 h-4 inline mr-1" />
                    Start
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* End-to-End CLIP Setup Guide - Only for Internal Users */}
        {trainingAudience === 'internal' && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold dark:text-white flex items-center gap-2">
                <Workflow className="w-5 h-5 text-purple-600" />
                End-to-End CLIP Setup Guide
              </h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">10 Steps • 2-3 Business Days</span>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-4 mb-4 border border-purple-200 dark:border-purple-800">
              <p className="text-sm text-purple-700 dark:text-purple-300">
                Complete walkthrough of the CLIP process from client request to final delivery. Click any step to expand details.
              </p>
            </div>

            <div className="space-y-3">
              {setupSteps.map((step) => (
                <div
                  key={step.step}
                  className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 overflow-hidden"
                >
                  <button
                    onClick={() => setActiveSetupStep(activeSetupStep === step.step ? null : step.step)}
                    className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors text-left"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                      step.step <= 3 ? 'bg-blue-500' :
                      step.step <= 6 ? 'bg-purple-500' :
                      step.step <= 8 ? 'bg-orange-500' :
                      'bg-green-500'
                    }`}>
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold dark:text-white">{step.title}</h4>
                        <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-full">
                          {step.duration}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{step.description}</p>
                    </div>
                    <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${activeSetupStep === step.step ? 'rotate-90' : ''}`} />
                  </button>

                  {activeSetupStep === step.step && (
                    <div className="px-4 pb-4 border-t dark:border-gray-700">
                      <div className="pt-4 pl-14">
                        <h5 className="font-medium text-sm dark:text-white mb-2">Tasks:</h5>
                        <ul className="space-y-2 mb-4">
                          {step.tasks.map((task, tidx) => (
                            <li key={tidx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              {task}
                            </li>
                          ))}
                        </ul>
                        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                          <p className="text-sm text-yellow-700 dark:text-yellow-300 flex items-start gap-2">
                            <Lightbulb className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span><strong>Tip:</strong> {step.tips}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Timeline Summary */}
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <h4 className="font-semibold dark:text-white mb-3">Timeline Summary</h4>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Day 1: Setup & Data Receipt</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Day 2: TransUnion Processing</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Day 3: Analysis & Delivery</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Reference Cards */}
        <div className="mt-8">
          <h3 className="font-semibold dark:text-white mb-4">Quick Reference</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white cursor-pointer hover:shadow-lg transition-shadow">
              <FileText className="w-8 h-8 mb-3 opacity-80" />
              <h4 className="font-semibold mb-1">Process Checklist</h4>
              <p className="text-sm opacity-80">Step-by-step CLIP processing guide</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white cursor-pointer hover:shadow-lg transition-shadow">
              <ListChecks className="w-8 h-8 mb-3 opacity-80" />
              <h4 className="font-semibold mb-1">Eligibility Criteria</h4>
              <p className="text-sm opacity-80">All parameters at a glance</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 text-white cursor-pointer hover:shadow-lg transition-shadow">
              <HelpCircle className="w-8 h-8 mb-3 opacity-80" />
              <h4 className="font-semibold mb-1">FAQ Document</h4>
              <p className="text-sm opacity-80">Common questions answered</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const tabs = [
    { id: 'notebook', label: 'Notebook', icon: BookOpen },
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'valuestream', label: 'Value Stream', icon: GitMerge },
    { id: 'operations', label: 'Operations', icon: Activity },
    { id: 'gaps', label: 'Gaps', icon: FileWarning },
    { id: 'training', label: 'Training', icon: GraduationCap },
    { id: 'browse', label: 'Browse', icon: Search }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
              CL
            </div>
            <div>
              <h1 className="font-bold text-lg dark:text-white">CLIP Knowledge Base</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">NotebookLM-style Interface</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Ollama Status Indicator */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
              ollamaConnected
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
            }`}>
              <div className={`w-2 h-2 rounded-full ${ollamaConnected ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`} />
              {ollamaConnected ? 'AI Connected' : 'Local Mode'}
            </div>
            <button
              onClick={() => setShowExportModal(true)}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <Share2 className="w-4 h-4" />
              Export to Confluence
            </button>
            <button
              onClick={() => setShowSourcePanel(!showSourcePanel)}
              className={`p-2 rounded-lg transition-colors ${showSourcePanel ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              <FileText className="w-5 h-5" />
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-gray-500" />}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto">
        {activeTab === 'notebook' && <NotebookTab />}
        {activeTab === 'chat' && (
          <div className="p-4">
            <div className="flex flex-col h-[calc(100vh-140px)]">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-xl p-4 text-white">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" /> Ask about CLIP
                </h2>
                <p className="text-sm text-blue-100 mt-1">
                  I only answer from the CLIP knowledge base - no external information
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900 space-y-4">
                {chatMessages.length === 0 && (
                  <div className="text-center py-8">
                    <MessageSquare className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">Ask me anything about CLIP</p>
                    <div className="flex flex-wrap justify-center gap-2 mt-4">
                      {['What is CLIP?', 'Eligibility requirements', 'Credit score tiers', 'Process workflow'].map((q) => (
                        <button
                          key={q}
                          onClick={() => setChatInput(q)}
                          className="px-3 py-1.5 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-full text-sm text-gray-600 dark:text-gray-300 hover:border-blue-500"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`chat-bubble flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-xl p-4 ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border dark:border-gray-700'
                    }`}>
                      <pre className="whitespace-pre-wrap font-sans text-sm">{msg.content}</pre>
                      {msg.sources && msg.sources.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Sources:</p>
                          <div className="flex flex-wrap gap-1">
                            {msg.sources.map((s, i) => (
                              <span key={i} className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-300">
                                {s.source}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border dark:border-gray-700">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>

              <div className="p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700 rounded-b-xl">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                    placeholder="Ask about CLIP parameters, process, TransUnion..."
                    className="flex-1 px-4 py-2 border dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!chatInput.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'valuestream' && <ValueStreamTab />}
        {activeTab === 'operations' && <OperationsTab />}
        {activeTab === 'gaps' && <GapsTab />}
        {activeTab === 'training' && <TrainingTab />}
        {activeTab === 'browse' && <div className="p-4"><BrowseTab /></div>}
      </main>

      {/* Add Source Modal */}
      {showAddSourceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md mx-4 overflow-hidden shadow-2xl">
            <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
              <h3 className="font-semibold dark:text-white">Add Source</h3>
              <button
                onClick={() => setShowAddSourceModal(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              {/* Upload Documents */}
              <div>
                <h4 className="font-medium dark:text-white mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-500" />
                  Upload Documents
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      documentInputRef.current?.click();
                      setShowAddSourceModal(false);
                    }}
                    className="flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed border-blue-300 dark:border-blue-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                  >
                    <FileText className="w-6 h-6 text-blue-500" />
                    <span className="text-xs text-blue-600 dark:text-blue-400 text-center">
                      Select Files
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      folderInputRef.current?.click();
                      setShowAddSourceModal(false);
                    }}
                    className="flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed border-green-300 dark:border-green-700 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                  >
                    <UploadCloud className="w-6 h-6 text-green-500" />
                    <span className="text-xs text-green-600 dark:text-green-400 text-center">
                      Upload Folder
                    </span>
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">Supports: PDF, Word, Text, Markdown, CSV, Excel (no size limit)</p>
              </div>

              <div className="border-t dark:border-gray-700 pt-4">
                {/* Upload Recording */}
                <h4 className="font-medium dark:text-white mb-2 flex items-center gap-2">
                  <Mic className="w-4 h-4 text-purple-500" />
                  Upload Recording
                </h4>
                <button
                  onClick={() => {
                    mediaInputRef.current?.click();
                    setShowAddSourceModal(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-purple-300 dark:border-purple-700 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                >
                  <Upload className="w-5 h-5 text-purple-500" />
                  <span className="text-sm text-purple-600 dark:text-purple-400">
                    Click to upload audio or video files
                  </span>
                </button>
                <p className="text-xs text-gray-500 mt-1">Supports: MP3, WAV, MP4, MOV, WebM</p>
              </div>

              <div className="border-t dark:border-gray-700 pt-4">
                <h4 className="font-medium dark:text-white mb-2 flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-orange-500" />
                  Add External Link
                </h4>
                <p className="text-xs text-gray-500 mb-3">
                  Add links from Lucidspark, Miro, Figma, YouTube, Loom, Confluence, or any webpage
                </p>
                <input
                  type="text"
                  placeholder="Link title (optional)"
                  value={newLinkTitle}
                  onChange={(e) => setNewLinkTitle(e.target.value)}
                  className="w-full px-3 py-2 mb-2 border dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white text-sm"
                />
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://lucidspark.com/..."
                    value={newLinkUrl}
                    onChange={(e) => setNewLinkUrl(e.target.value)}
                    className="flex-1 px-3 py-2 border dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white text-sm"
                  />
                  <button
                    onClick={() => {
                      addExternalLink();
                      if (newLinkUrl) setShowAddSourceModal(false);
                    }}
                    disabled={!newLinkUrl.trim()}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50"
                  >
                    Add
                  </button>
                </div>

                {/* Link type badges */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {['Lucidspark', 'Miro', 'Figma', 'YouTube', 'Loom', 'Confluence'].map((type) => (
                    <span
                      key={type}
                      className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md mx-4 overflow-hidden shadow-2xl">
            <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
              <h3 className="font-semibold dark:text-white flex items-center gap-2">
                <Share2 className="w-5 h-5" />
                Export to Confluence
              </h3>
              <button
                onClick={() => setShowExportModal(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Export your CLIP knowledge base to Confluence. This will create a formatted document with all sources, transcripts, and generated content.
              </p>

              <div>
                <label className="block text-sm font-medium dark:text-white mb-1">
                  Confluence Space Key *
                </label>
                <input
                  type="text"
                  placeholder="e.g., CLIP, TEAM, DOC"
                  value={confluenceSpace}
                  onChange={(e) => setConfluenceSpace(e.target.value)}
                  className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium dark:text-white mb-1">
                  Parent Page ID (optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., 123456789"
                  value={confluenceParentPage}
                  onChange={(e) => setConfluenceParentPage(e.target.value)}
                  className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white text-sm"
                />
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">Export will include:</h4>
                <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
                  <li>• All CLIP documentation ({clipDocuments.length} documents)</li>
                  {mediaFiles.filter(m => m.transcript).length > 0 && (
                    <li>• {mediaFiles.filter(m => m.transcript).length} transcribed recordings</li>
                  )}
                  {externalLinks.length > 0 && (
                    <li>• {externalLinks.length} external link references</li>
                  )}
                  <li>• Auto-generated overview and summaries</li>
                </ul>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowExportModal(false)}
                  className="flex-1 px-4 py-2 border dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={exportToConfluence}
                  disabled={!confluenceSpace || activeGeneration === 'export'}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {activeGeneration === 'export' ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Download Export
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs text-gray-500 text-center">
                Export downloads a Confluence-formatted file. You can then import it into your Confluence space.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CLIPKnowledgeDashboard;
