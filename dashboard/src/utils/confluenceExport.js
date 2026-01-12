// Confluence Export Utility for CLIP Knowledge Dashboard
// Generates Confluence-compatible content formats

/**
 * Convert markdown content to Confluence Storage Format (XHTML)
 */
export const markdownToConfluence = (markdown) => {
  let html = markdown
    // Headers
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    // Bold and italic
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Lists
    .replace(/^\- (.*$)/gm, '<li>$1</li>')
    .replace(/^\d+\. (.*$)/gm, '<li>$1</li>')
    // Code blocks
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<ac:structured-macro ac:name="code"><ac:parameter ac:name="language">$1</ac:parameter><ac:plain-text-body><![CDATA[$2]]></ac:plain-text-body></ac:structured-macro>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    // Paragraphs
    .replace(/\n\n/g, '</p><p>')
    // Line breaks
    .replace(/\n/g, '<br/>');

  // Wrap lists
  html = html.replace(/(<li>.*<\/li>\s*)+/g, (match) => `<ul>${match}</ul>`);

  return `<p>${html}</p>`;
};

/**
 * Generate Confluence Storage Format for CLIP Knowledge Base
 */
export const generateConfluenceStorage = (documents, mediaFiles = [], externalLinks = [], options = {}) => {
  const { title = 'CLIP Knowledge Base', includeTableOfContents = true } = options;

  let content = '';

  // Table of Contents macro
  if (includeTableOfContents) {
    content += `
<ac:structured-macro ac:name="toc">
  <ac:parameter ac:name="printable">true</ac:parameter>
  <ac:parameter ac:name="style">disc</ac:parameter>
  <ac:parameter ac:name="maxLevel">3</ac:parameter>
  <ac:parameter ac:name="minLevel">1</ac:parameter>
  <ac:parameter ac:name="type">list</ac:parameter>
</ac:structured-macro>
`;
  }

  // Info panel
  content += `
<ac:structured-macro ac:name="info">
  <ac:rich-text-body>
    <p><strong>CLIP Knowledge Base</strong></p>
    <p>Auto-generated from CLIP Knowledge Dashboard on ${new Date().toLocaleString()}</p>
    <p>Total documents: ${documents.length} | Media files: ${mediaFiles.length} | External links: ${externalLinks.length}</p>
  </ac:rich-text-body>
</ac:structured-macro>
`;

  // Group documents by category
  const byCategory = documents.reduce((acc, doc) => {
    if (!acc[doc.category]) acc[doc.category] = [];
    acc[doc.category].push(doc);
    return acc;
  }, {});

  // Generate sections for each category
  Object.entries(byCategory).forEach(([category, docs]) => {
    content += `<h1>${category}</h1>`;

    docs.forEach(doc => {
      content += `
<h2>${doc.title}</h2>
<p>${doc.content.replace(/\n/g, '<br/>')}</p>
<p><em>Source: ${doc.source}</em></p>
<hr/>
`;
    });
  });

  // Media files section
  if (mediaFiles.length > 0) {
    content += `<h1>Recorded Sessions & Transcripts</h1>`;

    mediaFiles.forEach(media => {
      content += `
<ac:structured-macro ac:name="panel">
  <ac:parameter ac:name="title">${media.name}</ac:parameter>
  <ac:rich-text-body>
    <p><strong>Type:</strong> ${media.type} | <strong>Size:</strong> ${media.size}</p>
    <p><strong>Status:</strong> ${media.status}</p>
    ${media.transcript ? `
    <ac:structured-macro ac:name="expand">
      <ac:parameter ac:name="title">View Transcript</ac:parameter>
      <ac:rich-text-body>
        <p>${media.transcript.replace(/\n/g, '<br/>')}</p>
      </ac:rich-text-body>
    </ac:structured-macro>
    ` : ''}
  </ac:rich-text-body>
</ac:structured-macro>
`;
    });
  }

  // External links section
  if (externalLinks.length > 0) {
    content += `<h1>Related Resources</h1>`;
    content += `<ul>`;

    externalLinks.forEach(link => {
      content += `<li><a href="${link.url}">${link.title}</a> <em>(${link.type})</em></li>`;
    });

    content += `</ul>`;
  }

  return content;
};

/**
 * Generate Confluence Wiki Markup (legacy format)
 */
export const generateConfluenceWiki = (documents, mediaFiles = [], externalLinks = []) => {
  let wiki = '';

  // Header
  wiki += `{panel:title=CLIP Knowledge Base|borderStyle=solid|borderColor=#ccc|titleBGColor=#f0f0f0|bgColor=#fff}
Auto-generated from CLIP Knowledge Dashboard
Generated: ${new Date().toLocaleString()}
Documents: ${documents.length} | Media: ${mediaFiles.length} | Links: ${externalLinks.length}
{panel}

{toc:printable=true|style=disc|maxLevel=3|minLevel=1}

----

`;

  // Group by category
  const byCategory = documents.reduce((acc, doc) => {
    if (!acc[doc.category]) acc[doc.category] = [];
    acc[doc.category].push(doc);
    return acc;
  }, {});

  // Generate sections
  Object.entries(byCategory).forEach(([category, docs]) => {
    wiki += `h1. ${category}\n\n`;

    docs.forEach(doc => {
      wiki += `h2. ${doc.title}\n\n`;
      wiki += `${doc.content}\n\n`;
      wiki += `_Source: ${doc.source}_\n\n`;
      wiki += `----\n\n`;
    });
  });

  // Media section
  if (mediaFiles.length > 0) {
    wiki += `h1. Recorded Sessions & Transcripts\n\n`;

    mediaFiles.forEach(media => {
      wiki += `{panel:title=${media.name}}\n`;
      wiki += `*Type:* ${media.type} | *Size:* ${media.size}\n`;
      wiki += `*Status:* ${media.status}\n`;
      if (media.transcript) {
        wiki += `{expand:View Transcript}\n${media.transcript}\n{expand}\n`;
      }
      wiki += `{panel}\n\n`;
    });
  }

  // Links section
  if (externalLinks.length > 0) {
    wiki += `h1. Related Resources\n\n`;
    externalLinks.forEach(link => {
      wiki += `* [${link.title}|${link.url}] _(${link.type})_\n`;
    });
  }

  return wiki;
};

/**
 * Generate JSON structure for Confluence API
 */
export const generateConfluenceApiPayload = (title, content, spaceKey, parentId = null) => {
  const payload = {
    type: 'page',
    title: title,
    space: {
      key: spaceKey
    },
    body: {
      storage: {
        value: content,
        representation: 'storage'
      }
    }
  };

  if (parentId) {
    payload.ancestors = [{ id: parentId }];
  }

  return payload;
};

export default {
  markdownToConfluence,
  generateConfluenceStorage,
  generateConfluenceWiki,
  generateConfluenceApiPayload
};
