import React, { useEffect } from 'react';

// Componente de transição simples com apenas fade in/out
const SimpleTransition = ({ isActive, theme, onTransitionEnd }) => {
  // Define cores baseadas no tema do portfólio
  const getBackgroundColor = () => {
    if (theme === 'cyberpunk') {
      return '#2d1b4e'; // Roxo escuro para cyberpunk
    } else if (theme === 'white') {
      return '#ffffff'; // Branco para tema claro
    } else {
      return '#121212'; // Cinza escuro para tema escuro
    }
  };
  
  // Chama onTransitionEnd após um delay para dar tempo à transição visual
  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => {
        if (onTransitionEnd) {
          onTransitionEnd();
        }
      }, 400); // Meio segundo de tela cheia antes de iniciar a transição para a nova página
      
      return () => clearTimeout(timer);
    }
  }, [isActive, onTransitionEnd]);
  
  return (
    <div 
      className={`fixed inset-0 z-50 transition-opacity duration-500 ${
        isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      style={{ 
        backgroundColor: getBackgroundColor(),
      }}
    />
  );
};

export default SimpleTransition;