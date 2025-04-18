import React, { useState, useEffect } from 'react';
import { Github, ShoppingCart, X, Filter, Check, ChevronLeft, ChevronRight } from 'lucide-react';

const Work = ({ theme, colors, projects }) => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  const [filterVisible, setFilterVisible] = useState(true);
  
  // Estado para controlar as animações
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Get all unique tags for filters
  const allTags = [...new Set(projects.flatMap(project => project.tags))];
  
  // Get filtered projects
  const filteredProjects = activeFilters.length === 0
    ? projects
    : projects.filter(project => 
        activeFilters.some(filter => project.tags.includes(filter))
      );
  
  // Cart functions
  const addToCart = (project) => {
    if (!cart.some(item => item.id === project.id)) {
      setCart([...cart, project]);
    }
    setIsCartOpen(true);
  };
  
  const removeFromCart = (projectId) => {
    setCart(cart.filter(item => item.id !== projectId));
  };
  
  const clearCart = () => {
    setCart([]);
  };
  
  const openAllProjectsInCart = () => {
    cart.forEach(project => {
      window.open(project.url, '_blank');
    });
  };
  
  // Função para lidar com a mudança de filtros com animação
  const handleFilterChange = (newFilters) => {
    if (isTransitioning) return;
    
    // Inicia a animação
    setIsTransitioning(true);
    
    // Após um pequeno delay, atualiza os filtros
    setTimeout(() => {
      setActiveFilters(newFilters);
      
      // Após atualizar os filtros, reseta o estado de transição
      setTimeout(() => {
        setIsTransitioning(false);
      }, 100);
    }, 100);
  };
  
  const toggleFilter = (tag) => {
    const newFilters = activeFilters.includes(tag)
      ? activeFilters.filter(t => t !== tag)
      : [...activeFilters, tag];
    
    handleFilterChange(newFilters);
  };
  
  const clearFilters = () => {
    handleFilterChange([]);
  };
  
  return (
    <div 
      className={`w-full h-full relative overflow-hidden ${colors.bg} ${colors.text}`}
      style={{
        height: 'calc(100vh - 64px)',
        backgroundImage: theme === 'cyberpunk' ? 
          'linear-gradient(rgba(59, 130, 246, 0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.15) 1px, transparent 1px)' : 
          theme === 'black' ?
          'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)' :
          'linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px)',
        backgroundSize: '20px 20px'
      }}
    >
      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease forwards;
        }
        
        .pulse {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }

        .projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
        }
        
        .project-card {
          border-radius: 0.5rem;
          overflow: hidden;
          transition: all 0.4s ease;
          opacity: 0;
          animation: fadeInUp 0.5s ease forwards;
        }
        
        .project-card:hover {
          transform: translateY(-5px) scale(1.03);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }
      `}</style>
      
      {/* Filters Sidebar */}
      <div className={`border-r ${colors.border} relative transition-all duration-300 h-full ${colors.secondaryBg} ${filterVisible ? 'w-64' : 'w-10'}`}>
        <button 
          onClick={() => setFilterVisible(!filterVisible)}
          className={`absolute right-0 top-4 ${colors.buttonBg} p-1 cursor-pointer transition-colors duration-200`}
          style={{
            boxShadow: theme === 'cyberpunk' ? '0 0 10px rgba(59, 130, 246, 0.5)' : 'none'
          }}
        >
          {filterVisible ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
        
        {filterVisible && (
          <div className="p-4 animate-fadeInRight">
            <div className="flex items-center mb-6">
              <div 
                className={`p-2 rounded-full ${theme === 'cyberpunk' ? 'bg-blue-500 pulse' : theme === 'black' ? 'bg-gray-700' : 'bg-gray-200'} mr-3`}
                style={{
                  boxShadow: theme === 'cyberpunk' ? '0 0 10px rgba(59, 130, 246, 0.5)' : 'none'
                }}
              >
                <Filter size={16} className={theme === 'white' ? 'text-black' : 'text-white'} />
              </div>
              <h3 
                className={`text-lg font-bold ${theme === 'cyberpunk' ? 'text-cyan-300' : theme === 'black' ? 'text-white' : 'text-black'}`}
                style={{
                  fontFamily: theme === 'cyberpunk' ? "'VT323', monospace" : 'inherit',
                  letterSpacing: theme === 'cyberpunk' ? '1px' : 'normal'
                }}
              >
                Filters
              </h3>
            </div>
            
            <div className="mb-6">
              <h4 className={`font-medium mb-2 ${theme === 'cyberpunk' ? 'text-pink-300' : theme === 'black' ? 'text-gray-300' : 'text-gray-700'}`}>Technologies</h4>
              <div className="flex flex-col gap-2">
                {allTags.map(tag => (
                  <div key={tag}>
                    <button
                      onClick={() => toggleFilter(tag)}
                      className="flex items-center w-full cursor-pointer group transition-all duration-300 hover:translate-x-1"
                      disabled={isTransitioning}
                    >
                      <div 
                        className={`w-4 h-4 border ${
                          activeFilters.includes(tag) ? 
                          (theme === 'cyberpunk' ? 'bg-cyan-500 border-cyan-500' : 
                           theme === 'black' ? 'bg-white border-white' : 
                           'bg-blue-500 border-blue-500') : 
                          'border-gray-500'
                        } mr-2 flex items-center justify-center transition-all duration-300`}
                      >
                        <Check 
                          size={12} 
                          className={`text-white transition-all duration-200 ${
                            activeFilters.includes(tag) ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                          }`} 
                        />
                      </div>
                      <span 
                        className={`text-sm transition-all duration-200 ${
                          activeFilters.includes(tag) ? 
                          (theme === 'cyberpunk' ? 'text-cyan-300 font-medium' : 
                           theme === 'black' ? 'text-white font-medium' : 
                           'text-blue-600 font-medium') : 
                          (theme === 'white' ? 'text-gray-700' : 'text-gray-300')
                        }`}
                      >
                        {tag}
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            {activeFilters.length > 0 && (
              <button
                onClick={clearFilters}
                disabled={isTransitioning}
                className={`text-sm cursor-pointer hover:underline transition-all duration-200 ${
                  theme === 'cyberpunk' ? 'text-cyan-300 hover:text-cyan-100' : 
                  theme === 'black' ? 'text-blue-300 hover:text-blue-100' : 
                  'text-blue-600 hover:text-blue-800'
                }`}
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>
      
      {/* Projects Grid */}
      <div 
        className="flex-1 overflow-auto p-6"
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          left: filterVisible ? '16rem' : '2.5rem',
          transition: 'left 0.3s ease'
        }}
      >
        {/* Header Section */}
        <header className="flex flex-col items-center text-center mb-10">
          <h1 
            className={`text-3xl md:text-5xl font-bold mb-4 ${
              theme === 'cyberpunk' ? 'text-cyan-300 cyberpunk-glow' : 
              theme === 'black' ? 'text-white' : 'text-black'
            }`}
            style={{
              fontFamily: theme === 'cyberpunk' ? "'VT323', monospace" : 'inherit',
              letterSpacing: theme === 'cyberpunk' ? '1px' : 'normal',
            }}
          >
            My Projects
          </h1>
          <div
            className={`w-24 h-1 mb-4 ${
              theme === 'cyberpunk' ? 'bg-blue-500 pulse' : 
              theme === 'black' ? 'bg-blue-400' : 
              'bg-blue-500'
            }`}
            style={{
              boxShadow: theme === 'cyberpunk' ? '0 0 10px #3b82f6' : 'none'
            }}
          ></div>
          <p 
            className={`text-lg max-w-2xl ${
              theme === 'cyberpunk' ? 'text-pink-200' : 
              theme === 'black' ? 'text-gray-300' : 
              'text-gray-700'
            }`}
            style={{
              fontFamily: theme === 'cyberpunk' ? "'VT323', monospace" : 'inherit',
              letterSpacing: theme === 'cyberpunk' ? '0.5px' : 'normal'
            }}
          >
            Explore my portfolio of projects and add interesting ones to your collection
          </p>
        </header>
        
        <div className="flex justify-end mb-6">
          {/* Cart Button */}
          <button 
            onClick={() => setIsCartOpen(!isCartOpen)} 
            className={`flex items-center py-2 px-4 relative transition-all duration-300 rounded hover:scale-105 ${
              theme === 'cyberpunk' 
                ? 'bg-pink-600 text-cyan-300 hover:bg-pink-700' 
                : theme === 'black'
                  ? 'bg-white text-black hover:bg-gray-100' 
                  : 'bg-black text-white hover:bg-gray-900'
            }`}
            style={{
              boxShadow: theme === 'cyberpunk' ? '0 0 10px rgba(59, 130, 246, 0.5)' : 'none'
            }}
          >
            <ShoppingCart size={18} className="mr-2" />
            <span>View Collection</span>
            {cart.length > 0 && (
              <div className={`absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center text-xs rounded-full font-bold ${
                theme === 'cyberpunk' ? 'bg-cyan-400 text-black' : 
                theme === 'black' ? 'bg-red-500 text-white' : 
                'bg-red-500 text-white'
              }`}>
                {cart.length}
              </div>
            )}
          </button>
        </div>
        
        {/* Projects Grid com animação simplificada */}
        <div key={activeFilters.join('-')} className="projects-grid">
          {filteredProjects.map((project, index) => (
            <div 
              key={project.id} 
              className={`project-card ${colors.cardBg} text-${theme === 'white' ? 'black' : 'white'} shadow-md ${theme === 'cyberpunk' ? 'cyberpunk-border' : 'border border-gray-200'}`}
              style={{
                animationDelay: `${index * 80}ms`,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                borderLeft: theme === 'cyberpunk' ? 
                  (index % 2 === 0 ? '4px solid #3b82f6' : '4px solid #ec4899') :
                  theme === 'black' ? 
                  '1px solid rgba(255, 255, 255, 0.1)' : 
                  '1px solid rgba(0, 0, 0, 0.1)'
              }}
            >
              {/* Project Image */}
              <div className={`h-40 relative overflow-hidden ${theme === 'cyberpunk' ? 'bg-gray-800' : theme === 'black' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" 
                />
                
                {/* Tags */}
                <div className={`absolute bottom-0 left-0 right-0 ${
                  theme === 'cyberpunk' ? 'bg-purple-900' : 
                  theme === 'black' ? 'bg-gray-800' : 
                  'bg-white'
                } p-2 flex flex-wrap gap-1`}>
                  {project.tags.map(tag => (
                    <span 
                      key={tag} 
                      className={`text-xs py-1 px-2 ${
                        theme === 'cyberpunk' 
                          ? 'text-cyan-300 border-cyan-400' 
                          : theme === 'black'
                            ? 'text-white bg-gray-800 border-gray-700'
                            : 'text-black border-gray-300'
                      } border shadow-sm transition-all duration-200 hover:scale-105 ${
                        activeFilters.includes(tag) ? (
                          theme === 'cyberpunk' ? 'ring-1 ring-cyan-400' : 'ring-1 ring-blue-400'
                        ) : ''
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Content */}
              <div className="p-4 flex flex-col flex-grow">
                <h3 className={`text-lg font-bold mb-2 ${theme === 'cyberpunk' ? 'text-cyan-300' : theme === 'black' ? 'text-white' : 'text-black'}`}>{project.title}</h3>
                <p className={`text-sm ${theme === 'cyberpunk' ? 'text-pink-200' : theme === 'black' ? 'text-gray-300' : 'text-gray-600'} mb-4 flex-grow`}>{project.description}</p>
                
                <div className="flex items-center justify-between mt-auto">
                  <a 
                    href={project.githubUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`${theme === 'cyberpunk' ? 'text-pink-300' : theme === 'black' ? 'text-gray-300' : 'text-gray-700'} transition-transform duration-200 hover:scale-125`}
                  >
                    <Github size={20} />
                  </a>
                  
                  <button
                    onClick={() => addToCart(project)}
                    className={`px-3 py-1 transition-all duration-200 hover:translate-y-0.5 ${
                      cart.some(item => item.id === project.id)
                        ? theme === 'cyberpunk' 
                          ? 'bg-cyan-600 text-black' 
                          : 'bg-green-800 text-white'
                        : theme === 'cyberpunk'
                          ? 'bg-pink-600 text-cyan-300'
                          : theme === 'black'
                            ? 'bg-white text-black'
                            : 'bg-black text-white'
                    }`}
                  >
                    {cart.some(item => item.id === project.id) 
                      ? <Check size={18} /> 
                      : 'Add to Collection'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredProjects.length === 0 && (
          <div 
            className="flex flex-col items-center justify-center py-10 animate-fadeIn"
          >
            <p className={`text-lg ${theme === 'cyberpunk' ? 'text-pink-300' : theme === 'black' ? 'text-gray-300' : 'text-gray-600'} mb-4`}>No projects match your selected filters</p>
            <button
              onClick={clearFilters}
              disabled={isTransitioning}
              className={`py-2 px-4 cursor-pointer transition-all duration-200 ${
                theme === 'cyberpunk' 
                  ? 'bg-pink-600 text-cyan-300 hover:bg-pink-700 hover:scale-105' 
                  : theme === 'black'
                    ? 'bg-white text-black hover:bg-gray-100 hover:scale-105'
                    : 'bg-black text-white hover:bg-gray-900 hover:scale-105'
              }`}
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
      
      {/* Mini Cart with animation */}
      <div 
        className={`absolute top-0 right-0 h-full w-80 shadow-lg p-4 z-20 transform transition-all duration-300 ease-in-out ${
          theme === 'cyberpunk' 
            ? 'bg-purple-800 text-cyan-300 border-l border-pink-500' 
            : theme === 'black' 
              ? 'bg-gray-800 text-white border-l border-gray-700' 
              : 'bg-white text-black border-l border-gray-200'
        }`}
        style={{
          transform: isCartOpen ? 'translateX(0)' : 'translateX(100%)',
          boxShadow: '-5px 0 15px rgba(0, 0, 0, 0.5)'
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <div 
              className={`p-2 rounded-full mr-3 ${
                theme === 'cyberpunk' 
                  ? 'bg-blue-500 pulse' 
                  : theme === 'black'
                    ? 'bg-gray-700' 
                    : 'bg-gray-200'
              }`}
              style={{
                boxShadow: theme === 'cyberpunk' ? '0 0 10px rgba(59, 130, 246, 0.5)' : 'none'
              }}
            >
              <ShoppingCart size={16} className={theme === 'white' ? 'text-black' : 'text-white'} />
            </div>
            <h3 className={`text-lg font-bold ${
              theme === 'cyberpunk' ? 'text-cyan-300' : 
              theme === 'black' ? 'text-white' : 
              'text-black'
            }`}>
              Your Collection ({cart.length})
            </h3>
          </div>
          <button 
            onClick={() => setIsCartOpen(false)} 
            className="transform transition-transform duration-200 hover:scale-110 text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className={`border-t mb-4 ${
            theme === 'cyberpunk' ? 'border-pink-500' : 
            theme === 'black' ? 'border-gray-600' : 
            'border-gray-200'
          }`}></div>
        
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <ShoppingCart 
              className={`mb-4 transition-all duration-500 animate-pulse ${
                theme === 'cyberpunk' ? 'text-pink-300' : 
                theme === 'black' ? 'text-gray-300' : 
                'text-gray-400'
              }`}
              size={48}
            />
            <p className={theme === 'cyberpunk' ? 'text-pink-200' : theme === 'black' ? 'text-gray-300' : 'text-gray-500'}>
              Your collection is empty
            </p>
          </div>
        ) : (
          <>
            <div className="flex-grow overflow-auto max-h-full" style={{maxHeight: 'calc(100vh - 240px)'}}>
              {cart.map((project, index) => (
                <div 
                  key={project.id} 
                  className={`flex justify-between items-center py-2 border-b transform transition-all duration-300 hover:translate-x-1 ${
                    theme === 'cyberpunk' 
                      ? 'border-pink-800' 
                      : theme === 'black' 
                        ? 'border-gray-700' 
                        : 'border-gray-100'
                  }`}
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    animation: 'fadeIn 0.3s forwards'
                  }}
                >
                  <div className="flex-grow">
                    <p className={`font-medium ${theme === 'cyberpunk' ? 'text-cyan-300' : theme === 'black' ? 'text-white' : 'text-black'}`}>{project.title}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {project.tags.slice(0, 3).map(tag => (
                        <span 
                          key={tag} 
                          className={`text-xs py-0.5 px-2 border shadow-sm transition-colors duration-200 ${
                            theme === 'cyberpunk' 
                              ? 'bg-purple-900 text-pink-300 border-pink-500' 
                              : theme === 'black'
                                ? 'bg-gray-700 text-white border-gray-600'
                                : 'bg-white text-black border-gray-300'
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 3 && 
                        <span className="text-xs text-gray-400">+{project.tags.length - 3}</span>
                      }
                    </div>
                  </div>
                  <button 
                    onClick={() => removeFromCart(project.id)}
                    className="ml-2 transform transition-all duration-200 hover:scale-110 text-red-400 hover:text-red-300"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
            
            <div className={`mt-4 pt-4 border-t ${
              theme === 'cyberpunk' ? 'border-pink-500' : 
              theme === 'black' ? 'border-gray-700' : 
              'border-gray-200'
            }`}>
              <button 
                onClick={clearCart}
                className={`w-full mb-2 py-2 text-sm text-center border cursor-pointer transition-all duration-200 hover:translate-y-0.5 ${
                  theme === 'cyberpunk' 
                    ? 'text-pink-300 border-pink-500 hover:bg-purple-700' 
                    : theme === 'black'
                      ? 'text-gray-300 border-gray-600 hover:bg-gray-700'
                      : 'text-gray-600 border-gray-300 hover:bg-gray-100'
                }`}
              >
                Clear Collection
              </button>
              <button 
                onClick={openAllProjectsInCart}
                className={`w-full py-3 cursor-pointer font-medium transition-all duration-200 hover:translate-y-0.5 ${
                  theme === 'cyberpunk' 
                    ? 'bg-pink-600 text-cyan-300 hover:bg-pink-700' 
                    : theme === 'black'
                      ? 'bg-white text-black hover:bg-gray-200'
                      : 'bg-black text-white hover:bg-gray-900'
                }`}
                style={{
                  boxShadow: theme === 'cyberpunk' ? '0 0 10px rgba(59, 130, 246, 0.5)' : 'none'
                }}
              >
                Open All Projects
              </button>
            </div>
          </>
        )}
      </div>
      
      {/* Overlay with animation */}
      <div 
        className="absolute inset-0 bg-black transition-opacity duration-300 ease-in-out"
        style={{
          opacity: isCartOpen ? 0.5 : 0,
          zIndex: isCartOpen ? 10 : -10
        }}
        onClick={() => setIsCartOpen(false)}
      ></div>
    </div>
  );
};

export default Work;