import React, { useState, useEffect, useRef } from 'react';
import { Palette, Monitor, Code, Zap, BookOpen, Rocket, Award, Briefcase } from 'lucide-react';
import './style.css'; // Importar o arquivo CSS

const Skills = ({ theme = 'cyberpunk', colors, activePage }) => {
  const [visibleItems, setVisibleItems] = useState({});
  const [scrollY, setScrollY] = useState(0);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const containerRef = useRef(null);
  
  // Theme colors definition
  const themeColors = {
    cyberpunk: {
      primary: '#3b82f6',    // Blue
      secondary: '#ec4899',  // Pink
      tertiary: '#10b981'    // Green
    },
    black: {
      primary: '#3b82f6',    // Blue
      secondary: '#f5f5f5',  // White
      tertiary: '#a855f7'    // Purple
    },
    white: {
      primary: '#2563eb',    // Dark blue
      secondary: '#111827',  // Almost black
      tertiary: '#059669'    // Dark green
    }
  };
  
  // Active colors based on current theme
  const activeColors = themeColors[theme];
  
  // Timeline milestones
  const timelineMilestones = [
    {
      year: 2018,
      title: "Started Web Development",
      description: "Began learning HTML, CSS and JavaScript fundamentals.",
      icon: <BookOpen size={20} />,
      achievements: [
        'Completed first HTML/CSS projects',
        'Learned JavaScript basics',
        'Built static websites'
      ],
      color: activeColors.primary
    },
    {
      year: 2019,
      title: "Diving into React",
      description: "Focused on frontend frameworks and modern development tools.",
      icon: <Rocket size={20} />,
      achievements: [
        'Built first React applications',
        'Learned modern ES6+ features',
        'Started using Git for version control'
      ],
      color: activeColors.secondary
    },
    {
      year: 2021,
      title: "Professional Development",
      description: "Expanded skills to include full-stack development and professional tools.",
      icon: <Award size={20} />,
      achievements: [
        'Worked on team-based projects',
        'Learned backend technologies',
        'Implemented responsive designs for various screen sizes'
      ],
      color: activeColors.tertiary
    },
    {
      year: 2023,
      title: "Advanced Frontend Mastery",
      description: "Specialized in advanced frontend techniques and performance optimization.",
      icon: <Zap size={20} />,
      achievements: [
        'Mastered state management techniques',
        'Implemented complex animations',
        'Optimized web applications for performance'
      ],
      color: activeColors.primary
    }
  ];

  // Initialize animation and handle scroll
  useEffect(() => {
    if (activePage === 'skills') {
      // Initialize animations with delay
      const timer = setTimeout(() => {
        const visibilityState = {};
        timelineMilestones.forEach((milestone, index) => {
          setTimeout(() => {
            setVisibleItems(prev => ({
              ...prev,
              [`timeline-${index}`]: true
            }));
          }, index * 300);
        });
        setVisibleItems(visibilityState);
      }, 300);
      
      // Add scroll event listener for effects
      const handleScroll = () => {
        if (containerRef.current) {
          setScrollY(containerRef.current.scrollTop);
        }
      };
      
      const container = containerRef.current;
      if (container) {
        container.addEventListener('scroll', handleScroll);
      }
      
      // Create interval for occasional glitch effects
      const glitchInterval = setInterval(() => {
        setScrollY(prev => prev + 0.1);
      }, 250);
      
      return () => {
        clearTimeout(timer);
        clearInterval(glitchInterval);
        if (container) {
          container.removeEventListener('scroll', handleScroll);
        }
      };
    }
  }, [activePage, timelineMilestones]);

  // Handle showing tooltip for a technology
  const handleTechHover = (category, skill) => {
    setActiveTooltip({
      category,
      skill
    });
  };

  // Function to determine text color based on theme
  const getTextColor = (element) => {
    if (element === 'title') {
      return theme === 'cyberpunk' ? 'text-cyan-300' : theme === 'black' ? 'text-white' : 'text-gray-900';
    } else if (element === 'subtitle') {
      return theme === 'cyberpunk' ? 'text-blue-400' : theme === 'black' ? 'text-blue-300' : 'text-blue-600';  
    } else if (element === 'paragraph') {
      return theme === 'cyberpunk' ? 'text-gray-300' : theme === 'black' ? 'text-gray-300' : 'text-gray-700';
    } else {
      return theme === 'cyberpunk' ? 'text-gray-300' : theme === 'black' ? 'text-gray-300' : 'text-gray-600';
    }
  };

  // Set number of glitch blocks based on theme
  const glitchBlocks = theme === 'cyberpunk' ? 15 : theme === 'black' ? 10 : 6;
  const glitchOpacity = theme === 'cyberpunk' ? 0.7 : theme === 'black' ? 0.5 : 0.3;

  // Function to render glitch effects appropriate to the theme
  const renderGlitchEffects = () => {
    return (
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none z-10">
        {/* Base scanlines - adapted for each theme */}
        <div 
          className="absolute inset-0 z-10"
          style={{
            backgroundImage: theme === 'cyberpunk' 
              ? 'linear-gradient(transparent 50%, rgba(59, 130, 246, 0.04) 50%)'
              : theme === 'black'
                ? 'linear-gradient(transparent 50%, rgba(255, 255, 255, 0.03) 50%)'
                : 'linear-gradient(transparent 50%, rgba(0, 0, 0, 0.02) 50%)',
            backgroundSize: '100% 4px',
            mixBlendMode: 'overlay',
            opacity: theme === 'cyberpunk' ? 0.3 : theme === 'black' ? 0.2 : 0.1
          }}
        ></div>
        
        {/* VHS tracking lines */}
        {theme === 'cyberpunk' && (
          <div 
            className="absolute inset-0 z-20"
            style={{
              backgroundImage: `repeating-linear-gradient(
                to bottom,
                transparent,
                transparent 8px,
                rgba(59, 130, 246, 0.15) 8px,
                rgba(59, 130, 246, 0.15) 16px
              )`,
              opacity: 0.15,
              transform: `translateY(${scrollY * 0.3}px)`,
              mixBlendMode: 'overlay'
            }}
          ></div>
        )}
        
        {/* RGB shift effect - only for cyberpunk and black themes */}
        {(theme === 'cyberpunk' || theme === 'black') && (
          <>
            <div 
              className="absolute inset-0 z-20 mix-blend-screen"
              style={{
                backgroundImage: `linear-gradient(
                  45deg,
                  ${theme === 'cyberpunk' ? 'rgba(236, 72, 153, 0.06)' : 'rgba(168, 85, 247, 0.04)'} 0%,
                  transparent 40%
                )`,
                transform: `translateX(${Math.sin(Date.now() * 0.0008) * 4}px)`
              }}
            ></div>
            
            <div 
              className="absolute inset-0 z-20 mix-blend-screen"
              style={{
                backgroundImage: `linear-gradient(
                  -45deg,
                  ${theme === 'cyberpunk' ? 'rgba(59, 130, 246, 0.06)' : 'rgba(59, 130, 246, 0.04)'} 0%,
                  transparent 40%
                )`,
                transform: `translateX(${-Math.sin(Date.now() * 0.0008) * 4}px)`
              }}
            ></div>
          </>
        )}
        
        {/* Static noise - adapted by theme */}
        <div 
          className="absolute inset-0 z-30"
          style={{
            backgroundImage: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwwAADsMBx2+oZAAAABh0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMS42/U4J6AAAAP1JREFUaEPtmEEKwzAMBPP/P7dtbj30UBCKJTuz4A3YgzmMSbzP8/WjcTMGcQQGcQQGcQQGcQQGcQQGcQQGcQQGcQQGcQQGcQQGeWOQl+ezVTG3Q5Dnvl6BiboeFkbM7BQkjZQYJI2EGCSNlBgkjYQYJI2UGCSNhBgkjZQYJI2EGCSNlBgkjYQYJI2UGCSNhBgkjZQYJI2EGCSNlBgkjYQYJI2UGCSNhI0F8cSE/TleI2EkjFfx/VjPY8ZImUHCSJhBwkiZQcJImEHCSJlBwkiYQcJImUHCSNhbg3xXzO+wIGJux634VjG7o/lz2H7k7Ecn8L7XYvH+LXeEL7Cr59G7XAAAAAElFTkSuQmCC)',
            backgroundRepeat: 'repeat',
            opacity: theme === 'cyberpunk' ? 0.04 : theme === 'black' ? 0.03 : 0.01,
            animation: 'noise 0.2s steps(2) infinite'
          }}
        ></div>
        
        {/* Glitch blocks with quantities and opacities adapted to the theme */}
        {Array.from({ length: glitchBlocks }).map((_, i) => (
          <div
            key={`glitch-block-${i}`}
            className="absolute z-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${20 + Math.random() * 150}px`,
              height: `${1 + Math.random() * 8}px`,
              backgroundColor: i % 3 === 0 
                ? `rgba(${theme === 'cyberpunk' ? '59, 130, 246' : theme === 'black' ? '59, 130, 246' : '37, 99, 235'}, ${0.1 + (Math.random() * 0.3) * glitchOpacity})` // Blue
                : i % 3 === 1 
                  ? `rgba(${theme === 'cyberpunk' ? '236, 72, 153' : theme === 'black' ? '245, 245, 245' : '17, 24, 39'}, ${0.1 + (Math.random() * 0.3) * glitchOpacity})` // Pink/White/Black
                  : `rgba(${theme === 'cyberpunk' ? '16, 185, 129' : theme === 'black' ? '168, 85, 247' : '5, 150, 105'}, ${0.1 + (Math.random() * 0.3) * glitchOpacity})`, // Green/Purple
              transform: `translateY(${scrollY * (0.05 + i * 0.03)}px)`,
              opacity: Math.random() > 0.7 ? 1 : 0,
              animation: `flash ${0.5 + Math.random() * 2}s infinite`
            }}
          ></div>
        ))}
        
        {/* VHS time code display - only for cyberpunk theme */}
        {theme === 'cyberpunk' && (
          <div 
            className="absolute z-40 flex items-center"
            style={{
              right: '20px',
              top: '20px',
              padding: '4px 8px',
              backgroundColor: 'rgba(0,0,0,0.7)',
              color: activeColors.primary,
              fontFamily: "'VT323', monospace",
              fontSize: '14px',
              letterSpacing: '1px',
              border: `1px solid ${activeColors.primary}40`,
              transform: `scale(${1 + (Math.sin(Date.now() * 0.001) * 0.02)})`,
              opacity: 0.7
            }}
          >
            <span style={{ animation: 'blink 1s infinite' }}>REC</span>
            <span style={{ marginLeft: '8px' }}>
              {Math.floor(Date.now() / 100000 % 24).toString().padStart(2, '0')}:
              {Math.floor(Date.now() / 1000 % 60).toString().padStart(2, '0')}:
              {Math.floor(Date.now() / 10 % 100).toString().padStart(2, '0')}
            </span>
          </div>
        )}
        
        {/* Vertical tear lines - only for cyberpunk and black themes */}
        {(theme === 'cyberpunk' || theme === 'black') && Array.from({ length: 5 }).map((_, i) => (
          <div
            key={`tear-${i}`}
            className="absolute z-30"
            style={{
              top: 0,
              bottom: 0,
              left: `${(i * 25) + Math.random() * 10}%`,
              width: '1px',
              backgroundColor: theme === 'cyberpunk' 
                ? `rgba(${i % 2 === 0 ? '59, 130, 246' : '236, 72, 153'}, 0.3)` 
                : 'rgba(255, 255, 255, 0.2)',
              boxShadow: theme === 'cyberpunk' 
                ? `0 0 4px ${i % 2 === 0 ? activeColors.primary : activeColors.secondary}` 
                : '0 0 4px rgba(255, 255, 255, 0.3)',
              opacity: Math.random() > 0.7 ? 0.8 : 0
            }}
          ></div>
        ))}
        
        {/* Random flashes - more frequent in cyberpunk theme */}
        {Math.random() > (theme === 'cyberpunk' ? 0.97 : theme === 'black' ? 0.98 : 0.99) && (
          <div 
            className="absolute inset-0 z-50"
            style={{
              backgroundColor: theme === 'cyberpunk' 
                ? `rgba(${Math.random() > 0.5 ? '59, 130, 246' : '236, 72, 153'}, 0.1)`
                : theme === 'black'
                  ? 'rgba(255, 255, 255, 0.05)'
                  : 'rgba(0, 0, 0, 0.03)',
              mixBlendMode: 'overlay',
              animation: 'flash 0.1s forwards'
            }}
          ></div>
        )}
      </div>
    );
  };

  // Function to create a technology span with tooltip
  const createTechSpan = (name, color, description, logo, category) => {
    const isActive = activeTooltip && 
                    activeTooltip.category === category && 
                    activeTooltip.skill.name === name;
    
    return (
      <span 
        key={`${category}-${name}`}
        className="tech-term"
        style={{ 
          color: color,
          background: theme === 'cyberpunk' 
            ? `linear-gradient(90deg, ${color}00, ${color}30, ${color}00)` 
            : 'transparent',
          boxShadow: `0 4px 6px -1px ${color}20, 0 2px 4px -2px ${color}30`,
          borderBottom: theme === 'cyberpunk' 
            ? `1px solid ${color}50` 
            : theme === 'black'
              ? `1px dashed ${color}60`
              : `1px solid ${color}40`,
          textShadow: theme === 'cyberpunk' ? `0 0 8px ${color}70` : 'none'
        }}
        onMouseEnter={() => handleTechHover(category, {name, logo, description})}
        onMouseLeave={() => setTimeout(() => setActiveTooltip(null), 100)}
      >
        {name}
        
        {isActive && (
          <div 
            className="tech-tooltip glitch-in"
            style={{
              backgroundColor: theme === 'cyberpunk' ? 'rgba(17, 24, 39, 0.95)' : 
                              theme === 'black' ? 'rgba(31, 41, 55, 0.95)' : 
                              'rgba(255, 255, 255, 0.95)',
              border: `2px solid ${color}`,
              boxShadow: theme === 'cyberpunk' 
                ? `0 0 20px ${color}70, inset 0 0 10px ${color}30` 
                : `0 5px 20px rgba(0,0,0,0.3)`,
              color: theme === 'white' ? 'black' : 'white'
            }}
          >
            {/* Tooltip arrow */}
            <div 
              className="absolute w-4 h-4 rotate-45"
              style={{
                top: '-8px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: theme === 'cyberpunk' ? 'rgba(17, 24, 39, 0.95)' : 
                                theme === 'black' ? 'rgba(31, 41, 55, 0.95)' : 
                                'rgba(255, 255, 255, 0.95)',
                borderLeft: `2px solid ${color}`,
                borderTop: `2px solid ${color}`,
              }}
            ></div>
            
            <div className="flex items-center mb-2">
              <div 
                className="text-2xl mr-3 p-2 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: `${color}20`,
                  border: `1px solid ${color}40`,
                  boxShadow: theme === 'cyberpunk' ? `0 0 10px ${color}40` : 'none',
                  width: '40px',
                  height: '40px'
                }}
              >
                <span className="text-xl">{logo}</span>
              </div>
              <h4 
                style={{ 
                  color: color,
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  textShadow: theme === 'cyberpunk' ? `0 0 5px ${color}70` : 'none'
                }}
              >
                {name}
              </h4>
            </div>
            <p 
              className="text-sm"
              style={{
                lineHeight: '1.6',
                opacity: 0.9
              }}
            >
              {description}
            </p>
          </div>
        )}
      </span>
    );
  };

  if (activePage !== 'skills') {
    return null;
  }

  return (
    <div 
      ref={containerRef}
      className={`w-full h-full relative overflow-y-auto ${colors.bg} ${colors.text}`}
      style={{
        height: '100vh',
        backgroundImage: theme === 'cyberpunk' ? 
          'linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)' : 
          theme === 'black' ?
          'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)' :
          'linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        color: theme === 'white' ? 'black' : 'white'
      }}
    >
      {/* Animações CSS em style jsx são mantidas no componente */}
      <style jsx>{`
        @keyframes glitch-text-anim {
          0% { text-shadow: -1px 0 ${activeColors.secondary}, 1px 0 ${activeColors.tertiary}; }
          50% { text-shadow: 1px 0 ${activeColors.secondary}, -1px 0 ${activeColors.tertiary}; }
          100% { text-shadow: -1px 0 ${activeColors.secondary}, 1px 0 ${activeColors.tertiary}; }
        }

        @keyframes noise {
          0%, 100% { background-position: 0 0; }
          25% { background-position: -15% 10%; }
          50% { background-position: 5% -15%; }
          75% { background-position: 10% 5%; }
        }
        
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        
        @keyframes flash {
          0%, 100% { opacity: 0; }
          50% { opacity: 0.8; }
        }

        .glitch-title {
          display: inline-block;
          position: relative;
          animation: ${theme === 'cyberpunk' ? 'glitch-text-anim 5s infinite' : ''};
        }

        .pulse {
          animation: pulse 3s infinite;
        }

        @keyframes pulse {
          0% { opacity: 0.7; }
          50% { opacity: 1; }
          100% { opacity: 0.7; }
        }
      `}</style>
      
      {/* Glitch Effects */}
      {renderGlitchEffects()}
      
      {/* Main Container */}
      <div className="px-6 py-8 md:px-12 md:py-10 relative z-20 w-full">
        {/* Header Section */}
        <header className="mb-16">
          <h2 
            className={`main-title ${getTextColor('title')}`}
            style={{
              textShadow: theme === 'cyberpunk' ? `0 0 10px ${activeColors.primary}80` : 'none'
            }}
          >
            <span className="glitch-title">Desenvolvedor Front-End</span>, com um pé no Back e coração nos Jogos
          </h2>
          
          {/* Multi-color divider */}
          <div className="flex w-32 h-1 mb-6 ml-6">
            <div 
              className={`w-1/3 h-full ${theme === 'cyberpunk' ? 'pulse' : ''}`} 
              style={{ 
                backgroundColor: activeColors.primary,
                boxShadow: theme === 'cyberpunk' ? `0 0 8px ${activeColors.primary}` : 'none'
              }}
            ></div>
            <div 
              className={`w-1/3 h-full ${theme === 'cyberpunk' ? 'pulse' : ''}`} 
              style={{ 
                backgroundColor: activeColors.secondary,
                boxShadow: theme === 'cyberpunk' ? `0 0 8px ${activeColors.secondary}` : 'none'
              }}
            ></div>
            <div 
              className={`w-1/3 h-full ${theme === 'cyberpunk' ? 'pulse' : ''}`}
              style={{ 
                backgroundColor: activeColors.tertiary,
                boxShadow: theme === 'cyberpunk' ? `0 0 8px ${activeColors.tertiary}` : 'none'
              }}
            ></div>
          </div>
        </header>
        
        {/* Bio Text Content */}
        <section className="mb-16 text-left w-full">
          <div className="bio-content">
            <p className={`bio-paragraph bio-paragraph-1 ${getTextColor('paragraph')}`}>
              Há 13 anos transformando ideias em código e cafezinhos em commits. Especialista em fazer usuários 
              clicarem em "Adicionar ao carrinho" mesmo quando o salário ainda não caiu.
            </p>
            
            <p className={`bio-paragraph bio-paragraph-2 ${getTextColor('paragraph')}`}>
              Veterano das guerras de e-commerce, sobrevivi a uma década inteira no campo de batalha do 
              {createTechSpan('VTEX', activeColors.primary, 'Plataforma de e-commerce brasileira com recursos avançados', '🛒', 'ecommerce')}, 
              onde aprendi a transformar layouts impossíveis em realidade (e a explicar gentilmente para clientes 
              por que seus sonhos de "igual ao Amazon, mas melhor" precisam de ajustes).
            </p>
            
            <p className={`bio-paragraph bio-paragraph-3 ${getTextColor('paragraph')}`}>
              Já naveguei pelas águas turbulentas do 
              {createTechSpan('Salesforce Commerce Cloud', activeColors.secondary, 'Plataforma de comércio digital da Salesforce para experiências omnichannel', '☁️', 'ecommerce')}, 
              dancei a valsa complexa do 
              {createTechSpan('Magento', activeColors.tertiary, 'Plataforma de comércio eletrônico flexível e de código aberto', '🧩', 'ecommerce')} 
              e domei a fera chamada 
              {createTechSpan('Shopify', activeColors.primary, 'Plataforma de e-commerce all-in-one para pequenas e médias empresas', '🛍️', 'ecommerce')}. 
              Fluente em 
              {createTechSpan('React', activeColors.secondary, 'Biblioteca JavaScript para construir interfaces de usuário', '⚛️', 'frontend')}, 
              {createTechSpan('jQuery', activeColors.tertiary, 'Biblioteca JavaScript rápida, pequena e rica em recursos', '🔄', 'frontend')}, 
              {createTechSpan('Vue.js', activeColors.primary, 'Framework JavaScript progressivo para construir interfaces de usuário', '🟢', 'frontend')}, 
              e em explicar para familiares o que exatamente eu faço para viver.
            </p>
            
            <p className={`bio-paragraph bio-paragraph-4 ${getTextColor('paragraph')}`}>
              Quando não estou otimizando a jornada de checkout, estou criando mundos virtuais através de 
              {createTechSpan('JavaScript', activeColors.secondary, 'Linguagem de programação versátil para desenvolvimento web', '📜', 'frontend')}. 
              Sim, descobri que fazer joguinhos é mais divertido que debugar carrinhos de compra (quem diria?).
            </p>
            
            <p className={`bio-paragraph bio-paragraph-5 ${getTextColor('paragraph')}`}>
              Aventureiro ocasional no território do back-end com 
              {createTechSpan('Node.js', activeColors.tertiary, 'Ambiente de execução JavaScript do lado do servidor', '🟢', 'backend')} 
              e 
              {createTechSpan('PHP', activeColors.primary, 'Linguagem de script especialmente adequada para desenvolvimento web', '🐘', 'backend')}, 
              onde tento não quebrar bancos de dados e aprendo que o front-end nem sempre tem culpa de tudo.
            </p>
            
            <p className={`bio-paragraph bio-paragraph-6 ${getTextColor('paragraph')}`}>
              Especialidades incluem: 
              {createTechSpan('HTML5', activeColors.secondary, 'Linguagem de marcação para estruturar conteúdo na web', '🌐', 'frontend')}, 
              {createTechSpan('CSS3', activeColors.tertiary, 'Linguagem de estilo para design de páginas web', '🎨', 'frontend')} 
              (e todas suas variantes fashion), 
              {createTechSpan('JavaScript', activeColors.primary, 'Linguagem de programação versátil para desenvolvimento web', '📜', 'frontend')} 
              (e seus infinitos frameworks), 
              {createTechSpan('APIs RESTful', activeColors.secondary, 'Arquitetura para projetar aplicações em rede', '🔌', 'backend')}, 
              {createTechSpan('GraphQL', activeColors.tertiary, 'Linguagem de consulta para APIs', '📊', 'backend')}, 
              {createTechSpan('Git', activeColors.primary, 'Sistema de controle de versão distribuído', '📂', 'tools')} 
              (e a arte de resolver conflitos de merge sem pânico), além de um talento especial para transformar requisições vagas em produtos funcionais.
            </p>
            
            <p className={`bio-paragraph bio-paragraph-7 ${getTextColor('paragraph')}`}>
              Se você precisa de alguém que entenda tanto de UX/UI quanto de como fazer seu e-commerce não cair na Black Friday, eu sou seu desenvolvedor. E se precisar de alguém para testar seu jogo, também estou disponível. Puramente por motivos profissionais, claro.
            </p>
          </div>
        </section>
        
        {/* Professional Journey Timeline */}
        <section className="mb-20">
          <h2 
            className={`text-2xl font-bold mb-10 text-left pl-6 ${getTextColor('subtitle')}`}
            style={{
              fontFamily: "'Abril Fatface', serif",
              letterSpacing: '1px'
            }}
          >
            Professional Journey
          </h2>
          
          {/* Timeline */}
          <div className="relative pb-10">
            {/* Multi-color timeline line */}
            <div 
              className="absolute top-0 bottom-0 left-1/2 w-px"
              style={{
                background: `linear-gradient(to bottom, 
                  ${activeColors.primary}, 
                  ${activeColors.secondary}, 
                  ${activeColors.tertiary}, 
                  ${activeColors.primary})`,
                transform: 'translateX(-50%)',
                boxShadow: theme === 'cyberpunk' ? `0 0 8px ${activeColors.primary}80` : 'none'
              }}>
            </div>
            
            {/* Timeline Items */}
            {timelineMilestones.map((milestone, index) => (
              <div 
                key={index}
                className={`relative mb-20 ${visibleItems[`timeline-${index}`] ? 'timeline-item' : 'opacity-0'}`}
                style={{
                  animationDelay: `${index * 300 + 800}ms`
                }}
              >
                {/* Timeline node */}
                <div 
                  className={`absolute z-20 w-12 h-12 rounded-full flex items-center justify-center left-1/2 transform -translate-x-1/2 ${theme === 'cyberpunk' ? 'pulse' : ''}`}
                  style={{
                    backgroundColor: milestone.color,
                    boxShadow: theme === 'cyberpunk' ? `0 0 12px ${milestone.color}90` : 'none',
                    top: 0
                  }}
                >
                  <span className={`text-lg font-bold ${theme === 'white' ? 'text-white' : 'text-black'}`}>{milestone.year}</span>
                </div>
                
                {/* Content Card - Alternate left and right */}
                <div 
                  className={`w-5/12 ${index % 2 === 0 ? 'ml-auto pl-10' : 'mr-auto pr-10 text-right'}`}
                  style={{
                    marginTop: '3rem'
                  }}
                >
                  {/* Connecting line to timeline */}
                  <div 
                    className="absolute w-8 h-px"
                    style={{
                      backgroundColor: milestone.color,
                      top: '24px',
                      left: index % 2 === 0 ? 'calc(50% + 6px)' : 'auto',
                      right: index % 2 === 1 ? 'calc(50% + 6px)' : 'auto',
                      boxShadow: theme === 'cyberpunk' ? `0 0 8px ${milestone.color}70` : 'none'
                    }}
                  ></div>
                  
                  <div 
                    className={`p-6 rounded-lg shadow-lg border ${
                      theme === 'cyberpunk' ? 'bg-gray-900 border-gray-800' : 
                      theme === 'black' ? 'bg-gray-800 border-gray-700' : 
                      'bg-white border-gray-200'
                    }`}
                    style={{
                      borderLeft: index % 2 === 0 ? `4px solid ${milestone.color}` : '0',
                      borderRight: index % 2 === 1 ? `4px solid ${milestone.color}` : '0',
                      boxShadow: theme === 'cyberpunk' 
                        ? `0 4px 20px rgba(0, 0, 0, 0.5), 0 0 10px ${milestone.color}30` 
                        : '0 4px 20px rgba(0, 0, 0, 0.2)'
                    }}
                  >
                    {/* Header */}
                    <div className={`flex items-center mb-4 ${index % 2 === 1 ? 'justify-end' : ''}`}>
                      <div 
                        className={`${index % 2 === 1 ? 'order-2 ml-3' : 'order-1 mr-3'} p-2 rounded-full`}
                        style={{
                          backgroundColor: milestone.color
                        }}
                      >
                        {React.cloneElement(milestone.icon, { 
                          className: theme === 'white' ? 'text-white' : 'text-black'
                        })}
                      </div>
                      <h3 
                        className={`text-xl font-bold ${index % 2 === 1 ? 'order-1' : 'order-2'}`}
                        style={{
                          fontFamily: "'Montserrat', sans-serif",
                          letterSpacing: '0.5px',
                          color: milestone.color
                        }}
                      >
                        {milestone.title}
                      </h3>
                    </div>
                    
                    {/* Description */}
                    <p className={getTextColor('default')}>
                      {milestone.description}
                    </p>
                    
                    {/* Achievements */}
                    <div className={`${index % 2 === 1 ? 'text-right' : ''}`}>
                      <div 
                        className="text-sm font-semibold mb-2"
                        style={{ color: milestone.color }}
                      >
                        Key Achievements:
                      </div>
                      <ul className={`${index % 2 === 1 ? 'list-inside' : 'pl-5'} list-disc ${getTextColor('default')}`}>
                        {milestone.achievements.map((achievement, i) => (
                          <li key={i} className="mb-1">{achievement}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Call To Action */}
        <div 
          className={`mt-10 p-6 text-center rounded-lg border ${
            theme === 'cyberpunk' ? 'bg-gray-900 border-gray-800' : 
            theme === 'black' ? 'bg-gray-800 border-gray-700' : 
            'bg-white border-gray-200'
          }`}
          style={{
            maxWidth: '700px',
            margin: '40px auto',
            background: theme === 'cyberpunk' 
              ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(17, 24, 39, 0.98))' 
              : '',
            boxShadow: theme === 'cyberpunk'
              ? `0 10px 25px -5px rgba(0, 0, 0, 0.3),
                 0 0 15px ${activeColors.primary}30,
                 0 0 15px ${activeColors.secondary}30,
                 0 0 15px ${activeColors.tertiary}30`
              : theme === 'black'
                ? '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
                : '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
          }}
        >
          <h3 
            className="text-xl font-bold mb-3"
            style={{
              fontFamily: "'Dancing Script', cursive",
              fontSize: "1.8rem",
              letterSpacing: '0.5px',
              background: theme === 'cyberpunk'
                ? `linear-gradient(90deg, ${activeColors.primary}, ${activeColors.secondary}, ${activeColors.tertiary})`
                : '',
              WebkitBackgroundClip: theme === 'cyberpunk' ? 'text' : '',
              WebkitTextFillColor: theme === 'cyberpunk' ? 'transparent' : '',
              backgroundClip: theme === 'cyberpunk' ? 'text' : '',
              color: theme === 'cyberpunk' 
                ? 'transparent' 
                : theme === 'black' 
                  ? 'white' 
                  : 'black'
            }}
          >
            Looking for a skilled developer?
          </h3>
          <p 
            className={getTextColor('default')}
            style={{
              fontFamily: "'Quicksand', sans-serif",
              fontSize: "1.1rem"
            }}
          >
            I'm always open to discussing product design work or partnership opportunities.
          </p>
          <button 
            className={`px-6 py-2 rounded text-white mt-4 transition-all duration-300 hover:scale-105 ${
              theme === 'white' ? 'text-white' : ''
            }`}
            style={{
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: "500",
              background: theme === 'cyberpunk'
                ? `linear-gradient(90deg, ${activeColors.primary}, ${activeColors.secondary})`
                : theme === 'black'
                  ? activeColors.primary
                  : activeColors.primary,
              boxShadow: theme === 'cyberpunk' ? '0 0 10px rgba(59, 130, 246, 0.5)' : 'none'
            }}
          >
            Start a conversation
          </button>
        </div>
      </div>
    </div>
  );
};

export default Skills;