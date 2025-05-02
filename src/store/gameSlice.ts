import { createSlice } from '@reduxjs/toolkit';

import { initialState } from './initialData';

// Import reducers from separate files
import { 
  feedFishReducer, 
  clearBreedingEventReducer 
} from './reducers/breedingReducers';
import { 
  gameTickReducer 
} from './reducers/gameLoopReducers';
import { 
  switchLocationReducer, 
  saveGameReducer, 
  loadGameReducer 
} from './reducers/navigationReducers';
import { 
  buyTankReducer, 
  buyLocationReducer, 
  buyUpgradeReducer 
} from './reducers/purchaseReducers';

// Create the slice
const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    // Feed fish manually (clicking)
    feedFish: feedFishReducer,
    
    // Buy a tank upgrade
    buyTank: buyTankReducer,
    
    // Buy a new location
    buyLocation: buyLocationReducer,
    
    // Switch to a different location
    switchLocation: switchLocationReducer,
    
    // Game tick (for auto-feeders and passive generation)
    gameTick: gameTickReducer,
    
    // Save game
    saveGame: saveGameReducer,
    
    // Load game (replace entire state)
    loadGame: loadGameReducer,
    
    // Clear breeding event
    clearBreedingEvent: clearBreedingEventReducer,
    
    // Buy an upgrade
    buyUpgrade: buyUpgradeReducer,
  },
});

export const { 
  feedFish, 
  buyTank, 
  buyLocation,
  switchLocation,
  gameTick, 
  saveGame, 
  loadGame,
  clearBreedingEvent,
  buyUpgrade
} = gameSlice.actions;
export default gameSlice.reducer; 