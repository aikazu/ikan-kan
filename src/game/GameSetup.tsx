import React, { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../store';
import { loadGame, gameTick, saveGame } from '../store/gameSlice';
import { loadGameFromStorage, saveGameToStorage } from '../utils/gameStorage';

/**
 * Component that handles game initialization, loading saved games,
 * and setting up auto-save functionality
 */
const GameSetup: React.FC = () => {
  const dispatch = useDispatch();
  const gameState = useSelector((state: RootState) => state.game);
  
  // Load saved game (if exists) when component mounts
  useEffect(() => {
    const savedGame = loadGameFromStorage();
    if (savedGame) {
      dispatch(loadGame(savedGame));
    }
    
    // Set up auto-save every 30 seconds
    const autoSaveInterval = setInterval(() => {
      saveGameToStorage(gameState);
      dispatch(saveGame());
    }, 30000);
    
    return () => clearInterval(autoSaveInterval);
  }, [dispatch, gameState]);
  
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