// CLIP Knowledge Base - Ollama Backend Server
// Provides RAG-based chat using local LLM

import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import multer from 'multer';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

// CommonJS imports for pdf-parse
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

// File upload config
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB max
});

const app = express();
const PORT = 3001;
const OLLAMA_URL = 'http://localhost:11434';

app.use(cors());
app.use(express.json());

// CLIP Knowledge Base - loaded from structured data
const clipKnowledge = {
  overview: {
    name: "CLIP - Credit Line Increase Program",
    organization: "Trellance / Rise Analytics",
    since: "2015-2016",
    turnaround: "2-3 business days",
    approvalRate: "60-70% of eligible members",
    creditBureau: "TransUnion (419 fields)",
    technology: { current: "Alteryx workflows", future: "Python/dbt migration" }
  },
  products: [
    { name: "Credit Cards", description: "Most common product for CLI analysis", requirements: "Minimum 1 year since origination", maxLimit: "$20,000" },
    { name: "Unsecured Lines of Credit", description: "Variable terms LOC products", requirements: "Same eligibility criteria apply" },
    { name: "HELOCs", description: "Home Equity Lines of Credit", requirements: "Requires property valuation" }
  ],
  eligibility: [
    { name: "Minimum Income", value: "$20,000", description: "Annual gross income floor" },
    { name: "Minimum FICO Score", value: "650", description: "Credit bureau score threshold" },
    { name: "Maximum DTI", value: "50%", description: "Debt-to-Income ceiling" },
    { name: "Minimum Age", value: "21 years", description: "Member age requirement" },
    { name: "Maximum Credit Limit", value: "$20,000", description: "Per-product cap" },
    { name: "Card Origination", value: "> 1 year", description: "Time since account opened" },
    { name: "FICO Drop Threshold", value: "-50 points", description: "Max decline from origination" },
    { name: "Days Past Due", value: "0", description: "Must be current" }
  ],
  increaseTiers: [
    { currentLimit: "< $1,000", increaseTo: "$1,500" },
    { currentLimit: "$1,000 - $2,000", increaseTo: "$3,000" },
    { currentLimit: "$2,000 - $3,000", increaseTo: "$5,000" },
    { currentLimit: "$3,000 - $5,000", increaseTo: "$7,500" },
    { currentLimit: "$5,000 - $7,500", increaseTo: "$10,000" },
    { currentLimit: "$7,500 - $10,000", increaseTo: "$15,000" },
    { currentLimit: "$10,000 - $15,000", increaseTo: "$20,000" }
  ],
  aggregateLimits: [
    { scoreRange: "776 - 850", tier: "Excellent", maxAggregate: "$25,000" },
    { scoreRange: "726 - 775", tier: "Good", maxAggregate: "$18,000" },
    { scoreRange: "650 - 725", tier: "Fair", maxAggregate: "$13,000" },
    { scoreRange: "Below 650", tier: "Below Threshold", maxAggregate: "Not Eligible" }
  ],
  exclusions: [
    "Bankruptcy (active or within lookback period)",
    "Charged-off accounts",
    "Active collections",
    "30/60/90 day delinquencies",
    "Fraud alerts on credit file",
    "Deceased indicator",
    "Credit freeze",
    "Overlimit on existing products",
    "Recent CLI (within 6-12 months)"
  ],
  processPhases: [
    "Phase 1: Data Preparation - Input file setup, account age formula, CORP ID lookup",
    "Phase 2: TransUnion Integration - Upload to DEG, download response, handle consumer statements",
    "Phase 3: Parameter Configuration - Credit metrics, exclusion criteria, income/payment calculation",
    "Phase 4: Aggregate Limits - Multi-product handling, credit limit buckets"
  ],
  contacts: [
    { name: "Jen Werkley", email: "jen.werkley@transunion.com", role: "TransUnion Primary Contact" },
    { name: "Abbie Jeremiah", email: "Abbie.Jeremiah@transunion.com", role: "TransUnion Secondary Contact" }
  ],
  glossary: {
    "CLI": "Credit Line Increase",
    "CLIP": "Credit Line Increase Program",
    "CU": "Credit Union",
    "DEG": "Data Exchange Gateway (TransUnion file transfer)",
    "DTI": "Debt-to-Income ratio",
    "FICO": "Fair Isaac Corporation credit score",
    "HELOC": "Home Equity Line of Credit",
    "TU": "TransUnion (credit bureau)",
    "dbt": "Data build tool - open source transformation framework",
    "ETL": "Extract, Transform, Load",
    "POC": "Proof of Concept"
  },
  automationStrategy: {
    overview: "Three approaches to automate CLIP processing",
    approaches: [
      { name: "Direct Alteryx Automation", timeline: "2-4 weeks", description: "PowerShell orchestration of existing workflows" },
      { name: "Hybrid Alteryx + Python", timeline: "4-6 weeks", description: "Alteryx for ETL, Python for business logic" },
      { name: "Full Python/dbt Migration", timeline: "8-12 weeks", description: "Complete modernization with dbt for Snowflake" }
    ],
    currentState: { touchpoints: "8-12", turnaround: "2-3 days", throughput: "5-10 CUs/week", errorRate: "2-5%" },
    futureState: { touchpoints: "2-3", turnaround: "4-8 hours", throughput: "20-30 CUs/week", errorRate: "<0.5%" }
  },
  alteryxWorkflow: {
    stages: [
      { name: "Input Stage", tools: "1-20", purpose: "Data ingestion and validation" },
      { name: "Data Preparation", tools: "21-50", purpose: "Cleaning, deduplication" },
      { name: "Eligibility Filtering", tools: "51-80", purpose: "Apply business rules" },
      { name: "Analysis", tools: "81-150", purpose: "TU merge, risk scoring" },
      { name: "Business Rules", tools: "151-200", purpose: "CLI tier logic" },
      { name: "Output", tools: "201+", purpose: "Report generation" }
    ],
    criticalFormulas: [
      { tool: "Formula (64)", purpose: "Account age calculation" },
      { tool: "Formula (67)", purpose: "Credit score range classification" },
      { tool: "Formula (72)", purpose: "Exclusion logic" },
      { tool: "Formula (73)", purpose: "Income and payment calculations" },
      { tool: "Formula (74)", purpose: "CLI tier assignment" }
    ]
  },
  folderSetup: {
    sDrive: "S:\\Products\\CLIP (Credit Line Increase Program)\\Inputs\\Direct Source Files\\PeerNumber_CUName\\",
    box: "https://trellance.app.box.com/folder/305984505328",
    naming: "PeerNumber_CreditUnionName (e.g., 0558_Interfaith)"
  }
};

// Convert knowledge base to searchable text chunks
const knowledgeChunks = [
  {
    id: 'overview',
    title: 'CLIP Overview',
    content: `CLIP (Credit Line Increase Program) is ${clipKnowledge.overview.organization}'s automated credit line increase analysis service. Operating since ${clipKnowledge.overview.since}, it has a standard turnaround of ${clipKnowledge.overview.turnaround} with an approval rate of ${clipKnowledge.overview.approvalRate}. It uses ${clipKnowledge.overview.creditBureau} for credit data. Current technology is ${clipKnowledge.overview.technology.current} with planned migration to ${clipKnowledge.overview.technology.future}.`
  },
  {
    id: 'products',
    title: 'CLIP Products',
    content: `CLIP analyzes three product types: ${clipKnowledge.products.map(p => `${p.name} - ${p.description} (${p.requirements})`).join('; ')}.`
  },
  {
    id: 'eligibility',
    title: 'Eligibility Requirements',
    content: `CLIP eligibility requirements: ${clipKnowledge.eligibility.map(e => `${e.name}: ${e.value} (${e.description})`).join('; ')}.`
  },
  {
    id: 'increase-tiers',
    title: 'Credit Line Increase Tiers',
    content: `Credit line increase tiers: ${clipKnowledge.increaseTiers.map(t => `Current limit ${t.currentLimit} can increase to ${t.increaseTo}`).join('; ')}. Maximum credit limit is $20,000.`
  },
  {
    id: 'aggregate-limits',
    title: 'Aggregate Limits by Credit Score',
    content: `Aggregate limits by credit score tier: ${clipKnowledge.aggregateLimits.map(a => `${a.tier} (${a.scoreRange}): ${a.maxAggregate} maximum`).join('; ')}.`
  },
  {
    id: 'exclusions',
    title: 'Exclusion Criteria',
    content: `Members are excluded from CLI if they have: ${clipKnowledge.exclusions.join('; ')}.`
  },
  {
    id: 'process',
    title: 'CLIP Process Workflow',
    content: `CLIP processing has four phases: ${clipKnowledge.processPhases.join('; ')}.`
  },
  {
    id: 'contacts',
    title: 'TransUnion Contacts',
    content: `TransUnion contacts: ${clipKnowledge.contacts.map(c => `${c.name} (${c.role}): ${c.email}`).join('; ')}.`
  },
  {
    id: 'glossary',
    title: 'CLIP Glossary',
    content: `Key terms: ${Object.entries(clipKnowledge.glossary).map(([term, def]) => `${term} = ${def}`).join('; ')}.`
  },
  {
    id: 'automation-strategy',
    title: 'Automation Strategy',
    content: `${clipKnowledge.automationStrategy.overview}. Three approaches: ${clipKnowledge.automationStrategy.approaches.map(a => `${a.name} (${a.timeline}) - ${a.description}`).join('; ')}. Current state: ${clipKnowledge.automationStrategy.currentState.touchpoints} touchpoints, ${clipKnowledge.automationStrategy.currentState.turnaround} turnaround, ${clipKnowledge.automationStrategy.currentState.throughput} throughput, ${clipKnowledge.automationStrategy.currentState.errorRate} error rate. Future state: ${clipKnowledge.automationStrategy.futureState.touchpoints} touchpoints, ${clipKnowledge.automationStrategy.futureState.turnaround} turnaround, ${clipKnowledge.automationStrategy.futureState.throughput} throughput, ${clipKnowledge.automationStrategy.futureState.errorRate} error rate.`
  },
  {
    id: 'alteryx-workflow',
    title: 'Alteryx Workflow Structure',
    content: `CLIP Alteryx workflow stages: ${clipKnowledge.alteryxWorkflow.stages.map(s => `${s.name} (tools ${s.tools}): ${s.purpose}`).join('; ')}. Critical formulas: ${clipKnowledge.alteryxWorkflow.criticalFormulas.map(f => `${f.tool} - ${f.purpose}`).join('; ')}.`
  },
  {
    id: 'folder-setup',
    title: 'Folder Setup and Box',
    content: `S: Drive location: ${clipKnowledge.folderSetup.sDrive}. Box URL: ${clipKnowledge.folderSetup.box}. Naming convention: ${clipKnowledge.folderSetup.naming}. Use File Request feature to let clients upload without needing Box accounts.`
  },
  {
    id: 'dbt-migration',
    title: 'Python/dbt Migration',
    content: `Full Python/dbt migration approach uses dbt for Snowflake transformations. Benefits: No Alteryx licensing costs, full Git version control, cloud-native scalability, easier CI/CD. dbt model structure: staging models (stg_member_accounts, stg_transunion_response), intermediate models (int_eligibility_filtered, int_risk_scored), mart models (mart_cli_recommendations, mart_cli_summary).`
  },
  {
    id: 'alteryx-formulas',
    title: 'Critical Alteryx Formulas',
    content: `Key Formula tools in CLIP workflow: Formula (64) calculates account age to determine time since origination. Formula (67) classifies credit score ranges into risk tiers. Formula (72) contains exclusion logic for bankruptcy, delinquency, and collections. Formula (73) handles income and payment calculations, converting annual to monthly income. Formula (74) assigns CLI tiers using nested IF statements for increase amounts. These are the most critical tools requiring CU-specific customization.`
  }
];

// Auto-load documentation from docs folder
async function loadDocumentation() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const docsDir = path.join(__dirname, '../../docs');

  console.log('Loading documentation from:', docsDir);

  if (!fs.existsSync(docsDir)) {
    console.log('Docs directory not found, skipping auto-load');
    return 0;
  }

  let loadedCount = 0;
  const files = fs.readdirSync(docsDir);

  for (const file of files) {
    const filePath = path.join(docsDir, file);
    const stat = fs.statSync(filePath);

    if (stat.isFile()) {
      const ext = path.extname(file).toLowerCase();
      let content = null;

      try {
        if (ext === '.md' || ext === '.txt') {
          content = fs.readFileSync(filePath, 'utf-8');
        } else if (ext === '.pdf') {
          const buffer = fs.readFileSync(filePath);
          const data = await pdfParse(buffer);
          content = data.text;
        } else if (ext === '.docx') {
          const buffer = fs.readFileSync(filePath);
          const result = await mammoth.extractRawText({ buffer });
          content = result.value;
        }

        if (content && content.trim().length > 0) {
          // Split into chunks for better retrieval
          const chunkSize = 1500;
          const docId = `doc_${file.replace(/[^a-z0-9]/gi, '_')}`;

          for (let i = 0; i < content.length; i += chunkSize) {
            const chunk = content.substring(i, i + chunkSize);
            const chunkIdx = Math.floor(i / chunkSize);

            knowledgeChunks.push({
              id: `${docId}_chunk_${chunkIdx}`,
              title: `${file} (section ${chunkIdx + 1})`,
              content: chunk,
              source: 'auto-loaded'
            });
            loadedCount++;
          }

          console.log(`  ✓ Loaded: ${file} (${Math.ceil(content.length / chunkSize)} chunks)`);
        }
      } catch (err) {
        console.log(`  ✗ Failed to load ${file}: ${err.message}`);
      }
    }
  }

  return loadedCount;
}

// Simple keyword-based retrieval
function retrieveContext(query) {
  const queryLower = query.toLowerCase();
  const scored = knowledgeChunks.map(chunk => {
    const contentLower = chunk.content.toLowerCase();
    const titleLower = chunk.title.toLowerCase();
    let score = 0;

    // Check for keyword matches
    const words = queryLower.split(/\s+/).filter(w => w.length > 2);
    words.forEach(word => {
      if (contentLower.includes(word)) score += 2;
      if (titleLower.includes(word)) score += 3;
    });

    // Boost for specific topics
    if (queryLower.includes('eligib') && chunk.id === 'eligibility') score += 5;
    if (queryLower.includes('score') && (chunk.id === 'aggregate-limits' || chunk.id === 'eligibility')) score += 5;
    if (queryLower.includes('limit') && (chunk.id === 'increase-tiers' || chunk.id === 'aggregate-limits')) score += 5;
    if (queryLower.includes('product') && chunk.id === 'products') score += 5;
    if (queryLower.includes('process') && chunk.id === 'process') score += 5;
    if (queryLower.includes('contact') && chunk.id === 'contacts') score += 5;
    if (queryLower.includes('exclus') && chunk.id === 'exclusions') score += 5;
    if ((queryLower.includes('what is') || queryLower.includes('overview')) && chunk.id === 'overview') score += 5;
    // New automation and workflow topics
    if ((queryLower.includes('automat') || queryLower.includes('python') || queryLower.includes('dbt')) && chunk.id === 'automation-strategy') score += 5;
    if ((queryLower.includes('alteryx') || queryLower.includes('workflow') || queryLower.includes('stage')) && chunk.id === 'alteryx-workflow') score += 5;
    if ((queryLower.includes('folder') || queryLower.includes('box') || queryLower.includes('setup')) && chunk.id === 'folder-setup') score += 5;
    if ((queryLower.includes('formula') || queryLower.includes('tool')) && chunk.id === 'alteryx-formulas') score += 5;
    if ((queryLower.includes('dbt') || queryLower.includes('migrat') || queryLower.includes('snowflake')) && chunk.id === 'dbt-migration') score += 5;

    return { ...chunk, score };
  });

  // Return top 3 most relevant chunks
  return scored
    .filter(c => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

// Check if Ollama is running
async function checkOllama() {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/tags`);
    return response.ok;
  } catch {
    return false;
  }
}

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // Retrieve relevant context (limit to 2000 chars for faster response)
  const relevantChunks = retrieveContext(message);
  let context = relevantChunks.map(c => c.content).join('\n\n');
  if (context.length > 2000) {
    context = context.substring(0, 2000) + '...';
  }

  // Build detailed source citations with excerpts
  const detailedSources = relevantChunks.map(c => ({
    title: c.title,
    id: c.id,
    score: c.score,
    excerpt: c.content.substring(0, 200) + (c.content.length > 200 ? '...' : ''),
    fullContent: c.content,
    isUploaded: c.id?.startsWith('uploaded_') || c.id?.startsWith('doc_')
  }));
  const sources = relevantChunks.map(c => c.title);

  // Check if Ollama is available
  const ollamaAvailable = await checkOllama();

  if (!ollamaAvailable) {
    // Fallback to simple retrieval-based response
    if (relevantChunks.length === 0) {
      return res.json({
        response: "I don't have information about that in the CLIP knowledge base. Please ask about CLIP eligibility, products, credit limits, process workflow, or other CLIP-related topics.",
        sources: [],
        detailedSources: [],
        mode: 'fallback'
      });
    }

    return res.json({
      response: relevantChunks[0].content,
      sources,
      detailedSources,
      mode: 'fallback',
      note: 'Ollama not running. Install and start Ollama for AI-powered responses.'
    });
  }

  // Build prompt for Ollama
  const systemPrompt = `You are a CLIP (Credit Line Increase Program) knowledge assistant. You MUST answer questions using ONLY the provided context below.

CRITICAL RULES:
1. ONLY use information from the provided context
2. If the context doesn't contain the answer, say "I don't have that information in the CLIP knowledge base"
3. NEVER make up information or use knowledge from outside the context
4. Be concise and direct
5. Cite which part of the context you used

CONTEXT:
${context || "No relevant context found."}`;

  try {
    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'phi3:mini',  // Small and fast model for knowledge-base Q&A
        prompt: `${systemPrompt}\n\nUser Question: ${message}\n\nAnswer:`,
        stream: false,
        options: {
          temperature: 0.3,  // Lower temperature for more factual responses
          num_predict: 300  // Reduced for faster responses
        }
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error('Ollama request failed');
    }

    const data = await response.json();

    res.json({
      response: data.response,
      sources,
      detailedSources,
      mode: 'ollama'
    });
  } catch (error) {
    console.error('Ollama error:', error);

    // Fallback response
    if (relevantChunks.length > 0) {
      res.json({
        response: relevantChunks[0].content,
        sources,
        detailedSources,
        mode: 'fallback',
        error: 'Ollama error, using fallback'
      });
    } else {
      res.json({
        response: "I couldn't process your question. Please try again.",
        sources: [],
        mode: 'error'
      });
    }
  }
});

// Health check
app.get('/api/health', async (req, res) => {
  const ollamaAvailable = await checkOllama();
  res.json({
    status: 'ok',
    ollama: ollamaAvailable,
    message: ollamaAvailable ? 'Ollama connected' : 'Ollama not running - using fallback mode'
  });
});

// List available models
app.get('/api/models', async (req, res) => {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/tags`);
    if (response.ok) {
      const data = await response.json();
      res.json({ models: data.models || [] });
    } else {
      res.json({ models: [], error: 'Ollama not available' });
    }
  } catch {
    res.json({ models: [], error: 'Ollama not running' });
  }
});

// Store for dynamically added documents
let uploadedDocuments = [];

// Knowledge base stats endpoint
app.get('/api/stats', (req, res) => {
  const autoLoadedChunks = knowledgeChunks.filter(c => c.source === 'auto-loaded');
  const builtInChunks = knowledgeChunks.filter(c => !c.source);

  res.json({
    builtInChunks: builtInChunks.length,
    autoLoadedChunks: autoLoadedChunks.length,
    uploadedDocuments: uploadedDocuments.length,
    totalChunks: knowledgeChunks.length,
    categories: {
      overview: 1,
      products: 1,
      eligibility: 1,
      increaseTiers: 1,
      aggregateLimits: 1,
      exclusions: 1,
      process: 1,
      contacts: 1,
      glossary: 1,
      automation: 3,
      workflow: 2,
      folderSetup: 1
    },
    autoLoadedDocs: [...new Set(autoLoadedChunks.map(c => c.title.split(' (section')[0]))],
    uploadedDocs: uploadedDocuments.map(d => ({ id: d.id, name: d.name, type: d.type, addedAt: d.addedAt }))
  });
});

// Add document to knowledge base
app.post('/api/documents', (req, res) => {
  const { name, content, type } = req.body;

  if (!name || !content) {
    return res.status(400).json({ error: 'Name and content are required' });
  }

  const doc = {
    id: `uploaded_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    content,
    type: type || 'document',
    addedAt: new Date().toISOString()
  };

  // Add to uploaded documents
  uploadedDocuments.push(doc);

  // Also add to knowledge chunks for retrieval
  knowledgeChunks.push({
    id: doc.id,
    title: `Uploaded: ${name}`,
    content: content.substring(0, 2000) // Limit chunk size
  });

  res.json({
    success: true,
    document: { id: doc.id, name: doc.name, type: doc.type },
    totalChunks: knowledgeChunks.length
  });
});

// Bulk add documents
app.post('/api/documents/bulk', (req, res) => {
  const { documents } = req.body;

  if (!Array.isArray(documents)) {
    return res.status(400).json({ error: 'Documents array is required' });
  }

  const added = [];
  for (const doc of documents) {
    if (doc.name && doc.content) {
      const newDoc = {
        id: `uploaded_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: doc.name,
        content: doc.content,
        type: doc.type || 'document',
        addedAt: new Date().toISOString()
      };

      uploadedDocuments.push(newDoc);
      knowledgeChunks.push({
        id: newDoc.id,
        title: `Uploaded: ${doc.name}`,
        content: doc.content.substring(0, 2000)
      });

      added.push({ id: newDoc.id, name: newDoc.name });
    }
  }

  res.json({
    success: true,
    added: added.length,
    documents: added,
    totalChunks: knowledgeChunks.length
  });
});

// List uploaded documents
app.get('/api/documents', (req, res) => {
  res.json({
    documents: uploadedDocuments.map(d => ({
      id: d.id,
      name: d.name,
      type: d.type,
      addedAt: d.addedAt,
      contentPreview: d.content.substring(0, 200) + '...'
    }))
  });
});

// Upload and parse files (PDF, Word, Text)
app.post('/api/upload', upload.array('files', 20), async (req, res) => {
  const results = [];
  const errors = [];

  for (const file of req.files || []) {
    const ext = path.extname(file.originalname).toLowerCase();
    let content = null;
    let parseError = null;

    try {
      if (ext === '.pdf') {
        // Parse PDF
        const data = await pdfParse(file.buffer);
        content = data.text;
      } else if (ext === '.docx') {
        // Parse Word document
        const result = await mammoth.extractRawText({ buffer: file.buffer });
        content = result.value;
      } else if (ext === '.doc') {
        // Older Word format - try mammoth (may not work for all .doc files)
        try {
          const result = await mammoth.extractRawText({ buffer: file.buffer });
          content = result.value;
        } catch {
          parseError = 'Legacy .doc format not fully supported. Please convert to .docx';
        }
      } else if (['.txt', '.md', '.csv', '.json'].includes(ext)) {
        // Plain text files
        content = file.buffer.toString('utf-8');
      } else {
        parseError = `Unsupported file type: ${ext}`;
      }

      if (content && content.trim().length > 0) {
        const doc = {
          id: `uploaded_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: file.originalname,
          content: content,
          type: ext.replace('.', ''),
          addedAt: new Date().toISOString(),
          chunks: Math.ceil(content.length / 1000) // Approximate chunks
        };

        uploadedDocuments.push(doc);

        // Split into multiple chunks for better retrieval
        const chunkSize = 1500;
        const chunks = [];
        for (let i = 0; i < content.length; i += chunkSize) {
          chunks.push(content.substring(i, i + chunkSize));
        }

        chunks.forEach((chunk, idx) => {
          knowledgeChunks.push({
            id: `${doc.id}_chunk_${idx}`,
            title: `${file.originalname} (part ${idx + 1})`,
            content: chunk
          });
        });

        results.push({
          name: file.originalname,
          success: true,
          chunks: chunks.length,
          contentLength: content.length
        });
      } else if (parseError) {
        errors.push({ name: file.originalname, error: parseError });
      } else {
        errors.push({ name: file.originalname, error: 'No text content extracted' });
      }
    } catch (err) {
      errors.push({ name: file.originalname, error: err.message });
    }
  }

  res.json({
    success: results.length > 0,
    processed: results.length,
    failed: errors.length,
    results,
    errors,
    totalChunks: knowledgeChunks.length,
    totalDocuments: uploadedDocuments.length
  });
});

// Initialize server
async function startServer() {
  // Auto-load documentation first
  console.log('\n📚 Loading CLIP documentation into knowledge base...');
  const docCount = await loadDocumentation();
  console.log(`📚 Total knowledge chunks: ${knowledgeChunks.length} (${docCount} from docs folder)\n`);

  app.listen(PORT, () => {
    console.log(`CLIP Knowledge Server running on http://localhost:${PORT}`);
    console.log('Checking Ollama connection...');
    checkOllama().then(available => {
      if (available) {
        console.log('✓ Ollama is running');
      } else {
        console.log('⚠ Ollama not detected. Install from https://ollama.com');
        console.log('  Then run: ollama pull phi3:mini');
        console.log('  Server will use fallback mode until Ollama is available');
      }
    });
  });
}

startServer();
