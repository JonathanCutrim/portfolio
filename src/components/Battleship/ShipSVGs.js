// src/components/Battleship/ShipSVGs.js
// Componentes SVG para os navios do jogo Battleship

import React from 'react';

// Componente de navio de batalha (4 células)
export const BattleshipSVG = ({ theme = 'white', orientation = 'horizontal', cellSize = 24 }) => {
  // Definir cores baseadas no tema
  const colors = getThemeColors(theme);
  
  // Tamanho baseado na orientação
  const width = orientation === 'horizontal' ? cellSize * 4 : cellSize;
  const height = orientation === 'horizontal' ? cellSize : cellSize * 4;
  
  // Transformação para orientação
  const transform = orientation === 'horizontal' ? '' : 'rotate(90) translate(0, -100%)';
  const viewBox = orientation === 'horizontal' ? '0 0 400 100' : '0 0 100 400';
  
  return (
    <svg width={width} height={height} viewBox={viewBox} xmlns="http://www.w3.org/2000/svg">
      <g transform={transform}>
        {/* Casco principal */}
        <rect x="0" y="25" width="400" height="50" rx="5" ry="5" fill={colors.bodyFill} stroke={colors.outline} strokeWidth="2"/>
        
        {/* Torres de artilharia */}
        <rect x="50" y="10" width="60" height="25" rx="3" ry="3" fill={colors.detailFill}/>
        <rect x="170" y="10" width="60" height="25" rx="3" ry="3" fill={colors.detailFill}/>
        <rect x="290" y="10" width="60" height="25" rx="3" ry="3" fill={colors.detailFill}/>
        
        {/* Ponte de comando */}
        <rect x="150" y="30" width="100" height="20" rx="3" ry="3" fill={colors.detailFill}/>
        <rect x="175" y="15" width="50" height="15" rx="2" ry="2" fill={colors.detailFill}/>
        
        {/* Designação do navio (só mostrar se o tema não for cyberpunk) */}
        {theme !== 'cyberpunk' && (
          <text x="200" y="60" fontFamily="monospace" fontSize="14" fill={colors.text} textAnchor="middle">BB-63</text>
        )}
        
        {/* Efeito de brilho para o tema cyberpunk */}
        {theme === 'cyberpunk' && (
          <>
            <rect x="0" y="25" width="400" height="50" rx="5" ry="5" fill="none" stroke={colors.glow} strokeWidth="4" opacity="0.5">
              <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2s" repeatCount="indefinite" />
            </rect>
            <rect x="300" y="30" width="80" height="5" rx="2" ry="2" fill={colors.glow} opacity="0.8">
              <animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite" />
            </rect>
          </>
        )}
      </g>
    </svg>
  );
};

// Componente de cruzador (3 células)
export const CruiserSVG = ({ theme = 'white', orientation = 'horizontal', cellSize = 24 }) => {
  // Definir cores baseadas no tema
  const colors = getThemeColors(theme);
  
  // Tamanho baseado na orientação
  const width = orientation === 'horizontal' ? cellSize * 3 : cellSize;
  const height = orientation === 'horizontal' ? cellSize : cellSize * 3;
  
  // Transformação para orientação
  const transform = orientation === 'horizontal' ? '' : 'rotate(90) translate(0, -100%)';
  const viewBox = orientation === 'horizontal' ? '0 0 300 100' : '0 0 100 300';
  
  return (
    <svg width={width} height={height} viewBox={viewBox} xmlns="http://www.w3.org/2000/svg">
      <g transform={transform}>
        {/* Casco principal */}
        <rect x="0" y="25" width="300" height="50" rx="5" ry="5" fill={colors.bodyFill} stroke={colors.outline} strokeWidth="2"/>
        
        {/* Torres de artilharia */}
        <rect x="40" y="10" width="50" height="20" rx="3" ry="3" fill={colors.detailFill}/>
        <rect x="210" y="10" width="50" height="20" rx="3" ry="3" fill={colors.detailFill}/>
        
        {/* Ponte de comando */}
        <rect x="120" y="30" width="60" height="20" rx="3" ry="3" fill={colors.detailFill}/>
        <rect x="135" y="15" width="30" height="15" rx="2" ry="2" fill={colors.detailFill}/>
        
        {/* Designação do navio (só mostrar se o tema não for cyberpunk) */}
        {theme !== 'cyberpunk' && (
          <text x="150" y="60" fontFamily="monospace" fontSize="14" fill={colors.text} textAnchor="middle">CA-68</text>
        )}
        
        {/* Efeito de brilho para o tema cyberpunk */}
        {theme === 'cyberpunk' && (
          <>
            <rect x="0" y="25" width="300" height="50" rx="5" ry="5" fill="none" stroke={colors.glow} strokeWidth="4" opacity="0.5">
              <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2s" repeatCount="indefinite" />
            </rect>
            <rect x="200" y="35" width="80" height="5" rx="2" ry="2" fill={colors.glow} opacity="0.8">
              <animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite" />
            </rect>
          </>
        )}
      </g>
    </svg>
  );
};

// Componente de destroyer (2 células)
export const DestroyerSVG = ({ theme = 'white', orientation = 'horizontal', cellSize = 24 }) => {
  // Definir cores baseadas no tema
  const colors = getThemeColors(theme);
  
  // Tamanho baseado na orientação
  const width = orientation === 'horizontal' ? cellSize * 2 : cellSize;
  const height = orientation === 'horizontal' ? cellSize : cellSize * 2;
  
  // Transformação para orientação
  const transform = orientation === 'horizontal' ? '' : 'rotate(90) translate(0, -100%)';
  const viewBox = orientation === 'horizontal' ? '0 0 200 100' : '0 0 100 200';
  
  return (
    <svg width={width} height={height} viewBox={viewBox} xmlns="http://www.w3.org/2000/svg">
      <g transform={transform}>
        {/* Casco principal */}
        <rect x="0" y="25" width="200" height="50" rx="5" ry="5" fill={colors.bodyFill} stroke={colors.outline} strokeWidth="2"/>
        
        {/* Torre de artilharia principal */}
        <rect x="75" y="10" width="50" height="20" rx="3" ry="3" fill={colors.detailFill}/>
        <rect x="95" y="0" width="10" height="15" rx="1" ry="1" fill={colors.detailFill}/>
        
        {/* Ponte de comando */}
        <rect x="50" y="35" width="100" height="15" rx="3" ry="3" fill={colors.detailFill}/>
        
        {/* Designação do navio (só mostrar se o tema não for cyberpunk) */}
        {theme !== 'cyberpunk' && (
          <text x="100" y="60" fontFamily="monospace" fontSize="14" fill={colors.text} textAnchor="middle">DD-143</text>
        )}
        
        {/* Efeito de brilho para o tema cyberpunk */}
        {theme === 'cyberpunk' && (
          <>
            <rect x="0" y="25" width="200" height="50" rx="5" ry="5" fill="none" stroke={colors.glow} strokeWidth="4" opacity="0.5">
              <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2s" repeatCount="indefinite" />
            </rect>
            <rect x="120" y="40" width="60" height="5" rx="2" ry="2" fill={colors.glow} opacity="0.8">
              <animate attributeName="opacity" values="0.5;1;0.5" dur="1.5s" repeatCount="indefinite" />
            </rect>
          </>
        )}
      </g>
    </svg>
  );
};

// Componente de submarino (1 célula)
export const SubmarineSVG = ({ theme = 'white', orientation = 'horizontal', cellSize = 24 }) => {
  // Definir cores baseadas no tema
  const colors = getThemeColors(theme);
  
  // Para o submarino, como é 1 célula, o tamanho e orientação são mais simples
  const width = cellSize;
  const height = cellSize;
  
  // Sem necessidade de transformação para o submarino já que é quadrado
  const viewBox = '0 0 100 100';
  
  return (
    <svg width={width} height={height} viewBox={viewBox} xmlns="http://www.w3.org/2000/svg">
      <g>
        {/* Corpo principal */}
        <ellipse cx="50" cy="50" rx="45" ry="20" fill={colors.bodyFill} stroke={colors.outline} strokeWidth="2"/>
        
        {/* Torre de comando (vela) */}
        <rect x="35" y="20" width="30" height="15" rx="3" ry="3" fill={colors.detailFill}/>
        
        {/* Periscópio */}
        <rect x="49" y="5" width="2" height="15" fill={colors.detailFill}/>
        
        {/* Designação do navio (só mostrar se o tema não for cyberpunk) */}
        {theme !== 'cyberpunk' && (
          <text x="50" y="55" fontFamily="monospace" fontSize="14" fill={colors.text} textAnchor="middle">SS-396</text>
        )}
        
        {/* Efeito de brilho para o tema cyberpunk */}
        {theme === 'cyberpunk' && (
          <>
            <ellipse cx="50" cy="50" rx="45" ry="20" fill="none" stroke={colors.glow} strokeWidth="4" opacity="0.5">
              <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cx="50" cy="50" rx="10" ry="5" fill={colors.glow} opacity="0.6">
              <animate attributeName="opacity" values="0.4;0.8;0.4" dur="1.5s" repeatCount="indefinite" />
            </ellipse>
          </>
        )}
      </g>
    </svg>
  );
};

// Função utilitária para obter cores baseadas no tema
const getThemeColors = (theme) => {
  switch (theme) {
    case 'cyberpunk':
      return {
        bodyFill: '#502080', // Roxo escuro
        detailFill: '#802080', // Roxo médio
        outline: '#FF00FF', // Magenta
        text: '#00FFFF', // Ciano
        glow: '#00FFFF' // Brilho ciano
      };
    case 'black':
      return {
        bodyFill: '#464646', // Cinza escuro
        detailFill: '#5A5A5A', // Cinza médio
        outline: '#648CC8', // Azul acinzentado
        text: '#A4C8FF', // Azul claro
        glow: '#4080FF' // Azul brilhante
      };
    case 'white':
    default:
      return {
        bodyFill: '#DCDCDC', // Cinza muito claro
        detailFill: '#B4B4B4', // Cinza claro
        outline: '#969696', // Cinza médio
        text: '#505050', // Cinza escuro
        glow: '#FFFFFF' // Branco
      };
  }
};

// Mapeamento de tipo de navio para componente SVG
export const ShipComponentMap = {
  battleship: BattleshipSVG,
  cruiser: CruiserSVG,
  destroyer: DestroyerSVG,
  submarine: SubmarineSVG
};

// Função auxiliar para determinar a orientação de um navio
export const determineShipOrientation = (ship) => {
  if (!ship || !ship.positions || ship.positions.length < 2) return 'horizontal';
  
  const [first, second] = ship.positions;
  return first.x === second.x ? 'vertical' : 'horizontal';
};

// Componente principal que renderiza o navio apropriado
export const ShipSVG = ({ shipType, theme = 'white', orientation = 'horizontal', cellSize = 24 }) => {
  const ShipComponent = ShipComponentMap[shipType];
  if (!ShipComponent) return null;
  
  return <ShipComponent theme={theme} orientation={orientation} cellSize={cellSize} />;
};

export default ShipSVG;