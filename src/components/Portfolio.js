import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Github,
  Twitter,
  Facebook,
  Youtube,
  Moon,
  Sun,
  Monitor,
  X,
  Zap,
  Linkedin,
  Send,
  MessageSquare,
  Phone,
  Gamepad2,
} from "lucide-react";
import TerminalContactForm from "./TerminalContactForm";
import SharedTerminal from "./SharedTerminal";
import SimpleTransition from "./RetroTransition";
import LogoAnimation from "./LogoAnimation";
import NameAnimation from "./NameAnimation";
import Skills from "./Pages/Skills";
import Work from "./Pages/Works";

import Battleship from './Battleship/Battleship'

import { projects } from "./Content/projects";
import themeColors from "./Content/themeColors";

import './home.css';

const Portfolio = () => {
  const [theme, setTheme] = useState("black"); 
  const [activePage, setActivePage] = useState("home");
  const [transitionActive, setTransitionActive] = useState(false);
  const [nextPage, setNextPage] = useState("home");
  const [gameExpanded, setGameExpanded] = useState(false);
  
  // States for terminals
  const [isGameTerminalOpen, setIsGameTerminalOpen] = useState(false);
  const gameTerminalRef = useRef(null);
  
  // Reference for the terminal content
  const terminalContentRef = useRef(null);

  const colors = themeColors[theme];

  const navigateTo = (page) => {
    if (page === activePage) return;
    setTransitionActive(true);
    setNextPage(page);
  };

  const handleTransitionEnd = () => {
    setActivePage(nextPage);

    setTimeout(() => {
      setTransitionActive(false);
    }, 300);
  };

  const changeTheme = (newTheme) => {
    if (newTheme !== theme) {
      const nextTheme = newTheme;
      setTransitionActive(true);

      setTimeout(() => {
        setTheme(nextTheme);
        setTimeout(() => {
          setTransitionActive(false);
        }, 300);
      }, 500);
    }
  };

  // Open the game terminal
  const openGameTerminal = () => {
    setIsGameTerminalOpen(true);
  };

  // Close the game terminal
  const closeGameTerminal = () => {
    setIsGameTerminalOpen(false);
  };

  return (
    <>
      <SimpleTransition
        isActive={transitionActive}
        theme={theme}
        onTransitionEnd={handleTransitionEnd}
      />

      <div className="flex flex-col h-screen relative">
        <div className="vhs-overlay absolute inset-0 pointer-events-none z-20"></div>

        <div className="flex flex-grow overflow-hidden">
          {/* Left Column */}
          <div
            className={`flex flex-col items-center z-50 relative justify-between py-6 ${colors.sidebar} ${colors.text}`}
            style={{ width: "64px", zIndex: 30 }}
          >
            <LogoAnimation
              themeColor={theme}
              onClick={() => navigateTo("home")}
            />
            <div className="flex flex-col gap-8 items-center">
              <button
                onClick={() => navigateTo("skills")}
                className={`writing-vertical-lr transform -rotate-90 text-base font-medium tracking-wider cursor-pointer ${
                  activePage === "skills"
                    ? theme === "cyberpunk"
                      ? "text-cyan-300 cyberpunk-glow"
                      : colors.text
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Skills
              </button>
              <button
                onClick={() => navigateTo("work")}
                className={`writing-vertical-lr transform -rotate-90 text-base font-medium tracking-wider cursor-pointer ${
                  activePage === "work"
                    ? theme === "cyberpunk"
                      ? "text-cyan-300 cyberpunk-glow"
                      : colors.text
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Work
              </button>
              <a href="#" className={`text-gray-400 hover:${colors.text}`}>
                <Github size={24} />
              </a>
              <a href="#" className={`text-gray-400 hover:${colors.text}`}>
                <Twitter size={24} />
              </a>
              <a href="#" className={`text-gray-400 hover:${colors.text}`}>
                <Facebook size={24} />
              </a>
              <a href="#" className={`text-gray-400 hover:${colors.text}`}>
                <Youtube size={24} />
              </a>
            </div>
            <div></div> {/* Spacer */}
          </div>

          {/* Right Column  */}
          <div className="flex-grow">
            <div
              className={`flex justify-between items-center h-16 z-50 ${colors.border} border-b relative ${colors.bg}`}
            >
              <div
                className={`ml-6 ${colors.secondaryText} cursor-pointer hover:underline transition-all duration-200 flex items-center gap-2`}
              >
                <MessageSquare size={16} className="animate-bounce" />
                <span>
                  {/* Using the proper TerminalContactForm component with bottom position */}
                  <TerminalContactForm
                    buttonType="text"
                    buttonText="Say hi to me..."
                    position="bottom"
                    className="terminal-container"
                  />
                </span>
              </div>

              <div className="flex">
                <button
                  onClick={() => changeTheme("white")}
                  className={`p-2 cursor-pointer ${
                    theme === "white"
                      ? "bg-black text-white"
                      : "bg-white text-black"
                  }`}
                >
                  <Sun size={20} />
                </button>
                <button
                  onClick={() => changeTheme("black")}
                  className={`p-2 cursor-pointer ${
                    theme === "black"
                      ? "bg-white text-black"
                      : "bg-black text-white"
                  }`}
                >
                  <Moon size={20} />
                </button>
                <button
                  onClick={() => changeTheme("cyberpunk")}
                  className={`p-2 cursor-pointer ${
                    theme === "cyberpunk"
                      ? "bg-pink-600 text-cyan-300"
                      : "bg-purple-800 text-pink-300"
                  }`}
                >
                  <Zap size={20} />
                </button>
              </div>
            </div>

            {/* Content Pages */}
            {activePage === "home" && (
  <div className={`flex h-full ${colors.bg} ${colors.text}`} style={{ height: "calc(100% - 64px)" }}>
    {/* Lado esquerdo - Apresentação do desenvolvedor com textos CENTRALIZADOS */}
    <div className="w-1/2 flex flex-col justify-center items-center px-8 py-8 relative">
      <div className="relative z-10 max-w-xl text-center">
        {/* Badge para theme cyberpunk */}
        {theme === "cyberpunk" && (
          <div className="inline-block px-3 py-1 mb-6 border border-pink-500 text-cyan-300 text-sm font-medium tracking-wider">
            {"<"}DEV{">"}
          </div>
        )}

        {/* Título principal com nome */}
        <div className="mb-8">
          <h1 className={`text-5xl md:text-6xl font-bold mb-1 ${
            theme === "cyberpunk" ? "text-cyan-300 cyberpunk-glow" : ""
          }`}>
            Hello, I'm
          </h1>
          
          <h2 className={`text-6xl md:text-7xl font-extrabold ${
            theme === "cyberpunk" ? "text-pink-300" : ""
          }`}>
            Jonathan Lacerda
          </h2>
          
          <div className={`w-32 h-1 mt-6 mb-8 mx-auto ${
            theme === "cyberpunk" ? "bg-pink-500" : "bg-gray-400"
          }`}></div>
        </div>

        {/* Especialidades - centralizadas */}
        <div className="flex flex-wrap gap-3 mb-6 justify-center">
          <span className={`py-1 px-3 rounded-full text-sm font-medium ${
            theme === "cyberpunk" 
              ? "bg-purple-800 text-cyan-300 border border-cyan-500" 
              : theme === "black"
                ? "bg-gray-800 text-white border border-gray-700" 
                : "bg-gray-200 text-gray-800 border border-gray-300"
          }`}>Front-end Developer</span>
          
          <span className={`py-1 px-3 rounded-full text-sm font-medium ${
            theme === "cyberpunk" 
              ? "bg-purple-800 text-pink-300 border border-pink-500" 
              : theme === "black"
                ? "bg-gray-800 text-white border border-gray-700" 
                : "bg-gray-200 text-gray-800 border border-gray-300"
          }`}>VTEX Specialist</span>
          
          <span className={`py-1 px-3 rounded-full text-sm font-medium ${
            theme === "cyberpunk" 
              ? "bg-purple-800 text-cyan-300 border border-cyan-500" 
              : theme === "black"
                ? "bg-gray-800 text-white border border-gray-700" 
                : "bg-gray-200 text-gray-800 border border-gray-300"
          }`}>ReactJS</span>
          
          <span className={`py-1 px-3 rounded-full text-sm font-medium ${
            theme === "cyberpunk" 
              ? "bg-purple-800 text-pink-300 border border-pink-500" 
              : theme === "black"
                ? "bg-gray-800 text-white border border-gray-700" 
                : "bg-gray-200 text-gray-800 border border-gray-300"
          }`}>TypeScript</span>
        </div>

        {/* Bio - centralizada */}
        <div className={`space-y-4 mb-8 max-w-md mx-auto ${
          theme === "cyberpunk" ? "text-gray-300" : theme === "black" ? "text-gray-300" : "text-gray-600"
        }`}>
          <p className="text-lg leading-relaxed">
            Desenvolvedor front-end com mais de uma década de experiência em arquitetura de interfaces e sistemas de e-commerce.
          </p>
          <p className="text-lg leading-relaxed">
            Especializado na criação de experiências digitais refinadas e performáticas com foco em conversão.
          </p>
          <p className="text-lg leading-relaxed">
            Recentemente, expandindo horizontes no desenvolvimento de jogos e aplicações interativas.
          </p>
        </div>

        {/* Botão de contato */}
        <button 
          className={`mt-2 py-3 px-8 rounded-md font-medium text-lg transition-all duration-300 transform hover:scale-105 ${
            theme === "cyberpunk" 
              ? "bg-pink-600 text-cyan-300 hover:bg-pink-700 shadow-lg shadow-pink-900/50" 
              : theme === "black"
                ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-900/30" 
                : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-300/30"
          }`}
        >
          Vamos conversar
        </button>
      </div>
      
      {/* Elementos decorativos de fundo - visíveis apenas em temas não-white */}
      {theme !== "white" && (
        <>
          <div className="absolute top-1/4 left-1/4 w-16 h-16 rounded-full opacity-10 blur-2xl"
            style={{ 
              background: theme === "cyberpunk" ? 
                "radial-gradient(circle, rgba(236,72,153,1) 0%, rgba(139,92,246,0) 70%)" : 
                "radial-gradient(circle, rgba(59,130,246,0.5) 0%, rgba(59,130,246,0) 70%)" 
            }}
          ></div>
          <div className="absolute bottom-1/3 right-1/4 w-24 h-24 rounded-full opacity-10 blur-xl"
            style={{ 
              background: theme === "cyberpunk" ? 
                "radial-gradient(circle, rgba(6,182,212,1) 0%, rgba(139,92,246,0) 70%)" : 
                "radial-gradient(circle, rgba(59,130,246,0.5) 0%, rgba(59,130,246,0) 70%)" 
            }}
          ></div>
        </>
      )}
    </div>

    {/* Lado direito - Jogo Battleship em formato compacto inicialmente */}
    <div className={`w-1/2 flex flex-col h-full ${colors.secondaryBg}`} style={{ position: 'relative' }}>
      {/* Versão compacta do jogo (visível quando não expandido) */}
      {!gameExpanded && (
        <div 
          className={`flex flex-col items-center justify-center h-full cursor-pointer transition-all duration-300 hover:bg-opacity-80`}
          onClick={() => setGameExpanded(true)}
        >
          <div className={`w-64 h-64 relative overflow-hidden rounded-lg ${
            theme === "cyberpunk" 
              ? "border-2 border-cyan-500" 
              : theme === "white" 
                ? "border-2 border-gray-300" 
                : "border border-gray-700"
          }`}
          style={{
            boxShadow: theme === "cyberpunk" 
              ? "0 0 15px rgba(6, 182, 212, 0.5)" 
              : theme === "white" 
                ? "0 4px 6px -1px rgba(0, 0, 0, 0.1)" 
                : "0 4px 6px -1px rgba(0, 0, 0, 0.5)"
          }}>
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
              <h3 className={`text-xl font-bold mb-2 ${
                theme === "cyberpunk" ? "text-cyan-300 cyberpunk-glow" : ""
              }`}>
                Naval Combat
              </h3>
              
              <div className={`my-2 ${
                theme === "cyberpunk" ? "text-cyan-300" : theme === "black" ? "text-gray-300" : "text-gray-700"
              } font-mono text-xs`}>
                STATUS: AWAITING AUTHORIZATION
              </div>
              
              <div className={`mt-4 mb-2 w-36 py-2 text-center text-sm font-mono ${
                theme === "cyberpunk" 
                  ? "border border-cyan-500 text-cyan-300"
                  : theme === "black"
                    ? "border border-gray-500 text-gray-300"
                    : "border border-gray-400 text-gray-600"
              }`}>
                SHALL WE PLAY A GAME?
              </div>
              
              <p className={`mt-4 text-xs ${
                theme === "cyberpunk" ? "text-pink-300" : "text-gray-500"
              }`}>
                Click to expand
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Versão expandida do jogo (visível quando expandido) */}
      {gameExpanded && (
        <div className="relative h-full w-full">
          {/* Botão para minimizar */}
          <button 
            className={`absolute top-4 right-4 z-30 p-1 rounded-full ${
              theme === "cyberpunk" 
                ? "bg-pink-900 text-cyan-300 hover:bg-pink-800" 
                : theme === "black"
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600" 
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setGameExpanded(false)}
            title="Minimize game"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          
          {/* Gaming header */}
          <div className="text-center pt-6 pb-2">
            <h3 className={`text-xl md:text-2xl font-bold mb-1 ${
              theme === "cyberpunk" ? "text-cyan-300 cyberpunk-glow" : ""
            }`}>
              Play Battleship
            </h3>
            <p className={`text-sm md:text-base ${
              theme === "cyberpunk" ? "text-pink-300" : "text-gray-400"
            } mb-3`}>
              Try your luck against the computer - can you sink all the ships?
            </p>
          </div>

          {/* Game Container - Full Height */}
          <div className="flex-1 px-6 pb-6 flex flex-col h-5/6" style={{ zIndex: 26 }}>
            {/* Jogo com bordas e estilo adequados para o tema */}
            <div 
              className={`w-full h-full overflow-hidden relative ${
                theme === "cyberpunk" 
                  ? "border-2 border-cyan-500 rounded-md" 
                  : theme === "white" 
                    ? "border-2 border-gray-300 rounded-md" 
                    : "border border-gray-700 rounded-md"
              }`}
              style={{
                boxShadow: theme === "cyberpunk" 
                  ? "0 0 15px rgba(6, 182, 212, 0.5)" 
                  : theme === "white" 
                    ? "0 4px 6px -1px rgba(0, 0, 0, 0.1)" 
                    : "0 4px 6px -1px rgba(0, 0, 0, 0.5)"
              }}
            >
              {/* Efeitos sutis de CRT apenas para temas não-white */}
              {theme !== "white" && (
                <div 
                  className="absolute inset-0 pointer-events-none z-10" 
                  style={{
                    backgroundImage: theme === "cyberpunk"
                      ? 'repeating-linear-gradient(0deg, rgba(0, 255, 255, 0.03), rgba(0, 255, 255, 0.03) 1px, transparent 1px, transparent 2px)'
                      : 'repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.02) 1px, transparent 1px, transparent 2px)',
                    backgroundSize: '100% 2px',
                    opacity: theme === "cyberpunk" ? 0.4 : 0.2
                  }}
                ></div>
              )}
              
              <Battleship theme={theme} />
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
)}

            {/* Skills Page */}
            <Skills
              theme={theme}
              activePage={activePage}
              colors={colors}
              Monitor={Monitor}
            />

            {/* Work Page - E-commerce Style */}
            <Work theme={theme} colors={colors} projects={projects} />

            {/* Footer - Navigation */}
            <div className={`flex ${colors.border} border-t relative`}>
              <button
                onClick={() => navigateTo("home")}
                className={`w-1/3 py-4 text-center cursor-pointer ${
                  activePage === "home" ? "font-bold" : ""
                } ${colors.bg} ${colors.text}`}
              >
                About.
              </button>
              <button
                onClick={() => navigateTo("skills")}
                className={`w-1/3 py-4 text-center cursor-pointer ${
                  activePage === "skills" ? "font-bold" : ""
                } ${colors.bg} ${colors.text}`}
              >
                My Skills.
              </button>
              <button
                onClick={() => navigateTo("work")}
                className={`w-1/3 py-4 text-center cursor-pointer ${
                  activePage === "work" ? "font-bold" : ""
                } ${colors.bg} ${colors.text}`}
              >
                My Work.
              </button>
              <div className="absolute bottom-4 right-4 w-12 h-12 relative">
                {/* Theme symbol indicator */}
                <div
                  className={`w-full h-full flex items-center justify-center relative ${
                    theme === "cyberpunk"
                      ? "bg-purple-900 border-2 border-pink-500"
                      : theme === "black"
                      ? "bg-black border-2 border-white"
                      : "bg-white border-2 border-black"
                  }`}
                >
                  {theme === "white" && (
                    <Sun size={20} className="text-black" />
                  )}
                  {theme === "black" && (
                    <Moon size={20} className="text-white" />
                  )}
                  {theme === "cyberpunk" && (
                    <Zap size={20} className="text-cyan-300" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Portfolio;