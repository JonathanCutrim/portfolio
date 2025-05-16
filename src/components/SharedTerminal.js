import React, { useRef, useEffect, useState } from 'react';
import { Terminal as TerminalIcon, X, Minus, Maximize } from 'lucide-react';

const SharedTerminal = ({ 
  id = `terminal-${Math.random().toString(36).substr(2, 9)}`,
  isOpen = false, 
  isMinimized = false,
  onClose = () => {},
  onMinimize = () => {},
  onRestore = () => {},
  title = "Terminal", 
  terminalType = "centered", // "centered", "bottom", "fullscreen"
  command = "sudo ./terminal.sh",
  contentRef = null,
  children,
  zIndex = 1000,
  position = { x: 50, y: 50 }
}) => {
  const terminalRef = useRef(null);
  const [dimensions, setDimensions] = useState({
    width: terminalType === "fullscreen" ? "100%" : "680px",
    height: terminalType === "fullscreen" ? "100%" : terminalType === "bottom" ? "300px" : "400px"
  });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState('');
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [startDimensions, setStartDimensions] = useState({ width: 0, height: 0 });
  const [startDragPosition, setStartDragPosition] = useState({ x: 0, y: 0 });
  const [currentPosition, setCurrentPosition] = useState(position);
  
  // Forward contentRef to child content
  const internalContentRef = useRef(null);
  const effectiveContentRef = contentRef || internalContentRef;
  
  useEffect(() => {
    // Scroll to bottom when content changes
    if (effectiveContentRef.current) {
      effectiveContentRef.current.scrollTop = effectiveContentRef.current.scrollHeight;
    }
  }, [children, effectiveContentRef]);
  
  useEffect(() => {
    if (isResizing) {
      // Add resize event listeners when resizing starts
      document.addEventListener('mousemove', handleResize);
      document.addEventListener('mouseup', stopResize);
      return () => {
        document.removeEventListener('mousemove', handleResize);
        document.removeEventListener('mouseup', stopResize);
      };
    }
  }, [isResizing, resizeDirection, startPosition, startDimensions]);
  
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleDrag);
      document.addEventListener('mouseup', stopDrag);
      return () => {
        document.removeEventListener('mousemove', handleDrag);
        document.removeEventListener('mouseup', stopDrag);
      };
    }
  }, [isDragging, startDragPosition]);

  // Start dragging
  const startDrag = (e) => {
    if (terminalType === "fullscreen" || terminalType === "bottom") return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setStartDragPosition({ x: e.clientX - currentPosition.x, y: e.clientY - currentPosition.y });
  };

  // Handle dragging
  const handleDrag = (e) => {
    if (!isDragging) return;
    const newX = e.clientX - startDragPosition.x;
    const newY = e.clientY - startDragPosition.y;
    
    // Keep window within viewport bounds
    const maxX = window.innerWidth - parseFloat(dimensions.width);
    const maxY = window.innerHeight - parseFloat(dimensions.height);
    
    setCurrentPosition({
      x: Math.min(Math.max(0, newX), maxX),
      y: Math.min(Math.max(0, newY), maxY)
    });
    
    e.preventDefault();
  };

  // Stop dragging
  const stopDrag = () => {
    setIsDragging(false);
  };

  // Start resizing
  const startResize = (e, direction) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeDirection(direction);
    setStartPosition({ x: e.clientX, y: e.clientY });
    
    if (terminalRef.current) {
      setStartDimensions({
        width: parseFloat(dimensions.width),
        height: parseFloat(dimensions.height)
      });
    }
  };

  // Handle resizing
  const handleResize = (e) => {
    if (!isResizing) return;
    
    let newWidth = dimensions.width;
    let newHeight = dimensions.height;
    let newX = currentPosition.x;
    let newY = currentPosition.y;
    
    const deltaX = e.clientX - startPosition.x;
    const deltaY = e.clientY - startPosition.y;
    const maxHeight = window.innerHeight - 40;
    const maxWidth = window.innerWidth - 40;
    
    // Handle different resize directions
    if (resizeDirection.includes('e')) {
      // Resize from right
      const calculatedWidth = startDimensions.width + deltaX;
      newWidth = `${Math.min(Math.max(300, calculatedWidth), maxWidth)}px`;
    }
    
    if (resizeDirection.includes('w')) {
      // Resize from left
      const calculatedWidth = startDimensions.width - deltaX;
      if (calculatedWidth >= 300 && calculatedWidth <= maxWidth) {
        newWidth = `${calculatedWidth}px`;
        newX = currentPosition.x + deltaX;
      }
    }
    
    if (resizeDirection.includes('s')) {
      // Resize from bottom
      const calculatedHeight = startDimensions.height + deltaY;
      newHeight = `${Math.min(Math.max(200, calculatedHeight), maxHeight)}px`;
    }
    
    if (resizeDirection.includes('n')) {
      // Resize from top
      const calculatedHeight = startDimensions.height - deltaY;
      if (calculatedHeight >= 200 && calculatedHeight <= maxHeight) {
        newHeight = `${calculatedHeight}px`;
        newY = currentPosition.y + deltaY;
      }
    }
    
    // Apply the new dimensions and position
    setDimensions({ width: newWidth, height: newHeight });
    setCurrentPosition({ x: newX, y: newY });
    
    e.preventDefault();
  };

  // Stop resizing
  const stopResize = () => {
    setIsResizing(false);
  };

  // Handle terminal behaviors based on state
  if (!isOpen) return null;
  if (isMinimized) return null; // Handled by parent component

  // Different layout styles based on terminal type
  const getTerminalStyles = () => {
    switch (terminalType) {
      case "bottom":
        return {
          container: "fixed bottom-0 left-0 right-0",
          terminal: "w-full border-t border-gray-700 shadow-lg"
        };
      case "fullscreen":
        return {
          container: "fixed inset-0",
          terminal: "w-full h-full"
        };
      case "centered":
      default:
        return {
          container: "fixed",
          terminal: "rounded-md"
        };
    }
  };

  const styles = getTerminalStyles();

  // Only add resize capabilities if not fullscreen or bottom
  const canResize = terminalType !== "fullscreen" && terminalType !== "bottom";

  return (
    <div 
      className={`${styles.container}`} 
      style={{ 
        zIndex,
        left: terminalType === "centered" ? `${currentPosition.x}px` : 0,
        top: terminalType === "centered" ? `${currentPosition.y}px` : 0,
        transform: 'translate3d(0,0,0)',
        backfaceVisibility: 'hidden'
      }}
    >
      <div 
        ref={terminalRef}
        className={`terminal-window shadow-2xl border border-gray-700 flex flex-col overflow-hidden bg-gray-900 ${styles.terminal}`}
        style={{
          width: terminalType === "fullscreen" || terminalType === "bottom" ? '100%' : dimensions.width,
          height: terminalType === "fullscreen" ? '100%' : 
                 terminalType === "bottom" ? '300px' : dimensions.height,
          zIndex: terminalType === "fullscreen" ? 1050 : 1000
        }}
      >
        {/* Terminal Header */}
        <div 
          className={`terminal-header flex items-center px-3 py-2 bg-gray-800 border-b border-gray-700 ${
            terminalType !== "fullscreen" && terminalType !== "bottom" ? "cursor-move" : ""
          }`}
          onMouseDown={terminalType !== "fullscreen" && terminalType !== "bottom" ? startDrag : undefined}
        >
          <div className="flex-grow text-sm text-gray-300 font-mono flex items-center">
            <TerminalIcon size={16} className="mr-2 text-green-400" />
            <span className="font-bold mr-2">{title}</span>
            <span className="text-gray-500">—</span>
            <span className="ml-2 text-gray-400">user@terminal:~$ {command}</span>
          </div>
          <div className="flex space-x-3 ml-4">
            <button 
              className="w-5 h-5 rounded-full bg-yellow-500 flex items-center justify-center hover:bg-yellow-600 focus:outline-none transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onMinimize(id);
              }}
              title="Minimize terminal"
            >
              <Minus size={12} className="text-yellow-900" />
            </button>
            <button 
              className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center hover:bg-green-600 focus:outline-none transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                // Toggle between fullscreen and centered
                // onToggleFullscreen();
              }}
              title="Maximize terminal"
            >
              <Maximize size={12} className="text-green-900" />
            </button>
            <button 
              className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600 focus:outline-none transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onClose(id);
              }}
              title="Close terminal"
            >
              <X size={12} className="text-red-900" />
            </button>
          </div>
        </div>
        
        {/* Terminal Content */}
        <div 
          ref={effectiveContentRef}
          className="terminal-content p-3 font-mono text-sm flex-1 overflow-y-auto bg-gray-900 text-green-400 w-full"
          style={{
            fontFamily: "Consolas, 'Courier New', monospace",
            lineHeight: "1.4",
            letterSpacing: "0.5px",
            scrollbarWidth: 'thin',
            scrollbarColor: '#333 #1a1a1a'
          }}
        >
          {children}
        </div>
        
        {/* Resize handles - only visible when canResize is true */}
        {canResize && (
          <>
            {/* Right resize handle */}
            <div 
              className="absolute top-0 right-0 w-3 h-full cursor-e-resize bg-transparent hover:bg-green-500 hover:bg-opacity-20" 
              onMouseDown={(e) => startResize(e, 'e')}
              style={{ touchAction: 'none' }}
            ></div>
            
            {/* Bottom resize handle */}
            <div 
              className="absolute bottom-0 left-0 w-full h-3 cursor-s-resize bg-transparent hover:bg-green-500 hover:bg-opacity-20" 
              onMouseDown={(e) => startResize(e, 's')}
              style={{ touchAction: 'none' }}
            ></div>
            
            {/* Bottom-right corner resize handle */}
            <div 
              className="absolute bottom-0 right-0 w-6 h-6 cursor-se-resize bg-green-500 bg-opacity-10 hover:bg-opacity-30" 
              onMouseDown={(e) => startResize(e, 'se')}
              style={{ touchAction: 'none' }}
            ></div>
            
            {/* Left resize handle */}
            <div 
              className="absolute top-0 left-0 w-3 h-full cursor-w-resize bg-transparent hover:bg-green-500 hover:bg-opacity-20" 
              onMouseDown={(e) => startResize(e, 'w')}
              style={{ touchAction: 'none' }}
            ></div>
            
            {/* Top resize handle */}
            <div 
              className="absolute top-0 left-0 w-full h-3 cursor-n-resize bg-transparent hover:bg-green-500 hover:bg-opacity-20" 
              onMouseDown={(e) => startResize(e, 'n')}
              style={{ touchAction: 'none' }}
            ></div>

            {/* Diagonal resize handles for corners */}
            <div 
              className="absolute top-0 left-0 w-6 h-6 cursor-nw-resize bg-green-500 bg-opacity-10 hover:bg-opacity-30" 
              onMouseDown={(e) => startResize(e, 'nw')}
              style={{ touchAction: 'none' }}
            ></div>
            
            <div 
              className="absolute top-0 right-0 w-6 h-6 cursor-ne-resize bg-green-500 bg-opacity-10 hover:bg-opacity-30" 
              onMouseDown={(e) => startResize(e, 'ne')}
              style={{ touchAction: 'none' }}
            ></div>
            
            <div 
              className="absolute bottom-0 left-0 w-6 h-6 cursor-sw-resize bg-green-500 bg-opacity-10 hover:bg-opacity-30" 
              onMouseDown={(e) => startResize(e, 'sw')}
              style={{ touchAction: 'none' }}
            ></div>
          </>
        )}
      </div>
    </div>
  );
};

export default SharedTerminal;