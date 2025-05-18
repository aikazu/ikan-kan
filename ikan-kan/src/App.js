import React, { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { CssBaseline } from '@mui/material';
import { loadGame } from './store/gameSlice';
import { store } from './store';
import { startGameLoop, stopGameLoop } from './game/core';
import { loadGameState, calculateOfflineProgress } from './utils/storage';
import GameScreen from './components/GameScreen';
import WaterBackground from './components/WaterBackground';

// Main App component wrapper
function App() {
  return (
    <Provider store={store}>
      <CssBaseline />
      <GameApp />
    </Provider>
  );
}

// Game App component with Redux connection
function GameApp() {
  const dispatch = useDispatch();
  
  // Initialize game when component mounts
  useEffect(() => {
    // Try to load saved game
    const savedGame = loadGameState();
    
    if (savedGame) {
      // Calculate offline progress
      const offlineProgress = calculateOfflineProgress(
        savedGame, 
        savedGame.lastActive
      );
      
      // Add offline progress to loaded game
      const gameWithProgress = {
        ...savedGame,
        fish: savedGame.fish + offlineProgress.fish,
      };
      
      // Load game state into Redux
      dispatch(loadGame(gameWithProgress));
      
      // Show offline progress notification if significant
      if (offlineProgress.fish > 0) {
        // You could add a notification system here
        console.log(`You earned ${offlineProgress.fish} fish while away!`);
      }
    }
    
    // Start game loop
    startGameLoop();
    
    // Clean up when component unmounts
    return () => {
      stopGameLoop();
    };
  }, [dispatch]);
  
  return (
    <div className="App">
      <WaterBackground />
      <GameScreen />
    </div>
  );
}

export default App;
