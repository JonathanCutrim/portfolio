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
} from "lucide-react";
import TerminalContactForm from "./TerminalContactForm";
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
  const [contactOpen, setContactOpen] = useState(false); 
  const [transitionActive, setTransitionActive] = useState(false);
  const [nextPage, setNextPage] = useState("home");

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
                  <TerminalContactForm
                    buttonType="text"
                    buttonText="Say hi to me..."
                    position="bottom-center"
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
              <div
                className={`flex h-full ${colors.bg} ${colors.text}`}
                style={{ height: "calc(100% - 64px)" }}
              >
                {/* Left Content - Developer Introduction */}
                <div className="w-1/2 flex flex-col justify-center p-8 relative">
                  <div className="relative z-10">
                    {/* Glowing badge for cyberpunk theme */}
                    {theme === "cyberpunk" && (
                      <div className="inline-block px-3 py-1 mb-6 border border-pink-500 text-cyan-300 text-sm tracking-wider animate-pulse">
                        {"<"}DEV{">"}
                      </div>
                    )}

                    <h1
                      className={`text-5xl md:text-6xl font-bold mb-2 ${
                        theme === "cyberpunk"
                          ? "text-cyan-300 cyberpunk-glow"
                          : ""
                      }`}
                    >
                      Hello, I'm
                    </h1>

                    <h2
                      className={`text-4xl md:text-5xl font-bold mb-4 ${
                        theme === "cyberpunk" ? "text-pink-300" : ""
                      }`}
                    >
                      <NameAnimation themeColor={theme}/>
                    </h2>

                    <div
                      className={`w-48 h-1 mb-6 ${
                        theme === "cyberpunk" ? "bg-pink-500" : "bg-gray-400"
                      } ${theme === "cyberpunk" ? "animate-pulse" : ""}`}
                    ></div>

                    <p
                      className={`text-lg md:text-xl font-semibold mb-4 ${
                        theme === "cyberpunk"
                          ? "text-cyan-200"
                          : "text-gray-400"
                      }`}
                    >
                      Front-end Developer | VTEX Developer | ReactJS |
                      TypeScript
                    </p>

                    <p
                      className={`text-lg md:text-xl mb-8 ${
                        theme === "cyberpunk"
                          ? "text-pink-200"
                          : "text-gray-500"
                      }`}
                    >
                      Creating elegant and functional web interfaces with modern
                      technologies.
                    </p>
                  </div>
                </div>

                {/* Right Content - Full Height Battleship Terminal */}
                <div
                  className={`w-1/2 flex flex-col h-full ${colors.secondaryBg}`}
                  style={{ position: 'relative', zIndex: 25 }} 
                >
                  {/* Gaming header */}
                  <div className="text-center pt-6 pb-2">
                    <h3
                      className={`text-xl md:text-2xl font-bold mb-1 ${
                        theme === "cyberpunk"
                          ? "text-cyan-300 cyberpunk-glow"
                          : ""
                      }`}
                    >
                      Play Battleship Terminal
                    </h3>
                    <p
                      className={`text-sm md:text-base ${
                        theme === "cyberpunk"
                          ? "text-pink-300"
                          : "text-gray-400"
                      } mb-3`}
                    >
                      Try your luck against the computer - can you sink all the
                      ships?
                    </p>
                  </div>

                  {/* Game Container - Full Height */}
                  <div className="flex-1 px-6 pb-6 flex flex-col relative"  style={{ zIndex: 26 }}>
                    <div
                      className={`w-full h-full ${
                        theme === "cyberpunk"
                          ? "cyberpunk-border"
                          : "border-4 border-gray-800"
                      } rounded-lg overflow-hidden relative`}
                    >
                      {/* Animated corner accents */}
                      <div
                        className={`absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 ${
                          theme === "cyberpunk"
                            ? "border-cyan-400"
                            : "border-gray-300"
                        } z-10`}
                      ></div>
                      <div
                        className={`absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 ${
                          theme === "cyberpunk"
                            ? "border-cyan-400"
                            : "border-gray-300"
                        } z-10`}
                      ></div>
                      <div
                        className={`absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 ${
                          theme === "cyberpunk"
                            ? "border-cyan-400"
                            : "border-gray-300"
                        } z-10`}
                      ></div>
                      <div
                        className={`absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 ${
                          theme === "cyberpunk"
                            ? "border-cyan-400"
                            : "border-gray-300"
                        } z-10`}
                      ></div>

                      {/* Monitor frame */}
                      <div className="absolute inset-0 rounded-lg overflow-hidden">
                        {/* CRT Screen Glare */}
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white to-transparent opacity-5 pointer-events-none"></div>

                        {/* CRT Screen Lines */}
                        <div
                          className="absolute top-0 left-0 w-full h-full bg-black opacity-10 pointer-events-none"
                          style={{
                            backgroundImage:
                              "repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255, 255, 255, 0.05) 1px, rgba(255, 255, 255, 0.05) 2px)",
                            backgroundSize: "100% 2px",
                          }}
                        ></div>

                        {/* Game display - Full size */}
                        <div className="h-full w-full p-1 terminal-scanlines terminal-flicker">
                          <Battleship theme={theme} />                          
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Game features bullets - at the bottom of the terminal section */}
                  <div className="px-6 pb-4">
                    <div className="flex flex-wrap gap-4 justify-center">
                      <div className="flex items-center">
                        <div
                          className={`mr-2 text-sm ${
                            theme === "cyberpunk"
                              ? "text-cyan-300"
                              : "text-gray-400"
                          }`}
                        >
                          ★
                        </div>
                        <p
                          className={`text-sm ${
                            theme === "cyberpunk"
                              ? "text-pink-200"
                              : "text-gray-400"
                          }`}
                        >
                          Classic Battleship game with terminal-style interface
                        </p>
                      </div>
                      <div className="flex items-center">
                        <div
                          className={`mr-2 text-sm ${
                            theme === "cyberpunk"
                              ? "text-cyan-300"
                              : "text-gray-400"
                          }`}
                        >
                          ★
                        </div>
                        <p
                          className={`text-sm ${
                            theme === "cyberpunk"
                              ? "text-pink-200"
                              : "text-gray-400"
                          }`}
                        >
                          Adaptive AI opponent that learns from your strategy
                        </p>
                      </div>
                      <div className="flex items-center">
                        <div
                          className={`mr-2 text-sm ${
                            theme === "cyberpunk"
                              ? "text-cyan-300"
                              : "text-gray-400"
                          }`}
                        >
                          ★
                        </div>
                        <p
                          className={`text-sm ${
                            theme === "cyberpunk"
                              ? "text-pink-200"
                              : "text-gray-400"
                          }`}
                        >
                          Retro aesthetic with modern gameplay
                        </p>
                      </div>
                    </div>
                  </div>
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

            {/* Formulário de Contato */}
            <div
              className={`fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70 transition-opacity duration-300 ${
                contactOpen ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <div
                className={`${
                  colors.cardBg
                } rounded-lg shadow-xl w-full max-w-lg transform transition-all duration-300 ${
                  contactOpen
                    ? "scale-100 translate-y-0"
                    : "scale-95 -translate-y-8"
                } ${
                  theme === "cyberpunk"
                    ? "cyberpunk-border"
                    : "border border-gray-600"
                }`}
              >
                {/* Header */}
                <div
                  className={`flex justify-between items-center p-5 border-b ${colors.border}`}
                >
                  <h3
                    className={`text-xl font-bold ${
                      theme === "cyberpunk"
                        ? "text-cyan-300 cyberpunk-glow"
                        : colors.text
                    }`}
                  >
                    Get in touch
                  </h3>
                  <button
                    onClick={() => setContactOpen(false)}
                    className={`p-1 rounded-full hover:bg-opacity-10 hover:bg-gray-300 transition-all duration-200 transform hover:rotate-90 ${colors.text}`}
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Formulário */}
                <div className="p-5">
                  <form className="space-y-4">
                    <div>
                      <label
                        htmlFor="name"
                        className={`block mb-1 font-medium ${
                          theme === "cyberpunk" ? "text-pink-300" : colors.text
                        }`}
                      >
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        className={`w-full px-4 py-2 rounded-md ${
                          theme === "cyberpunk"
                            ? "bg-purple-950 text-cyan-300 border border-pink-600 focus:border-cyan-400"
                            : theme === "black"
                            ? "bg-gray-800 text-white border border-gray-600 focus:border-blue-500"
                            : "bg-white text-black border border-gray-300 focus:border-blue-500"
                        } focus:outline-none transition-colors duration-200`}
                        placeholder="Your name"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className={`block mb-1 font-medium ${
                          theme === "cyberpunk" ? "text-pink-300" : colors.text
                        }`}
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        className={`w-full px-4 py-2 rounded-md ${
                          theme === "cyberpunk"
                            ? "bg-purple-950 text-cyan-300 border border-pink-600 focus:border-cyan-400"
                            : theme === "black"
                            ? "bg-gray-800 text-white border border-gray-600 focus:border-blue-500"
                            : "bg-white text-black border border-gray-300 focus:border-blue-500"
                        } focus:outline-none transition-colors duration-200`}
                        placeholder="your@email.com"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="message"
                        className={`block mb-1 font-medium ${
                          theme === "cyberpunk" ? "text-pink-300" : colors.text
                        }`}
                      >
                        Message
                      </label>
                      <textarea
                        id="message"
                        rows="4"
                        className={`w-full px-4 py-2 rounded-md ${
                          theme === "cyberpunk"
                            ? "bg-purple-950 text-cyan-300 border border-pink-600 focus:border-cyan-400"
                            : theme === "black"
                            ? "bg-gray-800 text-white border border-gray-600 focus:border-blue-500"
                            : "bg-white text-black border border-gray-300 focus:border-blue-500"
                        } focus:outline-none transition-colors duration-200`}
                        placeholder="Your message..."
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className={`w-full py-3 rounded-md flex items-center justify-center gap-2 font-medium transition-all duration-200 ${
                        theme === "cyberpunk"
                          ? "bg-pink-600 text-cyan-300 hover:bg-pink-700 hover:shadow-lg hover:shadow-pink-600/50"
                          : theme === "black"
                          ? "bg-white text-black hover:bg-gray-200"
                          : "bg-black text-white hover:bg-gray-900"
                      }`}
                    >
                      <Send size={18} />
                      <span>Send Message</span>
                    </button>
                  </form>

                  {/* Social Links */}
                  <div className="mt-8 pt-5 border-t border-gray-700">
                    <h4
                      className={`mb-4 font-medium ${
                        theme === "cyberpunk" ? "text-cyan-300" : colors.text
                      }`}
                    >
                      Or connect with me via:
                    </h4>
                    <div className="flex gap-4 justify-center">
                      <a
                        href="https://linkedin.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-3 rounded-full transition-transform duration-200 hover:scale-110 ${
                          theme === "cyberpunk"
                            ? "bg-purple-800 text-cyan-300"
                            : theme === "black"
                            ? "bg-gray-800 text-blue-400"
                            : "bg-gray-200 text-blue-700"
                        }`}
                      >
                        <Linkedin size={24} />
                      </a>
                      <a
                        href="https://wa.me/1234567890"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-3 rounded-full transition-transform duration-200 hover:scale-110 ${
                          theme === "cyberpunk"
                            ? "bg-purple-800 text-pink-300"
                            : theme === "black"
                            ? "bg-gray-800 text-green-400"
                            : "bg-gray-200 text-green-600"
                        }`}
                      >
                        <Phone size={24} />
                      </a>
                      <a
                        href="https://t.me/username"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-3 rounded-full transition-transform duration-200 hover:scale-110 ${
                          theme === "cyberpunk"
                            ? "bg-purple-800 text-cyan-300"
                            : theme === "black"
                            ? "bg-gray-800 text-blue-400"
                            : "bg-gray-200 text-blue-500"
                        }`}
                      >
                        <Send size={24} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

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
