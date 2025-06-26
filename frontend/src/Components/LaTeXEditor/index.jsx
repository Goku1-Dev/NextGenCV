import React, { useState, useEffect, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import './index.scss';

const LaTeXEditor = ({ value = '', onChange = () => {} }) => {
  const [isPreviewActive, setIsPreviewActive] = useState(false);
  const [activeView, setActiveView] = useState('editor');
  const [previewFormat, setPreviewFormat] = useState('pdf');
  const [previewContent, setPreviewContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationStatus, setValidationStatus] = useState({ isValid: true, errors: [] });
  const [debounceTimer, setDebounceTimer] = useState(null);

  // Debounced validation function
  const validateLatex = useCallback(async (latex) => {
    if (!latex.trim()) {
      setValidationStatus({ isValid: true, errors: [] });
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/validate_latex', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ latex }),
      });

      const result = await response.json();
      
      if (response.ok) {
        setValidationStatus({ 
          isValid: result.isValid || result.valid, 
          errors: result.errors || [] 
        });
      } else {
        setValidationStatus({ 
          isValid: false, 
          errors: [result.error || 'Validation failed'] 
        });
      }
    } catch (err) {
      console.error('Validation error:', err);
      setValidationStatus({ 
        isValid: false, 
        errors: ['Unable to validate LaTeX'] 
      });
    }
  }, []);

  // Handle editor change with debounced validation
  const handleChange = (val) => {
    const newValue = val || '';
    onChange(newValue);
    
    // Clear existing timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    
    // Set new timer for validation
    const timer = setTimeout(() => {
      validateLatex(newValue);
    }, 500);
    
    setDebounceTimer(timer);
  };

  // Convert LaTeX to preview format
  const convertLatex = async (latex, format) => {
    if (!latex.trim()) return '';

    setIsLoading(true);
    setError('');

    try {
      const endpoint = format === 'pdf' ? 
        'http://localhost:3000/convert_pdf' : 
        'http://localhost:3000/convert_word';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ latex }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to convert to ${format.toUpperCase()}`);
      }

      if (format === 'pdf') {
        // For PDF, we expect a blob or base64 data
        const result = await response.json();
        if (result.pdfData || result.data) {
          return result.pdfData || result.data;
        } else {
          // If response is already a blob
          const blob = await response.blob();
          return URL.createObjectURL(blob);
        }
      } else {
        // For Word, we expect HTML or document data
        const result = await response.json();
        return result.html || result.content || result.data || '';
      }
    } catch (err) {
      console.error(`Conversion error (${format}):`, err);
      setError(`Failed to convert to ${format.toUpperCase()}: ${err.message}`);
      return '';
    } finally {
      setIsLoading(false);
    }
  };

  // Update preview when format changes or preview is toggled
  useEffect(() => {
    if (isPreviewActive && value.trim()) {
      convertLatex(value, previewFormat).then(setPreviewContent);
    }
  }, [isPreviewActive, previewFormat, value]);

  const togglePreview = async () => {
    const newPreviewState = !isPreviewActive;
    setIsPreviewActive(newPreviewState);
    
    if (!newPreviewState) {
      setActiveView('editor');
      setPreviewContent('');
    } else if (value.trim()) {
      const content = await convertLatex(value, previewFormat);
      setPreviewContent(content);
    }
  };

  const handleFormatChange = async (format) => {
    setPreviewFormat(format);
    if (isPreviewActive && value.trim()) {
      const content = await convertLatex(value, format);
      setPreviewContent(content);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(value);
      // You could add a toast notification here
      console.log('Copied to clipboard');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const downloadFile = async () => {
    if (!value.trim()) return;

    try {
      const endpoint = previewFormat === 'pdf' ? 
        'http://localhost:3000/convert_pdf' : 
        'http://localhost:3000/convert_word';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ latex: value }),
      });

      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `document.${previewFormat}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download error:', err);
      setError(`Failed to download ${previewFormat.toUpperCase()}`);
    }
  };

  const renderPreviewContent = () => {
    if (!value.trim()) {
      return (
        <div className="preview-placeholder">
          <p>Start typing LaTeX code to see the preview</p>
        </div>
      );
    }

    if (isLoading) {
      return (
        <div className="preview-loading">
          <div className="loading-spinner"></div>
          <p>Converting to {previewFormat.toUpperCase()}...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="preview-error">
          <p>Error: {error}</p>
          <button onClick={() => convertLatex(value, previewFormat).then(setPreviewContent)}>
            Retry
          </button>
        </div>
      );
    }

    if (previewFormat === 'pdf') {
      return previewContent ? (
        <iframe
          src={previewContent}
          className="pdf-preview"
          title="PDF Preview"
        />
      ) : (
        <div className="preview-placeholder">
          <p>No preview available</p>
        </div>
      );
    } else {
      return (
        <div 
          className="word-preview"
          dangerouslySetInnerHTML={{ __html: previewContent }}
        />
      );
    }
  };

  return (
    <div className="latex-editor">
      {/* Toolbar */}
      <div className="toolbar">
        <div className="toolbar-left">
          <h1 className="editor-title">LaTeX Editor</h1>
          {!validationStatus.isValid && (
            <div className="validation-indicator error">
              <span className="validation-icon">⚠️</span>
              <span className="validation-text">Syntax Error</span>
            </div>
          )}
          {validationStatus.isValid && value.trim() && (
            <div className="validation-indicator success">
              <span className="validation-icon">✅</span>
              <span className="validation-text">Valid</span>
            </div>
          )}
        </div>
        <div className="toolbar-right">
          <button 
            className={`toolbar-btn ${isPreviewActive ? 'primary active' : ''}`}
            onClick={togglePreview}
            disabled={isLoading}
          >
            {isPreviewActive ? 'Hide Preview' : 'Preview'}
          </button>
          <button className="toolbar-btn" onClick={copyToClipboard}>
            Copy
          </button>
          {isPreviewActive && (
            <>
              <button 
                className={`toolbar-btn format-btn desktop-only ${previewFormat === 'pdf' ? 'active' : ''}`}
                onClick={() => handleFormatChange('pdf')}
                disabled={isLoading}
              >
                PDF
              </button>
              <button 
                className={`toolbar-btn format-btn desktop-only ${previewFormat === 'word' ? 'active' : ''}`}
                onClick={() => handleFormatChange('word')}
                disabled={isLoading}
              >
                Word
              </button>
            </>
          )}
          <button 
            className="toolbar-btn" 
            onClick={downloadFile}
            disabled={!value.trim() || isLoading}
          >
            {isLoading ? 'Processing...' : 'Download'}
          </button>
        </div>
      </div>

      {/* Validation Errors */}
      {!validationStatus.isValid && validationStatus.errors.length > 0 && (
        <div className="validation-errors">
          {validationStatus.errors.map((error, index) => (
            <div key={index} className="validation-error">
              {error}
            </div>
          ))}
        </div>
      )}

      {/* Mobile View Toggle */}
      {isPreviewActive && (
        <div className="mobile-toggle">
          <button 
            className={`toggle-btn ${activeView === 'editor' ? 'active' : ''}`}
            onClick={() => setActiveView('editor')}
          >
            Editor
          </button>
          <button 
            className={`toggle-btn ${activeView === 'preview' ? 'active' : ''}`}
            onClick={() => setActiveView('preview')}
          >
            Preview
          </button>
        </div>
      )}

      {/* Format Toggle for Mobile */}
      {isPreviewActive && (
        <div className="mobile-format-toggle">
          <button 
            className={`format-toggle-btn ${previewFormat === 'pdf' ? 'active' : ''}`}
            onClick={() => handleFormatChange('pdf')}
            disabled={isLoading}
          >
            PDF
          </button>
          <button 
            className={`format-toggle-btn ${previewFormat === 'word' ? 'active' : ''}`}
            onClick={() => handleFormatChange('word')}
            disabled={isLoading}
          >
            Word
          </button>
        </div>
      )}

      {/* Editor Content */}
      <div className="editor-content">
        <div className={`editor-panel ${!isPreviewActive || activeView === 'editor' ? 'active' : ''} ${!isPreviewActive ? 'full-width' : ''}`}>
          <div className="panel-header">
            <span>Editor</span>
            {isLoading && <span className="loading-indicator">Converting...</span>}
          </div>
          <div className="editor-wrapper">
            <Editor
              className="latex-textarea"
              defaultLanguage="latex"
              theme="vs-dark"
              value={value}
              onChange={handleChange}
              options={{
                spellcheck: false,
                wordWrap: 'on',
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </div>
        </div>

        {isPreviewActive && (
          <div className={`preview-panel ${activeView === 'preview' ? 'active' : ''}`}>
            <div className="panel-header">
              <span>Preview ({previewFormat.toUpperCase()})</span>
              {error && (
                <button 
                  className="retry-btn"
                  onClick={() => convertLatex(value, previewFormat).then(setPreviewContent)}
                >
                  Retry
                </button>
              )}
            </div>
            <div className="preview-wrapper">
              <div className="preview-content">
                {renderPreviewContent()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LaTeXEditor;