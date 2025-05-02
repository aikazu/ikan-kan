import { GameState } from '../gameModels';
import { createRandomFish } from '../gameUtils';

// Reducer for feeding fish manually (clicking)
export const feedFishReducer = (state: GameState) => {
  state.fishPoints += state.clickPower;
  const currentLocation = state.locations[state.currentLocationId];
  
  // Reset breeding event flag
  state.breedingEvent = {
    occurred: false,
    position: null,
    timestamp: state.breedingEvent.timestamp,
    parentId: undefined,
    locationId: state.currentLocationId
  };
  
  // Get current tank capacity from the location's tank
  const currentTank = state.tanks[currentLocation.tankId];
  const tankCapacity = currentTank.capacity;
  
  // Check for breeding
  if (currentLocation.fishCount < tankCapacity) {
    const willBreed = Math.random() < state.breedingChance;
    if (willBreed) {
      // Select a random existing fish as the parent
      const parentIndex = Math.floor(Math.random() * currentLocation.fish.length);
      const parentFish = currentLocation.fish[parentIndex];
      
      // Mark parent fish as breeding temporarily (for animation)
      currentLocation.fish[parentIndex] = {
        ...parentFish,
        breeding: true
      };
      
      // Create new fish near parent fish position
      const positionVariation = 5; // %
      const newPosition = {
        x: Math.max(5, Math.min(95, parentFish.position.x + (Math.random() * 2 - 1) * positionVariation)),
        y: Math.max(5, Math.min(95, parentFish.position.y + (Math.random() * 2 - 1) * positionVariation)),
      };
      
      // Add a new fish with position near parent
      const newFishId = `fish-${Date.now()}`;
      const newFish = createRandomFish(newFishId, 'guppy', true, state.currentLocationId);
      newFish.position = newPosition;
      currentLocation.fish.push(newFish);
      currentLocation.fishCount += 1;
      state.fishCount += 1;
      
      // Set breeding event for visual effect
      state.breedingEvent = {
        occurred: true,
        position: newPosition,
        timestamp: Date.now(),
        parentId: parentFish.id,
        locationId: state.currentLocationId
      };
    }
  }
};

// Clear breeding event
export const clearBreedingEventReducer = (state: GameState) => {
  state.breedingEvent.occurred = false;
};

// Helper to check for and handle auto-breeding in gameTick
export const handleAutoBreeding = (
  state: GameState, 
  deltaTime: number
) => {
  if (state.autoFeedRate <= 0) return;

  const currentLocation = state.locations[state.currentLocationId];
  const currentTank = state.tanks[currentLocation.tankId];
  
  const feeds = Math.floor(state.autoFeedRate * deltaTime);
  if (feeds <= 0) return;

  state.fishPoints += feeds;
  
  // Check for breeding with auto-feeds (only if capacity not reached)
  if (state.capacityReached) return;

  for (let i = 0; i < feeds; i++) {
    const willBreed = Math.random() < (state.breedingChance / 2); // Half chance for auto-feeds
    if (willBreed && currentLocation.fishCount < currentTank.capacity) {
      // Select a random existing fish as the parent
      const parentIndex = Math.floor(Math.random() * currentLocation.fish.length);
      const parentFish = currentLocation.fish[parentIndex];
      
      // Mark parent fish as breeding temporarily
      currentLocation.fish[parentIndex] = {
        ...parentFish,
        breeding: true
      };
      
      // Create new fish near parent fish position
      const positionVariation = 5; // %
      const newPosition = {
        x: Math.max(5, Math.min(95, parentFish.position.x + (Math.random() * 2 - 1) * positionVariation)),
        y: Math.max(5, Math.min(95, parentFish.position.y + (Math.random() * 2 - 1) * positionVariation)),
      };
      
      // Add a new fish with random properties but near parent
      const newFishId = `fish-${Date.now()}-${i}`;
      const newFish = createRandomFish(newFishId, 'guppy', true, state.currentLocationId);
      newFish.position = newPosition;
      currentLocation.fish.push(newFish);
      currentLocation.fishCount += 1;
      state.fishCount += 1;
      
      // Set breeding event for visual effect
      state.breedingEvent = {
        occurred: true,
        position: newPosition,
        timestamp: Date.now(),
        parentId: parentFish.id,
        locationId: state.currentLocationId
      };
      
      // Check if capacity reached after adding a fish
      if (currentLocation.fishCount >= currentTank.capacity) {
        state.capacityReached = true;
        break; // Exit breeding loop if capacity reached
      }
    }
  }
}; 