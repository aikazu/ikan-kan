// Core game engine

import { store } from '../store';
import {
  addFishPassive,
  saveGame,
  updateLastActive,
} from '../store/gameSlice';
import { saveGameState } from '../utils/storage';

// Configuration
const TICK_INTERVAL = 1000; // 1 second
const AUTO_SAVE_INTERVAL = 60000; // 1 minute

let tickInterval = null;
let saveInterval = null;

/**
 * Start the game loop
 */
export const startGameLoop = () => {
  if (tickInterval) {
    clearInterval(tickInterval);
  }
  
  if (saveInterval) {
    clearInterval(saveInterval);
  }
  
  // Game tick - handles passive resource generation
  tickInterval = setInterval(() => {
    const state = store.getState().game;
    
    // Add passive fish income
    if (state.fishPerSecond > 0) {
      store.dispatch(addFishPassive(state.fishPerSecond));
    }
    
    // Other periodic calculations would go here
    
    // Update last active timestamp
    store.dispatch(updateLastActive());
  }, TICK_INTERVAL);
  
  // Auto-save interval
  saveInterval = setInterval(() => {
    const state = store.getState().game;
    store.dispatch(saveGame());
    saveGameState(state);
  }, AUTO_SAVE_INTERVAL);
  
  return {
    tickInterval,
    saveInterval,
  };
};

/**
 * Stop the game loop
 */
export const stopGameLoop = () => {
  if (tickInterval) {
    clearInterval(tickInterval);
    tickInterval = null;
  }
  
  if (saveInterval) {
    clearInterval(saveInterval);
    saveInterval = null;
  }
  
  // Save one last time
  const state = store.getState().game;
  store.dispatch(saveGame());
  saveGameState(state);
};

/**
 * Calculate the cost of an upgrade at a specific level
 * @param {number} basePrice - The base price of the upgrade
 * @param {number} level - The current level
 * @param {number} growthRate - Price increase per level (default 1.15)
 * @returns {number} The calculated price
 */
export const calculateUpgradePrice = (basePrice, level, growthRate = 1.15) => {
  return Math.floor(basePrice * Math.pow(growthRate, level));
};

/**
 * Format a large number for display
 * @param {number} num - The number to format
 * @returns {string} Formatted number
 */
export const formatNumber = (num) => {
  if (num === undefined || num === null) return '0';
  
  if (num < 1000) {
    return num.toFixed(0);
  }
  
  const units = ['K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];
  
  const order = Math.floor(Math.log10(num) / 3);
  if (order > units.length) {
    return num.toExponential(2);
  }
  
  const unitValue = num / Math.pow(10, order * 3);
  if (order > 0) {
    return `${unitValue.toFixed(2)}${units[order - 1]}`;
  }
  
  return num.toFixed(0);
};

/**
 * Format time duration for display
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time string
 */
export const formatTime = (seconds) => {
  if (seconds < 60) {
    return `${Math.floor(seconds)} seconds`;
  }
  
  if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  }
  
  if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minute${minutes > 1 ? 's' : ''}`;
  }
  
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  return `${days} day${days > 1 ? 's' : ''} ${hours} hour${hours > 1 ? 's' : ''}`;
}; 