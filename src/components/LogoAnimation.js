import React, { useEffect, useState, useRef } from 'react';

const LogoAnimation = ({ themeColor, onClick }) => {
  // Animation states
  const [displayText, setDisplayText] = useState('');
  const [animationPhase, setAnimationPhase] = useState('typing'); // typing, pausing, deleting, or restarting
  const cursorRef = useRef(null);
  
  // Animation settings
  const fullText = 'JL';
  const typingDelay = 180;
  const pauseDelay = 2000;
  const deleteDelay = 160;
  const cursorBlinkSpeed = 500;
  
  // Get theme-based colors
  const getColor = () => {
    if (themeColor === 'cyberpunk') {
      return { text: '#0f0', cursor: '#0f0' };
    } else if (themeColor === 'white') {
      return { text: '#000', cursor: '#000' };
    } else {
      return { text: '#fff', cursor: '#fff' };
    }
  };
  
  const colors = getColor();
  
  // Handle cursor blinking
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;
    
    let blinkInterval;
    
    // Only blink cursor during pause phase
    if (animationPhase === 'pausing') {
      blinkInterval = setInterval(() => {
        cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0';
      }, cursorBlinkSpeed);
    } else {
      // Solid cursor during other phases
      cursor.style.opacity = '1';
    }
    
    return () => clearInterval(blinkInterval);
  }, [animationPhase]);
  
  // Main animation controller
  useEffect(() => {
    let timeoutId;
    
    switch (animationPhase) {
      case 'typing':
        if (displayText.length < fullText.length) {
          // Continue typing
          timeoutId = setTimeout(() => {
            setDisplayText(fullText.slice(0, displayText.length + 1));
          }, typingDelay);
        } else {
          // Finished typing, move to pause phase
          setAnimationPhase('pausing');
        }
        break;
        
      case 'pausing':
        // Wait before starting to delete
        timeoutId = setTimeout(() => {
          setAnimationPhase('deleting');
        }, pauseDelay);
        break;
        
      case 'deleting':
        if (displayText.length > 0) {
          // Continue deleting
          timeoutId = setTimeout(() => {
            setDisplayText(displayText.slice(0, displayText.length - 1));
          }, deleteDelay);
        } else {
          // Finished deleting, move to restart phase
          setAnimationPhase('restarting');
        }
        break;
        
      case 'restarting':
        // Pause briefly before restarting the animation
        timeoutId = setTimeout(() => {
          setAnimationPhase('typing');
        }, 500);
        break;
    }
    
    return () => clearTimeout(timeoutId);
  }, [animationPhase, displayText, fullText]);
  
  return (
    <button
      onClick={onClick}
      className="font-bold cursor-pointer hover:opacity-80 transition-opacity flex items-center justify-center"
      aria-label="Go to home page"
      style={{
        padding: '0 10px',
        background: 'transparent',
        border: 'none',
        outline: 'none'
      }}
    >
      <div
        className={`${themeColor === 'cyberpunk' ? 'cyberpunk-glow' : ''}`}
        style={{
          position: 'relative',
          height: '40px',
          width: '80px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%'
          }}
        >
          <span style={{
            fontSize: '24px',
            fontWeight: '900',
            color: colors.text,
            textTransform: 'uppercase'
          }}>
            {displayText}
          </span>
          <div
            ref={cursorRef}
            style={{
              width: '3px',
              height: '20px',
              backgroundColor: colors.cursor,
              marginLeft: '2px'
            }}
          />
        </div>
      </div>
    </button>
  );
};

export default LogoAnimation;