// Vector Search Engine for CLIP Knowledge Base
// Uses TF-IDF based similarity search (no external API needed)

import { clipDocuments } from '../data/clipDocuments';

// Simple tokenizer
const tokenize = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2);
};

// Stop words to filter out
const stopWords = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
  'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'must', 'shall', 'can', 'this', 'that', 'these',
  'those', 'it', 'its', 'they', 'them', 'their', 'we', 'our', 'you', 'your',
  'what', 'which', 'who', 'whom', 'when', 'where', 'why', 'how', 'all', 'each',
  'every', 'both', 'few', 'more', 'most', 'other', 'some', 'such', 'only',
  'same', 'than', 'too', 'very', 'just', 'also', 'now', 'here', 'there'
]);

// Build inverted index for fast search
let invertedIndex = {};
let documentVectors = {};
let idfValues = {};

const buildIndex = () => {
  const termDocFreq = {}; // Number of documents containing each term
  const docTermFreq = {}; // Term frequencies per document

  // First pass: count term frequencies
  clipDocuments.forEach(doc => {
    const tokens = tokenize(doc.content + ' ' + doc.title);
    const uniqueTerms = new Set();
    docTermFreq[doc.id] = {};

    tokens.forEach(token => {
      if (!stopWords.has(token)) {
        docTermFreq[doc.id][token] = (docTermFreq[doc.id][token] || 0) + 1;
        uniqueTerms.add(token);
      }
    });

    // Count document frequency for each unique term
    uniqueTerms.forEach(term => {
      termDocFreq[term] = (termDocFreq[term] || 0) + 1;
      if (!invertedIndex[term]) invertedIndex[term] = [];
      invertedIndex[term].push(doc.id);
    });
  });

  // Calculate IDF values
  const numDocs = clipDocuments.length;
  Object.keys(termDocFreq).forEach(term => {
    idfValues[term] = Math.log(numDocs / termDocFreq[term]);
  });

  // Calculate TF-IDF vectors for each document
  clipDocuments.forEach(doc => {
    const vector = {};
    const termFreqs = docTermFreq[doc.id];
    const maxFreq = Math.max(...Object.values(termFreqs));

    Object.keys(termFreqs).forEach(term => {
      const tf = termFreqs[term] / maxFreq; // Normalized TF
      const idf = idfValues[term] || 0;
      vector[term] = tf * idf;
    });

    documentVectors[doc.id] = vector;
  });
};

// Calculate cosine similarity between two vectors
const cosineSimilarity = (vec1, vec2) => {
  const terms = new Set([...Object.keys(vec1), ...Object.keys(vec2)]);
  let dotProduct = 0;
  let mag1 = 0;
  let mag2 = 0;

  terms.forEach(term => {
    const v1 = vec1[term] || 0;
    const v2 = vec2[term] || 0;
    dotProduct += v1 * v2;
    mag1 += v1 * v1;
    mag2 += v2 * v2;
  });

  mag1 = Math.sqrt(mag1);
  mag2 = Math.sqrt(mag2);

  if (mag1 === 0 || mag2 === 0) return 0;
  return dotProduct / (mag1 * mag2);
};

// Create query vector
const createQueryVector = (query) => {
  const tokens = tokenize(query);
  const termFreqs = {};

  tokens.forEach(token => {
    if (!stopWords.has(token)) {
      termFreqs[token] = (termFreqs[token] || 0) + 1;
    }
  });

  const maxFreq = Math.max(...Object.values(termFreqs), 1);
  const vector = {};

  Object.keys(termFreqs).forEach(term => {
    const tf = termFreqs[term] / maxFreq;
    const idf = idfValues[term] || 0;
    vector[term] = tf * idf;
  });

  return vector;
};

// Search function
export const searchDocuments = (query, topK = 5) => {
  if (Object.keys(invertedIndex).length === 0) {
    buildIndex();
  }

  const queryVector = createQueryVector(query);
  const scores = [];

  clipDocuments.forEach(doc => {
    const docVector = documentVectors[doc.id];
    const similarity = cosineSimilarity(queryVector, docVector);

    if (similarity > 0) {
      scores.push({
        ...doc,
        score: similarity
      });
    }
  });

  // Sort by similarity score
  scores.sort((a, b) => b.score - a.score);

  return scores.slice(0, topK);
};

// Keyword-based search (faster, for quick lookups)
export const keywordSearch = (query, topK = 5) => {
  if (Object.keys(invertedIndex).length === 0) {
    buildIndex();
  }

  const tokens = tokenize(query).filter(t => !stopWords.has(t));
  const docScores = {};

  tokens.forEach(token => {
    // Exact match
    if (invertedIndex[token]) {
      invertedIndex[token].forEach(docId => {
        docScores[docId] = (docScores[docId] || 0) + 2;
      });
    }

    // Partial match
    Object.keys(invertedIndex).forEach(term => {
      if (term.includes(token) || token.includes(term)) {
        invertedIndex[term].forEach(docId => {
          docScores[docId] = (docScores[docId] || 0) + 1;
        });
      }
    });
  });

  const results = Object.keys(docScores).map(docId => {
    const doc = clipDocuments.find(d => d.id === docId);
    return { ...doc, score: docScores[docId] };
  });

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, topK);
};

// Get documents by category
export const getDocumentsByCategory = (category) => {
  return clipDocuments.filter(doc => doc.category === category);
};

// Get all categories
export const getAllCategories = () => {
  const cats = new Set(clipDocuments.map(doc => doc.category));
  return Array.from(cats);
};

// Initialize index on load
buildIndex();

export default {
  searchDocuments,
  keywordSearch,
  getDocumentsByCategory,
  getAllCategories
};
