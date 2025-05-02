import { GameState } from '../gameModels';
import { updateFishPositions } from '../gameUtils';
import { handleAutoBreeding } from './breedingReducers';

// Game tick (for auto-feeders and passive generation)
export const gameTickReducer = (state: GameState) => {
  const now = Date.now();
  const deltaTime = (now - state.lastTick) / 1000; // in seconds
  
  // Update for each location
  Object.keys(state.locations).forEach(locationId => {
    const location = state.locations[locationId];
    if (!location.unlocked) return;
    
    const currentTank = state.tanks[location.tankId];
    
    // Update capacity reached flag for current location
    if (locationId === state.currentLocationId) {
      state.capacityReached = location.fishCount >= currentTank.capacity;
    }
    
    // Reset breeding flags on all fish after 1 second
    location.fish = location.fish.map(fish => ({
      ...fish,
      breeding: fish.breeding && (now - state.breedingEvent.timestamp < 1000)
    }));
    
    // Update fish positions for this location
    location.fish = updateFishPositions(location.fish, deltaTime * 1000);
    
    // Passive generation from fish in this location
    const passiveGeneration = location.fishCount * 0.1 * deltaTime; // Each fish generates 0.1 FP per second
    state.fishPoints += passiveGeneration;
  });
  
  // Clear old breeding event after 1 second
  if (state.breedingEvent.occurred && now - state.breedingEvent.timestamp > 1000) {
    state.breedingEvent.occurred = false;
    state.breedingEvent.parentId = undefined;
  }
  
  // Handle auto-feeding and potential breeding
  handleAutoBreeding(state, deltaTime);
  
  state.lastTick = now;
}; 