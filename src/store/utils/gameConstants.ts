import { TankType, FishRarity } from '../../types/game';

/**
 * Tank display information with capacities
 */
export const TANK_INFO: Record<TankType, { name: string; capacity: number }> = {
  [TankType.FISH_BOWL]: { name: 'Fish Bowl', capacity: 5 },
  [TankType.SMALL_AQUARIUM]: { name: 'Small Aquarium', capacity: 30 },
  [TankType.MEDIUM_AQUARIUM]: { name: 'Medium Aquarium', capacity: 150 },
  [TankType.LARGE_AQUARIUM]: { name: 'Large Aquarium', capacity: 600 },
  [TankType.HOME_POND]: { name: 'Home Pond', capacity: 1800 },
  [TankType.INDOOR_REEF]: { name: 'Indoor Reef', capacity: 3200 },
};

/**
 * Costs for tank upgrades
 */
export const TANK_COSTS: Record<TankType, number> = {
  [TankType.FISH_BOWL]: 0, // Base tank, costs nothing
  [TankType.SMALL_AQUARIUM]: 50,
  [TankType.MEDIUM_AQUARIUM]: 500,
  [TankType.LARGE_AQUARIUM]: 5000,
  [TankType.HOME_POND]: 50000,
  [TankType.INDOOR_REEF]: 500000,
};

/**
 * Auto-feed level costs (each level doubles the rate)
 */
export const AUTO_FEED_LEVEL_COSTS = [
  20,        // Level 1: 4 FP/s - 20 FP
  40,        // Level 2: 8 FP/s - 40 FP
  80,        // Level 3: 16 FP/s - 80 FP
  160,       // Level 4: 32 FP/s - 160 FP
  320,       // Level 5: 64 FP/s - 320 FP
  640,       // Level 6: 128 FP/s - 640 FP
  1280,      // Level 7: 256 FP/s - 1,280 FP
  2560,      // Level 8: 512 FP/s - 2,560 FP
  5120,      // Level 9: 1,024 FP/s - 5,120 FP
  10240,     // Level 10: 2,048 FP/s - 10,240 FP
  20480,     // Level 11: 4,096 FP/s - 20,480 FP
  40960,     // Level 12: 8,192 FP/s - 40,960 FP
  81920,     // Level 13: 16,384 FP/s - 81,920 FP
  163840,    // Level 14: 32,768 FP/s - 163,840 FP
  327680,    // Level 15: 65,536 FP/s - 327,680 FP
  655360,    // Level 16: 131,072 FP/s - 655,360 FP
  1310720,   // Level 17: 262,144 FP/s - 1,310,720 FP
  2621440,   // Level 18: 524,288 FP/s - 2,621,440 FP
  5242880,   // Level 19: 1,048,576 FP/s - 5,242,880 FP
  10485760,  // Level 20: 2,097,152 FP/s - 10,485,760 FP
];

/**
 * Rarity display information with colors
 */
export const RARITY_DISPLAY: Record<FishRarity, { name: string, color: string }> = {
  [FishRarity.COMMON]: { name: 'Common', color: '#aaaaaa' },
  [FishRarity.UNCOMMON]: { name: 'Uncommon', color: '#4caf50' },
  [FishRarity.RARE]: { name: 'Rare', color: '#2196f3' },
  [FishRarity.EPIC]: { name: 'Epic', color: '#9c27b0' },
  [FishRarity.LEGENDARY]: { name: 'Legendary', color: '#ff9800' },
};

/**
 * Tank upgrade progression - maps current tank to next upgrade
 */
export function getNextTankUpgrade(currentTankType: TankType): TankType | null {
  switch (currentTankType) {
    case TankType.FISH_BOWL:
      return TankType.SMALL_AQUARIUM;
    case TankType.SMALL_AQUARIUM:
      return TankType.MEDIUM_AQUARIUM;
    case TankType.MEDIUM_AQUARIUM:
      return TankType.LARGE_AQUARIUM;
    case TankType.LARGE_AQUARIUM:
      return TankType.HOME_POND;
    case TankType.HOME_POND:
      return TankType.INDOOR_REEF;
    default:
      return null;
  }
}

/**
 * Format large numbers with K, M, B suffixes
 */
export function formatRate(rate: number): string {
  if (rate < 1000) return rate.toFixed(0);
  if (rate < 1000000) return (rate / 1000).toFixed(1) + 'K';
  if (rate < 1000000000) return (rate / 1000000).toFixed(1) + 'M';
  return (rate / 1000000000).toFixed(1) + 'B';
} 