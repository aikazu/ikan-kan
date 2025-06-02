import { setGamePhase } from '../gameSlice';

const phaseUnlockMiddleware = store => next => action => {
  const result = next(action);

  // Only check for phase unlocks if an upgrade was purchased or research was completed
  if (action.type === 'game/purchaseUpgrade' || action.type === 'game/completeResearch') {
    const finalState = store.getState().game;

    // Check for Lake phase unlock
    if (finalState.phase === 'pond') {
      const fiberRodOwned = finalState.upgrades['fiber_rod']?.level >= 1;
      // Define the fish requirement directly here or import from a config if it varies
      const fishRequiredForLake = 1000; 
      const hasEnoughFish = finalState.fish >= fishRequiredForLake;
      if (fiberRodOwned && hasEnoughFish) {
        store.dispatch(setGamePhase('lake'));
        console.log("Lake phase unlocked!");
      }
    }

    // Check for Coastal Waters phase unlock
    // This can only happen if the current phase is already 'lake'
    if (finalState.phase === 'lake') {
      const smallFishingBoatOwned = finalState.upgrades['small_fishing_boat']?.level >= 1;
      const lakeEcologyStudied = finalState.researchedItems['lake_ecology_study'];
      // Define the fish requirement directly here or import from a config
      const fishRequiredForCoastal = 5000; 
      const hasEnoughFishCoastal = finalState.fish >= fishRequiredForCoastal;

      if (smallFishingBoatOwned && lakeEcologyStudied && hasEnoughFishCoastal) {
        store.dispatch(setGamePhase('coastal'));
        console.log("Coastal Waters phase unlocked!");
      }
    }
    
    // Add logic for unlocking other phases here
  }

  return result;
};

export default phaseUnlockMiddleware;
