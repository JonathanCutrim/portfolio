import React, { useState, useRef } from 'react';
import { Gamepad2 } from 'lucide-react';
import Battleship from './Battleship/Battleship';
import SharedTerminal from './SharedTerminal';

const BattleshipTerminal = ({ theme = 'black' }) => {
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const terminalContentRef = useRef(null);

  const openTerminal = () => {
    setIsTerminalOpen(true);
  };

  const closeTerminal = () => {
    setIsTerminalOpen(false);
  };

  return (
    <div className="relative" style={{ zIndex: 100 }}> {/* Increased z-index */}
      {/* Launch Button - Styled to match the theme */}
      <button
        onClick={openTerminal}
        className={`flex items-center justify-center p-4 gap-2 text-lg font-mono cursor-pointer transition-all duration-300 
                   hover:scale-105 transform border-2 ${
                     theme === 'cyberpunk'
                       ? 'border-pink-600 text-cyan-300 cyberpunk-glow'
                       : theme === 'white'
                         ? 'border-gray-300 text-black'
                         : 'border-gray-700 text-green-400'
                   }`}
        style={{ background: 'transparent', fontFamily: "'VT323', 'Courier New', monospace" }}
      >
        <Gamepad2 size={24} />
        <span>SHALL WE PLAY A GAME?</span>
      </button>

      {/* Full Screen Terminal */}
      <SharedTerminal
        isOpen={isTerminalOpen}
        onClose={closeTerminal}
        terminalType="fullscreen"
        title="Naval Combat"
        command="sudo ./naval-combat.sh"
        contentRef={terminalContentRef}
      >
        <div className="h-full w-full">
          <Battleship theme={theme} />
        </div>
      </SharedTerminal>
    </div>
  );
};

export default BattleshipTerminal;