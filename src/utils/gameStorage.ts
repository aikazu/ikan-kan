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
    console.log('Game saved successfully');
  } catch (error) {
    console.error('Failed to save game:', error);
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
    console.log('Game loaded successfully');
    return parsedState;
  } catch (error) {
    console.error('Failed to load game:', error);
    return null;
  }
};

/**
 * Clear saved game from local storage
 */
export const clearSavedGame = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('Saved game cleared');
  } catch (error) {
    console.error('Failed to clear saved game:', error);
  }
}; 