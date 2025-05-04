import { v4 as uuidv4 } from 'uuid';
import { createAchievements } from '../../utils/achievementUtils';
import { FishType, FishRarity, Fish, FISH_PROPERTIES, Feeder, AutoFeederSpeed } from '../../types/game';
import { LuckyBubbleType } from '../slices/luckyBubbleSlice';

const LEGACY_STORAGE_KEY = 'ikan-kan-save';
const NEW_STORAGE_KEY = 'ikankan_save';

/**
 * Migrate from old game state to new sliced state
 * @returns true if migration was successful, false otherwise
 */
export function migrateGameState(): boolean {
  try {
    // Check if legacy data exists
    const legacyData = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!legacyData) {
      return false;
    }
    
    // Check if new data already exists (already migrated)
    const newData = localStorage.getItem(NEW_STORAGE_KEY);
    if (newData) {
      return false;
    }
    
    const parsedLegacyData = JSON.parse(legacyData);
    
    // Create the new data structure
    const newState = {
      fish: {
        discoveredFishTypes: parsedLegacyData.discoveredFishTypes || [FishType.GUPPY],
        totalFishPointsEarned: parsedLegacyData.totalFishPointsEarned || 0,
        totalFishBred: parsedLegacyData.statistics?.totalFishBred || 0
      },
      tank: {
        fishPoints: parsedLegacyData.fishPoints || 0,
        currentTank: parsedLegacyData.currentTank || {
          id: uuidv4(),
          type: "fishBowl",
          capacity: 5,
          fish: []
        }
      },
      feeder: {
        feeders: parsedLegacyData.feeders || [],
        totalFeedersPurchased: parsedLegacyData.statistics?.totalFeedersPurchased || 0
      },
      luckyBubble: {
        activeLuckyBubbles: parsedLegacyData.activeLuckyBubbles || [],
        lastLuckyBubbleTime: parsedLegacyData.lastLuckyBubbleTime || Date.now(),
        totalLuckyBubbles: parsedLegacyData.statistics?.totalLuckyBubbles || 0,
        totalActiveBubbleTime: parsedLegacyData.statistics?.totalActiveBubbleTime || 0
      },
      statistics: {
        statistics: parsedLegacyData.statistics || {
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
        }
      },
      achievement: {
        achievements: parsedLegacyData.achievements || createAchievements(),
        recentlyCompletedAchievements: parsedLegacyData.recentlyCompletedAchievements || []
      },
      savedAt: Date.now()
    };
    
    // Ensure fish have all the required properties
    if (newState.tank.currentTank.fish.length > 0) {
      newState.tank.currentTank.fish = newState.tank.currentTank.fish.map((fish: Fish) => {
        // Check if this is an old format fish without pointsPerSecond
        if (!fish.pointsPerSecond || !fish.breedingRate) {
          const fishProps = FISH_PROPERTIES[fish.type];
          return {
            ...fish,
            rarity: fishProps.rarity,
            pointsPerSecond: fishProps.basePointsPerSecond * (fish.level || 1),
            breedingRate: fishProps.breedingRate,
            specialAbility: fishProps.specialAbility
          };
        }
        return fish;
      });
    }
    
    // Ensure feeders have the correct properties
    if (newState.feeder.feeders.length > 0) {
      newState.feeder.feeders = newState.feeder.feeders.map((feeder: Feeder) => {
        // Recalculate the level based on the feed rate
        const feedRate = feeder.feedRate || 4;
        const level = Math.log2(feedRate / 4) + 1;
        const adjustedLevel = Math.max(1, Math.round(level)); // Round to nearest whole number
        
        // Map the level to the appropriate enum value
        let speedLevel = feeder.speedLevel;
        if (!speedLevel || adjustedLevel > 1) {
          switch(Math.min(adjustedLevel, 5)) {
            case 1: speedLevel = AutoFeederSpeed.LEVEL_1; break;
            case 2: speedLevel = AutoFeederSpeed.LEVEL_2; break;
            case 3: speedLevel = AutoFeederSpeed.LEVEL_3; break;
            case 4: speedLevel = AutoFeederSpeed.LEVEL_4; break;
            case 5: speedLevel = AutoFeederSpeed.LEVEL_5; break;
            default: speedLevel = AutoFeederSpeed.LEVEL_1;
          }
        }
        
        return {
          ...feeder,
          feedRate: feedRate,
          efficiency: feeder.efficiency || 1.0,
          speedLevel
        };
      });
    }
    
    // Convert lucky bubble types from string to enum
    if (newState.luckyBubble.activeLuckyBubbles.length > 0) {
      newState.luckyBubble.activeLuckyBubbles = newState.luckyBubble.activeLuckyBubbles.map((bubble: any) => {
        if (typeof bubble.type === 'string') {
          const type = stringToBubbleType(bubble.type);
          return {
            ...bubble,
            type
          };
        }
        return bubble;
      });
    }
    
    // Save the new data structure
    localStorage.setItem(NEW_STORAGE_KEY, JSON.stringify(newState));
    
    // Can optionally remove the old data
    // localStorage.removeItem(LEGACY_STORAGE_KEY);
    
    return true;
  } catch (error) {
    console.error('Migration failed:', error);
    return false;
  }
}

/**
 * Convert string to LuckyBubbleType enum
 */
function stringToBubbleType(type: string): LuckyBubbleType {
  switch (type) {
    case 'feedingFrenzy':
      return LuckyBubbleType.FEEDING_FRENZY;
    case 'breedingBoom':
      return LuckyBubbleType.BREEDING_BOOM;
    case 'fishShower':
      return LuckyBubbleType.FISH_SHOWER;
    case 'schoolsIn':
      return LuckyBubbleType.SCHOOLS_IN;
    case 'visitorRush':
      return LuckyBubbleType.VISITOR_RUSH;
    default:
      return LuckyBubbleType.FEEDING_FRENZY;
  }
} 