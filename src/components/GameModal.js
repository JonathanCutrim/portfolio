import React, { useState } from 'react';
import { X, Gamepad2 } from 'lucide-react';
import Battleship from './Battleship/Battleship';

const GameModal = ({ theme, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay com fundo escurecido */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm" 
        onClick={onClose}
      ></div>
      
      {/* Modal content */}
      <div 
        className={`relative w-11/12 max-w-4xl max-h-[90vh] overflow-auto rounded-lg border shadow-xl
          ${theme === 'white' 
            ? 'bg-white border-gray-300' 
            : theme === 'cyberpunk'
              ? 'bg-purple-900 border-pink-600 cyberpunk-border' 
              : 'bg-gray-900 border-gray-700'}`}
      >
        {/* Header */}
        <div className={`flex justify-between items-center p-4 border-b
          ${theme === 'white' 
            ? 'border-gray-200 text-black' 
            : theme === 'cyberpunk'
              ? 'border-pink-600 text-cyan-300' 
              : 'border-gray-700 text-white'}`}
        >
          <h2 className={`text-xl font-bold ${theme === 'cyberpunk' ? 'cyberpunk-glow' : ''}`}>
            Batalha Naval
          </h2>
          <button 
            onClick={onClose}
            className={`p-1 rounded-full transition-transform duration-200 hover:scale-110
              ${theme === 'white' 
                ? 'text-gray-800 hover:bg-gray-200' 
                : theme === 'cyberpunk'
                  ? 'text-pink-300 hover:bg-purple-800' 
                  : 'text-gray-300 hover:bg-gray-800'}`}
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Game content */}
        <div className="p-4">
          <Battleship theme={theme} />
        </div>
      </div>
    </div>
  );
};

const GameButton = ({ theme }) => {
  const [showModal, setShowModal] = useState(false);
  
  // Definir estilos baseados no tema
  const buttonStyles = {
    white: 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg',
    black: 'bg-white hover:bg-gray-100 text-black shadow-md hover:shadow-lg',
    cyberpunk: 'bg-pink-600 hover:bg-pink-700 text-cyan-300 shadow-pink-500/30 hover:shadow-pink-500/50 border border-pink-500'
  };
  
  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={`flex items-center gap-2 py-3 px-5 rounded-lg transition-all duration-300 transform hover:scale-105 font-medium ${buttonStyles[theme] || buttonStyles.black}`}
      >
        <Gamepad2 size={20} className={theme === 'cyberpunk' ? 'animate-pulse' : ''} />
        <span className={theme === 'cyberpunk' ? 'cyberpunk-glow' : ''}>
          Want to play a game?
        </span>
      </button>
      
      {showModal && (
        <GameModal 
          theme={theme} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </>
  );
};

export default GameButton;