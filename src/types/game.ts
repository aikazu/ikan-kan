export interface Fish {
  id: string;
  type: FishType;
  level: number;
  createdAt: number;
  rarity: FishRarity;
  pointsPerSecond: number;
  breedingRate: number;
  specialAbility?: SpecialAbility;
}

export enum FishType {
  GUPPY = 'guppy',
  GOLDFISH = 'goldfish',
  TETRA = 'tetra',
  ANGELFISH = 'angelfish',
  CLOWNFISH = 'clownfish',
  DISCUS = 'discus',
  BETTA = 'betta',
  MOLLY = 'molly',
  PLATY = 'platy',
  SWORDTAIL = 'swordtail',
  KOI = 'koi',
  AROWANA = 'arowana',
}

export enum FishRarity {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary'
}

export enum SpecialAbility {
  FEEDING_BOOST = 'feedingBoost',      // Increases chance of Feeding Frenzy 
  BREEDING_MASTER = 'breedingMaster',  // Increases breeding rate for all fish
  LUCKY_CHARM = 'luckyCharm',          // Increases chance of Lucky Bubbles
  POINT_MULTIPLIER = 'pointMultiplier', // Multiplies points earned from clicking
  FEEDER_EFFICIENCY = 'feederEfficiency', // Makes feeders more efficient
  DISCOVERY_BOOST = 'discoveryBoost'   // Increases chance of discovering new fish types
}

export enum TankType {
  FISH_BOWL = 'fishBowl',
  SMALL_AQUARIUM = 'smallAquarium',
  MEDIUM_AQUARIUM = 'mediumAquarium',
  LARGE_AQUARIUM = 'largeAquarium',
  HOME_POND = 'homePond',
  INDOOR_REEF = 'indoorReef',
}

// Fish type definitions with their properties
export const FISH_PROPERTIES: Record<FishType, {
  basePointsPerSecond: number;
  breedingRate: number;
  rarity: FishRarity;
  minTankType: TankType;
  specialAbility?: SpecialAbility;
  description: string;
}> = {
  [FishType.GUPPY]: {
    basePointsPerSecond: 0.5,
    breedingRate: 0.2,
    rarity: FishRarity.COMMON,
    minTankType: TankType.FISH_BOWL,
    description: 'The humble guppy, a great starter fish'
  },
  [FishType.GOLDFISH]: {
    basePointsPerSecond: 0.8,
    breedingRate: 0.15,
    rarity: FishRarity.COMMON,
    minTankType: TankType.FISH_BOWL,
    description: 'A classic pet fish, slightly more productive'
  },
  [FishType.TETRA]: {
    basePointsPerSecond: 1.0,
    breedingRate: 0.25,
    rarity: FishRarity.UNCOMMON,
    minTankType: TankType.SMALL_AQUARIUM,
    description: 'Small but quick breeders that generate decent points'
  },
  [FishType.ANGELFISH]: {
    basePointsPerSecond: 1.5,
    breedingRate: 0.1,
    rarity: FishRarity.UNCOMMON,
    minTankType: TankType.MEDIUM_AQUARIUM,
    specialAbility: SpecialAbility.POINT_MULTIPLIER,
    description: 'Majestic fish that enhance your clicking rewards'
  },
  [FishType.CLOWNFISH]: {
    basePointsPerSecond: 2.0,
    breedingRate: 0.12,
    rarity: FishRarity.RARE,
    minTankType: TankType.MEDIUM_AQUARIUM,
    specialAbility: SpecialAbility.LUCKY_CHARM,
    description: 'Increases the chance of Lucky Bubbles appearing'
  },
  [FishType.DISCUS]: {
    basePointsPerSecond: 3.0,
    breedingRate: 0.08,
    rarity: FishRarity.RARE,
    minTankType: TankType.LARGE_AQUARIUM,
    specialAbility: SpecialAbility.FEEDER_EFFICIENCY,
    description: 'Improves the performance of all your feeders'
  },
  [FishType.BETTA]: {
    basePointsPerSecond: 1.2,
    breedingRate: 0.1,
    rarity: FishRarity.UNCOMMON,
    minTankType: TankType.SMALL_AQUARIUM,
    specialAbility: SpecialAbility.FEEDING_BOOST,
    description: 'Increases chances of feeding frenzies occurring'
  },
  [FishType.MOLLY]: {
    basePointsPerSecond: 0.9,
    breedingRate: 0.3,
    rarity: FishRarity.COMMON,
    minTankType: TankType.SMALL_AQUARIUM,
    description: 'Breeds quickly, helping fill your tank'
  },
  [FishType.PLATY]: {
    basePointsPerSecond: 1.0,
    breedingRate: 0.25,
    rarity: FishRarity.COMMON,
    minTankType: TankType.SMALL_AQUARIUM,
    description: 'Colorful fish with decent breeding rate'
  },
  [FishType.SWORDTAIL]: {
    basePointsPerSecond: 1.3,
    breedingRate: 0.2,
    rarity: FishRarity.UNCOMMON,
    minTankType: TankType.MEDIUM_AQUARIUM,
    description: 'Recognizable by their sword-like tails, good point producers'
  },
  [FishType.KOI]: {
    basePointsPerSecond: 4.0,
    breedingRate: 0.05,
    rarity: FishRarity.EPIC,
    minTankType: TankType.HOME_POND,
    specialAbility: SpecialAbility.BREEDING_MASTER,
    description: 'Majestic pond fish that boost breeding for all fish'
  },
  [FishType.AROWANA]: {
    basePointsPerSecond: 6.0,
    breedingRate: 0.02,
    rarity: FishRarity.LEGENDARY,
    minTankType: TankType.INDOOR_REEF,
    specialAbility: SpecialAbility.DISCOVERY_BOOST,
    description: 'Exotic legendary fish that helps you discover new species'
  }
};

export interface Tank {
  id: string;
  type: TankType;
  capacity: number;
  fish: Fish[];
}

export interface Feeder {
  id: string;
  type: FeederType;
  feedRate: number;
  efficiency: number;
  speedLevel?: AutoFeederSpeed; // Optional speed level for backward compatibility
}

export enum FeederType {
  BASIC = 'basic',
  TIMED = 'timed',
  DIGITAL = 'digital',
  ADVANCED = 'advanced',
  ECOSYSTEM = 'ecosystem',
}

// New enum for auto-feeder speed upgrades
export enum AutoFeederSpeed {
  LEVEL_1 = 'level_1',
  LEVEL_2 = 'level_2',
  LEVEL_3 = 'level_3',
  LEVEL_4 = 'level_4',
  LEVEL_5 = 'level_5',
}

export interface LuckyBubble {
  id: string;
  type: string;
  startTime: number;
  duration: number; // in milliseconds
}

export interface Statistics {
  totalClicks: number;
  totalFishBred: number;
  totalFishDiscovered: number;
  totalLuckyBubbles: number;
  totalOfflineEarnings: number;
  totalActiveBubbleTime: number; // in seconds
  highestPointsPerSecond: number;
  currentPointsPerSecond: number; // Added for real-time display
  totalUpgradesPurchased: number;
  totalFeedersPurchased: number;
  totalAchievementsCompleted: number;
  totalFishPointsEarned: number; // Total fish points earned throughout the game
  playTime: number; // in seconds
  fishByType: Record<FishType, number>;
  fishByRarity: Record<FishRarity, number>;
  startDate: number; // timestamp when the game was first started
  lastSessionDate: number; // timestamp of the last session
}

export enum AchievementType {
  CLICKS = 'clicks',
  FISH_BRED = 'fishBred',
  FISH_DISCOVERED = 'fishDiscovered',
  POINTS_EARNED = 'pointsEarned',
  POINTS_PER_SECOND = 'pointsPerSecond',
  PLAY_TIME = 'playTime',
  FISH_BY_RARITY = 'fishByRarity',
  FEEDERS_PURCHASED = 'feedersPurchased',
  UPGRADES_PURCHASED = 'upgradesPurchased',
  LUCKY_BUBBLES = 'luckyBubbles'
}

export enum AchievementTier {
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
  PLATINUM = 'platinum',
  DIAMOND = 'diamond'
}

export interface Achievement {
  id: string;
  type: AchievementType;
  tier: AchievementTier;
  name: string;
  description: string;
  requirement: number;
  reward: number; // Fish points reward
  requiredFishRarity?: FishRarity; // Only for FISH_BY_RARITY type
  icon: string;
  completed: boolean;
  completedAt?: number;
}

export interface GameState {
  fishPoints: number;
  totalFishPointsEarned: number;
  currentTank: Tank;
  feeders: Feeder[];
  lastSavedAt: number;
  lastFeedTime: number;
  discoveredFishTypes: FishType[];
  activeLuckyBubbles: LuckyBubble[];
  lastLuckyBubbleTime: number;
  statistics: Statistics;
  achievements: Achievement[];
  recentlyCompletedAchievements: Achievement[];
} 