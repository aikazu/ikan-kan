import React from 'react';
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

const GameContainer: React.FC = () => {
  const { saveGame, resetGame, getOfflineEarnings } = useLocalStorage();
  
  // Initialize game loop with higher frame rate for more frequent updates
  useGameLoop(20);
  
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
      <OfflineEarningsModal getOfflineEarnings={getOfflineEarnings} />
      
      {/* Fish collection */}
      <FishCollection />
      
      {/* Game statistics */}
      <GameStatistics />
    </div>
  );
};

export default GameContainer; 