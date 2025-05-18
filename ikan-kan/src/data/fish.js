// Fish collection data

/**
 * Rarity levels:
 * 1 - Common (70%)
 * 2 - Uncommon (20%)
 * 3 - Rare (7%)
 * 4 - Epic (2%)
 * 5 - Legendary (0.9%)
 * 6 - Mythical (0.1%)
 */

const fish = {
  // Common fish (Pond)
  goldfish: {
    id: 'goldfish',
    name: 'Goldfish',
    description: 'A common ornamental fish with a bright orange-gold color.',
    environment: 'pond',
    rarity: 1, // Common
    value: 1,
    scaleChance: 0.01, // 1% chance to get scales
    icon: '🐠',
    discoveryMessage: 'You caught a goldfish! It shimmers in the sunlight.',
  },
  carp: {
    id: 'carp',
    name: 'Carp',
    description: 'A large freshwater fish found in ponds and lakes.',
    environment: 'pond',
    rarity: 1, // Common
    value: 2,
    scaleChance: 0.02, // 2% chance to get scales
    icon: '🐟',
    discoveryMessage: 'You caught a carp! It\'s a decent size.',
  },
  minnow: {
    id: 'minnow',
    name: 'Minnow',
    description: 'A tiny fish often used as bait.',
    environment: 'pond',
    rarity: 1, // Common
    value: 1,
    scaleChance: 0,
    icon: '🐟',
    discoveryMessage: 'You caught a minnow! It\'s very small.',
  },
  
  // Uncommon fish (Pond)
  koi: {
    id: 'koi',
    name: 'Koi',
    description: 'A colorful variety of carp kept for decorative purposes in ponds.',
    environment: 'pond',
    rarity: 2, // Uncommon
    value: 5,
    scaleChance: 0.05, // 5% chance to get scales
    icon: '🐠',
    discoveryMessage: 'You caught a beautiful koi! Its patterns are mesmerizing.',
  },
  catfish: {
    id: 'catfish',
    name: 'Catfish',
    description: 'A whiskered fish that dwells at the bottom of ponds.',
    environment: 'pond',
    rarity: 2, // Uncommon
    value: 7,
    scaleChance: 0.03, // 3% chance to get scales
    icon: '🐡',
    discoveryMessage: 'You caught a catfish! It has distinctive whiskers.',
  },
  
  // Rare fish (Pond)
  sturgeon: {
    id: 'sturgeon',
    name: 'Sturgeon',
    description: 'An ancient species with bony plates instead of scales.',
    environment: 'pond',
    rarity: 3, // Rare
    value: 15,
    scaleChance: 0.1, // 10% chance to get scales
    icon: '🐟',
    discoveryMessage: 'You caught a sturgeon! This ancient fish has bony plates along its back.',
  },
  
  // Epic fish (Pond)
  golden_koi: {
    id: 'golden_koi',
    name: 'Golden Koi',
    description: 'A legendary koi with scales that shine like pure gold.',
    environment: 'pond',
    rarity: 4, // Epic
    value: 50,
    scaleChance: 0.25, // 25% chance to get scales
    icon: '✨🐠',
    discoveryMessage: 'You caught a golden koi! Its scales shine like pure gold - this is considered very lucky!',
    special: {
      effect: 'multiplier',
      target: 'fishPerSecond',
      value: 1.05, // 5% increase to fish per second
      duration: 300, // 5 minutes
    },
  },
  
  // Common fish (Lake)
  perch: {
    id: 'perch',
    name: 'Perch',
    description: 'A freshwater fish found in lakes and rivers.',
    environment: 'lake',
    rarity: 1, // Common
    value: 3,
    scaleChance: 0.02, // 2% chance to get scales
    icon: '🐟',
    discoveryMessage: 'You caught a perch! Its striped pattern is distinctive.',
  },
  bass: {
    id: 'bass',
    name: 'Bass',
    description: 'A popular game fish found in lakes.',
    environment: 'lake',
    rarity: 1, // Common
    value: 4,
    scaleChance: 0.03, // 3% chance to get scales
    icon: '🐟',
    discoveryMessage: 'You caught a bass! It put up a good fight.',
  },
  
  // Uncommon fish (Lake)
  pike: {
    id: 'pike',
    name: 'Pike',
    description: 'A predatory freshwater fish with a long, flat snout.',
    environment: 'lake',
    rarity: 2, // Uncommon
    value: 8,
    scaleChance: 0.05, // 5% chance to get scales
    icon: '🐡',
    discoveryMessage: 'You caught a pike! Its teeth look dangerous.',
  },
  
  // Common fish (Coastal)
  mackerel: {
    id: 'mackerel',
    name: 'Mackerel',
    description: 'A small saltwater fish found in coastal waters.',
    environment: 'coastal',
    rarity: 1, // Common
    value: 5,
    scaleChance: 0.03, // 3% chance to get scales
    icon: '🐟',
    discoveryMessage: 'You caught a mackerel! Its blue-green stripes glisten in the sun.',
  },
  
  // Uncommon fish (Coastal)
  snapper: {
    id: 'snapper',
    name: 'Snapper',
    description: 'A reddish fish prized for its taste.',
    environment: 'coastal',
    rarity: 2, // Uncommon
    value: 10,
    scaleChance: 0.05, // 5% chance to get scales
    icon: '🐡',
    discoveryMessage: 'You caught a snapper! Its red color is striking.',
  },
};

export default fish;

/**
 * Get all fish
 * @returns {Object} All fish
 */
export const getAllFish = () => fish;

/**
 * Get fish by environment
 * @param {string} environment - Environment to filter by
 * @returns {Array} Array of fish from the specified environment
 */
export const getFishByEnvironment = (environment) => {
  return Object.values(fish).filter(f => f.environment === environment);
};

/**
 * Get fish by rarity
 * @param {number} rarity - Rarity level to filter by
 * @returns {Array} Array of fish with the specified rarity
 */
export const getFishByRarity = (rarity) => {
  return Object.values(fish).filter(f => f.rarity === rarity);
};

/**
 * Generate a random fish based on environment and rarity chances
 * @param {string} environment - Current environment
 * @param {number} rarityBoost - Boost to rarity chances (0-1)
 * @returns {Object} Randomly selected fish
 */
export const getRandomFish = (environment, rarityBoost = 0) => {
  // Get fish available in this environment
  const availableFish = getFishByEnvironment(environment);
  if (availableFish.length === 0) return null;
  
  // Roll for rarity with boost
  const rarityRoll = Math.random();
  let targetRarity;
  
  // Apply rarity boost (shifts probabilities toward rarer fish)
  const boostedRoll = Math.max(0, rarityRoll - rarityBoost);
  
  if (boostedRoll < 0.001) {
    targetRarity = 6; // Mythical (0.1%)
  } else if (boostedRoll < 0.01) {
    targetRarity = 5; // Legendary (0.9%)
  } else if (boostedRoll < 0.03) {
    targetRarity = 4; // Epic (2%)
  } else if (boostedRoll < 0.1) {
    targetRarity = 3; // Rare (7%)
  } else if (boostedRoll < 0.3) {
    targetRarity = 2; // Uncommon (20%)
  } else {
    targetRarity = 1; // Common (70%)
  }
  
  // Filter by target rarity
  let possibleFish = availableFish.filter(f => f.rarity === targetRarity);
  
  // If no fish of target rarity, fall back to lower rarity
  while (possibleFish.length === 0 && targetRarity > 0) {
    targetRarity--;
    possibleFish = availableFish.filter(f => f.rarity === targetRarity);
  }
  
  // Select random fish from possibilities
  return possibleFish[Math.floor(Math.random() * possibleFish.length)];
}; 