// Local imports
import { logInfo, logError } from './logging';
import { GameState } from '../store/gameModels';

// Local storage key
const STORAGE_KEY = 'fish-empire-save';

/**
 * Save game state to local storage
 */
export const saveGameToStorage = (state: GameState): void => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serializedState);
    logInfo('Game saved successfully');
  } catch (error) {
    logError('Failed to save game:', error);
  }
};

/**
 * Load game state from local storage
 */
export const loadGameFromStorage = (): GameState | null => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (!serializedState) return null;
    
    const parsedState = JSON.parse(serializedState) as GameState;
    logInfo('Game loaded successfully');
    return parsedState;
  } catch (error) {
    logError('Failed to load game:', error);
    return null;
  }
};

/**
 * Clear saved game from local storage
 */
export const clearSavedGame = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    logInfo('Saved game cleared');
  } catch (error) {
    logError('Failed to clear saved game:', error);
  }
}; 