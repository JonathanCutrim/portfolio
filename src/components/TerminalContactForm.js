import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare } from 'lucide-react';
import SharedTerminal from './SharedTerminal';

const TerminalContactForm = ({ 
  className = '', 
  position = 'bottom-right', 
  buttonType = 'icon',
  buttonText = 'Open Terminal' 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    phone: '',
    email: '',
    message: ''
  });
  const [currentInput, setCurrentInput] = useState('');
  const [commandHistory, setCommandHistory] = useState([
    { type: 'system', content: `Last login: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}` },
    { type: 'system', content: 'Welcome to Contact Terminal v1.0.2' },
    { type: 'system', content: 'Initializing contact form sequence...' },
    { type: 'command', content: './contact-form.sh --interactive' },
    { type: 'response', content: 'Please enter your information to get in touch.' },
    { type: 'response', content: 'Type your response after each prompt and press ENTER' },
    { type: 'prompt', content: '* name:' }
  ]);
  const [formComplete, setFormComplete] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [waitingForReset, setWaitingForReset] = useState(false);
  
  const inputRef = useRef(null);
  const terminalRef = useRef(null);
  const terminalContentRef = useRef(null);
  const terminalId = useRef('contact-terminal-' + Math.random().toString(36).substr(2, 9));

  const steps = [
    { field: 'name', prompt: '* name:' },
    { field: 'subject', prompt: '* subject:' },
    { field: 'phone', prompt: '* phone:' },
    { field: 'email', prompt: '* email:' },
    { field: 'message', prompt: '* message:' }
  ];

  useEffect(() => {
    // Auto-focus the input field when terminal is opened
    if (inputRef.current && terminalOpen) {
      inputRef.current.focus();
    }
    
    // Add event listener for click outside to maintain focus
    const handleClick = () => {
      if (inputRef.current && terminalOpen) {
        setTimeout(() => {
          inputRef.current.focus();
        }, 0);
      }
    };
    
    // Add event listener for escape key to close terminal
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && terminalOpen) {
        closeTerminal();
      }
    };
    
    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [terminalOpen]);

  useEffect(() => {
    // Scroll to the bottom of the terminal when new content is added
    if (terminalContentRef.current) {
      terminalContentRef.current.scrollTop = terminalContentRef.current.scrollHeight;
    }
  }, [commandHistory]);

  // Reset the form to initial state
  const resetForm = () => {
    setCurrentStep(0);
    setFormData({
      name: '',
      subject: '',
      phone: '',
      email: '',
      message: ''
    });
    setCurrentInput('');
    setFormComplete(false);
    setWaitingForReset(false);
    
    // Reset command history
    setCommandHistory([
      { type: 'system', content: `Last login: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}` },
      { type: 'system', content: 'Welcome to Contact Terminal v1.0.2' },
      { type: 'system', content: 'Initializing contact form sequence...' },
      { type: 'command', content: './contact-form.sh --interactive' },
      { type: 'response', content: 'Please enter your information to get in touch.' },
      { type: 'response', content: 'Type your response after each prompt and press ENTER' },
      { type: 'prompt', content: '* name:' }
    ]);
  };

  // Validation functions
  const validateField = (field, value) => {
    switch (field) {
      case 'name':
        return value.trim() === '' ? 'Name cannot be empty' : null;
      case 'subject':
        return value.trim() === '' ? 'Subject cannot be empty' : null;
      case 'phone':
        const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        return !phoneRegex.test(value) ? 'Please enter a valid phone number' : null;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return !emailRegex.test(value) ? 'Please enter a valid email address' : null;
      case 'message':
        return value.trim().length < 10 ? 'Message must be at least 10 characters' : null;
      default:
        return null;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      
      // Handle reset prompt
      if (waitingForReset) {
        // Add the input to command history
        setCommandHistory(prev => [
          ...prev,
          { type: 'input', content: currentInput }
        ]);
        
        // Check if input is "reset"
        if (currentInput.trim().toLowerCase() === 'reset') {
          // Add processing message
          setCommandHistory(prev => [
            ...prev,
            { type: 'system', content: 'Resetting form...' }
          ]);
          
          // Reset form after a short delay for better UX
          setTimeout(() => {
            resetForm();
          }, 300);
        } else {
          // Show error message for invalid input
          setCommandHistory(prev => [
            ...prev,
            { type: 'system', content: 'Comando não reconhecido. Digite "reset" para preencher o formulário novamente.', error: true },
            { type: 'prompt', content: '* Digite "reset" para recomeçar:' }
          ]);
          
          // Clear current input
          setCurrentInput('');
        }
        return;
      }
      
      if (currentStep < steps.length) {
        // Validate the current input
        const currentField = steps[currentStep].field;
        const validationError = validateField(currentField, currentInput);
        
        if (validationError) {
          // Add error message to command history
          setCommandHistory(prev => [
            ...prev,
            { type: 'input', content: currentInput },
            { type: 'system', content: `Error: ${validationError}`, error: true }
          ]);
          
          // Clear current input
          setCurrentInput('');
          return;
        }
        
        // Update form data
        const updatedFormData = {
          ...formData,
          [currentField]: currentInput
        };
        setFormData(updatedFormData);
        
        // Add to command history
        setCommandHistory(prev => [
          ...prev,
          { type: 'input', content: currentInput }
        ]);
        
        // Clear current input
        setCurrentInput('');
        
        // Move to next step
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);
        
        // If there's another step, add its prompt to history
        if (nextStep < steps.length) {
          // Add a processing message for visual feedback
          setCommandHistory(prev => [
            ...prev,
            { type: 'system', content: `Processing ${steps[currentStep].field}...` }
          ]);
          
          // Simulate a small delay to make it feel more interactive
          setTimeout(() => {
            setCommandHistory(prev => [
              ...prev,
              { type: 'prompt', content: steps[nextStep].prompt }
            ]);
          }, 300);
        } else {
          // Form is complete - show processing animation immediately
          setFormComplete(true);
          
          // Add processing message
          setCommandHistory(prev => [
            ...prev,
            { type: 'system', content: 'Processing your information...' }
          ]);
          
          // Add animated loading dots
          let dots = 0;
          const loadingInterval = setInterval(() => {
            setCommandHistory(prev => {
              const newHistory = [...prev];
              newHistory[newHistory.length - 1] = { 
                type: 'system', 
                content: 'Processing your information' + '.'.repeat(dots % 4) 
              };
              return newHistory;
            });
            dots++;
          }, 300);
          
          setTimeout(() => {
            clearInterval(loadingInterval);
            setCommandHistory(prev => [
              ...prev,
              { type: 'system', content: "Oops, it's not implemented yet, check back in a few days... or weeks...", error: true },
              { type: 'system', content: "But you can contact me through the options below:" },
              { type: 'system', content: '• Email: <a href="mailto:contact@example.com" class="text-blue-400 hover:underline">contact@example.com</a>' },
              { type: 'system', content: '• WhatsApp: <a href="https://wa.me/15551234567" target="_blank" class="text-blue-400 hover:underline">+1 (555) 123-4567</a>' },
              { type: 'system', content: '• Telegram: <a href="https://t.me/username" target="_blank" class="text-blue-400 hover:underline">@username</a>' },
              { type: 'system', content: '• LinkedIn: <a href="https://linkedin.com/in/username" target="_blank" class="text-blue-400 hover:underline">linkedin.com/in/username</a>' },
              { type: 'system', content: '' },
              { type: 'prompt', content: '* Digite "reset" para preencher o formulário novamente:' }
            ]);
            
            // Set waiting for reset
            setWaitingForReset(true);
          }, 3000);
        }
      }
    }
  };

  // Close the terminal
  const closeTerminal = () => {
    setTerminalOpen(false);
    // Reset form when terminal is closed
    resetForm();
  };

  // Open the terminal
  const openTerminal = () => {
    setTerminalOpen(true);
    // Reset focus when opened
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);
  };

  // Minimize the terminal (added for compatibility with SharedTerminal)
  const minimizeTerminal = () => {
    setTerminalOpen(false);
  };

  // Render terminal content
  const renderTerminalContent = () => {
    return (
      <div ref={terminalContentRef} className="terminal-content h-full overflow-y-auto">
        {/* Command History */}
        <div className="p-2 text-left">
          {commandHistory.map((item, index) => (
            <div key={index} className="mb-0.5 text-left">
              {item.type === 'system' && (
                <p className={`${item.error ? 'text-red-400' : 'text-gray-400'} text-left`} dangerouslySetInnerHTML={{ __html: item.content }}></p>
              )}
              {item.type === 'command' && (
                <p className="text-left">
                  <span className="text-cyan-300 mr-2">$</span>
                  <span className="text-yellow-400">{item.content}</span>
                </p>
              )}
              {item.type === 'response' && (
                <p className="ml-2 text-left">{item.content}</p>
              )}
              {item.type === 'prompt' && (
                <p className="text-pink-400 text-left">{item.content}</p>
              )}
              {item.type === 'input' && (
                <p className="text-white ml-2 text-left">{item.content}</p>
              )}
              {item.type === 'json' && (
                <pre className="bg-gray-800 p-2 rounded text-cyan-200 mt-1 mb-2 overflow-x-auto text-left">
                  {item.content}
                </pre>
              )}
            </div>
          ))}
        </div>
        
        {/* Current Input Line */}
        {(currentStep < steps.length || waitingForReset) && (
          <div className="flex items-center px-2">
            <div className="flex-grow">
              <input
                ref={inputRef}
                type="text"
                name="terminal-input"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="bg-transparent border-none outline-none text-white w-full"
                autoFocus
                spellCheck="false"
                autoComplete="off"
                style={{ appearance: 'none', WebkitAppearance: 'none' }}
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`contact-terminal-widget ${className}`}>
      {/* Button */}
      {buttonType === 'icon' ? (
        <button 
          className={`bg-gray-800 text-green-400 p-3 rounded-full shadow-lg hover:bg-gray-700 transition-all`}
          onClick={openTerminal}
          aria-label="Open contact terminal"
        >
          <MessageSquare size={24} />
        </button>
      ) : (
        <button 
          className="inline-block"
          onClick={openTerminal}
          aria-label="Open contact terminal"
        >
          {buttonText}
        </button>
      )}

      {/* Terminal using SharedTerminal component */}
      <SharedTerminal
        id={terminalId.current}
        isOpen={terminalOpen}
        isMinimized={false}
        onClose={closeTerminal}
        onMinimize={minimizeTerminal}
        onRestore={() => setTerminalOpen(true)}
        terminalType="bottom"
        title="Contact Form"
        command="./contact-form.sh --interactive"
        zIndex={1000}
      >
        {renderTerminalContent()}
      </SharedTerminal>
    </div>
  );
};

export default TerminalContactForm;