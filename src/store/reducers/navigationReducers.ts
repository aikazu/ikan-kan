import { PayloadAction } from '@reduxjs/toolkit';

import { GameState } from '../gameModels';

// Switch to a different location
export const switchLocationReducer = (state: GameState, action: PayloadAction<string>) => {
  const locationId = action.payload;
  const location = state.locations[locationId];
  
  if (location && location.unlocked) {
    // Set the previous active location to inactive
    state.locations[state.currentLocationId].active = false;
    
    // Switch to the new location
    state.currentLocationId = locationId;
    state.locations[locationId].active = true;
    
    // Update capacity reached flag for the new location
    const currentTank = state.tanks[location.tankId];
    state.capacityReached = location.fishCount >= currentTank.capacity;
  }
};

// Save game
export const saveGameReducer = (state: GameState) => {
  state.lastSaved = Date.now();
};

// Load game (replace entire state)
export const loadGameReducer = (state: GameState, action: PayloadAction<GameState>) => {
  return action.payload;
}; 