import { AppDispatch, RootState } from '..';
import { 
  calculateFishPointsPerSecond, 
  calculateFeederPointsPerSecond,
  shouldTriggerRandomBubble,
  calculateBreedingChance
} from './gameUpdateUtils';
import { LuckyBubbleType, cleanExpiredBubbles, triggerLuckyBubble } from '../slices/luckyBubbleSlice';
import { addFishPoints, addFish } from '../slices/tankSlice';
import { 
  updateCurrentPointsPerSecond, 
  addPlayTime,
  incrementFishBred,
  incrementFishDiscovered,
  recordNewFish
} from '../slices/statisticsSlice';
import { discoverFishType } from '../slices/fishSlice';
import { createFish, selectFishToSpawn } from '../../utils/fishUtils';
import { checkAchievements } from '../slices/achievementSlice';

// Store the last processed timestamp to avoid processing multiple times in the same millisecond
let lastProcessedTime = 0;

// Maximum allowed delta time to prevent excessive calculations after long pauses
const MAX_DELTA_TIME = 30; // seconds

/**
 * Game loop function to be called on each animation frame
 * Manages all passive game updates
 */
export function processGameLoop(
  state: RootState,
  lastUpdate: number,
  dispatch: AppDispatch
): number {
  const now = Date.now();
  
  // Safeguard against processing the same timestamp multiple times
  if (now === lastProcessedTime) {
    return now;
  }
  
  // If the state is incomplete or invalid, return early
  if (!state?.tank?.currentTank?.fish || !Array.isArray(state.tank.currentTank.fish)) {
    console.warn('Invalid game state detected in game loop');
    return now;
  }
  
  // Check if first click has been performed - don't process game loop until then
  if (!state.tank.firstClickPerformed) {
    // Just update the timestamp and return, without processing any game logic
    lastProcessedTime = now;
    return now;
  }
  
  // Calculate delta time since last update (in seconds)
  let deltaTime = (now - lastUpdate) / 1000;
  
  // Cap deltaTime to prevent excessive calculations after long browser pauses
  if (deltaTime > MAX_DELTA_TIME) {
    console.log(`Capping large time gap: ${deltaTime.toFixed(2)}s → ${MAX_DELTA_TIME}s`);
    deltaTime = MAX_DELTA_TIME;
  }
  
  // Update playtime in statistics
  dispatch(addPlayTime(deltaTime));
  
  // Clean up expired lucky bubbles
  dispatch(cleanExpiredBubbles());
  
  // Get important state for calculations
  const { 
    tank: { currentTank },
    feeder: { feeders },
    luckyBubble: { activeLuckyBubbles, lastLuckyBubbleTime },
    fish: { discoveredFishTypes }
  } = state;
  
  // Check for active 'School's In' bubble for bonus fish production
  const schoolsInBubble = activeLuckyBubbles.find(
    bubble => bubble.type === LuckyBubbleType.SCHOOLS_IN &&
    now < bubble.startTime + bubble.duration
  );
  
  // Calculate fish points per second (passive income)
  const fishPointsPerSecond = calculateFishPointsPerSecond(
    currentTank.fish, 
    !!schoolsInBubble
  );
  
  // Calculate feeder points per second (automated income)
  const feederPointsPerSecond = calculateFeederPointsPerSecond(
    feeders,
    currentTank.fish
  );
  
  // Total rate is fish points (passive) + feeder points (automation)
  const totalRate = fishPointsPerSecond + feederPointsPerSecond;
  
  // Update points based on time passed
  const pointsToAdd = totalRate * deltaTime;
  if (pointsToAdd > 0) {
    dispatch(addFishPoints(pointsToAdd));
  }
  
  // Update current points per second in statistics
  dispatch(updateCurrentPointsPerSecond(totalRate));
  
  // Check for breeding from feeders
  if (feederPointsPerSecond > 0 && currentTank.fish.length < currentTank.capacity) {
    // Check for breeding boom bubble
    const breedingBoom = activeLuckyBubbles.find(
      bubble => bubble.type === LuckyBubbleType.BREEDING_BOOM &&
      now < bubble.startTime + bubble.duration
    );
    
    // Calculate breeding chance based on feed rate
    const breedingChance = calculateBreedingChance(currentTank.fish, !!breedingBoom);
    
    // Adjust probability based on deltaTime and feeder rate to keep consistent odds
    // Higher feeder rates give better chance of breeding
    if (Math.random() < breedingChance * (feederPointsPerSecond / 10) * deltaTime) {
      // Select which fish type to spawn
      const selectedFishType = selectFishToSpawn(currentTank, discoveredFishTypes);
      
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
  
  // Try to trigger random lucky bubble
  if (shouldTriggerRandomBubble(lastLuckyBubbleTime, currentTank.fish, deltaTime)) {
    dispatch(triggerLuckyBubble({}));
  }
  
  // Check achievements (but not on every frame to avoid performance issues)
  // Check approximately once per second
  if (Math.floor(lastUpdate / 1000) !== Math.floor(now / 1000)) {
    dispatch(checkAchievements(state.statistics.statistics));
  }
  
  // Store the current time as the last processed time
  lastProcessedTime = now;
  
  return now; // Return the current timestamp for the next update
} 