import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import './index.scss';

const LaTeXEditor = ({ value = '', onChange = () => {} }) => {
  const [isPreviewActive, setIsPreviewActive] = useState(false);
  const [activeView, setActiveView] = useState('editor'); // For mobile toggle
  const [previewFormat, setPreviewFormat] = useState('pdf'); // 'pdf' or 'word'

  const handleChange = (val) => {
    onChange(val || '');
  };

  const togglePreview = () => {
    setIsPreviewActive(!isPreviewActive);
    // Reset mobile view to editor when preview is turned off
    if (isPreviewActive) {
      setActiveView('editor');
    }
  };

  const handleFormatChange = (format) => {
    setPreviewFormat(format);
  };

  const renderPreviewContent = () => {
    if (!value.trim()) {
      return (
        <div className="preview-placeholder">
          <p>Start typing LaTeX code to see the preview</p>
        </div>
      );
    }
  };

  return (
    <div className="latex-editor">
      {/* Toolbar */}
      <div className="toolbar">
        <div className="toolbar-left">
          <h1 className="editor-title">LaTeX Editor</h1>
        </div>
        <div className="toolbar-right">
          <button 
            className={`toolbar-btn ${isPreviewActive ? 'primary active' : ''}`}
            onClick={togglePreview}
          >
            {isPreviewActive ? 'Hide Preview' : 'Preview'}
          </button>
          <button className="toolbar-btn">Copy</button>
          {isPreviewActive && (
            <>
              <button 
                className={`toolbar-btn format-btn desktop-only ${previewFormat === 'pdf' ? 'active' : ''}`}
                onClick={() => handleFormatChange('pdf')}
              >
                PDF
              </button>
              <button 
                className={`toolbar-btn format-btn desktop-only ${previewFormat === 'word' ? 'active' : ''}`}
                onClick={() => handleFormatChange('word')}
              >
                Word
              </button>
            </>
          )}
          <button className="toolbar-btn">Download</button>
        </div>
      </div>

      {/* Mobile View Toggle - Only show when preview is active */}
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

      {/* Format Toggle for Mobile - Only show when preview is active */}
      {isPreviewActive && (
        <div className="mobile-format-toggle">
          <button 
            className={`format-toggle-btn ${previewFormat === 'pdf' ? 'active' : ''}`}
            onClick={() => handleFormatChange('pdf')}
          >
            PDF
          </button>
          <button 
            className={`format-toggle-btn ${previewFormat === 'word' ? 'active' : ''}`}
            onClick={() => handleFormatChange('word')}
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
          </div>
          <div className="editor-wrapper">
            <Editor
              className="latex-textarea"
              defaultLanguage="latex"
              theme="vs-dark"
              value={value}
              onChange={handleChange}
              spellCheck={false}
            />
          </div>
        </div>

        {isPreviewActive && (
          <div className={`preview-panel ${activeView === 'preview' ? 'active' : ''}`}>
            <div className="panel-header">
              <span>Preview ({previewFormat.toUpperCase()})</span>
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