import { useRef, useEffect, useCallback, useState } from 'react';
import DOMPurify from 'dompurify';

interface UseContentEditableOptions {
  initialContent?: string;
  onChange?: (content: string) => void;
  onSelectionChange?: (selection: Selection | null) => void;
  sanitize?: boolean;
  debounceMs?: number;
}

interface CursorPosition {
  startContainer: Node;
  startOffset: number;
  endContainer: Node;
  endOffset: number;
}

// Debounce utility
const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const useContentEditable = ({
  initialContent = '',
  onChange,
  onSelectionChange,
  sanitize = true,
  debounceMs = 300
}: UseContentEditableOptions = {}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [content, setContent] = useState(initialContent);
  const cursorPosition = useRef<Range | null>(null);
  
  // Save cursor position before updates
  const saveCursor = useCallback(() => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      cursorPosition.current = selection.getRangeAt(0).cloneRange();
    }
  }, []);
  
  // Restore cursor after updates
  const restoreCursor = useCallback(() => {
    if (cursorPosition.current && editorRef.current) {
      const selection = window.getSelection();
      selection?.removeAllRanges();
      selection?.addRange(cursorPosition.current);
    }
  }, []);
  
  // Handle input with debouncing
  const handleInput = useCallback(
    debounce((e: Event) => {
      const target = e.target as HTMLDivElement;
      let newContent = target.innerHTML;
      
      if (sanitize) {
        newContent = DOMPurify.sanitize(newContent, {
          ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'span', 'div', 'h1', 'h2', 'h3'],
          ALLOWED_ATTR: ['class', 'data-field', 'contenteditable', 'style'],
          KEEP_CONTENT: true
        });
      }
      
      saveCursor();
      setContent(newContent);
      onChange?.(newContent);
      
      // Restore cursor after React re-render
      requestAnimationFrame(restoreCursor);
    }, debounceMs),
    [onChange, sanitize, debounceMs, saveCursor, restoreCursor]
  );
  
  // Handle selection changes
  const handleSelectionChange = useCallback(() => {
    const selection = window.getSelection();
    onSelectionChange?.(selection);
  }, [onSelectionChange]);
  
  // Insert text at cursor position
  const insertAtCursor = useCallback((text: string) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      // No selection, append at end
      if (editorRef.current) {
        editorRef.current.innerHTML += text;
        // Trigger input event
        editorRef.current.dispatchEvent(new Event('input', { bubbles: true }));
      }
      return;
    }
    
    const range = selection.getRangeAt(0);
    range.deleteContents();
    
    const textNode = document.createTextNode(text);
    range.insertNode(textNode);
    
    // Move cursor after inserted text
    range.setStartAfter(textNode);
    range.setEndAfter(textNode);
    selection.removeAllRanges();
    selection.addRange(range);
    
    // Trigger input event
    if (editorRef.current) {
      editorRef.current.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }, []);
  
  // Set up event listeners
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    
    const inputHandler = (e: Event) => handleInput(e);
    editor.addEventListener('input', inputHandler);
    document.addEventListener('selectionchange', handleSelectionChange);
    
    return () => {
      editor.removeEventListener('input', inputHandler);
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, [handleInput, handleSelectionChange]);
  
  // Initialize content (only on mount)
  useEffect(() => {
    if (editorRef.current && !editorRef.current.innerHTML) {
      editorRef.current.innerHTML = initialContent;
    }
  }, []);
  
  // Handle external content updates
  const updateContent = useCallback((newContent: string) => {
    if (editorRef.current) {
      saveCursor();
      editorRef.current.innerHTML = newContent;
      setContent(newContent);
      restoreCursor();
    }
  }, [saveCursor, restoreCursor]);
  
  return {
    editorRef,
    content,
    setContent: updateContent,
    insertAtCursor,
    saveCursor,
    restoreCursor
  };
};