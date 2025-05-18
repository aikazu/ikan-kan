import { configureStore } from '@reduxjs/toolkit';
import gameReducer, { setClickPower, setFishPerSecond } from './gameSlice';

// Middleware to handle upgrade effects
const upgradeMiddleware = store => next => action => {
  // Process the action first
  const result = next(action);
  
  // Then handle any additional effects
  if (action.type === 'game/purchaseUpgrade') {
    const state = store.getState();
    const upgrades = state.game.upgrades;
    
    // Recalculate click power
    let newClickPower = 1; // Base click power
    let clickMultiplier = 1;
    
    // Recalculate fish per second
    let newFishPerSecond = 0;
    let fpsMultiplier = 1;
    
    // Apply all upgrade effects
    Object.values(upgrades).forEach(upgrade => {
      const upgradeData = require('../data/upgrades').getAllUpgrades()[upgrade.id];
      if (!upgradeData) return;
      
      const { effect } = upgradeData;
      const level = upgrade.level;
      
      if (effect.type === 'clickPower') {
        newClickPower += effect.value * level;
      } else if (effect.type === 'fishPerSecond') {
        newFishPerSecond += effect.value * level;
      } else if (effect.type === 'multiplier') {
        if (effect.target === 'clickPower') {
          clickMultiplier *= Math.pow(effect.value, level);
        } else if (effect.target === 'fishPerSecond') {
          fpsMultiplier *= Math.pow(effect.value, level);
        }
      }
      // Special effects handled elsewhere
    });
    
    // Apply multipliers
    newClickPower = Math.floor(newClickPower * clickMultiplier);
    newFishPerSecond = Math.floor(newFishPerSecond * fpsMultiplier * 10) / 10; // Round to 1 decimal
    
    // Update the state
    store.dispatch(setClickPower(newClickPower));
    store.dispatch(setFishPerSecond(newFishPerSecond));
  }
  
  return result;
};

export const store = configureStore({
  reducer: {
    game: gameReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Allows non-serializable data (for timestamps, etc.)
    }).concat(upgradeMiddleware),
});

export default store; 