import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { useRef } from 'react';
import { updateFishState } from '../store/slices/fishSlice';
import { updateTankState } from '../store/slices/tankSlice';
import { updateFeederState } from '../store/slices/feederSlice';
import { updateLuckyBubbleState } from '../store/slices/luckyBubbleSlice';
import { updateStatisticsState } from '../store/slices/statisticsSlice';
import { updateAchievementState } from '../store/slices/achievementSlice';
import { addOfflineEarnings } from '../store/slices/statisticsSlice';
import { addFishPoints } from '../store/slices/tankSlice';
import { calculateFishPointsPerSecond, calculateFeederPointsPerSecond } from '../store/utils/gameUpdateUtils';
import { formatNumber } from '../utils/numberUtils';

export interface OfflineEarnings {
  totalEarnings: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface OfflineEarningsData {
  points: string;
  timeDiff: string;
  newFish: number;
  wasLongOffline: boolean;
}

const STORAGE_KEY = 'ikankan_save';

const useLocalStorage = () => {
  const dispatch = useDispatch();
  const state = useSelector((state: RootState) => state);
  // Use a ref to track if we've already loaded the game to prevent infinite loops
  const isGameLoaded = useRef(false);
  
  // Save game state to localStorage
  const saveGame = () => {
    try {
      const gameState = {
        fish: state.fish,
        tank: state.tank,
        feeder: state.feeder,
        luckyBubble: state.luckyBubble,
        statistics: state.statistics,
        achievement: state.achievement,
        savedAt: Date.now()
      };
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
      console.log('Game saved successfully');
      return true;
    } catch (error) {
      console.error('Error saving game:', error);
      return false;
    }
  };
  
  // Load game state from localStorage
  const loadGame = () => {
    try {
      // Check if we've already loaded the game to prevent infinite updates
      if (isGameLoaded.current) {
        return true;
      }
      
      const savedData = localStorage.getItem(STORAGE_KEY);
      
      if (!savedData) {
        console.log('No saved game found');
        isGameLoaded.current = true;
        return false;
      }
      
      const parsedData = JSON.parse(savedData);
      
      // Update each slice with its saved state
      if (parsedData.fish) dispatch(updateFishState(parsedData.fish));
      if (parsedData.tank) dispatch(updateTankState(parsedData.tank));
      if (parsedData.feeder) dispatch(updateFeederState(parsedData.feeder));
      if (parsedData.luckyBubble) dispatch(updateLuckyBubbleState(parsedData.luckyBubble));
      if (parsedData.statistics) dispatch(updateStatisticsState(parsedData.statistics));
      if (parsedData.achievement) dispatch(updateAchievementState(parsedData.achievement));
      
      console.log('Game loaded successfully');
      isGameLoaded.current = true;
      return true;
    } catch (error) {
      console.error('Error loading game:', error);
      isGameLoaded.current = true;
      return false;
    }
  };
  
  // Reset game state
  const resetGame = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      isGameLoaded.current = false;
      window.location.reload();
      return true;
    } catch (error) {
      console.error('Error resetting game:', error);
      return false;
    }
  };
  
  // Calculate offline earnings
  const getOfflineEarnings = (): OfflineEarningsData | null => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      
      if (!savedData) {
        return null;
      }
      
      const parsedData = JSON.parse(savedData);
      const now = Date.now();
      const lastSaved = parsedData.savedAt || now;
      
      // Calculate time difference in seconds
      const timeDiffSeconds = Math.floor((now - lastSaved) / 1000);
      
      // If less than 60 seconds, don't give offline earnings
      if (timeDiffSeconds < 60) {
        return null;
      }
      
      // Cap offline earnings at 24 hours
      const cappedSeconds = Math.min(timeDiffSeconds, 24 * 60 * 60);
      const wasLongOffline = timeDiffSeconds > 8 * 60 * 60;
      
      // For display purposes
      const hours = Math.floor(cappedSeconds / 3600);
      const minutes = Math.floor((cappedSeconds % 3600) / 60);
      const seconds = cappedSeconds % 60;
      
      // Create time diff string
      let timeDiff = '';
      if (hours > 0) {
        timeDiff += `${hours}h `;
      }
      if (minutes > 0 || hours > 0) {
        timeDiff += `${minutes}m `;
      }
      timeDiff += `${seconds}s`;
      
      // Calculate earnings rate from saved state
      const savedState = parsedData;
      
      const fishPointsPerSecond = calculateFishPointsPerSecond(
        savedState.tank.currentTank.fish
      );
      
      const feederPointsPerSecond = calculateFeederPointsPerSecond(
        savedState.feeder.feeders,
        savedState.tank.currentTank.fish
      );
      
      // Total earnings rate per second
      const ratePerSecond = fishPointsPerSecond + feederPointsPerSecond;
      
      // Apply 50% efficiency for offline earnings
      const offlineEfficiency = 0.5;
      
      // Calculate total earnings
      const totalEarnings = Math.floor(ratePerSecond * cappedSeconds * offlineEfficiency);
      
      // Update game state with earnings
      if (totalEarnings > 0) {
        dispatch(addFishPoints(totalEarnings));
        dispatch(addOfflineEarnings(totalEarnings));
      }
      
      return {
        points: formatNumber(totalEarnings),
        timeDiff,
        newFish: 0, // Simplified for now - would need to track new fish spawns
        wasLongOffline
      };
    } catch (error) {
      console.error('Error calculating offline earnings:', error);
      return null;
    }
  };
  
  return {
    saveGame,
    loadGame,
    resetGame,
    getOfflineEarnings
  };
};

export default useLocalStorage; 