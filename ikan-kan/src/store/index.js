import { configureStore } from '@reduxjs/toolkit';
import gameReducer, {
  setClickPower,
  setFishPerSecond,
  discoverFish,
  setGamePhase,
  addKnowledge,
  setGlobalFishValueMultiplier,
  setBonusRareFishChance
} from './gameSlice';
import { getAllUpgrades } from '../data/upgrades';
import { getAllResearchItems } from '../data/research';

// Import the new middleware files
import itemEffectMiddleware from './middleware/itemEffectMiddleware';
import statsRecalculationMiddleware from './middleware/statsRecalculationMiddleware';
import phaseUnlockMiddleware from './middleware/phaseUnlockMiddleware';

// The gameLogicMiddleware has been refactored into the three imported middleware files above.
// It is no longer needed here.

export const store = configureStore({
  reducer: {
    game: gameReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }).concat(
      itemEffectMiddleware,
      statsRecalculationMiddleware,
      phaseUnlockMiddleware
      // gameLogicMiddleware, // Removed as its logic is now in separate files
    ),
});

export default store; 