import React, { useEffect, useCallback } from 'react';
import useGameLoop from '../hooks/useGameLoop';
import useLocalStorage from '../hooks/useLocalStorage';
import FishTank from './FishTank';
import ResourcePanel from './ResourcePanel';
import LuckyBubbleIndicator from './LuckyBubbleIndicator';
import OfflineEarningsModal from './OfflineEarningsModal';
import FishCollection from './FishCollection';
import GameStatistics from './GameStatistics';
import FloatingUpgrades from './FloatingUpgrades';
import './GameContainer.css';
import { migrateGameState } from '../store/utils/migrationUtils';

const GameContainer: React.FC = () => {
  const { saveGame: saveGameOriginal, resetGame: resetGameOriginal, loadGame: loadGameOriginal, getOfflineEarnings } = useLocalStorage();
  
  // Create memoized callbacks for save, reset, and load
  const saveGame = useCallback(() => {
    saveGameOriginal();
  }, [saveGameOriginal]);
  
  const resetGame = useCallback(() => {
    resetGameOriginal();
  }, [resetGameOriginal]);
  
  const loadGame = useCallback(() => {
    loadGameOriginal();
  }, [loadGameOriginal]);
  
  // Initialize game loop with higher frame rate for more frequent updates
  useGameLoop(30);
  
  // Migration and load saved game on first mount
  useEffect(() => {
    // Try to migrate from old state format
    const migrationResult = migrateGameState();
    
    if (migrationResult) {
      console.log('Successfully migrated from old game state');
    }
    
    // Load the game (this will use migrated data if available)
    loadGame();
  }, []); // Empty dependency array since we only want to run this once on mount
  
  // Auto-save every 30 seconds
  useEffect(() => {
    const saveInterval = setInterval(() => {
      saveGame();
    }, 30000);
    
    return () => clearInterval(saveInterval);
  }, [saveGame]);
  
  return (
    <div className="game-container">
      {/* FishTank takes the full screen now */}
      <FishTank />
      
      {/* Floating panels */}
      <ResourcePanel />
      <FloatingUpgrades />
      
      <div className="game-controls">
        <button onClick={saveGame} className="control-button">
          Save Game
        </button>
        <button 
          onClick={() => {
            if (window.confirm('Are you sure you want to reset your progress?')) {
              resetGame();
            }
          }} 
          className="control-button danger"
        >
          Reset Game
        </button>
      </div>
      
      {/* Lucky bubble notifications */}
      <LuckyBubbleIndicator />
      
      {/* Offline earnings modal */}
      <OfflineEarningsModal getOfflineEarnings={getOfflineEarnings as any} />
      
      {/* Fish collection */}
      <FishCollection />
      
      {/* Game statistics */}
      <GameStatistics />
    </div>
  );
};

export default GameContainer; 