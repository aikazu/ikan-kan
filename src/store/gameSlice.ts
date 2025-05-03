import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { FishType, TankType, GameState, Fish, Feeder, FeederType, FishRarity, Statistics, Achievement, AutoFeederSpeed } from '../types/game';
import { 
  createFish, 
  selectFishToSpawn, 
  calculateBreedingBoost,
  calculateFeederBoost,
  calculateLuckyCharmBoost,
  calculateFeedingBoost,
  calculatePointMultiplier
} from '../utils/fishUtils';
import { createAchievements, checkAchievementCompletion } from '../utils/achievementUtils';

// Define Lucky Bubble types and effects
export enum LuckyBubbleType {
  FEEDING_FRENZY = 'feedingFrenzy',
  BREEDING_BOOM = 'breedingBoom',
  FISH_SHOWER = 'fishShower',
  SCHOOLS_IN = 'schoolsIn',
  VISITOR_RUSH = 'visitorRush',
}

export interface LuckyBubble {
  id: string;
  type: LuckyBubbleType;
  startTime: number;
  duration: number; // in milliseconds
}

// Initialize empty statistics object
const initialStatistics: Statistics = {
  totalClicks: 0,
  totalFishBred: 0,
  totalFishDiscovered: 0,
  totalLuckyBubbles: 0,
  totalOfflineEarnings: 0,
  totalActiveBubbleTime: 0,
  highestPointsPerSecond: 0,
  currentPointsPerSecond: 0,
  totalUpgradesPurchased: 0,
  totalFeedersPurchased: 0,
  totalAchievementsCompleted: 0,
  totalFishPointsEarned: 0,
  playTime: 0,
  fishByType: Object.values(FishType).reduce((acc, type) => {
    acc[type] = 0;
    return acc;
  }, {} as Record<FishType, number>),
  fishByRarity: Object.values(FishRarity).reduce((acc, rarity) => {
    acc[rarity] = 0;
    return acc;
  }, {} as Record<FishRarity, number>),
  startDate: Date.now(),
  lastSessionDate: Date.now()
};

export const initialState: GameState = {
  fishPoints: 0,
  totalFishPointsEarned: 0,
  currentTank: {
    id: uuidv4(),
    type: TankType.FISH_BOWL,
    capacity: 5,
    fish: [
      createFish(FishType.GUPPY)
    ],
  },
  feeders: [],
  lastSavedAt: Date.now(),
  lastFeedTime: Date.now(),
  discoveredFishTypes: [FishType.GUPPY],
  activeLuckyBubbles: [],
  lastLuckyBubbleTime: Date.now(),
  statistics: initialStatistics,
  achievements: createAchievements(),
  recentlyCompletedAchievements: []
};

// Helper function to update fish count statistics
const updateFishCountStats = (statistics: Statistics, fish: Fish) => {
  // Increment count by fish type
  statistics.fishByType[fish.type] = (statistics.fishByType[fish.type] || 0) + 1;
  
  // Increment count by fish rarity
  statistics.fishByRarity[fish.rarity] = (statistics.fishByRarity[fish.rarity] || 0) + 1;
  
  return statistics;
};

// Helper function to check all achievements and return newly completed ones
const checkAchievements = (state: GameState): Achievement[] => {
  const newlyCompleted: Achievement[] = [];
  
  state.achievements.forEach(achievement => {
    if (!achievement.completed && checkAchievementCompletion(achievement, state.statistics)) {
      // Mark as completed
      achievement.completed = true;
      achievement.completedAt = Date.now();
      
      // Add to newly completed list
      newlyCompleted.push(achievement);
      
      // Award points for completing the achievement
      state.fishPoints += achievement.reward;
      state.totalFishPointsEarned += achievement.reward;
      
      // Increment the achievement counter
      state.statistics.totalAchievementsCompleted += 1;
    }
  });
  
  return newlyCompleted;
};

// Helper function to map a level number to the appropriate AutoFeederSpeed enum value
const getSpeedLevelForLevel = (level: number): AutoFeederSpeed => {
  // Ensure the level is within bounds (1-5 for the enum)
  const cappedLevel = Math.min(Math.max(level, 1), 5);
  
  switch (cappedLevel) {
    case 1:
      return AutoFeederSpeed.LEVEL_1;
    case 2:
      return AutoFeederSpeed.LEVEL_2;
    case 3:
      return AutoFeederSpeed.LEVEL_3;
    case 4:
      return AutoFeederSpeed.LEVEL_4;
    case 5:
    default:
      return AutoFeederSpeed.LEVEL_5;
  }
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    feedFish: (state) => {
      const now = Date.now();
      
      // Update click counter in statistics
      state.statistics.totalClicks += 1;
      
      // Check for active lucky bubbles
      const feedingFrenzy = state.activeLuckyBubbles.find(
        bubble => bubble.type === LuckyBubbleType.FEEDING_FRENZY && 
        now < bubble.startTime + bubble.duration
      );
      
      // Calculate point multiplier from special abilities
      const pointMultiplier = calculatePointMultiplier(state.currentTank.fish);
      
      // Each click earns 2 FP, modified by point multiplier and feeding frenzy
      const basePoints = 2 * pointMultiplier;
      const frenzyMultiplier = feedingFrenzy ? 5 : 1;
      const pointsEarned = basePoints * frenzyMultiplier;
      
      state.fishPoints += pointsEarned;
      state.totalFishPointsEarned += pointsEarned;
      state.lastFeedTime = now;
      
      // Check for breeding lucky bubble
      const breedingBoom = state.activeLuckyBubbles.find(
        bubble => bubble.type === LuckyBubbleType.BREEDING_BOOM && 
        now < bubble.startTime + bubble.duration
      );
      
      // Apply breeding boost from special abilities
      const breedingBoost = calculateBreedingBoost(state.currentTank.fish);
      
      // Calculate breeding chance (20% base, modified by breeding abilities and booms)
      let breedingChance;
      const baseBreedingChance = 0.2 * breedingBoost;
      const breedingMultiplier = breedingBoom ? 5 : 1;
      
      // Skip the multiplication and min check if we're already at or above 100%
      if (baseBreedingChance >= 1.0 || (baseBreedingChance * breedingMultiplier >= 1.0)) {
        breedingChance = 1.0; // 100% chance
      } else {
        breedingChance = baseBreedingChance * breedingMultiplier;
      }
      
      if (
        Math.random() < breedingChance && 
        state.currentTank.fish.length < state.currentTank.capacity
      ) {
        // Select which fish type to spawn
        const selectedFishType = selectFishToSpawn(state.currentTank, state.discoveredFishTypes);
        
        // Check if this is a new discovery
        if (!state.discoveredFishTypes.includes(selectedFishType)) {
          state.discoveredFishTypes.push(selectedFishType);
          // Update statistics for discovered fish
          state.statistics.totalFishDiscovered += 1;
        }
        
        // Create and add the new fish
        const newFish = createFish(selectedFishType);
        state.currentTank.fish.push(newFish);
        
        // Update statistics for bred fish
        state.statistics.totalFishBred += 1;
        
        // Update fish count statistics
        updateFishCountStats(state.statistics, newFish);
      }
      
      // Apply feeding boost from special abilities for Lucky Bubble chance
      const feedingBoost = calculateFeedingBoost(state.currentTank.fish);
      
      // Try to trigger a lucky bubble (5% chance per click, min 30 seconds between bubbles)
      if (
        now - state.lastLuckyBubbleTime > 30000 && // 30 seconds minimum between bubbles
        Math.random() < 0.05 * feedingBoost // 5% chance per click, boosted by feeding abilities
      ) {
        triggerLuckyBubble(state);
        
        // Update statistics for lucky bubbles
        state.statistics.totalLuckyBubbles += 1;
      }
    },
    
    upgradeTank: (state, action: PayloadAction<TankType>) => {
      const newTankType = action.payload;
      let newCapacity = 5; // Default fish bowl
      
      switch (newTankType) {
        case TankType.SMALL_AQUARIUM:
          newCapacity = 30;
          break;
        case TankType.MEDIUM_AQUARIUM:
          newCapacity = 150;
          break;
        case TankType.LARGE_AQUARIUM:
          newCapacity = 600;
          break;
        case TankType.HOME_POND:
          newCapacity = 1800;
          break;
        case TankType.INDOOR_REEF:
          newCapacity = 3200;
          break;
      }
      
      state.currentTank = {
        ...state.currentTank,
        type: newTankType,
        capacity: newCapacity,
      };
      
      // Update statistics for upgrades
      state.statistics.totalUpgradesPurchased += 1;
    },
    
    purchaseFeeder: (state, action: PayloadAction<FeederType>) => {
      const feederType = action.payload;
      
      // Calculate the current level based on existing feeder rates
      let currentLevel = 0;
      
      if (state.feeders.length > 0) {
        // Calculate level based on the feed rate of the first feeder
        const currentFeedRate = state.feeders[0].feedRate;
        // Formula: level = log₂(feedRate/4) + 1
        currentLevel = Math.max(1, Math.round(Math.log2(currentFeedRate / 4) + 1));
        
        console.log(`Purchasing feeder - Current level: ${currentLevel}, Feed rate: ${currentFeedRate}`);
      }
      
      // Calculate feed rate for the new level: 4 * 2^currentLevel 
      // This gives us 4, 8, 16, 32, etc. FP/s
      const feedRate = 4 * Math.pow(2, currentLevel);
      const efficiency = 1.0; // All feeders have the same efficiency
      
      console.log(`New feeder - Level: ${currentLevel + 1}, Feed rate: ${feedRate}`);
      
      // Create new feeder with appropriate rate and proper level information
      // We need to store the level explicitly to ensure it's preserved during save/load
      const newFeeder: Feeder = {
        id: uuidv4(),
        type: feederType,
        feedRate,
        efficiency,
        // Store the current level as a number property to avoid issues with enum serialization
        speedLevel: getSpeedLevelForLevel(currentLevel + 1)
      };
      
      // Replace all existing feeders with the new, higher-level feeder
      // This ensures we only have one feeder at a time with the appropriate rate
      state.feeders = [newFeeder];
      
      // Update statistics for feeders
      state.statistics.totalFeedersPurchased += 1;
      
      // Update lastSavedAt to ensure the change is saved
      state.lastSavedAt = Date.now();
    },
    
    upgradeFeederSpeed: (_state: GameState, _action: PayloadAction<{feederId: string, speedLevel: AutoFeederSpeed}>) => {
      // This function is no longer used with our new auto-feed system
      // We now just add a new feeder for each level instead
    },
    
    spendFishPoints: (state, action: PayloadAction<number>) => {
      state.fishPoints -= action.payload;
    },
    
    updateGameState: (state, action: PayloadAction<Partial<GameState>>) => {
      return { ...state, ...action.payload };
    },
    
    processAutomation: (state) => {
      const now = Date.now();
      
      // Calculate delta time since last update (in seconds)
      const deltaTime = (now - state.lastSavedAt) / 1000;
      
      // Update playtime
      state.statistics.playTime += deltaTime;
      state.statistics.lastSessionDate = now;
      
      // Clean up expired lucky bubbles
      if (state.activeLuckyBubbles.length > 0) {
        // Update total bubble time for expired bubbles
        state.activeLuckyBubbles.forEach(bubble => {
          if (now >= bubble.startTime + bubble.duration) {
            const bubbleActiveTime = Math.min(now - bubble.startTime, bubble.duration) / 1000; // Convert to seconds
            state.statistics.totalActiveBubbleTime += bubbleActiveTime;
          }
        });
        
        state.activeLuckyBubbles = state.activeLuckyBubbles.filter(
          bubble => now < bubble.startTime + bubble.duration
        );
      }
      
      // Check for active 'School's In' bubble for bonus fish production
      const schoolsInBubble = state.activeLuckyBubbles.find(
        bubble => bubble.type === LuckyBubbleType.SCHOOLS_IN &&
        now < bubble.startTime + bubble.duration
      );
      const schoolsMultiplier = schoolsInBubble ? 2 : 1;
      
      // Calculate feeder efficiency boost from special abilities
      const feederBoost = calculateFeederBoost(state.currentTank.fish);
      
      // Calculate total feed rate from all feeders, enhanced by feeder efficiency and special abilities
      let baseFeederRate = 0;
      
      // Sum feedRate * efficiency for each feeder
      state.feeders.forEach(feeder => {
        // Default to 1.0 efficiency for backward compatibility with saved games
        const feederEfficiency = feeder.efficiency || 1.0;
        baseFeederRate += feeder.feedRate * feederEfficiency;
      });
      
      const boostedFeederRate = baseFeederRate * feederBoost;
      
      // Calculate points earned from feeders for this frame
      let feederPoints = 0;
      if (boostedFeederRate > 0) {
        // Calculate points to earn from feeders (per second rate * deltaTime)
        feederPoints = boostedFeederRate * deltaTime; // feedRate now directly represents FP/s
        
        state.fishPoints += feederPoints;
        state.totalFishPointsEarned += feederPoints;
        
        // Apply breeding boost from special abilities
        const breedingBoost = calculateBreedingBoost(state.currentTank.fish);
        
        // Chance to spawn new fish based on feed rate and breeding boost
        // Adjust probability based on deltaTime to keep consistent odds regardless of frame rate
        if (
          Math.random() < 0.1 * boostedFeederRate * breedingBoost * deltaTime && 
          state.currentTank.fish.length < state.currentTank.capacity
        ) {
          // Select which fish type to spawn
          const selectedFishType = selectFishToSpawn(state.currentTank, state.discoveredFishTypes);
          
          // Check if this is a new discovery
          if (!state.discoveredFishTypes.includes(selectedFishType)) {
            state.discoveredFishTypes.push(selectedFishType);
            
            // Update statistics for discovered fish
            state.statistics.totalFishDiscovered += 1;
          }
          
          // Create and add the new fish
          const newFish = createFish(selectedFishType);
          state.currentTank.fish.push(newFish);
          
          // Update statistics for bred fish
          state.statistics.totalFishBred += 1;
          
          // Update fish count statistics
          updateFishCountStats(state.statistics, newFish);
        }
      }
      
      // Calculate passive income from fish - affected by School's In multiplier
      let totalFishPointsPerSecond = 0;
      
      // Sum the points per second from each fish
      state.currentTank.fish.forEach(fish => {
        totalFishPointsPerSecond += fish.pointsPerSecond;
      });
      
      // Calculate points earned from fish for this frame
      const fishPoints = totalFishPointsPerSecond * schoolsMultiplier * deltaTime;
      
      // Add fish points to total
      state.fishPoints += fishPoints;
      state.totalFishPointsEarned += fishPoints;
      
      // Update current points per second in real-time
      // This is ONLY the fish points per second, not including feeders
      state.statistics.currentPointsPerSecond = totalFishPointsPerSecond * schoolsMultiplier;
      
      // Check if this is a new highest points per second
      if (totalFishPointsPerSecond > state.statistics.highestPointsPerSecond) {
        state.statistics.highestPointsPerSecond = totalFishPointsPerSecond;
      }
      
      // Apply lucky charm boost from special abilities
      const luckyBoost = calculateLuckyCharmBoost(state.currentTank.fish);
      
      // Try to trigger random lucky bubble (0.5% chance per second, minimum 30 seconds between bubbles)
      // Adjust probability based on deltaTime for consistent odds regardless of frame rate
      if (
        now - state.lastLuckyBubbleTime > 30000 && // 30 seconds minimum between bubbles
        Math.random() < 0.005 * luckyBoost * deltaTime // 0.5% chance per second, adjusted for frame time
      ) {
        triggerLuckyBubble(state);
        
        // Update statistics for lucky bubbles
        state.statistics.totalLuckyBubbles += 1;
      }
      
      // Check for achievement completions every second
      // Use a timestamp-based approach rather than random chance for consistency
      // Use lastSavedAt modulo 1000ms to determine if we should check achievements
      // This ensures checks happen approximately once per second without being affected by frame rate
      if (Math.floor(state.lastSavedAt / 1000) !== Math.floor(now / 1000)) {
        const newlyCompleted = checkAchievements(state);
        
        // Add newly completed achievements to the recently completed list
        if (newlyCompleted.length > 0) {
          state.recentlyCompletedAchievements = [
            ...state.recentlyCompletedAchievements,
            ...newlyCompleted
          ];
        }
      }
      
      state.lastSavedAt = now;
    },
    
    // Mark an achievement as seen and remove from recent completions
    acknowledgeAchievement: (state, action: PayloadAction<string>) => {
      const achievementId = action.payload;
      state.recentlyCompletedAchievements = state.recentlyCompletedAchievements.filter(
        a => a.id !== achievementId
      );
    },
    
    // Remove a lucky bubble manually
    removeLuckyBubble: (state, action: PayloadAction<string>) => {
      // Find the bubble first
      const bubble = state.activeLuckyBubbles.find(b => b.id === action.payload);
      
      if (bubble) {
        // Update statistics for bubble time
        const now = Date.now();
        const bubbleActiveTime = Math.min(now - bubble.startTime, bubble.duration) / 1000; // Convert to seconds
        state.statistics.totalActiveBubbleTime += bubbleActiveTime;
      }
      
      state.activeLuckyBubbles = state.activeLuckyBubbles.filter(
        bubble => bubble.id !== action.payload
      );
    },
    
    // Level up a fish
    levelUpFish: (state, action: PayloadAction<string>) => {
      const fishId = action.payload;
      const fishIndex = state.currentTank.fish.findIndex(fish => fish.id === fishId);
      
      if (fishIndex !== -1) {
        const fish = state.currentTank.fish[fishIndex];
        const newLevel = fish.level + 1;
        
        // Create an updated fish with the new level
        const updatedFish = {
          ...fish,
          level: newLevel,
          pointsPerSecond: fish.pointsPerSecond * 1.5, // 50% increase per level
        };
        
        // Replace the fish in the tank
        state.currentTank.fish[fishIndex] = updatedFish;
        
        // Update statistics for upgrade
        state.statistics.totalUpgradesPurchased += 1;
      }
    },
    
    // Add a new discovered fish type
    discoverFishType: (state, action: PayloadAction<FishType>) => {
      const fishType = action.payload;
      
      // Only add if not already discovered
      if (!state.discoveredFishTypes.includes(fishType)) {
        state.discoveredFishTypes.push(fishType);
        
        // Update statistics for discovered fish
        state.statistics.totalFishDiscovered += 1;
      }
    },
    
    // Track offline earnings in statistics
    trackOfflineEarnings: (state, action: PayloadAction<number>) => {
      state.statistics.totalOfflineEarnings += action.payload;
    },
    
    // Reset specific statistics
    resetStatistics: (state) => {
      state.statistics = {
        ...initialStatistics,
        startDate: state.statistics.startDate, // Preserve original start date
        lastSessionDate: Date.now()
      };
    },
    
    // Add a new achievement
    addAchievement: (state, action: PayloadAction<Achievement>) => {
      const newAchievement = action.payload;
      state.achievements.push(newAchievement);
    },
    
    // Check achievement completion
    checkAchievement: (state, action: PayloadAction<string>) => {
      const achievementId = action.payload;
      const achievement = state.achievements.find(a => a.id === achievementId);
      
      if (achievement && !achievement.completed) {
        // Check if the achievement is completed
        if (checkAchievementCompletion(achievement, state.statistics)) {
          // Mark the achievement as completed
          achievement.completed = true;
          achievement.completedAt = Date.now();
          
          // Add to recently completed achievements
          state.recentlyCompletedAchievements.push(achievement);
          
          // Award fish points
          state.fishPoints += achievement.reward;
          state.totalFishPointsEarned += achievement.reward;
          
          // Update statistics for completed achievement
          state.statistics.totalAchievementsCompleted += 1;
        }
      }
    }
  },
});

// Helper function to trigger a random lucky bubble
function triggerLuckyBubble(state: GameState) {
  // List of all bubble types
  const bubbleTypes = Object.values(LuckyBubbleType);
  
  // Randomly select a bubble type
  const randomType = bubbleTypes[Math.floor(Math.random() * bubbleTypes.length)] as LuckyBubbleType;
  
  // Calculate duration based on type (30 seconds to 2 minutes)
  let duration = 30000; // Default 30 seconds
  
  switch (randomType) {
    case LuckyBubbleType.FEEDING_FRENZY:
      duration = 30000; // 30 seconds
      break;
    case LuckyBubbleType.BREEDING_BOOM:
      duration = 30000; // 30 seconds
      break;
    case LuckyBubbleType.FISH_SHOWER:
      // This is instant, so duration doesn't matter
      // Instantly gain 60 seconds of production
      let totalPassivePoints = 0;
      
      // Sum the points per second from each fish
      state.currentTank.fish.forEach(fish => {
        totalPassivePoints += fish.pointsPerSecond;
      });
      
      const passivePoints = totalPassivePoints * 60; // 60 seconds of production
      state.fishPoints += passivePoints;
      state.totalFishPointsEarned += passivePoints;
      break;
    case LuckyBubbleType.SCHOOLS_IN:
      duration = 120000; // 2 minutes
      break;
    case LuckyBubbleType.VISITOR_RUSH:
      // Instant cash bonus (10% of current points with a minimum of 5 points)
      const bonusPoints = Math.max(state.fishPoints * 0.1, 5);
      state.fishPoints += bonusPoints;
      state.totalFishPointsEarned += bonusPoints;
      break;
  }
  
  // For instant effects, we don't add them to active bubbles
  if (randomType !== LuckyBubbleType.FISH_SHOWER && randomType !== LuckyBubbleType.VISITOR_RUSH) {
    const newBubble: LuckyBubble = {
      id: uuidv4(),
      type: randomType,
      startTime: Date.now(),
      duration,
    };
    
    state.activeLuckyBubbles.push(newBubble);
  }
  
  // Update last bubble time
  state.lastLuckyBubbleTime = Date.now();
}

export const { 
  feedFish, 
  upgradeTank, 
  purchaseFeeder,
  upgradeFeederSpeed, 
  spendFishPoints, 
  updateGameState, 
  processAutomation,
  removeLuckyBubble,
  levelUpFish,
  discoverFishType,
  trackOfflineEarnings,
  resetStatistics,
  addAchievement,
  checkAchievement,
  acknowledgeAchievement
} = gameSlice.actions;

export default gameSlice.reducer; 