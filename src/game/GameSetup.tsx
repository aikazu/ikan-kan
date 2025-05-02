import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadGame, gameTick } from '../store/gameSlice';
import { loadGameFromStorage, saveGameToStorage } from '../utils/gameStorage';

/**
 * Component that handles game initialization, loading saved games,
 * and setting up auto-save functionality
 */
const GameSetup: React.FC = () => {
  const dispatch = useDispatch();
  
  // Load saved game (if exists) when component mounts
  useEffect(() => {
    const savedGame = loadGameFromStorage();
    if (savedGame) {
      dispatch(loadGame(savedGame));
      console.log('Loaded saved game');
    }
    
    // Set up auto-save every 30 seconds
    const autoSaveInterval = setInterval(() => {
      // Will need to get the current state here
      // Using a thunk would be better, but for simplicity we'll handle it elsewhere
    }, 30000);
    
    return () => clearInterval(autoSaveInterval);
  }, [dispatch]);
  
  // Start the game loop
  useEffect(() => {
    const gameLoopInterval = setInterval(() => {
      dispatch(gameTick());
    }, 1000);
    
    return () => clearInterval(gameLoopInterval);
  }, [dispatch]);
  
  // This component doesn't render anything
  return null;
};

export default GameSetup; 