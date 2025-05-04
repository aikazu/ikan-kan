import { AppDispatch, RootState } from '..';
// Tank and fish slice imports
import { addFishPoints, spendFishPoints, upgradeTank, addFish, setFirstClickPerformed } from '../slices/tankSlice';
import { discoverFishType } from '../slices/fishSlice';
// Other slice imports
import { purchaseFeeder, calculateFeederLevel } from '../slices/feederSlice';
import { triggerLuckyBubble, LuckyBubbleType } from '../slices/luckyBubbleSlice';
import { incrementUpgradesPurchased, incrementFeedersPurchased, incrementClicks, incrementFishBred, incrementFishDiscovered, recordNewFish } from '../slices/statisticsSlice';
import { checkAchievements } from '../slices/achievementSlice';
// Type imports
import { FeederType, TankType } from '../../types/game';
// Utility imports
import { TANK_COSTS, AUTO_FEED_LEVEL_COSTS } from './gameConstants';
import { createFish, selectFishToSpawn } from '../../utils/fishUtils';
import { calculateBreedingChance, calculateClickPoints, shouldTriggerFeedingBubble } from './gameUpdateUtils';

/**
 * Handle purchasing a tank upgrade
 */
export const purchaseTankUpgrade = (
  tankType: TankType,
  currentFishPoints: number,
  dispatch: AppDispatch
) => {
  const cost = TANK_COSTS[tankType];
  
  if (currentFishPoints >= cost) {
    // Purchase the tank
    dispatch(upgradeTank(tankType));
    dispatch(spendFishPoints(cost));
    
    // Update statistics
    dispatch(incrementUpgradesPurchased());
    
    return true;
  }
  
  return false;
};

/**
 * Handle purchasing or upgrading an auto-feeder
 */
export const purchaseAutoFeeder = (
  feederType: FeederType,
  currentFishPoints: number,
  feeders: Array<any>,
  dispatch: AppDispatch
) => {
  // Calculate the current level based on existing feeder rates
  const currentLevel = calculateFeederLevel(feeders);
  
  // If maxed out at level 20, do nothing
  if (currentLevel >= 20) return false;
  
  const cost = AUTO_FEED_LEVEL_COSTS[currentLevel];
  
  if (currentFishPoints >= cost) {
    // Purchase the feeder
    dispatch(purchaseFeeder({ feederType, currentLevel }));
    dispatch(spendFishPoints(cost));
    
    // Update statistics
    dispatch(incrementFeedersPurchased());
    
    return {
      success: true,
      newLevel: currentLevel + 1,
      newRate: 4 * Math.pow(2, currentLevel) // 4, 8, 16, 32, etc.
    };
  }
  
  return { success: false };
};

/**
 * Simplified feedFish action that works with the new store structure
 */
export const feedFish = () => {
  return (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    const fish = state.tank.currentTank.fish;
    const tankCapacity = state.tank.currentTank.capacity;
    const currentFishCount = fish.length;
    const discoveredFishTypes = state.fish.discoveredFishTypes;
    const lastBubbleTime = state.luckyBubble.lastLuckyBubbleTime;
    const activeBubbles = state.luckyBubble.activeLuckyBubbles;
    const firstClickPerformed = state.tank.firstClickPerformed;
    
    // If this is the first click, mark it to start calculations
    if (!firstClickPerformed) {
      dispatch(setFirstClickPerformed());
    }
    
    // Increment click counter
    dispatch(incrementClicks());
    
    // Check for active feeding frenzy bubble
    const feedingFrenzy = activeBubbles.find(
      bubble => bubble.type === LuckyBubbleType.FEEDING_FRENZY && 
      Date.now() < bubble.startTime + bubble.duration
    );
    
    // Calculate points from this click
    const pointsEarned = calculateClickPoints(fish, !!feedingFrenzy);
    
    // Add the points to the tank
    dispatch(addFishPoints(pointsEarned));
    
    // Check if breeding happens
    if (currentFishCount < tankCapacity) {
      // Check for breeding boom bubble
      const breedingBoom = activeBubbles.find(
        bubble => bubble.type === LuckyBubbleType.BREEDING_BOOM && 
        Date.now() < bubble.startTime + bubble.duration
      );
      
      // Calculate breeding chance
      const breedingChance = calculateBreedingChance(fish, !!breedingBoom);
      
      if (Math.random() < breedingChance) {
        // Select which fish type to spawn
        const selectedFishType = selectFishToSpawn(state.tank.currentTank, discoveredFishTypes);
        
        // Check if this is a new discovery
        const isNewDiscovery = !discoveredFishTypes.includes(selectedFishType);
        if (isNewDiscovery) {
          dispatch(discoverFishType(selectedFishType));
          dispatch(incrementFishDiscovered());
        }
        
        // Create and add the new fish
        const newFish = createFish(selectedFishType);
        dispatch(addFish(newFish));
        
        // Update statistics
        dispatch(incrementFishBred());
        dispatch(recordNewFish(newFish));
      }
    }
    
    // Check for lucky bubble
    if (shouldTriggerFeedingBubble(lastBubbleTime, fish)) {
      dispatch(triggerLuckyBubble({})); // Random bubble type
    }
    
    // Check achievements
    dispatch(checkAchievements(state.statistics.statistics));
    
    return { pointsEarned };
  };
}; 