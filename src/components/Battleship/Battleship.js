// src/components/Battleship/Battleship.js - Versão completa com modo de jogo
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { RefreshCw, X, Check, Terminal, Server, Database } from 'lucide-react';

import './style.css';

function Battleship({ theme = 'black', isExpanded = false }) {
  // Estados para controle de modo de jogo
  const [gameMode, setGameMode] = useState(null); // 'online' ou 'computer'
  const [modeSelectionVisible, setModeSelectionVisible] = useState(true);
  
  // Usar isExpanded para ajustar comportamentos visuais se necessário
  useEffect(() => {
    // Se o componente estiver sendo usado em modo expandido no portfólio,
    // podemos ajustar alguns comportamentos visuais específicos aqui
    if (isExpanded) {
      // Por exemplo, podemos garantir que a animação de abertura seja mais suave
      // ou ajustar tamanhos específicos para o layout expandido
    }
  }, [isExpanded]);
  
  const getThemeColors = () => {
    switch (theme) {
      case 'white':
        return {
          bg: 'bg-white',
          text: 'text-black',
          secondaryText: 'text-gray-700',
          border: 'border-gray-300',
          primaryBg: 'bg-gray-100',
          secondaryBg: 'bg-gray-200',
          cellWater: 'bg-gray-100 hover:bg-gray-200',
          cellShip: 'bg-gray-400',
          cellHit: 'bg-red-400',
          cellMiss: 'bg-blue-200',
          cellScan: 'bg-yellow-200',
          button: 'bg-gray-200 text-black hover:bg-gray-300 border border-gray-300',
          buttonSecondary: 'bg-white text-black hover:bg-gray-100 border border-gray-300',
          buttonSelected: 'bg-blue-500 text-white border border-blue-600',
          buttonDisabled: 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200',
          highlight: 'border-blue-500',
          input: 'bg-white border border-gray-300 text-black',
          card: 'bg-white border border-gray-200',
          success: 'bg-green-100 text-green-800 border border-green-200',
          error: 'bg-red-100 text-red-800 border border-red-200',
          info: 'bg-blue-100 text-blue-800 border border-blue-200',
          accent: 'text-blue-600',
          scanlines: 'terminal-scanlines-light',
          glitch: 'terminal-glitch',
        };
      case 'cyberpunk':
        return {
          bg: 'bg-purple-900',
          text: 'text-cyan-300',
          secondaryText: 'text-pink-300',
          border: 'border-pink-600',
          primaryBg: 'bg-purple-950',
          secondaryBg: 'bg-purple-800',
          cellWater: 'bg-purple-800 hover:bg-purple-700',
          cellShip: 'bg-pink-600',
          cellHit: 'bg-red-500',
          cellMiss: 'bg-cyan-900',
          cellScan: 'bg-yellow-500',
          button: 'bg-pink-900 text-cyan-300 hover:bg-pink-800 border border-pink-700',
          buttonSecondary: 'bg-purple-800 text-pink-300 hover:bg-purple-700 border border-pink-700',
          buttonSelected: 'bg-cyan-500 text-black border border-cyan-600',
          buttonDisabled: 'bg-purple-700 text-purple-400 cursor-not-allowed border border-purple-600',
          highlight: 'border-cyan-500',
          input: 'bg-purple-950 border border-pink-500 text-cyan-300',
          card: 'bg-purple-900 border border-pink-500',
          success: 'bg-purple-800 text-cyan-300 border border-cyan-700',
          error: 'bg-purple-800 text-pink-300 border border-pink-700',
          info: 'bg-purple-900 text-cyan-300 border border-cyan-700',
          accent: 'text-cyan-300',
          scanlines: 'terminal-scanlines-cyber',
          glitch: 'terminal-glitch',
        };
      case 'black':
      default:
        return {
          bg: 'bg-gray-900',             // Mais escuro, mas não preto puro
          text: 'text-gray-200',         // Texto cinza claro em vez de verde
          secondaryText: 'text-gray-400',// Texto secundário mais suave
          border: 'border-gray-700',     // Bordas mais suaves
          primaryBg: 'bg-gray-800',      // Fundo primário mais claro
          secondaryBg: 'bg-gray-700',    // Fundo secundário mais claro
          cellWater: 'bg-gray-700 hover:bg-gray-600', // Células de água mais suaves
          cellShip: 'bg-gray-500',       // Navios em cinza médio
          cellHit: 'bg-red-800',         // Hits em vermelho mais escuro
          cellMiss: 'bg-blue-900',       // Misses em azul mais escuro
          cellScan: 'bg-yellow-900',     // Scan em amarelo mais escuro
          button: 'bg-gray-700 text-gray-200 hover:bg-gray-600 border border-gray-600',
          buttonSecondary: 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700',
          buttonSelected: 'bg-blue-800 text-white border border-blue-700',
          buttonDisabled: 'bg-gray-900 text-gray-600 cursor-not-allowed border border-gray-800',
          highlight: 'border-blue-600',
          input: 'bg-gray-800 border border-gray-700 text-white',
          card: 'bg-gray-800 border border-gray-700',
          success: 'bg-gray-800 text-blue-400 border border-blue-800',
          error: 'bg-gray-800 text-red-400 border border-red-800',
          info: 'bg-gray-800 text-blue-400 border border-blue-800',
          accent: 'text-blue-400',      // Cor de destaque azul em vez de verde
          scanlines: 'terminal-scanlines-subtle', // Scanlines mais sutis
          glitch: 'terminal-glitch-subtle',      // Efeito glitch mais sutil
        };
    }
  };

  const colors = getThemeColors();
  
  // Game states
  const [gameState, setGameState] = useState('initial'); // initial, lobby, waiting, setup, playing, gameover
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [playerId, setPlayerId] = useState('');
  const [opponentId, setOpponentId] = useState('');
  const [roomId, setRoomId] = useState('');
  const [roomName, setRoomName] = useState('');
  const [waitingMessage, setWaitingMessage] = useState('Connecting to server...');
  const [disconnected, setDisconnected] = useState(false);
  const [debug, setDebug] = useState([]);  // For debugging purposes
  const [rooms, setRooms] = useState([]);
  const [newRoomName, setNewRoomName] = useState('');
  const [error, setError] = useState('');
  const [yourTurn, setYourTurn] = useState(false);
  
  // Game boards and ships
  const [boardSize, setBoardSize] = useState(10);
  const [shipsToPlace, setShipsToPlace] = useState({});
  const [yourBoard, setYourBoard] = useState([]);
  const [opponentBoard, setOpponentBoard] = useState([]);
  const [yourShips, setYourShips] = useState({});
  const [opponentShips, setOpponentShips] = useState({});
  const [selectedShip, setSelectedShip] = useState(null);
  const [shipOrientation, setShipOrientation] = useState('horizontal');
  const [shots, setShots] = useState([]);
  const [lastShotResult, setLastShotResult] = useState(null);
  
  // Special abilities
  const [abilities, setAbilities] = useState({});
  const [specialAbilities, setSpecialAbilities] = useState({});
  const [selectedAbility, setSelectedAbility] = useState(null);
  const [multiShotPositions, setMultiShotPositions] = useState([]);
  
  // UseRef to ensure we only create one connection
  const socketRef = useRef(null);
  const reconnectingRef = useRef(false);
  
  // Function to add debug messages
  const addDebug = (message) => {
    setDebug(prev => {
      const newDebug = [...prev, `${new Date().toLocaleTimeString()}: ${message}`];
      if (newDebug.length > 50) {
        return newDebug.slice(newDebug.length - 50);
      }
      return newDebug;
    });
  };

  // Function to create WebSocket connection
  const createWebSocketConnection = useCallback(() => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      addDebug("Existing WebSocket connection detected. Continuing.");
      return;
    }

    if (reconnectingRef.current) {
      addDebug("Reconnection already in progress. Standby.");
      return;
    }

    reconnectingRef.current = true;
    addDebug("Initializing WebSocket connection...");

    // SEMPRE use wss:// para conexões seguras
    // URLs diferentes dependendo do modo de jogo
    let wsUrl = 'wss://server-websockets.onrender.com';
    
    // Para desenvolvimento local
    // const wsUrl = 'ws://localhost:8080';
    
    // Se estiver no modo online, poderia usar uma URL diferente (opcional)
    if (gameMode === 'online') {
      // Versão futura: wsUrl = 'wss://multiplayer-server.onrender.com';
      addDebug('Conectando ao servidor multiplayer...');
    } else {
      addDebug('Conectando ao servidor de IA...');
    }
    
    addDebug(`Connecting to ${wsUrl}`);
    
    const newSocket = new WebSocket(wsUrl);
    socketRef.current = newSocket;
    
    newSocket.onopen = () => {
      addDebug('WebSocket connection established');
      setConnected(true);
      setDisconnected(false);
      setWaitingMessage('Loading available rooms...');
      setGameState('lobby');
      reconnectingRef.current = false;
      
      // Request room list when connected
      setTimeout(() => {
        // Adicione o modo de jogo ao solicitar salas
        sendMessageWithSocket(newSocket, { 
          type: 'get_rooms',
          gameMode: gameMode // Permite ao servidor filtrar salas pelo modo
        });
      }, 500);
    };
    
    newSocket.onclose = (event) => {
      addDebug(`WebSocket connection closed. Code: ${event.code}, Reason: ${event.reason}`);
      setConnected(false);
      setDisconnected(true);
      setWaitingMessage('Disconnected from server. Attempting reconnection...');
      socketRef.current = null;
      
      // Try to reconnect after 3 seconds
      setTimeout(() => {
        reconnectingRef.current = false;
        createWebSocketConnection();
      }, 3000);
    };
    
    newSocket.onerror = (error) => {
      addDebug(`WebSocket error: ${error.message || 'Unknown error'}`);
      setWaitingMessage('Connection error. Attempting reconnection...');
    };
    
    newSocket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        addDebug(`Message received: ${message.type}`);
        handleMessage(message);
      } catch (error) {
        addDebug(`Error processing message: ${error.message}`);
      }
    };
    
    setSocket(newSocket);
  }, [gameMode]);

  // Função para selecionar o modo de jogo
  const selectGameMode = (mode) => {
    setGameMode(mode);
    setModeSelectionVisible(false);
    
    if (mode === 'computer') {
      // Iniciar jogo contra o computador - usar lógica existente
      createWebSocketConnection();
    } else if (mode === 'online') {
      // Iniciar jogo online - conexão direta ao servidor multiplayer
      createWebSocketConnection();
      // Aqui você poderia ter uma lógica diferente para jogos online
      addDebug("Modo multiplayer iniciado - buscando oponentes");
    }
  };
  
  // Função para voltar à seleção de modo
  const backToModeSelection = () => {
    // Se o jogo já estiver em andamento, confirmar antes de sair
    if (gameState !== 'initial') {
      if (window.confirm('Sair do jogo atual e voltar à seleção de modo?')) {
        resetGame();
        setModeSelectionVisible(true);
        setGameMode(null);
      }
    } else {
      setModeSelectionVisible(true);
      setGameMode(null);
    }
  };
  
  // Função para resetar o jogo
  const resetGame = () => {
    // Resetar estados importantes
    setGameState('initial');
    setRoomId('');
    setRoomName('');
    
    // Limpar o tabuleiro, navios, etc.
    const emptyBoard = Array(boardSize).fill().map(() => Array(boardSize).fill(null));
    setYourBoard(emptyBoard);
    setOpponentBoard(emptyBoard);
    setYourShips({});
    setOpponentShips({});
    setShots([]);
    
    // Se havia conexão WebSocket, fechar
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.close();
    }
    socketRef.current = null;
  };

  // New function to start the game when the button is clicked
  const startGame = () => {
    // Ao invés de iniciar o jogo diretamente, mostrar a seleção de modo
    setModeSelectionVisible(true);
  };

  // Function to send message with a specific socket
  const sendMessageWithSocket = (socketToUse, message) => {
    if (socketToUse && socketToUse.readyState === WebSocket.OPEN) {
      addDebug(`Sending: ${message.type}`);
      socketToUse.send(JSON.stringify(message));
    } else {
      addDebug(`Error sending ${message.type}: Socket not ready`);
    }
  };

  // Function to send message
  const sendMessage = (message) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      addDebug(`Sending: ${message.type}`);
      socket.send(JSON.stringify(message));
    } else {
      addDebug(`Error sending ${message.type}: Socket not ready (${socket?.readyState})`);
      
      // Try to reconnect if not connected
      if (socket?.readyState !== WebSocket.CONNECTING && !reconnectingRef.current) {
        addDebug('Attempting reconnection...');
        createWebSocketConnection();
      }
    }
  };

  // Initialize empty boards
  useEffect(() => {
    if (boardSize > 0) {
      const emptyBoard = Array(boardSize).fill().map(() => Array(boardSize).fill(null));
      setYourBoard(emptyBoard);
      setOpponentBoard(emptyBoard);
    }
  }, [boardSize]);

  // Function to handle received messages
  const handleMessage = useCallback((message) => {
    // Clear error messages
    setError('');
    
    switch (message.type) {
      case 'connected':
        setPlayerId(message.playerId);
        addDebug(`Player ID: ${message.playerId}`);
        setGameState('lobby');
        break;
        
      case 'rooms_list':
        setRooms(message.rooms);
        addDebug(`Received ${message.rooms.length} rooms`);
        break;
        
      case 'room_created':
        setRoomId(message.roomId);
        setRoomName(message.roomName);
        setGameState('waiting');
        addDebug(`Room created: ${message.roomName} (${message.roomId})`);
        break;
        
      case 'room_joined':
        setRoomId(message.roomId);
        setRoomName(message.roomName);
        setGameState('waiting');
        addDebug(`Joined room: ${message.roomName} (${message.roomId})`);
        break;
        
      case 'error':
        setError(message.message);
        addDebug(`Error: ${message.message}`);
        break;
        
      case 'setup_phase':
        setGameState('setup');
        setShipsToPlace(message.shipsToPlace);
        setBoardSize(message.boardSize);
        
        // Reset ships and boards
        setYourShips({});
        setOpponentShips({});
        setShots([]);
        
        // Create empty boards
        const emptyBoard = Array(message.boardSize).fill().map(() => Array(message.boardSize).fill(null));
        setYourBoard(emptyBoard);
        setOpponentBoard(emptyBoard);
        
        addDebug(`Setup phase initiated. Board size: ${message.boardSize}x${message.boardSize}`);
        break;
        
      case 'ships_placed':
        addDebug(`Ships positioned successfully: ${message.message}`);
        break;
        
      case 'game_started':
        setGameState('playing');
        setYourTurn(message.yourTurn);
        setOpponentId(message.opponentId);
        setAbilities(message.abilities);
        setSpecialAbilities(message.specialAbilities);
        setSelectedAbility(null);
        addDebug(`Game started. Your turn: ${message.yourTurn}`);
        break;
        
      case 'shot_result':
        handleShotResult(message.result);
        setYourTurn(message.yourTurn);
        
        if (message.gameOver) {
          addDebug(`Game over. You won!`);
        }
        break;
        
      case 'opponent_shot':
        handleOpponentShot(message.result);
        setYourTurn(message.yourTurn);
        
        if (message.gameOver) {
          addDebug(`Game over. You lost!`);
        }
        break;
        
      case 'ability_result':
        handleAbilityResult(message.results, message.abilityType);
        setYourTurn(message.yourTurn);
        
        // If received a new ability
        if (message.newAbility) {
          const newAbilities = {...abilities};
          newAbilities[message.newAbility.type]++;
          setAbilities(newAbilities);
          addDebug(`New ability received: ${message.newAbility.name}`);
        }
        
        if (message.gameOver) {
          addDebug(`Game over. You won!`);
        }
        break;
        
      case 'opponent_ability':
        handleOpponentAbility(message.results, message.abilityType);
        setYourTurn(message.yourTurn);
        
        if (message.gameOver) {
          addDebug(`Game over. You lost!`);
        }
        break;
        
      case 'game_over':
        setGameState('gameover');
        setOpponentShips(message.opponentShips);
        addDebug(`Game over. Result: ${message.winner ? 'Victory' : 'Defeat'}`);
        break;
        
      case 'opponent_left':
        setWaitingMessage('Opponent left the room. Waiting for new player...');
        setGameState('waiting');
        addDebug('Opponent left the room');
        break;
        
      case 'room_expired':
        setError(message.message);
        setGameState('lobby');
        setRoomId('');
        setRoomName('');
        addDebug('Room expired: ' + message.message);
        break;
        
      default:
        addDebug(`Unknown message type: ${message.type}`);
    }
  }, [abilities]);

  // Function to handle shot result
  const handleShotResult = (result) => {
    setLastShotResult(result);
    
    // Update opponent's board
    setOpponentBoard(prevBoard => {
      const newBoard = [...prevBoard.map(row => [...row])];
      newBoard[result.position.y][result.position.x] = result.hit ? 'hit' : 'miss';
      return newBoard;
    });
    
    // Add to shot list
    setShots(prev => [...prev, { ...result.position, hit: result.hit, shipType: result.shipType }]);
    
    addDebug(`Shot at (${result.position.x}, ${result.position.y}): ${result.hit ? 'Hit' : 'Miss'} ${result.sunk ? `and sunk a ${result.shipType}` : ''}`);
  };
  
  // Function to handle opponent's shot
  const handleOpponentShot = (result) => {
    // Update your board
    setYourBoard(prevBoard => {
      const newBoard = [...prevBoard.map(row => [...row])];
      newBoard[result.position.y][result.position.x] = result.hit ? 'hit' : 'miss';
      return newBoard;
    });
    
    addDebug(`Opponent fired at (${result.position.x}, ${result.position.y}): ${result.hit ? 'Hit' : 'Miss'} ${result.sunk ? `and sunk a ${result.shipType}` : ''}`);
  };
  
  // Function to handle special ability result
  const handleAbilityResult = (results, abilityType) => {
    // Update opponent's board with results
    setOpponentBoard(prevBoard => {
      const newBoard = [...prevBoard.map(row => [...row])];
      
      results.forEach(result => {
        if (abilityType === 'scan') {
          newBoard[result.position.y][result.position.x] = result.hasShip ? 'scan-ship' : 'scan-empty';
        } else {
          newBoard[result.position.y][result.position.x] = result.hit ? 'hit' : 'miss';
        }
      });
      
      return newBoard;
    });
    
    // Decrement ability uses
    setAbilities(prev => ({
      ...prev,
      [abilityType]: prev[abilityType] - 1
    }));
    
    // Reset selected ability
    setSelectedAbility(null);
    setMultiShotPositions([]);
    
    addDebug(`Ability ${abilityType} used with ${results.length} results`);
  };
  
  // Function to handle opponent's special ability
  const handleOpponentAbility = (results, abilityType) => {
    // Update your board with results
    setYourBoard(prevBoard => {
      const newBoard = [...prevBoard.map(row => [...row])];
      
      results.forEach(result => {
        if (abilityType !== 'scan') {
          newBoard[result.position.y][result.position.x] = result.hit ? 'hit' : 'miss';
        }
      });
      
      return newBoard;
    });
    
    addDebug(`Opponent used ability ${abilityType}`);
  };

  // Function to create a new room
  const createRoom = () => {
    // Validate room name
    const roomName = newRoomName.trim() || `Server-${playerId.substring(0, 5)}`;
    
    sendMessage({
      type: 'create_room',
      roomName: roomName,
      gameMode: gameMode // Adicionar o modo de jogo para o servidor saber
    });
    
    addDebug(`Requesting room creation: ${roomName} (Mode: ${gameMode})`);
    setNewRoomName('');
  };

  // Function to join a room
  const joinRoom = (roomId) => {
    sendMessage({
      type: 'join_room',
      roomId: roomId
    });
    
    addDebug(`Requesting to join room: ${roomId}`);
  };

  // Function to leave current room
  const leaveRoom = () => {
    sendMessage({
      type: 'leave_room'
    });
    
    setRoomId('');
    setRoomName('');
    setGameState('lobby');
    
    addDebug('Leaving room');
  };

  // Function to refresh room list
  const refreshRooms = () => {
    sendMessage({
      type: 'get_rooms',
      gameMode: gameMode // Incluir modo para filtrar as salas
    });
    
    addDebug('Requesting room list');
  };

  // Function to place a ship on the board
  const placeShip = () => {
    if (!selectedShip) return;
    
    // Clone ships object
    const newShips = {...yourShips};
    
    // Check if we've already added this ship type before
    if (!newShips[selectedShip.type]) {
      newShips[selectedShip.type] = [];
    }
    
    // Check if we can add more ships of this type
    if (newShips[selectedShip.type].length >= selectedShip.count) {
      setError(`Already deployed all ${selectedShip.type} vessels`);
      return;
    }
    
    // Confirm that we have a starting position selected
    if (selectedShip.x === undefined || selectedShip.y === undefined) {
      setError('Select an initial position for the vessel');
      return;
    }
    
    // Calculate ship positions
    const positions = [];
    for (let i = 0; i < selectedShip.size; i++) {
      if (shipOrientation === 'horizontal') {
        if (selectedShip.x + i >= boardSize) {
          setError('Vessel does not fit on grid in this position');
          return;
        }
        positions.push({ x: selectedShip.x + i, y: selectedShip.y });
      } else {
        if (selectedShip.y + i >= boardSize) {
          setError('Vessel does not fit on grid in this position');
          return;
        }
        positions.push({ x: selectedShip.x, y: selectedShip.y + i });
      }
    }
    
    // Check for overlap with other ships
    for (const shipType in newShips) {
      for (const ship of newShips[shipType]) {
        for (const pos of ship.positions) {
          for (const newPos of positions) {
            if (pos.x === newPos.x && pos.y === newPos.y) {
              setError('Vessels cannot overlap');
              return;
            }
          }
        }
      }
    }
    
    // Add the ship
    newShips[selectedShip.type].push({ positions });
    setYourShips(newShips);
    
    // Update the board
    setYourBoard(prevBoard => {
      const newBoard = [...prevBoard.map(row => [...row])];
      positions.forEach(pos => {
        newBoard[pos.y][pos.x] = selectedShip.type;
      });
      return newBoard;
    });
    
    addDebug(`${selectedShip.type} positioned at (${selectedShip.x}, ${selectedShip.y}) - ${shipOrientation}`);
    
    // Reset selection
    setSelectedShip({...selectedShip, x: undefined, y: undefined});
  };

  // Function to select a ship type
  const selectShipType = (type, size, count) => {
    setSelectedShip({type, size, count, x: undefined, y: undefined});
    addDebug(`Ship type selected: ${type} (size: ${size})`);
  };

  // Function to rotate the ship
  const rotateShip = () => {
    setShipOrientation(prevOrientation => prevOrientation === 'horizontal' ? 'vertical' : 'horizontal');
    addDebug(`Ship orientation changed to: ${shipOrientation === 'horizontal' ? 'vertical' : 'horizontal'}`);
  };

  // Function to select initial ship position
  const selectShipPosition = (x, y) => {
    if (!selectedShip) return;
    
    setSelectedShip({...selectedShip, x, y});
    addDebug(`Initial position selected: (${x}, ${y})`);
  };

  // Function to send ship placement to server
  const confirmShipPlacement = () => {
    // Check if all ships are placed
    for (const [shipType, shipInfo] of Object.entries(shipsToPlace)) {
      if (!yourShips[shipType] || yourShips[shipType].length !== shipInfo.count) {
        setError(`All vessels must be deployed (missing: ${shipType})`);
        return;
      }
    }
    
    sendMessage({
      type: 'place_ships',
      ships: yourShips
    });
    
    addDebug('Sending ship placement to server');
  };

  // Function to fire at opponent's board
  const fireShot = (x, y) => {
    if (!yourTurn) {
      setError('Awaiting enemy action');
      return;
    }
    
    if (selectedAbility) {
      handleSpecialAbility(x, y);
      return;
    }
    
    // Check if already fired at this position
    if (opponentBoard[y][x] !== null) {
      setError('Already fired at this location');
      return;
    }
    
    sendMessage({
      type: 'fire_shot',
      position: { x, y }
    });
    
    addDebug(`Firing at (${x}, ${y})`);
  };

  // Function to select a special ability
  const selectAbility = (type) => {
    if (abilities[type] <= 0) {
      setError(`No ${type} ability charges remaining`);
      return;
    }
    
    setSelectedAbility(type);
    setMultiShotPositions([]);
    addDebug(`Ability selected: ${type}`);
  };

  // Function to handle special ability use
  const handleSpecialAbility = (x, y) => {
    if (!selectedAbility) return;
    
    switch (selectedAbility) {
      case 'scan':
        // Scan reveals a 3x3 area
        sendMessage({
          type: 'use_special',
          ability: {
            type: 'scan',
            position: { x, y }
          }
        });
        break;
        
      case 'multiShot':
        // MultiShot allows selecting 3 positions in a line
        if (multiShotPositions.length < 2) {
          // Add position to list
          setMultiShotPositions(prev => [...prev, { x, y }]);
          
          if (multiShotPositions.length === 1) {
            // Check if 3 positions are in a line
            const pos0 = multiShotPositions[0];
            
            if (pos0.x === x && Math.abs(pos0.y - y) === 1) {
              // Vertical line
              const y3 = y + (y - pos0.y);
              if (y3 >= 0 && y3 < boardSize) {
                sendMessage({
                  type: 'use_special',
                  ability: {
                    type: 'multiShot',
                    positions: [pos0, { x, y }, { x, y: y3 }]
                  }
                });
                setMultiShotPositions([]);
              } else {
                setError('Third position outside grid bounds');
              }
            } else if (pos0.y === y && Math.abs(pos0.x - x) === 1) {
              // Horizontal line
              const x3 = x + (x - pos0.x);
              if (x3 >= 0 && x3 < boardSize) {
                sendMessage({
                  type: 'use_special',
                  ability: {
                    type: 'multiShot',
                    positions: [pos0, { x, y }, { x: x3, y }]
                  }
                });
                setMultiShotPositions([]);
              } else {
                setError('Third position outside grid bounds');
              }
            } else {
              setError('Positions must be adjacent and in line');
              setMultiShotPositions([]);
            }
          }
        }
        break;
        
      case 'bomb':
        // Bomb attacks a 2x2 area
        sendMessage({
          type: 'use_special',
          ability: {
            type: 'bomb',
            position: { x, y }
          }
        });
        break;
        
      default:
        setError(`Ability ${selectedAbility} not implemented`);
    }
    
    addDebug(`Using ability ${selectedAbility} at (${x}, ${y})`);
  };

  // Function to play again
  const playAgain = () => {
    sendMessage({ 
      type: 'play_again'
    });
    
    addDebug('Requesting to play again');
  };

  // Function to force reconnection
  const forceReconnect = () => {
    addDebug('Forcing reconnection...');
    
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.close();
    }
    
    socketRef.current = null;
    reconnectingRef.current = false;
    createWebSocketConnection();
  };

  // Render a board cell with ASCII instead of background colors
  const renderCell = (board, x, y, isOpponent = false) => {
    const cellState = board[y][x];
    
    let cellClass = `w-7 h-7 border ${colors.border} flex items-center justify-center text-xs transition-all duration-200 `;
    let cellContent = '';
    
    // Base cell style - always has theme background
    cellClass += `${colors.secondaryBg} `;
    
    if (isOpponent) {
      if (cellState === 'hit') {
        cellContent = '✗'; // X mark for hit
        // Ajuste para que no tema escuro o X seja colorido em vez de usar a cor padrão de texto
        cellClass += theme === 'black' ? 'text-red-400' : `${colors.text}`;
      } else if (cellState === 'miss') {
        cellContent = '•'; // Dot for miss
        cellClass += `${colors.secondaryText}`;
      } else if (cellState === 'scan-ship') {
        // No tema escuro, use um caractere mais visível ou destaque diferente
        cellContent = theme === 'black' ? '■' : '░'; // Caractere mais sólido para tema escuro
        cellClass += `${colors.accent}`;
      } else if (cellState === 'scan-empty') {
        cellContent = '·'; // Small dot for scanned empty
        cellClass += `${colors.secondaryText}`;
      } else {
        cellContent = ' '; // Empty for unexplored
      }
      
      // Highlight last move
      if (lastShotResult && 
          lastShotResult.position.x === x && 
          lastShotResult.position.y === y) {
        cellClass += ` ring-1 ${colors.highlight}`;
      }
      
      // Cells selected for multiShot
      if (selectedAbility === 'multiShot' && 
          multiShotPositions.some(pos => pos.x === x && pos.y === y)) {
        cellClass += ` ring-1 ${colors.highlight}`;
        // Ajuste para tema escuro - use caractere mais visível
        cellContent = theme === 'black' ? '◎' : '+'; // Target marker
      }
    } else {
      if (cellState === 'hit') {
        cellContent = '✗'; // X mark for hit
        // Ajuste para que no tema escuro o X seja vermelho
        cellClass += theme === 'black' ? 'text-red-400' : 'text-red-500';
      } else if (cellState === 'miss') {
        cellContent = '•'; // Dot for miss
        cellClass += `${colors.secondaryText}`;
      } else if (cellState && cellState !== null) {
        // Use different symbols based on ship type for better visualization
        switch(cellState) {
          case 'battleship': cellContent = '■'; break;
          case 'cruiser': cellContent = '▣'; break;
          case 'destroyer': cellContent = '▢'; break;
          case 'submarine': cellContent = '▩'; break;
          case 'carrier': cellContent = '▦'; break;
          default: cellContent = '█';
        }
        // Ajuste de cores para tema escuro - use cores mais suaves
        cellClass += theme === 'black' ? 'text-gray-300' : `${colors.text}`;
      } else {
        cellContent = '·'; // Small dot for empty
        cellClass += `${colors.secondaryText}`;
      }
      
      // Highlight cells of ship being placed
      if (gameState === 'setup' && 
          selectedShip && 
          selectedShip.x !== undefined &&
          selectedShip.y !== undefined) {
        
        let isPartOfShip = false;
        
        // Check if this cell is part of the ship being placed
        for (let i = 0; i < selectedShip.size; i++) {
          if (shipOrientation === 'horizontal') {
            if (x === selectedShip.x + i && y === selectedShip.y) {
              isPartOfShip = true;
              break;
            }
          } else {
            if (x === selectedShip.x && y === selectedShip.y + i) {
              isPartOfShip = true;
              break;
            }
          }
        }
        
        if (isPartOfShip) {
          // Ajuste para tema escuro - use um caractere mais visível
          cellContent = theme === 'black' ? '■' : '#'; // Marker for ship being placed
          cellClass += ` ${colors.accent} animate-pulse`;
        }
      }
    }
    
    const handleClick = () => {
      if (isOpponent && gameState === 'playing' && yourTurn) {
        fireShot(x, y);
      } else if (!isOpponent && gameState === 'setup') {
        selectShipPosition(x, y);
      }
    };
    
    return (
      <div 
        key={`${x}-${y}`}
        className={`${cellClass} font-mono`}
        onClick={handleClick}
      >
        {cellContent}
      </div>
    );
  };

  // Render the board
  const renderBoard = (board, isOpponent = false) => {
    // Determine number of columns based on board size
    const colsClass = {
      5: 'grid-cols-5',
      6: 'grid-cols-6',
      7: 'grid-cols-7',
      8: 'grid-cols-8',
      9: 'grid-cols-9',
      10: 'grid-cols-10'
    }[boardSize] || 'grid-cols-10';
    
    return (
      <div className={`p-1 ${colors.primaryBg} rounded-sm inline-block border ${colors.border}`}>
        {/* Add column headers (A-J) */}
        <div className={`grid ${colsClass} gap-1 mb-1`}>
          {Array.from({length: boardSize}).map((_, i) => (
            <div key={`col-${i}`} className="flex items-center justify-center h-5 text-xs font-mono text-gray-500">
              {String.fromCharCode(65 + i)}
            </div>
          ))}
        </div>
        
        {/* Board with row numbers */}
        <div className="flex">
          {/* Row numbers (1-10) */}
          <div className="flex flex-col mr-1">
            {Array.from({length: boardSize}).map((_, i) => (
              <div key={`row-${i}`} className="flex items-center justify-center w-5 h-7 text-xs font-mono text-gray-500">
                {i + 1}
              </div>
            ))}
          </div>
          
          {/* The actual board grid */}
          <div className={`grid ${colsClass} gap-1`}>
            {board.map((row, y) => 
              row.map((_, x) => renderCell(board, x, y, isOpponent))
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render ship selection interface in terminal style
  const renderShipSelection = () => {
    return (
      <div className={`mt-3 ${colors.bg} p-2 rounded-sm ${colors.border} border font-mono`}>
        <div className="text-xs mb-2 flex items-center">
          <span className={`${colors.accent} mr-2`}>&#9654;</span>
          <span className={colors.text}>SELECT VESSEL FOR DEPLOYMENT:</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-2">
          {Object.entries(shipsToPlace).map(([type, info]) => {
            const placedCount = yourShips[type] ? yourShips[type].length : 0;
            const disabled = placedCount >= info.count;
            
            return (
              <button
                key={type}
                onClick={() => !disabled && selectShipType(type, info.size, info.count)}
                className={`px-2 py-1 text-xs rounded-sm transition-all font-mono border ${
                  disabled 
                    ? 'border-gray-500 text-gray-500 cursor-not-allowed'
                    : selectedShip?.type === type
                      ? `${colors.border} ${colors.accent} border-2`
                      : colors.border + ' ' + colors.text
                }`}
                disabled={disabled}
              >
                {type.toUpperCase()} [{info.size}] {placedCount}/{info.count}
              </button>
            );
          })}
        </div>
        
        <div className="flex justify-between">
          <button 
            onClick={rotateShip}
            className={`px-2 py-1 text-xs rounded-sm transition-all font-mono border ${colors.border} ${colors.text}`}
            disabled={!selectedShip}
          >
            {shipOrientation === 'horizontal' ? '[HORIZONTAL]' : '[VERTICAL]'}
          </button>
          
          {selectedShip && selectedShip.x !== undefined && (
            <button 
              onClick={placeShip}
              className={`px-2 py-1 text-xs rounded-sm transition-all font-mono border ${colors.border} ${colors.accent}`}
            >
              CONFIRM
            </button>
          )}
          
          <button 
            onClick={confirmShipPlacement}
            className={`px-2 py-1 text-xs rounded-sm transition-all font-mono border ${
              Object.keys(yourShips).length === 0 
                ? 'border-gray-500 text-gray-500 cursor-not-allowed'
                : `${colors.border} ${colors.accent}`
            }`}
            disabled={Object.keys(yourShips).length === 0}
          >
            DEPLOY FLEET
          </button>
        </div>
      </div>
    );
  };

  // Render special abilities in terminal style
  const renderAbilities = () => {
    if (!Object.keys(abilities).length) return null;
    
    return (
      <div className={`mt-2 ${colors.bg} p-2 rounded-sm border ${colors.border} font-mono`}>
        <div className="text-xs mb-2 flex items-center">
          <span className={`${colors.accent} mr-2`}>&#9654;</span>
          <span className={colors.text}>SPECIAL ABILITIES:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(abilities).map(([type, count]) => (
            <button
              key={type}
              onClick={() => count > 0 && selectAbility(type)}
              className={`px-2 py-1 text-xs rounded-sm transition-all font-mono border ${
                count <= 0 
                  ? 'border-gray-500 text-gray-500 cursor-not-allowed'
                  : selectedAbility === type
                    ? `${colors.border} ${colors.accent} border-2`
                    : colors.border + ' ' + colors.text
              }`}
              disabled={count <= 0}
              title={specialAbilities[type]?.description}
            >
              {specialAbilities[type]?.name || type.toUpperCase()} [{count}]
            </button>
          ))}
          
          {selectedAbility && (
            <button 
              onClick={() => setSelectedAbility(null)}
              className={`px-2 py-1 text-xs rounded-sm transition-all font-mono border ${colors.border} ${colors.text}`}
            >
              CANCEL
            </button>
          )}
        </div>
        
        {selectedAbility === 'multiShot' && multiShotPositions.length > 0 && (
          <div className="text-xs mt-2 font-mono">
            <span className={`${colors.accent} mr-2`}>&gt;</span>
            <span className={colors.text}>SELECT {3 - multiShotPositions.length} MORE POSITION(S) IN LINE</span>
          </div>
        )}
      </div>
    );
  };

  // New component for the initial "Want to play a game?" screen
  const renderInitialScreen = () => {
    return (
      <div className={`${colors.bg} p-4 rounded-sm border ${colors.border} ${colors.text} h-full flex flex-col items-center justify-center text-center w-full ${colors.scanlines}`}>
        <div className={`text-xl md:text-2xl font-bold mb-6 font-mono ${colors.accent}`}>
          NAVAL COMBAT SYSTEM v2.3.4
        </div>
        
        <pre className={`${colors.text} mb-6 font-mono text-xs md:text-sm`}>
{`
  ╔═══════════════════════════════════════════╗
  ║ CLASSIFIED - NAVAL INTELLIGENCE           ║
  ║ TACTICAL GRID COMBAT SIMULATION           ║
  ║                                           ║
  ║ STATUS: AWAITING AUTHORIZATION            ║
  ╚═══════════════════════════════════════════╝
`}
        </pre>
        
        <button 
          onClick={startGame}
          className={`px-4 py-2 font-mono text-base font-medium transition-all duration-300 
                    hover:scale-105 transform border-2 ${colors.border} ${colors.accent} flex items-center gap-2
                    bg-transparent`}
        >
          <Terminal size={18} />
          <span>SHALL WE PLAY A GAME?</span>
        </button>
      </div>
    );
  };

  // Render lobby area with terminal style
  const renderLobby = () => {
    return (
      <div className={`${colors.bg} p-4 rounded-sm border ${colors.border} ${colors.text} h-full overflow-y-auto w-full font-mono`}>
        {/* Cabeçalho com indicação do modo de jogo */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1">
            <Database size={16} className={colors.accent} />
            <h3 className={`text-sm font-bold ${colors.accent}`}>SERVIDORES DISPONÍVEIS</h3>
          </div>
          <div className={`text-xs py-1 px-2 border ${colors.border} ${colors.secondaryText}`}>
            {gameMode === 'online' ? 'MULTIPLAYER' : 'SINGLE PLAYER'}
          </div>
        </div>
        
        <div className={`flex items-center gap-2 mb-4 border ${colors.border} p-2 rounded-sm`}>
          <span className={`${colors.accent}`}>&gt;</span>
          <input
            type="text"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            placeholder={gameMode === 'online' ? "NOME DA SALA MULTIPLAYER" : "NOME DA SIMULAÇÃO"}
            className={`text-xs px-2 py-1 flex-grow bg-transparent border-b ${colors.border} focus:outline-none ${colors.text} font-mono uppercase`}
          />
          <button 
            onClick={createRoom}
            className={`px-3 py-1 text-xs border ${colors.border} hover:bg-opacity-20 hover:bg-gray-500 ${colors.text}`}
          >
            CRIAR
          </button>
        </div>
        
        <div className="space-y-1 mb-4 max-h-64 overflow-y-auto">
          {rooms.length === 0 ? (
            <div className={`text-xs border ${colors.border} p-2 rounded-sm text-center ${colors.text}`}>
              {gameMode === 'online' 
                ? "NENHUMA SALA MULTIPLAYER DISPONÍVEL - CRIE UMA NOVA" 
                : "NENHUMA SIMULAÇÃO DISPONÍVEL - INICIE UMA NOVA"}
            </div>
          ) : (
            rooms.map(room => (
              <div 
                key={room.id} 
                className={`border ${colors.border} p-2 rounded-sm text-xs ${room.isFull ? 'opacity-50' : ''}`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-bold">{room.name}</div>
                    <div className="text-xs flex items-center gap-1">
                      <Server size={12} />
                      <span>CONEXÕES: {room.playerCount}/2</span>
                      {/* Indicador opcional de tipo de sala para o modo online */}
                      {gameMode === 'online' && room.isRanked && (
                        <span className={`ml-2 px-1 text-[10px] ${colors.accent} border ${colors.border}`}>RANQUEADA</span>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={() => joinRoom(room.id)} 
                    disabled={room.isFull}
                    className={`px-3 py-1 text-xs border ${room.isFull ? 'border-gray-500 text-gray-500 cursor-not-allowed' : `${colors.border} ${colors.text}`}`}
                  >
                    {room.isFull ? 'CHEIA' : 'ENTRAR'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        
        <button 
          onClick={refreshRooms}
          className={`flex items-center justify-center gap-2 w-full px-3 py-1 text-xs border ${colors.border} hover:bg-opacity-20 hover:bg-gray-500 ${colors.text}`}
        >
          <RefreshCw size={12} />
          <span>ATUALIZAR LISTA DE {gameMode === 'online' ? 'SALAS' : 'SIMULAÇÕES'}</span>
        </button>
      </div>
    );
  };

  // Render waiting area
  const renderWaiting = () => {
    return (
      <div className={`${colors.bg} p-4 rounded-sm border ${colors.border} ${colors.text} h-full text-center w-full font-mono`}>
        <h3 className={`text-sm font-bold mb-3 ${colors.accent}`}>SERVER: {roomName}</h3>
        
        <div className={`border ${colors.border} p-3 rounded-sm mb-4`}>
          <div className="text-xs mb-2 animate-pulse">WAITING FOR OPPONENT CONNECTION...</div>
          <div className={`h-2 w-full ${colors.primaryBg} rounded-sm overflow-hidden border ${colors.border}`}>
            <div className={`h-full ${colors.accent} animate-pulse`} style={{
              width: '30%',
              animation: 'progressScan 3s infinite linear'
            }}></div>
          </div>
        </div>
        
        <button 
          onClick={leaveRoom}
          className={`px-3 py-1 text-xs border ${colors.border} hover:bg-opacity-20 hover:bg-gray-500 ${colors.text}`}
        >
          DISCONNECT
        </button>
        
        <style jsx>{`
          @keyframes progressScan {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
      </div>
    );
  };

  // Render setup phase
  const renderSetup = () => {
    return (
      <div className={`${colors.bg} p-4 rounded-sm border ${colors.border} ${colors.text} h-full w-full font-mono`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className={`text-xs font-bold ${colors.accent}`}>SERVER: {roomName}</h3>
          <div className="text-xs border px-2 py-1 border-green-500 text-green-500">DEPLOYMENT PHASE</div>
        </div>
        
        <div className="flex flex-col items-center">
          {renderBoard(yourBoard, false)}
          {renderShipSelection()}
        </div>
        
        <div className="flex justify-center mt-4">
          <button 
            onClick={leaveRoom}
            className={`px-3 py-1 text-xs border ${colors.border} hover:bg-opacity-20 hover:bg-gray-500 ${colors.text}`}
          >
            ABORT MISSION
          </button>
        </div>
      </div>
    );
  };

  // Render ongoing game
  const renderPlaying = () => {
    return (
      <div className={`${colors.bg} p-4 rounded-sm border ${colors.border} ${colors.text} h-full overflow-y-auto w-full font-mono`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className={`text-xs font-bold ${colors.accent}`}>SERVER: {roomName}</h3>
          <div className={`text-xs py-1 px-3 border ${yourTurn ? 'border-green-500 text-green-500' : 'border-yellow-500 text-yellow-500'}`}>
            {yourTurn ? 'AWAITING COMMAND' : 'ENEMY ACTION IN PROGRESS'}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-xs mb-2 text-center flex items-center justify-center gap-1">
              <span>FRIENDLY GRID</span>
              <span className="inline-block h-2 w-2 rounded-full bg-green-500"></span>
            </div>
            <div className="flex justify-center">
              {renderBoard(yourBoard, false)}
            </div>
          </div>
          <div>
            <div className="text-xs mb-2 text-center flex items-center justify-center gap-1">
              <span className="inline-block h-2 w-2 rounded-full bg-red-500"></span>
              <span>ENEMY GRID</span>
            </div>
            <div className="flex justify-center">
              {renderBoard(opponentBoard, true)}
            </div>
          </div>
        </div>
        
        {lastShotResult && (
          <div className={`text-xs mt-2 p-1 text-center ${colors.success}`}>
            {lastShotResult.hit 
              ? `TARGET HIT: ${lastShotResult.shipType.toUpperCase()}` + (lastShotResult.sunk ? ' - VESSEL DESTROYED' : ' - DAMAGE CONFIRMED') 
              : 'MISS REPORTED - NO DAMAGE'}
          </div>
        )}
        
        {renderAbilities()}
        
        <div className="flex justify-center mt-3">
          <button 
            onClick={leaveRoom}
            className={`px-3 py-1 text-xs border ${colors.border} hover:bg-opacity-20 hover:bg-gray-500 ${colors.text}`}
          >
            ABORT MISSION
          </button>
        </div>
      </div>
    );
  };

  // Render game over
  const renderGameOver = () => {
    return (
      <div className={`${colors.bg} p-4 rounded-sm border ${colors.border} ${colors.text} h-full overflow-y-auto w-full font-mono`}>
        <h3 className={`text-sm font-bold mb-3 text-center ${colors.accent}`}>MISSION COMPLETE</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-xs mb-2 text-center flex items-center justify-center gap-1">
              <span>FRIENDLY GRID</span>
              <span className="inline-block h-2 w-2 rounded-full bg-green-500"></span>
            </div>
            <div className="flex justify-center">
              {renderBoard(yourBoard, false)}
            </div>
          </div>
          <div>
            <div className="text-xs mb-2 text-center flex items-center justify-center gap-1">
              <span className="inline-block h-2 w-2 rounded-full bg-red-500"></span>
              <span>ENEMY GRID</span>
            </div>
            <div className="flex justify-center">
              {renderBoard(opponentBoard, true)}
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3 justify-center">
          <button 
            onClick={playAgain}
            className={`px-3 py-1 text-xs border-2 ${colors.border} ${colors.accent} hover:bg-opacity-20 hover:bg-gray-500`}
          >
            NEW MISSION
          </button>
          <button 
            onClick={leaveRoom}
            className={`px-3 py-1 text-xs border ${colors.border} hover:bg-opacity-20 hover:bg-gray-500 ${colors.text}`}
          >
            RETURN TO HQ
          </button>
        </div>
      </div>
    );
  };

  // Render message area
  const renderMessages = () => {
    if (!error && !disconnected && connected) return null;
    
    return (
      <div className="mb-4">
        {error && (
          <div className={`p-2 text-xs rounded-sm ${colors.error} flex justify-between items-center font-mono`}>
            <span>ERROR: {error}</span>
            <button onClick={() => setError('')}>
              <X size={14} />
            </button>
          </div>
        )}
        
        {disconnected && (
          <div className={`p-2 text-xs rounded-sm border ${colors.border} text-yellow-500 text-center font-mono`}>
            <div className="mb-1">CONNECTION LOST - ATTEMPTING RECONNECTION...</div>
            <button 
              onClick={forceReconnect}
              className={`px-2 py-1 text-xs border border-yellow-500 hover:bg-opacity-20 hover:bg-gray-500 text-yellow-500`}
            >
              FORCE RECONNECT
            </button>
          </div>
        )}
        
        {!connected && !disconnected && gameState !== 'initial' && (
          <div className={`p-2 text-xs rounded-sm border ${colors.border} ${colors.text} text-center font-mono animate-pulse`}>
            {waitingMessage}
          </div>
        )}
      </div>
    );
  };

  // Main render - display appropriate game state
  return (
    <div className={`${colors.bg} min-h-screen flex flex-col items-center justify-center p-4`}>
      <div className="w-full max-w-4xl">
        {/* Mensagens de erro/conexão */}
        {renderMessages()}
        
        {/* Seleção de Modo de Jogo */}
        {modeSelectionVisible && (
          <div className={`${colors.bg} flex flex-col items-center justify-center py-8 px-4`}>
            <h2 className={`text-xl md:text-2xl font-bold mb-6 ${colors.text}`}>
              NAVAL COMBAT SYSTEM v2.3.4
            </h2>
            
            <div className={`w-full max-w-md p-6 rounded-lg ${colors.primaryBg} ${colors.border} border mb-8`}>
              <div className={`mb-6 ${colors.text} text-center`}>
                <p className="mb-2 text-sm opacity-80 uppercase tracking-wider">SELECIONE O MODO DE JOGO</p>
                <div className={`h-px w-3/4 mx-auto mb-6 ${colors.border}`}></div>
              </div>
              
              <div className="flex flex-col space-y-4 mb-6">
                <button
                  onClick={() => selectGameMode('computer')}
                  className={`flex items-center justify-between px-4 py-3 rounded ${colors.secondaryBg} hover:opacity-90 transition-opacity duration-200 ${colors.border} border`}
                >
                  <div className="flex items-center">
                    <div className={`mr-3 p-2 rounded-full ${colors.secondaryBg} ${colors.border} border`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${colors.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className={`font-bold ${colors.text}`}>Jogar contra computador</p>
                      <p className={`text-xs ${colors.secondaryText}`}>Desafie a IA em uma batalha naval local</p>
                    </div>
                  </div>
                  <span className={`${colors.accent}`}>→</span>
                </button>
                
                <button
                  onClick={() => selectGameMode('online')}
                  className={`flex items-center justify-between px-4 py-3 rounded ${colors.secondaryBg} hover:opacity-90 transition-opacity duration-200 ${colors.border} border`}
                >
                  <div className="flex items-center">
                    <div className={`mr-3 p-2 rounded-full ${colors.secondaryBg} ${colors.border} border`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${colors.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className={`font-bold ${colors.text}`}>Jogar online</p>
                      <p className={`text-xs ${colors.secondaryText}`}>Encontre oponentes reais para desafiar</p>
                    </div>
                  </div>
                  <span className={`${colors.accent}`}>→</span>
                </button>
              </div>
              
              <div className={`text-xs text-center ${colors.secondaryText} mt-6`}>
                <p>Versão 2.3.4 - Sistema Atualizado</p>
                <p className="mt-1">Conexões seguras via WebSockets</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Estados do jogo - apenas visíveis quando um modo está selecionado */}
        {!modeSelectionVisible && (
          <>
            {/* Botão para voltar à seleção de modo */}
            <div className="absolute top-4 left-4 z-30">
              <button 
                onClick={backToModeSelection}
                className={`px-3 py-1 text-xs rounded ${colors.secondaryBg} ${colors.text} border ${colors.border} hover:opacity-80 transition-opacity duration-200 flex items-center`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Voltar
              </button>
            </div>
            
            {/* Indicador de modo de jogo */}
            <div className="absolute top-4 right-4 z-30">
              <div className={`px-3 py-1 text-xs rounded ${colors.primaryBg} ${colors.text} border ${colors.border} flex items-center`}>
                <span className={`inline-block w-2 h-2 rounded-full mr-2 ${gameMode === 'online' ? 'bg-green-500' : 'bg-blue-500'}`}></span>
                {gameMode === 'online' ? 'Modo Online' : 'Modo Computador'}
              </div>
            </div>
            
            {/* Telas do jogo existentes */}
            {gameState === 'initial' && renderInitialScreen()}
            {gameState === 'lobby' && renderLobby()}
            {gameState === 'waiting' && renderWaiting()}
            {gameState === 'setup' && renderSetup()}
            {gameState === 'playing' && renderPlaying()}
            {gameState === 'gameover' && renderGameOver()}
          </>
        )}
      </div>
    </div>
  );
}

export default Battleship;