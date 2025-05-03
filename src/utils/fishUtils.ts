import { v4 as uuidv4 } from 'uuid';
import { 
  Fish, 
  FishType, 
  FISH_PROPERTIES, 
  TankType, 
  FishRarity, 
  SpecialAbility,
  Tank
} from '../types/game';

/**
 * Creates a new fish with the given type and initializes its properties
 * 
 * @param fishType The type of fish to create
 * @param level Optional fish level, defaults to 1
 * @returns The newly created fish object
 */
export function createFish(fishType: FishType, level: number = 1): Fish {
  const props = FISH_PROPERTIES[fishType];
  
  return {
    id: uuidv4(),
    type: fishType,
    level,
    createdAt: Date.now(),
    rarity: props.rarity,
    pointsPerSecond: props.basePointsPerSecond * level,
    breedingRate: props.breedingRate,
    specialAbility: props.specialAbility
  };
}

/**
 * Calculate discovery chance for a new fish type based on current tank and discovered types
 * 
 * @param currentTankType The type of tank being used
 * @param discoveredTypes Array of already discovered fish types
 * @returns Map of fish types to their discovery probabilities
 */
export function calculateDiscoveryChances(
  currentTankType: TankType, 
  discoveredTypes: FishType[]
): Map<FishType, number> {
  const discoveryChances = new Map<FishType, number>();
  const tankTypeOrder = [
    TankType.FISH_BOWL,
    TankType.SMALL_AQUARIUM,
    TankType.MEDIUM_AQUARIUM,
    TankType.LARGE_AQUARIUM,
    TankType.HOME_POND,
    TankType.INDOOR_REEF
  ];
  
  // Get current tank index
  const currentTankIndex = tankTypeOrder.indexOf(currentTankType);
  
  // Go through all fish types
  Object.entries(FISH_PROPERTIES).forEach(([type, props]) => {
    const fishType = type as FishType;
    
    // Skip already discovered types
    if (discoveredTypes.includes(fishType)) {
      return;
    }
    
    // Get minimum tank type index
    const minTankIndex = tankTypeOrder.indexOf(props.minTankType);
    
    // Calculate base discovery chance based on tank difference
    let chance = 0;
    
    if (currentTankIndex >= minTankIndex) {
      // Base chance calculation
      switch (props.rarity) {
        case FishRarity.COMMON:
          chance = 0.2;
          break;
        case FishRarity.UNCOMMON:
          chance = 0.1;
          break;
        case FishRarity.RARE:
          chance = 0.05;
          break;
        case FishRarity.EPIC:
          chance = 0.02;
          break;
        case FishRarity.LEGENDARY:
          chance = 0.01;
          break;
      }
      
      // Adjust for tank level difference (better tanks = higher chance)
      chance *= (1 + (currentTankIndex - minTankIndex) * 0.5);
    }
    
    // Only add non-zero chances
    if (chance > 0) {
      discoveryChances.set(fishType, chance);
    }
  });
  
  return discoveryChances;
}

/**
 * Determine if a new fish type is discovered during breeding
 * 
 * @param currentTank Current tank information
 * @param discoveredTypes Array of already discovered fish types
 * @param discoveryBoost Discovery chance multiplier (from abilities)
 * @returns The newly discovered fish type, or null if none
 */
export function checkForNewFishDiscovery(
  currentTank: Tank,
  discoveredTypes: FishType[],
  discoveryBoost: number = 1
): FishType | null {
  // Calculate discovery chances
  const discoveryChances = calculateDiscoveryChances(
    currentTank.type,
    discoveredTypes
  );
  
  // No possible discoveries
  if (discoveryChances.size === 0) {
    return null;
  }
  
  // Apply discovery boost
  let totalChance = 0;
  const boostedChances = new Map<FishType, { min: number, max: number }>();
  
  // Calculate range for each fish type
  discoveryChances.forEach((chance, fishType) => {
    const boostedChance = chance * discoveryBoost;
    boostedChances.set(fishType, {
      min: totalChance,
      max: totalChance + boostedChance
    });
    totalChance += boostedChance;
  });
  
  // Roll for discovery
  const roll = Math.random() * totalChance;
  
  // Find which fish was discovered
  for (const [fishType, range] of boostedChances.entries()) {
    if (roll >= range.min && roll < range.max) {
      return fishType;
    }
  }
  
  return null;
}

/**
 * Calculate the total breeding rate boost from special abilities
 * 
 * @param fish Array of fish to check for breeding abilities
 * @returns Breeding rate multiplier
 */
export function calculateBreedingBoost(fish: Fish[]): number {
  let breedingBoost = 1;
  
  // Count breeding master fish
  const breedingMasters = fish.filter(
    f => f.specialAbility === SpecialAbility.BREEDING_MASTER
  );
  
  // Each breeding master adds 20% boost
  if (breedingMasters.length > 0) {
    breedingBoost += breedingMasters.length * 0.2;
  }
  
  return breedingBoost;
}

/**
 * Calculate the total feeder efficiency boost from special abilities
 * 
 * @param fish Array of fish to check for feeder abilities
 * @returns Feeder efficiency multiplier
 */
export function calculateFeederBoost(fish: Fish[]): number {
  let feederBoost = 1;
  
  // Count feeder efficiency fish
  const feederFish = fish.filter(
    f => f.specialAbility === SpecialAbility.FEEDER_EFFICIENCY
  );
  
  // Each feeder efficiency fish adds 15% boost
  if (feederFish.length > 0) {
    feederBoost += feederFish.length * 0.15;
  }
  
  return feederBoost;
}

/**
 * Calculate the total lucky bubble chance boost from special abilities
 * 
 * @param fish Array of fish to check for lucky charm abilities
 * @returns Lucky bubble chance multiplier
 */
export function calculateLuckyCharmBoost(fish: Fish[]): number {
  let luckyBoost = 1;
  
  // Count lucky charm fish
  const luckyFish = fish.filter(
    f => f.specialAbility === SpecialAbility.LUCKY_CHARM
  );
  
  // Each lucky charm fish adds 25% boost
  if (luckyFish.length > 0) {
    luckyBoost += luckyFish.length * 0.25;
  }
  
  return luckyBoost;
}

/**
 * Calculate the total feeding frenzy chance boost from special abilities
 * 
 * @param fish Array of fish to check for feeding boost abilities
 * @returns Feeding frenzy chance multiplier
 */
export function calculateFeedingBoost(fish: Fish[]): number {
  let feedingBoost = 1;
  
  // Count feeding boost fish
  const feedingFish = fish.filter(
    f => f.specialAbility === SpecialAbility.FEEDING_BOOST
  );
  
  // Each feeding boost fish adds 30% boost
  if (feedingFish.length > 0) {
    feedingBoost += feedingFish.length * 0.3;
  }
  
  return feedingBoost;
}

/**
 * Calculate the total point multiplier from special abilities
 * 
 * @param fish Array of fish to check for point multiplier abilities
 * @returns Points earned multiplier
 */
export function calculatePointMultiplier(fish: Fish[]): number {
  let pointMultiplier = 1;
  
  // Count point multiplier fish
  const multiplierFish = fish.filter(
    f => f.specialAbility === SpecialAbility.POINT_MULTIPLIER
  );
  
  // Each point multiplier fish adds 10% boost
  if (multiplierFish.length > 0) {
    pointMultiplier += multiplierFish.length * 0.1;
  }
  
  return pointMultiplier;
}

/**
 * Calculate the total discovery boost from special abilities
 * 
 * @param fish Array of fish to check for discovery boost abilities
 * @returns Discovery chance multiplier
 */
export function calculateDiscoveryBoost(fish: Fish[]): number {
  let discoveryBoost = 1;
  
  // Count discovery boost fish
  const discoveryFish = fish.filter(
    f => f.specialAbility === SpecialAbility.DISCOVERY_BOOST
  );
  
  // Each discovery boost fish adds 50% boost
  if (discoveryFish.length > 0) {
    discoveryBoost += discoveryFish.length * 0.5;
  }
  
  return discoveryBoost;
}

/**
 * Determine which fish type to spawn based on current tank and discovered types
 * 
 * @param currentTank Current tank information
 * @param discoveredTypes Array of already discovered fish types
 * @returns The fish type to spawn
 */
export function selectFishToSpawn(
  currentTank: Tank,
  discoveredTypes: FishType[]
): FishType {
  // Check if we should discover a new fish
  const discoveryBoost = calculateDiscoveryBoost(currentTank.fish);
  const newFishType = checkForNewFishDiscovery(
    currentTank,
    discoveredTypes,
    discoveryBoost
  );
  
  if (newFishType) {
    return newFishType;
  }
  
  // No new fish discovered, select from already discovered types
  // Filter fish types appropriate for current tank
  const validTypes = discoveredTypes.filter(fishType => {
    const props = FISH_PROPERTIES[fishType];
    // Only include fish that can be in the current tank type
    const tankTypeOrder = [
      TankType.FISH_BOWL,
      TankType.SMALL_AQUARIUM,
      TankType.MEDIUM_AQUARIUM,
      TankType.LARGE_AQUARIUM,
      TankType.HOME_POND,
      TankType.INDOOR_REEF
    ];
    
    const currentTankIndex = tankTypeOrder.indexOf(currentTank.type);
    const minTankIndex = tankTypeOrder.indexOf(props.minTankType);
    
    return currentTankIndex >= minTankIndex;
  });
  
  // If no valid types, default to guppy
  if (validTypes.length === 0) {
    return FishType.GUPPY;
  }
  
  // Randomly select a fish type weighted by rarity (rarer = less likely)
  const weightedTypes: Record<FishType, number> = Object.values(FishType).reduce((acc, type) => {
    acc[type] = 0;
    return acc;
  }, {} as Record<FishType, number>);
  
  validTypes.forEach(fishType => {
    const props = FISH_PROPERTIES[fishType];
    
    switch (props.rarity) {
      case FishRarity.COMMON:
        weightedTypes[fishType] = 60;
        break;
      case FishRarity.UNCOMMON:
        weightedTypes[fishType] = 30;
        break;
      case FishRarity.RARE:
        weightedTypes[fishType] = 9;
        break;
      case FishRarity.EPIC:
        weightedTypes[fishType] = 1;
        break;
      case FishRarity.LEGENDARY:
        weightedTypes[fishType] = 0.1;
        break;
    }
  });
  
  // Calculate total weight
  const totalWeight = Object.values(weightedTypes).reduce((sum, weight) => sum + weight, 0);
  
  // Roll a random number
  let roll = Math.random() * totalWeight;
  
  // Find which fish type was selected
  for (const [fishType, weight] of Object.entries(weightedTypes)) {
    roll -= weight;
    if (roll <= 0) {
      return fishType as FishType;
    }
  }
  
  // Fallback to first valid type (shouldn't happen but just in case)
  return validTypes[0];
} 