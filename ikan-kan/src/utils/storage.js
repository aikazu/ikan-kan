// Storage utility for saving and loading game state

const GAME_SAVE_KEY = 'ikan-kan-save';

/**
 * Save game state to localStorage
 * @param {Object} gameState - The current game state to save
 * @returns {boolean} Success status
 */
export const saveGameState = (gameState) => {
  try {
    const serializedState = JSON.stringify(gameState);
    localStorage.setItem(GAME_SAVE_KEY, serializedState);
    return true;
  } catch (err) {
    console.error('Failed to save game state:', err);
    return false;
  }
};

/**
 * Load game state from localStorage
 * @returns {Object|null} The loaded game state or null if not found/error
 */
export const loadGameState = () => {
  try {
    const serializedState = localStorage.getItem(GAME_SAVE_KEY);
    if (serializedState === null) {
      return null;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Failed to load game state:', err);
    return null;
  }
};

/**
 * Calculate offline progress based on time elapsed
 * @param {Object} gameState - Current game state
 * @param {string} lastActiveTimestamp - ISO string of last active time
 * @returns {Object} Resources earned while offline
 */
export const calculateOfflineProgress = (gameState, lastActiveTimestamp) => {
  if (!lastActiveTimestamp) return { fish: 0 };
  
  const now = new Date();
  const lastActive = new Date(lastActiveTimestamp);
  
  // Calculate seconds elapsed, cap at 24 hours (86400 seconds)
  const secondsElapsed = Math.min(
    (now - lastActive) / 1000,
    86400
  );
  
  // Calculate resources earned based on production rates
  const fishEarned = Math.floor(gameState.fishPerSecond * secondsElapsed);
  
  return {
    fish: fishEarned,
    secondsElapsed,
  };
};

/**
 * Clear saved game
 * @returns {boolean} Success status
 */
export const clearSavedGame = () => {
  try {
    localStorage.removeItem(GAME_SAVE_KEY);
    return true;
  } catch (err) {
    console.error('Failed to clear saved game:', err);
    return false;
  }
};

/**
 * Create a backup of the current save
 * @param {Object} gameState - The current game state
 * @returns {string} Backup code that can be used to restore
 */
export const createBackup = (gameState) => {
  try {
    const serializedState = JSON.stringify(gameState);
    const encodedState = btoa(serializedState);
    return encodedState;
  } catch (err) {
    console.error('Failed to create backup:', err);
    return null;
  }
};

/**
 * Restore from backup code
 * @param {string} backupCode - Encoded backup string
 * @returns {Object|null} The restored game state or null if invalid
 */
export const restoreFromBackup = (backupCode) => {
  try {
    const serializedState = atob(backupCode);
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Failed to restore from backup:', err);
    return null;
  }
}; 