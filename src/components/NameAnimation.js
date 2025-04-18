import React, { useEffect, useState, useRef } from 'react';

const NameAnimation = ({ themeColor }) => {
  // Animation states
  const [displayText, setDisplayText] = useState('');
  const [animationPhase, setAnimationPhase] = useState('typing1'); // typing1, pausing1, deleting1, typing2, pausing2, deleting2
  const cursorRef = useRef(null);
  
  // Animation settings
  const firstText = 'JL';
  const secondText = 'Jonathan Lacerda';
  const typingDelay = 150;
  const pauseDelay = 2000;
  const deleteDelay = 120;
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
    
    // Only blink cursor during pause phases
    if (animationPhase === 'pausing1' || animationPhase === 'pausing2') {
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
      case 'typing1':
        if (displayText.length < firstText.length) {
          // Continue typing first text
          timeoutId = setTimeout(() => {
            setDisplayText(firstText.slice(0, displayText.length + 1));
          }, typingDelay);
        } else {
          // Finished typing first text, move to pause phase
          setAnimationPhase('pausing1');
        }
        break;
        
      case 'pausing1':
        // Wait before starting to delete first text
        timeoutId = setTimeout(() => {
          setAnimationPhase('deleting1');
        }, pauseDelay);
        break;
        
      case 'deleting1':
        if (displayText.length > 0) {
          // Continue deleting first text
          timeoutId = setTimeout(() => {
            setDisplayText(displayText.slice(0, displayText.length - 1));
          }, deleteDelay);
        } else {
          // Finished deleting first text, start typing second text
          setAnimationPhase('typing2');
        }
        break;

      case 'typing2':
        if (displayText.length < secondText.length) {
          // Continue typing second text
          timeoutId = setTimeout(() => {
            setDisplayText(secondText.slice(0, displayText.length + 1));
          }, typingDelay);
        } else {
          // Finished typing second text, move to pause phase
          setAnimationPhase('pausing2');
        }
        break;
        
      case 'pausing2':
        // Wait before starting to delete second text
        timeoutId = setTimeout(() => {
          setAnimationPhase('deleting2');
        }, pauseDelay);
        break;
        
      case 'deleting2':
        if (displayText.length > 0) {
          // Continue deleting second text
          timeoutId = setTimeout(() => {
            setDisplayText(displayText.slice(0, displayText.length - 1));
          }, deleteDelay);
        } else {
          // Finished deleting second text, start typing first text again
          setAnimationPhase('typing1');
        }
        break;
    }
    
    return () => clearTimeout(timeoutId);
  }, [animationPhase, displayText, firstText, secondText]);
  
  return (
    <div
      className={`${themeColor === 'cyberpunk' ? 'cyberpunk-glow' : ''}`}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        left: '50%',
        transform: 'translateX(-50%)'
      }}
    >
      <span style={{
        fontSize: 'inherit',
        fontWeight: 'inherit',
        color: colors.text
      }}>
        {displayText}
      </span>
      <div
        ref={cursorRef}
        style={{
          width: '3px',
          height: '1em',
          backgroundColor: colors.cursor,
          marginLeft: '2px'
        }}
      />
    </div>
  );
};

export default NameAnimation;