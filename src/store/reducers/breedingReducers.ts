import { GameState } from '../gameModels';
import { createRandomFish } from '../gameUtils';

// Reducer for feeding fish manually (clicking)
export const feedFishReducer = (state: GameState) => {
  // Calculate FP gain based on the species of fish clicked (or average?)
  // For now, use base clickPower, but later could depend on fish
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
  if (currentLocation.fishCount < tankCapacity && currentLocation.fish.length > 0) {
    // Calculate breeding chance (base + parent species bonus)
    // Select a random potential parent
    const parentIndex = Math.floor(Math.random() * currentLocation.fish.length);
    const parentFish = currentLocation.fish[parentIndex];
    const parentSpecies = state.fishSpecies[parentFish.speciesId];
    const currentBreedingChance = state.breedingChance + (parentSpecies?.breedingBonus || 0);
    
    const willBreed = Math.random() < currentBreedingChance;
    if (willBreed) {
      
      // Mark parent fish as breeding temporarily (for animation)
      currentLocation.fish[parentIndex] = {
        ...parentFish,
        breeding: true
      };
      
      // Determine the species of the new fish (for now, same as parent)
      // TODO: Implement more complex breeding logic (e.g., weighted by rarity)
      const newSpeciesId = parentFish.speciesId;
      const newSpeciesData = state.fishSpecies[newSpeciesId];
      
      // Create new fish near parent fish position
      const positionVariation = 5; // %
      const newPosition = {
        x: Math.max(5, Math.min(95, parentFish.position.x + (Math.random() * 2 - 1) * positionVariation)),
        y: Math.max(5, Math.min(95, parentFish.position.y + (Math.random() * 2 - 1) * positionVariation)),
      };
      
      // Add a new fish with the determined species and position
      const newFishId = `fish-${Date.now()}`;
      const newFish = createRandomFish(newFishId, newSpeciesId, true, state.currentLocationId, newSpeciesData);
      newFish.position = newPosition;
      currentLocation.fish.push(newFish);
      currentLocation.fishCount += 1;
      state.fishCount += 1;
      
      // Track discovered species
      if (!state.discoveredSpecies.includes(newSpeciesId)) {
        state.discoveredSpecies.push(newSpeciesId);
        // Maybe add a notification here later
      }
      
      // Set breeding event for visual effect
      state.breedingEvent = {
        occurred: true,
        position: newPosition,
        timestamp: Date.now(),
        parentId: parentFish.id,
        locationId: state.currentLocationId
      };
      
      // Update capacity reached flag
      state.capacityReached = currentLocation.fishCount >= tankCapacity;
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

  state.fishPoints += feeds; // TODO: Base FP gain on fish species?
  
  // Check for breeding with auto-feeds (only if capacity not reached)
  if (state.capacityReached || currentLocation.fish.length === 0) return;

  for (let i = 0; i < feeds; i++) {
    // Select a random potential parent
    const parentIndex = Math.floor(Math.random() * currentLocation.fish.length);
    const parentFish = currentLocation.fish[parentIndex];
    const parentSpecies = state.fishSpecies[parentFish.speciesId];
    const currentBreedingChance = (state.breedingChance + (parentSpecies?.breedingBonus || 0)) / 2; // Half chance for auto-feeds

    const willBreed = Math.random() < currentBreedingChance;
    if (willBreed && currentLocation.fishCount < currentTank.capacity) {
      
      // Mark parent fish as breeding temporarily
      currentLocation.fish[parentIndex] = {
        ...parentFish,
        breeding: true
      };
      
      // Determine species (same as parent for now)
      const newSpeciesId = parentFish.speciesId;
      const newSpeciesData = state.fishSpecies[newSpeciesId];
      
      // Create new fish near parent fish position
      const positionVariation = 5; // %
      const newPosition = {
        x: Math.max(5, Math.min(95, parentFish.position.x + (Math.random() * 2 - 1) * positionVariation)),
        y: Math.max(5, Math.min(95, parentFish.position.y + (Math.random() * 2 - 1) * positionVariation)),
      };
      
      // Add a new fish with random properties but near parent
      const newFishId = `fish-${Date.now()}-${i}`;
      const newFish = createRandomFish(newFishId, newSpeciesId, true, state.currentLocationId, newSpeciesData);
      newFish.position = newPosition;
      currentLocation.fish.push(newFish);
      currentLocation.fishCount += 1;
      state.fishCount += 1;
      
      // Track discovered species
      if (!state.discoveredSpecies.includes(newSpeciesId)) {
        state.discoveredSpecies.push(newSpeciesId);
      }
      
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