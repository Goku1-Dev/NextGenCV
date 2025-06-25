import React, { useState, useEffect, useRef } from 'react';
import { FileText, Eye, Copy, Download, Settings, FileDown, FileType } from 'lucide-react';

const LaTeX = () => {
  const [code, setCode] = useState(`\\documentclass[line,margin]{res}
\\usepackage[utf8]{inputenc}
\\usepackage{amsmath}
\\usepackage{amssymb}

\\name{John Doe}
\\address{123 Main Street \\\\ City, State 12345 \\\\ (555) 123-4567}
\\address{john.doe@email.com \\\\ linkedin.com/in/johndoe \\\\ github.com/johndoe}

\\begin{document}

\\begin{resume}

\\section{OBJECTIVE}
Experienced software engineer seeking a challenging position to leverage 5+ years of full-stack development expertise in building scalable web applications and leading cross-functional teams.

\\section{TECHNICAL SKILLS}
\\textbf{Languages:} JavaScript, Python, Java, TypeScript, C++, SQL\\\\
\\textbf{Frameworks:} React, Node.js, Express, Django, Spring Boot, Angular\\\\
\\textbf{Databases:} PostgreSQL, MongoDB, Redis, MySQL\\\\
\\textbf{Tools:} Git, Docker, AWS, Jenkins, Kubernetes, Jest\\\\
\\textbf{Methodologies:} Agile, Scrum, TDD, CI/CD

\\section{EXPERIENCE}

\\textbf{Senior Software Engineer} \\hfill \\textbf{Jan 2021 - Present}\\\\
\\textit{TechCorp Inc., San Francisco, CA}
\\begin{itemize} \\itemsep -2pt
\\item Led development of microservices architecture serving 1M+ users with 99.9\\% uptime
\\item Improved application performance by 40\\% through database optimization and caching strategies
\\item Mentored 3 junior developers and established code review best practices
\\item Architected and implemented real-time notification system using WebSockets
\\end{itemize}

\\textbf{Software Engineer} \\hfill \\textbf{Jun 2019 - Dec 2020}\\\\
\\textit{StartupXYZ, Austin, TX}
\\begin{itemize} \\itemsep -2pt
\\item Built responsive web applications using React and Node.js for 50K+ active users
\\item Implemented RESTful APIs and integrated third-party payment processing systems
\\item Collaborated with cross-functional teams using Agile methodology
\\item Reduced API response time by 60\\% through efficient database query optimization
\\end{itemize}

\\textbf{Junior Developer} \\hfill \\textbf{Jan 2019 - May 2019}\\\\
\\textit{DevStudio, Remote}
\\begin{itemize} \\itemsep -2pt
\\item Developed and maintained client websites using HTML, CSS, and JavaScript
\\item Participated in daily standups and sprint planning meetings
\\item Fixed bugs and implemented new features based on client requirements
\\end{itemize}

\\section{EDUCATION}

\\textbf{Bachelor of Science in Computer Science} \\hfill \\textbf{2019}\\\\
\\textit{University of Technology, GPA: 3.8/4.0, Magna Cum Laude}

\\textbf{Relevant Coursework:} Data Structures, Algorithms, Software Engineering, Database Systems, Computer Networks

\\section{PROJECTS}

\\textbf{E-commerce Platform} \\hfill \\textbf{React, Node.js, PostgreSQL}
\\begin{itemize} \\itemsep -2pt
\\item Full-stack application with payment processing, user authentication, and inventory management
\\item Implemented advanced search functionality with filters and sorting options
\\item Integrated Stripe API for secure payment processing
\\end{itemize}

\\textbf{Task Management API} \\hfill \\textbf{Python, Django, WebSocket}
\\begin{itemize} \\itemsep -2pt
\\item RESTful API for task management with user roles and real-time notifications
\\item Built comprehensive test suite achieving 95\\% code coverage
\\item Deployed on AWS with auto-scaling capabilities
\\end{itemize}

\\section{CERTIFICATIONS}
\\textbf{AWS Certified Solutions Architect} \\hfill \\textbf{2023}\\\\
\\textbf{Google Cloud Professional Cloud Architect} \\hfill \\textbf{2022}

\\end{resume}
\\end{document}`);

  const [showPreview, setShowPreview] = useState(true);
  const [fontSize, setFontSize] = useState(14);
  const [theme, setTheme] = useState('dark');
  const [template, setTemplate] = useState('res');
  const [isKaTeXEnabled, setIsKaTeXEnabled] = useState(true);
  const textareaRef = useRef(null);

  // Load KaTeX CSS and JS
  useEffect(() => {
    if (isKaTeXEnabled && !document.getElementById('katex-css')) {
      const katexCSS = document.createElement('link');
      katexCSS.id = 'katex-css';
      katexCSS.rel = 'stylesheet';
      katexCSS.href = 'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.8/katex.min.css';
      document.head.appendChild(katexCSS);

      const katexJS = document.createElement('script');
      katexJS.id = 'katex-js';
      katexJS.src = 'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.8/katex.min.js';
      document.head.appendChild(katexJS);

      const katexAutoRender = document.createElement('script');
      katexAutoRender.id = 'katex-auto-render';
      katexAutoRender.src = 'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.16.8/contrib/auto-render.min.js';
      document.head.appendChild(katexAutoRender);
    }
  }, [isKaTeXEnabled]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [code]);

  const templates = {
    article: `\\documentclass{article}
\\usepackage[utf8]{inputenc}
\\usepackage{amsmath}
\\usepackage{geometry}
\\geometry{margin=1in}

\\title{Your Title Here}
\\author{Your Name}
\\date{\\today}

\\begin{document}

\\maketitle

\\section{Introduction}
Your content here...

\\end{document}`,
    
    res: `\\documentclass[line,margin]{res}
\\usepackage[utf8]{inputenc}
\\usepackage{amsmath}

\\name{Your Name}
\\address{Your Address \\\\ Phone Number}
\\address{Email \\\\ LinkedIn \\\\ Portfolio}

\\begin{document}

\\begin{resume}

\\section{OBJECTIVE}
Your objective here...

\\section{EXPERIENCE}
\\textbf{Job Title} \\hfill \\textbf{Dates}\\\\
\\textit{Company Name, Location}
\\begin{itemize} \\itemsep -2pt
\\item Achievement or responsibility
\\item Another achievement
\\end{itemize}

\\end{resume}
\\end{document}`,

    letter: `\\documentclass{letter}
\\usepackage[utf8]{inputenc}
\\usepackage{geometry}
\\geometry{margin=1in}

\\signature{Your Name}
\\address{Your Address \\\\ City, State ZIP \\\\ Phone Number \\\\ Email}

\\begin{document}

\\begin{letter}{Recipient Name \\\\ Recipient Address \\\\ City, State ZIP}

\\opening{Dear Sir or Madam,}

Your letter content here...

\\closing{Sincerely,}

\\end{letter}
\\end{document}`
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.tex';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPDF = async () => {
    try {
      // Create a temporary HTML document for PDF generation
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>LaTeX Document</title>
          <style>
            body { 
              font-family: 'Times New Roman', serif; 
              font-size: 12pt; 
              line-height: 1.6; 
              margin: 1in; 
              color: #000;
            }
            .document-title { font-size: 18pt; font-weight: bold; text-align: center; margin-bottom: 1em; }
            .document-author { font-size: 12pt; text-align: center; margin-bottom: 0.5em; }
            .section { font-size: 14pt; font-weight: bold; margin: 1.5em 0 0.5em 0; text-transform: uppercase; }
            .subsection { font-size: 12pt; font-weight: bold; margin: 1em 0 0.5em 0; }
            ul { margin: 0.5em 0; padding-left: 1.5em; }
            li { margin: 0.2em 0; }
            .name-header { font-size: 16pt; font-weight: bold; text-align: center; margin-bottom: 0.5em; }
            .address-line { text-align: center; font-size: 10pt; margin-bottom: 0.3em; }
            .job-header { display: flex; justify-content: space-between; font-weight: bold; margin-top: 1em; }
            .company-info { font-style: italic; margin-bottom: 0.5em; }
            @media print { 
              body { margin: 0.5in; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          ${renderPreview().__html}
        </body>
        </html>
      `;

      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      // Open in new window for printing to PDF
      const printWindow = window.open(url, '_blank');
      printWindow.onload = () => {
        printWindow.print();
        setTimeout(() => {
          printWindow.close();
          URL.revokeObjectURL(url);
        }, 1000);
      };
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  const handleDownloadWord = () => {
    try {
      // Create Word-compatible HTML
      const wordContent = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' 
              xmlns:w='urn:schemas-microsoft-com:office:word' 
              xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
          <meta charset="utf-8">
          <title>LaTeX Document</title>
          <!--[if gte mso 9]>
          <xml>
            <w:WordDocument>
              <w:View>Print</w:View>
              <w:Zoom>90</w:Zoom>
              <w:DoNotPromptForConvert/>
              <w:DoNotShowInsertionsAndDeletions/>
            </w:WordDocument>
          </xml>
          <![endif]-->
          <style>
            body { 
              font-family: 'Times New Roman', serif; 
              font-size: 12pt; 
              line-height: 1.6; 
              margin: 1in; 
            }
            .document-title { font-size: 18pt; font-weight: bold; text-align: center; margin-bottom: 1em; }
            .document-author { font-size: 12pt; text-align: center; margin-bottom: 0.5em; }
            .section { font-size: 14pt; font-weight: bold; margin: 1.5em 0 0.5em 0; text-transform: uppercase; }
            .subsection { font-size: 12pt; font-weight: bold; margin: 1em 0 0.5em 0; }
            ul { margin: 0.5em 0; padding-left: 1.5em; }
            li { margin: 0.2em 0; }
            .name-header { font-size: 16pt; font-weight: bold; text-align: center; margin-bottom: 0.5em; }
            .address-line { text-align: center; font-size: 10pt; margin-bottom: 0.3em; }
            .job-header { font-weight: bold; margin-top: 1em; }
            .company-info { font-style: italic; margin-bottom: 0.5em; }
          </style>
        </head>
        <body>
          ${renderPreview().__html}
        </body>
        </html>
      `;

      const blob = new Blob([wordContent], { 
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'document.doc';
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating Word document:', error);
      alert('Error generating Word document. Please try again.');
    }
  };

  const handleTemplateChange = (templateType) => {
    setTemplate(templateType);
    setCode(templates[templateType]);
  };

  const renderMath = (text) => {
    if (!isKaTeXEnabled || typeof window === 'undefined' || !window.katex) {
      return text;
    }

    try {
      // Handle inline math $...$
      text = text.replace(/\$([^$]+)\$/g, (match, formula) => {
        try {
          return window.katex.renderToString(formula, { displayMode: false });
        } catch (e) {
          return `<span class="math-error">$${formula}$</span>`;
        }
      });

      // Handle display math $$...$$
      text = text.replace(/\$\$([^$]+)\$\$/g, (match, formula) => {
        try {
          return window.katex.renderToString(formula, { displayMode: true });
        } catch (e) {
          return `<div class="math-error">$$${formula}$$</div>`;
        }
      });

      // Handle \[ ... \]
      text = text.replace(/\\\[([^\]]+)\\\]/g, (match, formula) => {
        try {
          return window.katex.renderToString(formula, { displayMode: true });
        } catch (e) {
          return `<div class="math-error">\\[${formula}\\]</div>`;
        }
      });

      return text;
    } catch (error) {
      console.error('KaTeX rendering error:', error);
      return text;
    }
  };

  const renderPreview = () => {
    let content = code;
    
    // Check if it's a res.cls document
    const isResDocument = content.includes('\\documentclass[') && content.includes('res}') || 
                          content.includes('\\documentclass{res}');
    
    // Extract document metadata
    const titleMatch = content.match(/\\title\{([^}]+)\}/);
    const authorMatch = content.match(/\\author\{([^}]+)\}/);
    const nameMatch = content.match(/\\name\{([^}]+)\}/);
    const addressMatches = content.match(/\\address\{([^}]+)\}/g);
    
    // Extract document body
    let bodyContent;
    if (isResDocument) {
      const resumeMatch = content.match(/\\begin\{resume\}([\s\S]*?)\\end\{resume\}/);
      bodyContent = resumeMatch ? resumeMatch[1] : content;
    } else {
      const documentMatch = content.match(/\\begin\{document\}([\s\S]*?)\\end\{document\}/);
      bodyContent = documentMatch ? documentMatch[1] : content;
    }
    
    if (bodyContent) {
      // Process LaTeX commands
      bodyContent = bodyContent
        .replace(/\\maketitle/g, '')
        // Handle sections with proper formatting
        .replace(/\\section\{([^}]+)\}/g, '<h2 class="section">$1</h2>')
        .replace(/\\subsection\{([^}]+)\}/g, '<h3 class="subsection">$1</h3>')
        .replace(/\\subsubsection\{([^}]+)\}/g, '<h4 class="subsubsection">$1</h4>')
        // Handle text formatting
        .replace(/\\textbf\{([^}]+)\}/g, '<strong>$1</strong>')
        .replace(/\\textit\{([^}]+)\}/g, '<em>$1</em>')
        .replace(/\\emph\{([^}]+)\}/g, '<em>$1</em>')
        .replace(/\\texttt\{([^}]+)\}/g, '<code>$1</code>')
        // Handle lists with proper spacing
        .replace(/\\begin\{itemize\}\s*\\itemsep\s*-?\d*pt/g, '<ul class="compact-list">')
        .replace(/\\begin\{itemize\}/g, '<ul>')
        .replace(/\\end\{itemize\}/g, '</ul>')
        .replace(/\\begin\{enumerate\}/g, '<ol>')
        .replace(/\\end\{enumerate\}/g, '</ol>')
        .replace(/\\item\s*/g, '<li>')
        // Handle resume-specific formatting
        .replace(/\\hfill\s*\\textbf\{([^}]+)\}/g, '<span class="date-right">$1</span>')
        .replace(/\\hfill\s*([^<\n]+)/g, '<span class="date-right">$1</span>')
        // Handle line breaks and spacing
        .replace(/\\\\\s*/g, '<br>')
        .replace(/\\par/g, '</p><p>')
        .replace(/\n\s*\n/g, '</p><p>')
        // Clean up remaining LaTeX commands
        .replace(/\\[a-zA-Z]+(\[[^\]]*\])?(\{[^}]*\})*\s*/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      // Apply math rendering if enabled
      if (isKaTeXEnabled) {
        bodyContent = renderMath(bodyContent);
      }
    }

    // Build the complete HTML preview
    let preview = '<div class="latex-document">';
    
    // Handle res.cls format
    if (isResDocument && nameMatch) {
      preview += '<div class="res-header">';
      preview += `<div class="name-header">${nameMatch[1]}</div>`;
      
      if (addressMatches) {
        addressMatches.forEach(addressMatch => {
          const address = addressMatch.match(/\\address\{([^}]+)\}/)[1];
          const formattedAddress = address.replace(/\\\\/g, ' • ');
          preview += `<div class="address-line">${formattedAddress}</div>`;
        });
      }
      
      preview += '</div>';
    } else if (titleMatch || authorMatch) {
      // Handle standard document format
      preview += '<div class="title-section">';
      if (titleMatch) preview += `<h1 class="document-title">${titleMatch[1]}</h1>`;
      if (authorMatch) preview += `<div class="document-author">${authorMatch[1]}</div>`;
      preview += '</div>';
    }
    
    // Add document body
    if (bodyContent && bodyContent.trim()) {
      preview += `<div class="document-body"><p>${bodyContent}</p></div>`;
    }
    
    preview += '</div>';
    
    return { __html: preview };
  };

  return (
    <div className={`latex-editor ${theme}`}>
      <style jsx>{`
        .latex-editor {
          display: flex;
          flex-direction: column;
          height: 100vh;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          background: var(--bg-color);
          color: var(--text-color);
          --bg-color: #1e1e1e;
          --text-color: #d4d4d4;
          --editor-bg: #252526;
          --preview-bg: #2d2d30;
          --border-color: #3e3e42;
          --command-color: #569cd6;
          --argument-color: #ce9178;
          --environment-color: #4ec9b0;
          --math-color: #b5cea8;
          --comment-color: #6a9955;
        }

        .latex-editor.light {
          --bg-color: #ffffff;
          --text-color: #333333;
          --editor-bg: #f8f8f8;
          --preview-bg: #ffffff;
          --border-color: #e1e1e1;
          --command-color: #0066cc;
          --argument-color: #a31515;
          --environment-color: #267f99;
          --math-color: #008000;
          --comment-color: #008000;
        }

        .toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          background: var(--editor-bg);
          border-bottom: 1px solid var(--border-color);
          gap: 12px;
          flex-wrap: wrap;
        }

        .toolbar-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .toolbar-center {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .toolbar-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          background: transparent;
          border: 1px solid var(--border-color);
          border-radius: 4px;
          color: var(--text-color);
          cursor: pointer;
          font-size: 12px;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .btn:hover {
          background: var(--border-color);
        }

        .btn.active {
          background: var(--command-color);
          border-color: var(--command-color);
          color: white;
        }

        .btn.pdf {
          background: #dc3545;
          border-color: #dc3545;
          color: white;
        }

        .btn.pdf:hover {
          background: #c82333;
          border-color: #c82333;
        }

        .btn.word {
          background: #2b579a;
          border-color: #2b579a;
          color: white;
        }

        .btn.word:hover {
          background: #1d4084;
          border-color: #1d4084;
        }

        .settings-group {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
        }

        .settings-group select,
        .settings-group input {
          background: var(--editor-bg);
          border: 1px solid var(--border-color);
          border-radius: 4px;
          color: var(--text-color);
          padding: 4px 8px;
          font-size: 12px;
        }

        .template-selector {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .template-selector select {
          min-width: 100px;
        }

        .main-content {
          display: flex;
          flex: 1;
          overflow: hidden;
        }

        .editor-panel {
          flex: 1;
          display: flex;
          flex-direction: column;
          border-right: ${showPreview ? `1px solid var(--border-color)` : 'none'};
        }

        .editor-header {
          padding: 8px 16px;
          background: var(--editor-bg);
          border-bottom: 1px solid var(--border-color);
          font-size: 12px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .editor-textarea {
          flex: 1;
          padding: 16px;
          background: var(--editor-bg);
          border: none;
          outline: none;
          color: var(--text-color);
          font-family: inherit;
          font-size: ${fontSize}px;
          line-height: 1.5;
          resize: none;
          overflow-y: auto;
        }

        .editor-textarea::placeholder {
          color: #6a6a6a;
        }

        .preview-panel {
          flex: 1;
          display: ${showPreview ? 'flex' : 'none'};
          flex-direction: column;
        }

        .preview-header {
          padding: 8px 16px;
          background: var(--preview-bg);
          border-bottom: 1px solid var(--border-color);
          font-size: 12px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .preview-content {
          flex: 1;
          padding: 24px;
          background: var(--preview-bg);
          overflow-y: auto;
          font-size: ${fontSize}px;
          line-height: 1.6;
          font-family: 'Times New Roman', 'Times', serif;
        }

        .latex-document {
          max-width: 100%;
          margin: 0 auto;
          background: ${theme === 'light' ? '#ffffff' : '#fafafa'};
          color: ${theme === 'light' ? '#000000' : '#1a1a1a'};
          padding: 32px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .res-header {
          text-align: center;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 2px solid #333;
        }

        .name-header {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 8px;
          color: ${theme === 'light' ? '#000000' : '#1a1a1a'};
          letter-spacing: 1px;
        }

        .address-line {
          font-size: 11px;
          margin: 4px 0;
          color: ${theme === 'light' ? '#333333' : '#333333'};
        }

        .title-section {
          text-align: center;
          margin-bottom: 32px;
          border-bottom: 1px solid #e0e0e0;
          padding-bottom: 24px;
        }

        .document-title {
          font-size: 2em;
          font-weight: bold;
          margin: 0 0 16px 0;
          color: ${theme === 'light' ? '#000000' : '#1a1a1a'};
        }

        .document-author {
          font-size: 1.2em;
          margin: 8px 0;
          color: ${theme === 'light' ? '#333333' : '#333333'};
        }

        .document-body {
          line-height: 1.6;
        }

        .document-body p {
          margin: 12px 0;
          text-align: justify;
          color: ${theme === 'light' ? '#000000' : '#1a1a1a'};
        }

        .section {
          font-size: 14px;
          font-weight: bold;
          margin: 20px 0 8px 0;
          color: ${theme === 'light' ? '#000000' : '#1a1a1a'};
          letter-spacing: 0.5px;
          text-transform: uppercase;
          border-bottom: 1px solid #333;
          padding-bottom: 2px;
        }

        .subsection {
          font-size: 12px;
          font-weight: bold;
          margin: 16px 0 4px 0;
          color: ${theme === 'light' ? '#000000' : '#1a1a1a'};
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }

        .date-right {
          font-weight: bold;
          font-size: 11px;
          color: ${theme === 'light' ? '#333333' : '#333333'};
        }

        .document-body ul,
        .document-body ol {
          margin: 8px 0;
          padding-left: 20px;
        }

        .document-body ul.compact-list {
          margin: 4px 0;
        }

        .document-body li {
          margin: 4px 0;
          color: ${theme === 'light' ? '#000000' : '#1a1a1a'};
          font-size: 11px;
          line-height: 1.4;
        }

        .document-body strong {
          font-weight: bold;
        }

        .document-body em {
          font-style: italic;
        }

        .document-body code {
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          background: ${theme === 'light' ? '#f5f5f5' : '#f0f0f0'};
          padding: 2px 4px;
          border-radius: 3px;
          font-size: 0.9em;
        }

        .math-inline {
          font-family: 'Times New Roman', serif;
          color: ${theme === 'light' ? '#0066cc' : '#0066cc'};
          background: ${theme === 'light' ? '#f0f8ff' : '#e6f3ff'};
          padding: 2px 4px;
          border-radius: 3px;
        }

        .math-block {
          font-family: 'Times New Roman', serif;
          text-align: center;
          margin: 20px 0;
          padding: 16px;
          background: ${theme === 'light' ? '#f0f8ff' : '#e6f3ff'};
          border-radius: 6px;
          border-left: 4px solid #0066cc;
          color: ${theme === 'light' ? '#0066cc' : '#0066cc'};
        }

        .math-error {
          color: #dc3545;
          background: #f8d7da;
          padding: 2px 4px;
          border-radius: 3px;
          font-family: monospace;
        }

        .status-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 4px 16px;
          background: var(--editor-bg);
          border-top: 1px solid var(--border-color);
          font-size: 11px;
          color: #8c8c8c;
        }

        .katex-toggle {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
        }

        .katex-toggle input[type="checkbox"] {
          margin: 0;
        }

        @media (max-width: 1024px) {
          .toolbar {
            flex-direction: column;
            align-items: stretch;
            gap: 8px;
          }
          
          .toolbar-left,
          .toolbar-center,
          .toolbar-right {
            justify-content: center;
            flex-wrap: wrap;
          }
        }

        @media (max-width: 768px) {
          .main-content {
            flex-direction: column;
          }
          
          .editor-panel {
            border-right: none;
            border-bottom: ${showPreview ? `1px solid var(--border-color)` : 'none'};
          }
          
          .toolbar {
            padding: 8px;
          }
          
          .btn {
            padding: 6px 8px;
            font-size: 11px;
          }
        }
      `}</style>

      <div className="toolbar">
        <div className="toolbar-left">
          <h1 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>
            LaTeX Editor Pro
          </h1>
        </div>
        
        <div className="toolbar-center">
          <div className="template-selector">
            <label>Template:</label>
            <select 
              value={template} 
              onChange={(e) => handleTemplateChange(e.target.value)}
            >
              <option value="res">Resume (res.cls)</option>
              <option value="article">Article</option>
              <option value="letter">Letter</option>
            </select>
          </div>
          
          <div className="katex-toggle">
            <input
              type="checkbox"
              id="katex-toggle"
              checked={isKaTeXEnabled}
              onChange={(e) => setIsKaTeXEnabled(e.target.checked)}
            />
            <label htmlFor="katex-toggle">KaTeX</label>
          </div>
        </div>
        
        <div className="toolbar-right">
          <button 
            className={`btn ${showPreview ? 'active' : ''}`}
            onClick={() => setShowPreview(!showPreview)}
          >
            <Eye size={14} />
            Preview
          </button>
          
          <button className="btn" onClick={handleCopy}>
            <Copy size={14} />
            Copy
          </button>
          
          <button className="btn" onClick={handleDownload}>
            <Download size={14} />
            .tex
          </button>
          
          <button className="btn pdf" onClick={handleDownloadPDF}>
            <FileDown size={14} />
            PDF
          </button>
          
          <button className="btn word" onClick={handleDownloadWord}>
            <FileType size={14} />
            Word
          </button>
          
          <div className="settings-group">
            <Settings size={14} />
            <select 
              value={theme} 
              onChange={(e) => setTheme(e.target.value)}
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
            
            <input
              type="range"
              min="10"
              max="20"
              value={fontSize}
              onChange={(e) => setFontSize(parseInt(e.target.value))}
              style={{ width: '60px' }}
            />
            <span>{fontSize}px</span>
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="editor-panel">
          <div className="editor-header">
            <FileText size={14} />
            document.tex
            {template === 'res' && <span style={{ color: '#4ec9b0', fontSize: '11px' }}>(res.cls)</span>}
          </div>
          
          <textarea
            ref={textareaRef}
            className="editor-textarea"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter your LaTeX code here..."
            spellCheck={false}
          />
        </div>

        {showPreview && (
          <div className="preview-panel">
            <div className="preview-header">
              <Eye size={14} />
              Live Preview
              {isKaTeXEnabled && <span style={{ color: '#4ec9b0', fontSize: '11px' }}>(KaTeX)</span>}
            </div>
            
            <div 
              className="preview-content"
              dangerouslySetInnerHTML={renderPreview()}
            />
          </div>
        )}
      </div>

      <div className="status-bar">
        <div>
          Lines: {code.split('\n').length} | Characters: {code.length} | Template: {template.toUpperCase()}
        </div>
        <div>
          LaTeX Document {isKaTeXEnabled ? '• KaTeX Enabled' : ''}
        </div>
      </div>
    </div>
  );
};

export default LaTeX;