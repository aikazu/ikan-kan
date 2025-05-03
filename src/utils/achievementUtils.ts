import { v4 as uuidv4 } from 'uuid';
import { 
  Achievement, 
  AchievementType, 
  AchievementTier, 
  Statistics,
  FishRarity
} from '../types/game';

// Define all achievements based on type and tier
export const createAchievements = (): Achievement[] => [
  // Clicking achievements
  {
    id: uuidv4(),
    type: AchievementType.CLICKS,
    tier: AchievementTier.BRONZE,
    name: 'Eager Feeder',
    description: 'Click to feed your fish 25 times',
    requirement: 25,
    reward: 10,
    icon: '👆',
    completed: false
  },
  {
    id: uuidv4(),
    type: AchievementType.CLICKS,
    tier: AchievementTier.SILVER,
    name: 'Consistent Caretaker',
    description: 'Click to feed your fish 100 times',
    requirement: 100,
    reward: 25,
    icon: '👆',
    completed: false
  },
  {
    id: uuidv4(),
    type: AchievementType.CLICKS,
    tier: AchievementTier.GOLD,
    name: 'Dedicated Aquarist',
    description: 'Click to feed your fish 500 times',
    requirement: 500,
    reward: 100,
    icon: '👆',
    completed: false
  },
  
  // Breeding achievements
  {
    id: uuidv4(),
    type: AchievementType.FISH_BRED,
    tier: AchievementTier.BRONZE,
    name: 'Fish Parent',
    description: 'Breed 5 new fish',
    requirement: 5,
    reward: 15,
    icon: '🐠',
    completed: false
  },
  {
    id: uuidv4(),
    type: AchievementType.FISH_BRED,
    tier: AchievementTier.SILVER,
    name: 'Fish Family',
    description: 'Breed 25 new fish',
    requirement: 25,
    reward: 50,
    icon: '🐠',
    completed: false
  },
  {
    id: uuidv4(),
    type: AchievementType.FISH_BRED,
    tier: AchievementTier.GOLD,
    name: 'Fish Colony',
    description: 'Breed 100 new fish',
    requirement: 100,
    reward: 200,
    icon: '🐠',
    completed: false
  },
  
  // Discovery achievements
  {
    id: uuidv4(),
    type: AchievementType.FISH_DISCOVERED,
    tier: AchievementTier.BRONZE,
    name: 'Novice Explorer',
    description: 'Discover 3 different fish types',
    requirement: 3,
    reward: 20,
    icon: '🔍',
    completed: false
  },
  {
    id: uuidv4(),
    type: AchievementType.FISH_DISCOVERED,
    tier: AchievementTier.SILVER,
    name: 'Marine Biologist',
    description: 'Discover 6 different fish types',
    requirement: 6,
    reward: 75,
    icon: '🔍',
    completed: false
  },
  {
    id: uuidv4(),
    type: AchievementType.FISH_DISCOVERED,
    tier: AchievementTier.GOLD,
    name: 'Master Ichthyologist',
    description: 'Discover all 12 fish types',
    requirement: 12,
    reward: 300,
    icon: '🔍',
    completed: false
  },
  
  // Points earned achievements
  {
    id: uuidv4(),
    type: AchievementType.POINTS_EARNED,
    tier: AchievementTier.BRONZE,
    name: 'Fish Bank',
    description: 'Earn a total of 100 fish points',
    requirement: 100,
    reward: 10,
    icon: '💰',
    completed: false
  },
  {
    id: uuidv4(),
    type: AchievementType.POINTS_EARNED,
    tier: AchievementTier.SILVER,
    name: 'Fish Fortune',
    description: 'Earn a total of 1,000 fish points',
    requirement: 1000,
    reward: 50,
    icon: '💰',
    completed: false
  },
  {
    id: uuidv4(),
    type: AchievementType.POINTS_EARNED,
    tier: AchievementTier.GOLD,
    name: 'Fish Tycoon',
    description: 'Earn a total of 10,000 fish points',
    requirement: 10000,
    reward: 250,
    icon: '💰',
    completed: false
  },
  
  // Points per second achievements
  {
    id: uuidv4(),
    type: AchievementType.POINTS_PER_SECOND,
    tier: AchievementTier.BRONZE,
    name: 'Self-Sufficient',
    description: 'Reach 2 points per second',
    requirement: 2,
    reward: 15,
    icon: '⏱️',
    completed: false
  },
  {
    id: uuidv4(),
    type: AchievementType.POINTS_PER_SECOND,
    tier: AchievementTier.SILVER,
    name: 'Efficient Ecosystem',
    description: 'Reach 10 points per second',
    requirement: 10,
    reward: 75,
    icon: '⏱️',
    completed: false
  },
  {
    id: uuidv4(),
    type: AchievementType.POINTS_PER_SECOND,
    tier: AchievementTier.GOLD,
    name: 'Point Machine',
    description: 'Reach 50 points per second',
    requirement: 50,
    reward: 250,
    icon: '⏱️',
    completed: false
  },
  
  // Play time achievements
  {
    id: uuidv4(),
    type: AchievementType.PLAY_TIME,
    tier: AchievementTier.BRONZE,
    name: 'Just Starting',
    description: 'Play for 3 minutes',
    requirement: 180, // in seconds
    reward: 10,
    icon: '⌛',
    completed: false
  },
  {
    id: uuidv4(),
    type: AchievementType.PLAY_TIME,
    tier: AchievementTier.SILVER,
    name: 'Getting Hooked',
    description: 'Play for 10 minutes',
    requirement: 600, // in seconds
    reward: 30,
    icon: '⌛',
    completed: false
  },
  {
    id: uuidv4(),
    type: AchievementType.PLAY_TIME,
    tier: AchievementTier.GOLD,
    name: 'Dedicated Aquarist',
    description: 'Play for 30 minutes',
    requirement: 1800, // in seconds
    reward: 100,
    icon: '⌛',
    completed: false
  },
  
  // Rarity achievements
  {
    id: uuidv4(),
    type: AchievementType.FISH_BY_RARITY,
    tier: AchievementTier.SILVER,
    name: 'Uncommon Find',
    description: 'Collect 3 uncommon fish',
    requirement: 3,
    reward: 30,
    requiredFishRarity: FishRarity.UNCOMMON,
    icon: '🔵',
    completed: false
  },
  {
    id: uuidv4(),
    type: AchievementType.FISH_BY_RARITY,
    tier: AchievementTier.GOLD,
    name: 'Rare Collector',
    description: 'Collect 2 rare fish',
    requirement: 2,
    reward: 75,
    requiredFishRarity: FishRarity.RARE,
    icon: '🟣',
    completed: false
  },
  {
    id: uuidv4(),
    type: AchievementType.FISH_BY_RARITY,
    tier: AchievementTier.PLATINUM,
    name: 'Epic Discovery',
    description: 'Collect an epic fish',
    requirement: 1,
    reward: 150,
    requiredFishRarity: FishRarity.EPIC,
    icon: '🟠',
    completed: false
  },
  {
    id: uuidv4(),
    type: AchievementType.FISH_BY_RARITY,
    tier: AchievementTier.DIAMOND,
    name: 'Legendary Quest',
    description: 'Collect a legendary fish',
    requirement: 1,
    reward: 300,
    requiredFishRarity: FishRarity.LEGENDARY,
    icon: '✨',
    completed: false
  },
  
  // Feeding system achievements
  {
    id: uuidv4(),
    type: AchievementType.FEEDERS_PURCHASED,
    tier: AchievementTier.BRONZE,
    name: 'Automation Beginner',
    description: 'Purchase your first feeder',
    requirement: 1,
    reward: 10,
    icon: '🤖',
    completed: false
  },
  {
    id: uuidv4(),
    type: AchievementType.FEEDERS_PURCHASED,
    tier: AchievementTier.SILVER,
    name: 'Feeding Fleet',
    description: 'Purchase 3 feeders',
    requirement: 3,
    reward: 50,
    icon: '🤖',
    completed: false
  },
  {
    id: uuidv4(),
    type: AchievementType.FEEDERS_PURCHASED,
    tier: AchievementTier.GOLD,
    name: 'Feeding Factory',
    description: 'Purchase 5 feeders',
    requirement: 5,
    reward: 150,
    icon: '🤖',
    completed: false
  },
  
  // Lucky bubble achievements
  {
    id: uuidv4(),
    type: AchievementType.LUCKY_BUBBLES,
    tier: AchievementTier.BRONZE,
    name: 'Lucky Find',
    description: 'Trigger 3 lucky bubbles',
    requirement: 3,
    reward: 25,
    icon: '🫧',
    completed: false
  },
  {
    id: uuidv4(),
    type: AchievementType.LUCKY_BUBBLES,
    tier: AchievementTier.SILVER,
    name: 'Bubble Master',
    description: 'Trigger 10 lucky bubbles',
    requirement: 10,
    reward: 75,
    icon: '🫧',
    completed: false
  },
  {
    id: uuidv4(),
    type: AchievementType.LUCKY_BUBBLES,
    tier: AchievementTier.GOLD,
    name: 'Bubble Fortune',
    description: 'Trigger 25 lucky bubbles',
    requirement: 25,
    reward: 200,
    icon: '🫧',
    completed: false
  }
];

// Function to check if an achievement is completed based on statistics
export const checkAchievementCompletion = (
  achievement: Achievement,
  statistics: Statistics
): boolean => {
  switch (achievement.type) {
    case AchievementType.CLICKS:
      return statistics.totalClicks >= achievement.requirement;
      
    case AchievementType.FISH_BRED:
      return statistics.totalFishBred >= achievement.requirement;
      
    case AchievementType.FISH_DISCOVERED:
      return statistics.totalFishDiscovered >= achievement.requirement;
      
    case AchievementType.POINTS_EARNED:
      return statistics.totalFishPointsEarned >= achievement.requirement;
      
    case AchievementType.POINTS_PER_SECOND:
      return statistics.currentPointsPerSecond >= achievement.requirement;
      
    case AchievementType.PLAY_TIME:
      return statistics.playTime >= achievement.requirement;
      
    case AchievementType.FISH_BY_RARITY:
      if (achievement.requiredFishRarity) {
        return statistics.fishByRarity[achievement.requiredFishRarity] >= achievement.requirement;
      }
      return false;
      
    case AchievementType.FEEDERS_PURCHASED:
      return statistics.totalFeedersPurchased >= achievement.requirement;
      
    case AchievementType.UPGRADES_PURCHASED:
      return statistics.totalUpgradesPurchased >= achievement.requirement;
      
    case AchievementType.LUCKY_BUBBLES:
      return statistics.totalLuckyBubbles >= achievement.requirement;
      
    default:
      return false;
  }
};

// Function to get progress percentage for an achievement
export const getAchievementProgress = (
  achievement: Achievement,
  statistics: Statistics
): number => {
  let currentValue = 0;
  
  switch (achievement.type) {
    case AchievementType.CLICKS:
      currentValue = statistics.totalClicks;
      break;
      
    case AchievementType.FISH_BRED:
      currentValue = statistics.totalFishBred;
      break;
      
    case AchievementType.FISH_DISCOVERED:
      currentValue = statistics.totalFishDiscovered;
      break;
      
    case AchievementType.POINTS_EARNED:
      currentValue = statistics.totalFishPointsEarned;
      break;
      
    case AchievementType.POINTS_PER_SECOND:
      currentValue = statistics.currentPointsPerSecond;
      break;
      
    case AchievementType.PLAY_TIME:
      currentValue = statistics.playTime;
      break;
      
    case AchievementType.FISH_BY_RARITY:
      if (achievement.requiredFishRarity) {
        currentValue = statistics.fishByRarity[achievement.requiredFishRarity] || 0;
      }
      break;
      
    case AchievementType.FEEDERS_PURCHASED:
      currentValue = statistics.totalFeedersPurchased;
      break;
      
    case AchievementType.UPGRADES_PURCHASED:
      currentValue = statistics.totalUpgradesPurchased;
      break;
      
    case AchievementType.LUCKY_BUBBLES:
      currentValue = statistics.totalLuckyBubbles;
      break;
  }
  
  return Math.min(100, Math.floor((currentValue / achievement.requirement) * 100));
}; 