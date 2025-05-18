// Upgrades data

/**
 * Upgrade categories:
 * - clickPower: Increases fish per click
 * - autoFishing: Generates fish per second automatically
 * - fishingRod: Improves fishing efficiency
 * - staff: Improves staff efficiency
 * - pond: Improves pond quality and fish yields
 * - special: Special upgrades with unique effects
 */

const upgrades = {
  // Click power upgrades
  better_finger: {
    id: 'better_finger',
    name: 'Better Finger',
    description: 'Train your finger to click more efficiently',
    category: 'clickPower',
    basePrice: 10,
    priceGrowth: 1.1,
    maxLevel: 10,
    effect: {
      type: 'clickPower',
      value: 1,
    },
    unlockCondition: null, // Always available
    icon: '👆',
  },
  fishing_gloves: {
    id: 'fishing_gloves',
    name: 'Fishing Gloves',
    description: 'Protect your hands and increase fish per click',
    category: 'clickPower',
    basePrice: 100,
    priceGrowth: 1.2,
    maxLevel: 5,
    effect: {
      type: 'clickPower',
      value: 5,
    },
    unlockCondition: {
      fish: 50,
    },
    icon: '🧤',
  },
  
  // Fishing rod upgrades
  bamboo_rod: {
    id: 'bamboo_rod',
    name: 'Bamboo Rod',
    description: 'A simple fishing rod made of bamboo',
    category: 'fishingRod',
    basePrice: 15,
    priceGrowth: 1.2,
    maxLevel: 1,
    effect: {
      type: 'fishPerSecond',
      value: 0.2,
    },
    unlockCondition: {
      fish: 10,
    },
    icon: '🎣',
  },
  wooden_rod: {
    id: 'wooden_rod',
    name: 'Wooden Rod',
    description: 'A sturdier fishing rod',
    category: 'fishingRod',
    basePrice: 100,
    priceGrowth: 1.2,
    maxLevel: 1,
    effect: {
      type: 'fishPerSecond',
      value: 0.5,
    },
    unlockCondition: {
      upgrades: {
        bamboo_rod: 1,
      },
      fish: 50,
    },
    icon: '🎣',
  },
  fiber_rod: {
    id: 'fiber_rod',
    name: 'Fiber Rod',
    description: 'A modern fishing rod with better durability',
    category: 'fishingRod',
    basePrice: 500,
    priceGrowth: 1.3,
    maxLevel: 1,
    effect: {
      type: 'fishPerSecond',
      value: 1,
    },
    unlockCondition: {
      upgrades: {
        wooden_rod: 1,
      },
      fish: 250,
    },
    icon: '🎣',
  },
  
  // Auto fishing upgrades
  fishing_hook: {
    id: 'fishing_hook',
    name: 'Better Hooks',
    description: 'Improved fishing hooks catch fish more easily',
    category: 'autoFishing',
    basePrice: 50,
    priceGrowth: 1.2,
    maxLevel: 10,
    effect: {
      type: 'fishPerSecond',
      value: 0.1,
    },
    unlockCondition: {
      upgrades: {
        bamboo_rod: 1,
      },
    },
    icon: '⚓',
  },
  fishing_bait: {
    id: 'fishing_bait',
    name: 'Premium Bait',
    description: 'Attracts fish more effectively',
    category: 'autoFishing',
    basePrice: 200,
    priceGrowth: 1.3,
    maxLevel: 10,
    effect: {
      type: 'fishPerSecond',
      value: 0.3,
    },
    unlockCondition: {
      upgrades: {
        wooden_rod: 1,
      },
    },
    icon: '🪱',
  },
  automatic_reel: {
    id: 'automatic_reel',
    name: 'Automatic Reel',
    description: 'Reels in fish automatically',
    category: 'autoFishing',
    basePrice: 1000,
    priceGrowth: 1.4,
    maxLevel: 5,
    effect: {
      type: 'fishPerSecond',
      value: 1,
    },
    unlockCondition: {
      upgrades: {
        fiber_rod: 1,
      },
    },
    icon: '⚙️',
  },
  
  // Pond upgrades
  pond_cleaning: {
    id: 'pond_cleaning',
    name: 'Pond Cleaning',
    description: 'Clean the pond to attract more fish',
    category: 'pond',
    basePrice: 75,
    priceGrowth: 1.2,
    maxLevel: 3,
    effect: {
      type: 'multiplier',
      target: 'fishPerSecond',
      value: 1.1, // 10% increase
    },
    unlockCondition: {
      fish: 100,
    },
    icon: '🧹',
  },
  pond_expansion: {
    id: 'pond_expansion',
    name: 'Pond Expansion',
    description: 'Expand your pond to hold more fish',
    category: 'pond',
    basePrice: 300,
    priceGrowth: 1.5,
    maxLevel: 3,
    effect: {
      type: 'multiplier',
      target: 'fishPerSecond',
      value: 1.2, // 20% increase
    },
    unlockCondition: {
      upgrades: {
        pond_cleaning: 1,
      },
    },
    icon: '🏞️',
  },
  fish_food: {
    id: 'fish_food',
    name: 'Fish Food',
    description: 'Feed the fish to help them multiply',
    category: 'pond',
    basePrice: 150,
    priceGrowth: 1.3,
    maxLevel: 5,
    effect: {
      type: 'multiplier',
      target: 'fishPerSecond',
      value: 1.1, // 10% increase
    },
    unlockCondition: {
      fish: 200,
    },
    icon: '🍞',
  },
  
  // Staff upgrades
  hire_kid: {
    id: 'hire_kid',
    name: 'Hire Neighborhood Kid',
    description: 'A local kid helps with fishing',
    category: 'staff',
    basePrice: 250,
    priceGrowth: 1.3,
    maxLevel: 5,
    effect: {
      type: 'fishPerSecond',
      value: 0.5,
    },
    unlockCondition: {
      fish: 200,
    },
    icon: '👦',
  },
  hire_fisherman: {
    id: 'hire_fisherman',
    name: 'Hire Amateur Fisherman',
    description: 'A fishing enthusiast joins your team',
    category: 'staff',
    basePrice: 1000,
    priceGrowth: 1.4,
    maxLevel: 3,
    effect: {
      type: 'fishPerSecond',
      value: 2,
    },
    unlockCondition: {
      upgrades: {
        hire_kid: 1,
      },
      fish: 500,
    },
    icon: '🧔',
  },
  
  // Special upgrades
  double_click: {
    id: 'double_click',
    name: 'Double Click',
    description: 'Occasionally catch twice as many fish per click',
    category: 'special',
    basePrice: 500,
    priceGrowth: 2,
    maxLevel: 1,
    effect: {
      type: 'special',
      value: 'doubleClick',
      chance: 0.1, // 10% chance
    },
    unlockCondition: {
      fish: 300,
    },
    icon: '✌️',
  },
  rare_fish_chance: {
    id: 'rare_fish_chance',
    name: 'Rare Fish Lure',
    description: 'Increases the chance of finding rare fish',
    category: 'special',
    basePrice: 1000,
    priceGrowth: 1.5,
    maxLevel: 3,
    effect: {
      type: 'special',
      value: 'rareFish',
      chance: 0.05, // +5% chance per level
    },
    unlockCondition: {
      fish: 500,
    },
    icon: '✨',
  },
};

export default upgrades;

/**
 * Get all upgrades
 * @returns {Object} All upgrades
 */
export const getAllUpgrades = () => upgrades;

/**
 * Get upgrades by category
 * @param {string} category - Category to filter by
 * @returns {Object} Filtered upgrades
 */
export const getUpgradesByCategory = (category) => {
  return Object.values(upgrades).filter(upgrade => upgrade.category === category);
};

/**
 * Check if an upgrade is available based on conditions
 * @param {Object} upgrade - Upgrade to check
 * @param {Object} gameState - Current game state
 * @returns {boolean} Whether the upgrade is available
 */
export const isUpgradeAvailable = (upgrade, gameState) => {
  if (!upgrade.unlockCondition) return true;
  
  // Check fish requirement
  if (upgrade.unlockCondition.fish && gameState.fish < upgrade.unlockCondition.fish) {
    return false;
  }
  
  // Check upgrade requirements
  if (upgrade.unlockCondition.upgrades) {
    for (const [upgradeId, requiredLevel] of Object.entries(upgrade.unlockCondition.upgrades)) {
      const playerUpgrade = gameState.upgrades[upgradeId];
      if (!playerUpgrade || playerUpgrade.level < requiredLevel) {
        return false;
      }
    }
  }
  
  return true;
}; 