import React, { forwardRef } from 'react';

interface EditorPaneProps {
  className?: string;
  placeholder?: string;
}

export const EditorPane = forwardRef<HTMLDivElement, EditorPaneProps>(
  ({ className = '', placeholder = 'Start typing or click to edit...' }, ref) => {
    
    const handleKeyDown = (e: React.KeyboardEvent) => {
      // Tab key - insert spaces instead of losing focus
      if (e.key === 'Tab') {
        e.preventDefault();
        document.execCommand('insertText', false, '    ');
      }
      
      // Ctrl/Cmd + B - Bold
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        document.execCommand('bold');
      }
      
      // Ctrl/Cmd + I - Italic
      if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
        e.preventDefault();
        document.execCommand('italic');
      }
      
      // Ctrl/Cmd + U - Underline
      if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
        e.preventDefault();
        document.execCommand('underline');
      }
    };
    
    return (
      <div className="editor-pane flex-1 p-4 bg-white rounded-lg shadow-sm">
        <div
          ref={ref}
          contentEditable
          className={`
            editor-content 
            min-h-[600px] 
            p-6 
            outline-none 
            prose 
            max-w-none
            focus:ring-2 
            focus:ring-blue-500 
            focus:ring-opacity-20
            rounded
            ${className}
          `}
          onKeyDown={handleKeyDown}
          suppressContentEditableWarning
          spellCheck
          data-placeholder={placeholder}
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: '14px',
            lineHeight: '1.8',
            minHeight: '600px'
          }}
        />
      </div>
    );
  }
);

EditorPane.displayName = 'EditorPane';