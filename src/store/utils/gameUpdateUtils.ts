import { Fish, Feeder } from '../../types/game';
import { 
  calculateBreedingBoost,
  calculateFeederBoost,
  calculateLuckyCharmBoost,
  calculateFeedingBoost,
  calculatePointMultiplier
} from '../../utils/fishUtils';

/**
 * Calculate the total passive points per second from fish
 * @param fish List of fish to calculate points from
 * @param schoolsInActive Whether the Schools In lucky bubble is active
 * @returns Points per second generated
 */
export function calculateFishPointsPerSecond(fish: Fish[], schoolsInActive: boolean = false): number {
  if (!Array.isArray(fish)) {
    console.warn('Invalid fish array passed to calculateFishPointsPerSecond');
    return 0;
  }
  
  let pointsPerSecond = 0;
  
  try {
    // Sum points per second from all fish
    fish.forEach(f => {
      if (f && typeof f.pointsPerSecond === 'number') {
        pointsPerSecond += f.pointsPerSecond;
      }
    });
    
    // Apply Schools In multiplier if active
    const schoolsMultiplier = schoolsInActive ? 2 : 1;
    
    // Cap at a reasonable maximum to prevent overflow
    const result = pointsPerSecond * schoolsMultiplier;
    return Math.min(result, 1_000_000); // Cap at 1M points per second
  } catch (error) {
    console.error('Error calculating fish points per second:', error);
    return 0;
  }
}

/**
 * Calculate breeding chance based on fish abilities and active bubbles
 * @param fish List of fish to get breeding boost from
 * @param breedingBoomActive Whether the Breeding Boom lucky bubble is active
 * @returns Breeding chance (0-1)
 */
export function calculateBreedingChance(fish: Fish[], breedingBoomActive: boolean = false): number {
  if (!Array.isArray(fish)) {
    console.warn('Invalid fish array passed to calculateBreedingChance');
    return 0.2; // Default base chance
  }
  
  try {
    // Apply breeding boost from special abilities
    const breedingBoost = calculateBreedingBoost(fish);
    
    // Calculate breeding chance (20% base, modified by breeding abilities and booms)
    const baseBreedingChance = 0.2 * breedingBoost;
    const breedingMultiplier = breedingBoomActive ? 5 : 1;
    
    // Skip the multiplication and min check if we're already at or above 100%
    if (baseBreedingChance >= 1.0 || (baseBreedingChance * breedingMultiplier >= 1.0)) {
      return 1.0; // 100% chance
    } else {
      return baseBreedingChance * breedingMultiplier;
    }
  } catch (error) {
    console.error('Error calculating breeding chance:', error);
    return 0.2; // Return default value on error
  }
}

/**
 * Calculate the total points earned from all feeders
 * @param feeders List of feeders
 * @param fish List of fish (for feeder efficiency calculation)
 * @returns Points per second from feeders
 */
export function calculateFeederPointsPerSecond(feeders: Feeder[], fish: Fish[]): number {
  if (!Array.isArray(feeders) || !Array.isArray(fish)) {
    console.warn('Invalid arguments passed to calculateFeederPointsPerSecond');
    return 0;
  }
  
  try {
    // Calculate feeder efficiency boost from special abilities
    const feederBoost = calculateFeederBoost(fish);
    
    // Calculate total feed rate from all feeders, enhanced by feeder efficiency and special abilities
    let baseFeederRate = 0;
    
    // Sum feedRate * efficiency for each feeder
    feeders.forEach(feeder => {
      if (feeder && typeof feeder.feedRate === 'number') {
        // Default to 1.0 efficiency for backward compatibility with saved games
        const feederEfficiency = (feeder.efficiency || 1.0);
        baseFeederRate += feeder.feedRate * feederEfficiency;
      }
    });
    
    // Cap the result to prevent excessive values
    const result = baseFeederRate * feederBoost;
    return Math.min(result, 5_000_000); // Cap at 5M points per second
  } catch (error) {
    console.error('Error calculating feeder points per second:', error);
    return 0;
  }
}

/**
 * Check if we should trigger a lucky bubble based on time and chance
 * @param lastBubbleTime Timestamp of the last lucky bubble
 * @param fish List of fish (for lucky bubble chance calculation)
 * @param deltaTime Time passed since last update in seconds
 * @returns True if a bubble should be triggered
 */
export function shouldTriggerRandomBubble(
  lastBubbleTime: number, 
  fish: Fish[], 
  deltaTime: number
): boolean {
  if (!Array.isArray(fish) || !lastBubbleTime || typeof deltaTime !== 'number') {
    return false;
  }
  
  try {
    const now = Date.now();
    
    // Apply lucky charm boost from special abilities
    const luckyBoost = calculateLuckyCharmBoost(fish);
    
    // Try to trigger random lucky bubble (0.5% chance per second, minimum 30 seconds between bubbles)
    // Adjust probability based on deltaTime for consistent odds regardless of frame rate
    // Cap deltaTime to prevent excessive probability
    const cappedDeltaTime = Math.min(deltaTime, 10);
    
    return (
      now - lastBubbleTime > 30000 && // 30 seconds minimum between bubbles
      Math.random() < 0.005 * luckyBoost * cappedDeltaTime // 0.5% chance per second, adjusted for frame time
    );
  } catch (error) {
    console.error('Error checking for random bubble:', error);
    return false;
  }
}

/**
 * Check if we should trigger a feeding frenzy bubble when feeding
 * @param lastBubbleTime Timestamp of the last lucky bubble
 * @param fish List of fish (for feeding boost calculation)
 * @returns True if a bubble should be triggered
 */
export function shouldTriggerFeedingBubble(lastBubbleTime: number, fish: Fish[]): boolean {
  if (!Array.isArray(fish) || !lastBubbleTime) {
    return false;
  }
  
  try {
    const now = Date.now();
    
    // Apply feeding boost from special abilities for Lucky Bubble chance
    const feedingBoost = calculateFeedingBoost(fish);
    
    // Try to trigger a lucky bubble (5% chance per click, min 30 seconds between bubbles)
    return (
      now - lastBubbleTime > 30000 && // 30 seconds minimum between bubbles
      Math.random() < 0.05 * feedingBoost // 5% chance per click, boosted by feeding abilities
    );
  } catch (error) {
    console.error('Error checking for feeding bubble:', error);
    return false;
  }
}

/**
 * Calculate points earned from a click, considering modifiers
 * @param fish List of fish (for point multiplier calculation)
 * @param feedingFrenzyActive Whether the Feeding Frenzy lucky bubble is active
 * @returns Points earned from the click
 */
export function calculateClickPoints(fish: Fish[], feedingFrenzyActive: boolean = false): number {
  if (!Array.isArray(fish)) {
    console.warn('Invalid fish array passed to calculateClickPoints');
    return 2; // Default points per click
  }
  
  try {
    // Calculate point multiplier from special abilities
    const pointMultiplier = calculatePointMultiplier(fish);
    
    // Each click earns 2 FP, modified by point multiplier and feeding frenzy
    const basePoints = 2 * pointMultiplier;
    const frenzyMultiplier = feedingFrenzyActive ? 5 : 1;
    
    // Cap to prevent excessive values
    return Math.min(basePoints * frenzyMultiplier, 1000); // Cap at 1000 points per click
  } catch (error) {
    console.error('Error calculating click points:', error);
    return 2; // Return default value on error
  }
} 