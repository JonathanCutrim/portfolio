import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Terminal as TerminalIcon, X, Minus, Maximize, ChevronUp } from 'lucide-react';

// Componente de Terminal Individual
export const Terminal = ({ 
  id,
  isOpen, 
  isMinimized,
  onClose, 
  onMinimize,
  onRestore,
  title = "Terminal", 
  terminalType = "centered", // "centered", "bottom", "fullscreen"
  command = "sudo ./terminal.sh",
  children,
  zIndex,
  position: initialPosition = { x: 50, y: 50 }
}) => {
  const terminalRef = useRef(null);
  const contentRef = useRef(null);
  const [dimensions, setDimensions] = useState({
    width: terminalType === "fullscreen" ? "100%" : "680px",
    height: terminalType === "fullscreen" ? "100%" : "400px"
  });
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState('');
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [startDimensions, setStartDimensions] = useState({ width: 0, height: 0 });
  const [startDragPosition, setStartDragPosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    // Scroll to bottom when content changes
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [children]);
  
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
    setIsDragging(true);
    setStartDragPosition({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  // Handle dragging
  const handleDrag = (e) => {
    if (!isDragging) return;
    const newX = e.clientX - startDragPosition.x;
    const newY = e.clientY - startDragPosition.y;
    
    // Keep window within viewport bounds
    const maxX = window.innerWidth - parseFloat(dimensions.width);
    const maxY = window.innerHeight - parseFloat(dimensions.height);
    
    setPosition({
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
    let newX = position.x;
    let newY = position.y;
    
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
        newX = position.x + deltaX;
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
        newY = position.y + deltaY;
      }
    }
    
    // Apply the new dimensions and position
    setDimensions({ width: newWidth, height: newHeight });
    setPosition({ x: newX, y: newY });
    
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
          container: "fixed bottom-0 left-0 right-0 z-50",
          terminal: "w-full max-h-64 border-t border-gray-700 shadow-lg"
        };
      case "fullscreen":
        return {
          container: "fixed inset-0 z-50 pt-16",
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
        left: terminalType === "centered" ? `${position.x}px` : 0,
        top: terminalType === "centered" ? `${position.y}px` : 0,
        transform: 'translate3d(0,0,0)',
        backfaceVisibility: 'hidden'
      }}
    >
      <div 
        ref={terminalRef}
        className={`shadow-2xl border border-gray-700 flex flex-col overflow-hidden bg-gray-900 ${styles.terminal}`}
        style={{
          width: terminalType === "fullscreen" || terminalType === "bottom" ? '100%' : dimensions.width,
          height: terminalType === "fullscreen" ? '100%' : 
                 terminalType === "bottom" ? 'auto' : dimensions.height
        }}
      >
        {/* Terminal Header */}
        <div 
          className="flex items-center px-3 py-2 bg-gray-800 border-b border-gray-700 cursor-move"
          onMouseDown={startDrag}
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
                //onToggleFullscreen();
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
          ref={contentRef}
          className="p-3 font-mono text-sm flex-1 overflow-y-auto bg-gray-900 text-green-400 w-full"
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

// Barra de terminais minimizados
const MinimizedTerminalBar = ({ minimizedTerminals, onRestore }) => {
  if (!minimizedTerminals.length) return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 flex gap-1 px-2 py-1 bg-gray-800 border-t border-gray-700 z-50">
      {minimizedTerminals.map(terminal => (
        <div 
          key={terminal.id}
          className="flex items-center bg-gray-900 text-gray-300 rounded-md px-3 py-1 text-sm cursor-pointer hover:bg-gray-700 transition-colors"
          onClick={() => onRestore(terminal.id)}
        >
          <TerminalIcon size={14} className="mr-2 text-green-400" />
          <span className="mr-1">{terminal.title}</span>
          <ChevronUp size={14} className="ml-1 text-gray-400" />
        </div>
      ))}
    </div>
  );
};

// Gerenciador de Múltiplos Terminais
const TerminalManager = () => {
  const [terminals, setTerminals] = useState([]);
  const [nextId, setNextId] = useState(1);
  const [nextZIndex, setNextZIndex] = useState(1000);
  
  // Posiciona os terminais em locais diferentes para evitar sobreposição total
  const calculateInitialPosition = (id) => {
    const offset = (id - 1) * 30;
    return { x: 100 + offset, y: 80 + offset };
  };
  
  // Exemplo de conteúdos possíveis para os terminais
  const terminalContents = {
    default: "Terminal v1.0.0 (c) 2025 Developer\n\n> cd /projects\n> ls -la\ntotal 164\ndrwxr-xr-x  12 user  staff    384 Mar 28 10:45 .\ndrwxr-xr-x   3 user  staff     96 Mar 28 09:12 ..\n-rw-r--r--   1 user  staff   1955 Mar 28 09:45 .eslintrc.json\n-rw-r--r--   1 user  staff   1019 Mar 28 09:32 .gitignore\ndrwxr-xr-x  12 user  staff    384 Mar 28 10:01 node_modules\n-rw-r--r--   1 user  staff   1256 Mar 28 09:32 package.json\ndrwxr-xr-x   5 user  staff    160 Mar 28 09:55 public\ndrwxr-xr-x   8 user  staff    256 Mar 28 10:15 src\n-rw-r--r--   1 user  staff   3901 Mar 28 09:40 tsconfig.json\n\n> ",
    logs: "Logs do sistema:\n\n2025-03-28 12:34:56 [INFO] Sistema iniciado\n2025-03-28 12:35:02 [INFO] Conexão estabelecida\n2025-03-28 12:35:21 [WARN] Uso de memória alto\n2025-03-28 12:36:14 [INFO] Backup automático iniciado\n2025-03-28 12:38:55 [ERROR] Falha na conexão com banco de dados\n2025-03-28 12:39:01 [INFO] Reconectando...\n2025-03-28 12:39:05 [INFO] Conexão restaurada\n\n> tail -f /var/log/system.log\nEsperando novos eventos...\n",
    process: "Iniciando processo...\n\n[======              ] 30% concluído\n\nInstalling dependencies...\nnpm install --save react lucide-react tailwindcss\n\nAdded 238 packages in 2.5s\n\n> npm run build\n\nCreating optimized production build...\n",
  };

  // Criar um novo terminal
  const createTerminal = useCallback((type = "default", title = "Terminal") => {
    const id = nextId;
    const content = terminalContents[type] || terminalContents.default;
    const command = type === "logs" ? "tail -f /var/log/system.log" : 
                   type === "process" ? "npm install" : "bash";
    
    const position = calculateInitialPosition(id);
    
    const newTerminal = {
      id,
      title,
      content,
      command,
      isOpen: true,
      isMinimized: false,
      terminalType: "centered",
      zIndex: nextZIndex,
      position // Uso da posição calculada
    };
    
    setTerminals(prevTerminals => [...prevTerminals, newTerminal]);
    setNextId(prevId => prevId + 1);
    setNextZIndex(prevZIndex => prevZIndex + 1);
    
    return id;
  }, [nextId, nextZIndex, terminalContents]);

  // Fechar um terminal
  const closeTerminal = (id) => {
    setTerminals(terminals.filter(terminal => terminal.id !== id));
  };

  // Minimizar um terminal
  const minimizeTerminal = (id) => {
    setTerminals(terminals.map(terminal => 
      terminal.id === id ? { ...terminal, isMinimized: true } : terminal
    ));
  };

  // Restaurar um terminal minimizado
  const restoreTerminal = (id) => {
    // Trazer para frente (aumentar o zIndex)
    const newZIndex = nextZIndex;
    setNextZIndex(newZIndex + 1);
    
    setTerminals(terminals.map(terminal => 
      terminal.id === id ? { ...terminal, isMinimized: false, zIndex: newZIndex } : terminal
    ));
  };

  // Trazer um terminal para a frente quando clicado
  const bringToFront = (id) => {
    const newZIndex = nextZIndex;
    setNextZIndex(newZIndex + 1);
    
    setTerminals(terminals.map(terminal => 
      terminal.id === id ? { ...terminal, zIndex: newZIndex } : terminal
    ));
  };

  // Separar terminais abertos e minimizados
  const openTerminals = terminals.filter(t => t.isOpen && !t.isMinimized);
  const minimizedTerminals = terminals.filter(t => t.isOpen && t.isMinimized);

  // Inicializa um terminal por padrão se não houver nenhum
  useEffect(() => {
    if (terminals.length === 0) {
      createTerminal("default", "Terminal");
    }
  }, []);

  return (
    <div>
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <button 
          className="px-3 py-2 bg-gray-800 text-white rounded-md flex items-center shadow-lg hover:bg-gray-700"
          onClick={() => createTerminal("default", "Terminal")}
        >
          <TerminalIcon size={16} className="mr-2" />
          Novo Terminal
        </button>
      </div>
      
      {/* Render todos os terminais abertos */}
      {openTerminals.map(terminal => (
        <div key={terminal.id} onClick={() => bringToFront(terminal.id)}>
          <Terminal
            id={terminal.id}
            isOpen={terminal.isOpen}
            isMinimized={terminal.isMinimized}
            onClose={closeTerminal}
            onMinimize={minimizeTerminal}
            onRestore={restoreTerminal}
            title={terminal.title}
            command={terminal.command}
            terminalType={terminal.terminalType}
            zIndex={terminal.zIndex}
            position={terminal.position || calculateInitialPosition(terminal.id)}
          >
            <pre className="whitespace-pre-wrap">
              {terminal.content}
              <span className="animate-pulse">█</span>
            </pre>
          </Terminal>
        </div>
      ))}
      
      {/* Barra de terminais minimizados */}
      <MinimizedTerminalBar 
        minimizedTerminals={minimizedTerminals} 
        onRestore={restoreTerminal} 
      />
    </div>
  );
};

export default TerminalManager;