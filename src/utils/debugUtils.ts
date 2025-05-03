/**
 * Debug utilities for Ikan-kan
 * These are helper functions that can be called from the browser console
 * to fix common issues or debug game state
 */

import { store } from '../store';
import { purchaseFeeder } from '../store/gameSlice';

/**
 * Helper function to fix auto-feed level if stuck
 * Call from browser console using: window.ikankanDebug.fixAutoFeedLevel()
 */
export const fixAutoFeedLevel = () => {
  try {
    const state = store.getState().game;
    
    if (state.feeders.length === 0) {
      console.log('No feeders found. You need to purchase your first auto-feeder.');
      return false;
    }
    
    // Calculate actual level based on feed rate
    const feeder = state.feeders[0];
    const feedRate = feeder.feedRate;
    const calculatedLevel = Math.max(1, Math.round(Math.log2(feedRate / 4) + 1));
    
    console.log(`Current feed rate: ${feedRate}`);
    console.log(`Calculated level based on feed rate: ${calculatedLevel}`);
    console.log(`Current speedLevel: ${feeder.speedLevel}`);
    
    // Force-replace the feeder with a corrected one to fix level problems
    store.dispatch(purchaseFeeder(feeder.type));
    
    // Get the updated state
    const updatedState = store.getState().game;
    const updatedFeeder = updatedState.feeders[0];
    const newCalculatedLevel = Math.max(1, Math.round(Math.log2(updatedFeeder.feedRate / 4) + 1));
    
    console.log(`Fixed! New feed rate: ${updatedFeeder.feedRate}`);
    console.log(`New calculated level: ${newCalculatedLevel}`);
    console.log(`New speedLevel: ${updatedFeeder.speedLevel}`);
    
    return true;
  } catch (error) {
    console.error('Error fixing auto-feed level:', error);
    return false;
  }
};

// Expose debug functions to the window object
if (typeof window !== 'undefined') {
  window.ikankanDebug = {
    fixAutoFeedLevel
  };
}

// Add type definition for window
declare global {
  interface Window {
    ikankanDebug: {
      fixAutoFeedLevel: () => boolean;
    };
  }
} 