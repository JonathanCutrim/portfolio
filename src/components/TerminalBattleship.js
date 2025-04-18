import React, { useState } from 'react';
import { Terminal, X } from 'lucide-react';
import Battleship from './Battleship/Battleship';

const TerminalBattleship = ({ theme = 'black' }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Function to open the terminal
  const openTerminal = () => {
    setIsOpen(true);
  };

  // Function to close the terminal
  const closeTerminal = () => {
    setIsOpen(false);
  };

  return (
    <div className="terminal-battleship-container">
      {/* Button to open the terminal - keep this positioned where it is currently */}
      {!isOpen && (
        <button 
          onClick={openTerminal}
          className="px-4 py-2 font-mono text-base font-medium transition-all duration-300 
                    hover:scale-105 transform border-2 border-gray-700 text-green-400 flex items-center gap-2
                    bg-transparent"
        >
          <Terminal size={18} />
          <span>SHALL WE PLAY A GAME?</span>
        </button>
      )}

      {/* Full screen terminal overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black text-green-400 font-mono">
          {/* Terminal Header */}
          <div className="flex items-center p-2 bg-gray-800 border-b border-gray-700">
            <div className="flex-grow text-sm text-gray-400 font-mono flex items-center">
              <Terminal size={16} className="mr-2" />
              <span className="font-bold mr-2">Terminal</span> - naval-combat@system ~ sudo ./naval-combat.sh
            </div>
            <div className="flex space-x-2 ml-4">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div 
                className="w-3 h-3 rounded-full bg-red-500 cursor-pointer hover:bg-red-600" 
                onClick={closeTerminal}
              ></div>
            </div>
          </div>

          {/* Terminal Content - Battleship Game */}
          <div className="flex-1 overflow-hidden relative">
            {/* Background scanlines effect */}
            <div 
              className="absolute inset-0 pointer-events-none z-10" 
              style={{
                backgroundImage: 'repeating-linear-gradient(0deg, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0) 1px, rgba(0, 255, 0, 0.03) 1px, rgba(0, 255, 0, 0.03) 2px)',
                backgroundSize: '100% 2px'
              }}
            ></div>
            
            {/* CRT screen flicker effect */}
            <div 
              className="absolute inset-0 pointer-events-none z-10 animate-crt-flicker opacity-30" 
              style={{
                background: 'radial-gradient(ellipse at center, rgba(0,255,0,0.2) 0%, rgba(0,0,0,0) 70%, rgba(0,0,0,0) 100%)'
              }}
            ></div>
            
            {/* Battleship game component */}
            <Battleship theme={theme} />
          </div>
        </div>
      )}

      {/* Add custom styles for the terminal effects */}
      <style jsx>{`
        @keyframes crt-flicker {
          0% { opacity: 0.27; }
          5% { opacity: 0.2; }
          10% { opacity: 0.27; }
          15% { opacity: 0.24; }
          20% { opacity: 0.28; }
          70% { opacity: 0.28; }
          80% { opacity: 0.24; }
          85% { opacity: 0.28; }
          90% { opacity: 0.25; }
          100% { opacity: 0.28; }
        }
        
        .animate-crt-flicker {
          animation: crt-flicker 5s infinite;
        }
        
        /* Apply VT323 terminal font to all terminal text */
        .font-mono {
          font-family: "VT323", "Courier New", monospace !important;
          letter-spacing: 0.5px;
        }
      `}</style>
    </div>
  );
};

export default TerminalBattleship;