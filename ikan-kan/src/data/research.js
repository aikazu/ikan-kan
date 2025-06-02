// ikan-kan/src/data/research.js

export const researchItems = {
  improved_rod_design: {
    id: 'improved_rod_design',
    name: 'Improved Rod Design',
    description: 'Apply basic engineering principles to improve fishing rod efficiency, boosting their output.',
    knowledgeCost: 5,
    icon: '🛠️',
    effect: {
      type: 'categoryMultiplier', // Specific type for multiplying output of an upgrade category
      category: 'fishingRod',     // The category of upgrades to affect
      value: 1.10,               // 10% increase
      targetStat: 'fishPerSecond' // The stat within that category's upgrades to boost (e.g. their FPS contribution)
    },
    unlockCondition: null, // Available by default if research panel is open
  },
  basic_lure_crafting: {
    id: 'basic_lure_crafting',
    name: 'Basic Lure Crafting',
    description: 'Learn to craft simple lures, making all automated fishing efforts slightly more effective.',
    knowledgeCost: 10,
    icon: '🪝',
    effect: {
      type: 'categoryMultiplier',
      category: 'autoFishing',
      value: 1.05, // 5% increase
      targetStat: 'fishPerSecond'
    },
    unlockCondition: {
      researchCompleted: ['improved_rod_design'] // Requires the previous research to be completed
    },
  },
  lake_ecology_study: {
    id: 'lake_ecology_study',
    name: 'Lake Ecology Study',
    description: 'Study the unique ecosystem of the lake to identify new fish species.',
    knowledgeCost: 15,
    icon: '🏞️',
    effect: {
      type: 'unlockFish',
      speciesId: 'lake_trout',
      // location: 'lake' // Not strictly needed by effect handler, but good for consistency
    },
    unlockCondition: {
      gamePhase: 'lake',
      researchCompleted: ['basic_lure_crafting']
    },
  },
  advanced_sonar_techniques: {
    id: 'advanced_sonar_techniques',
    name: 'Advanced Sonar',
    description: 'Develop sonar technology to find rarer, deeper-dwelling lake fish.',
    knowledgeCost: 30,
    icon: '📡',
    effect: {
      type: 'unlockFish',
      speciesId: 'golden_perch',
    },
    unlockCondition: {
      gamePhase: 'lake',
      researchCompleted: ['lake_ecology_study']
    },
  },
  marine_biology_fundamentals: {
    id: 'marine_biology_fundamentals',
    name: 'Marine Biology Fundamentals',
    description: 'Begin understanding the complex ecosystems of coastal waters. Unlocks the ability to discover more coastal fish.',
    knowledgeCost: 50,
    icon: '🌊',
    effect: {
      type: 'unlockFish',
      speciesId: 'coastal_cod', // Assumes coastal_cod will be added to fishSpecies.js
    },
    unlockCondition: {
      gamePhase: 'coastal',
      researchCompleted: ['advanced_sonar_techniques'] // Example dependency
    },
  },
  basic_fish_genetics: {
    id: 'basic_fish_genetics',
    name: 'Basic Fish Genetics',
    description: 'Study the genetic makeup of fish to understand basic breeding principles. Slightly increases the chance of discovering rare variants of currently known fish.',
    knowledgeCost: 75,
    icon: '🧬',
    effect: {
      type: 'passiveBonus', // New effect type
      bonusTarget: 'rareFishChance',
      value: 0.01, // 1% increase added to existing chances
    },
    unlockCondition: {
      gamePhase: 'coastal',
      researchCompleted: ['marine_biology_fundamentals']
    },
  },
  sustainable_harvesting_techniques: {
    id: 'sustainable_harvesting_techniques',
    name: 'Sustainable Harvesting Techniques',
    description: 'Learn methods to fish more selectively, improving the long-term health of fish populations and slightly boosting income from all fish caught.',
    knowledgeCost: 60,
    icon: '🎣',
    effect: {
      type: 'globalMultiplier', // Reusing existing type
      targetStat: 'fishValue', // New target stat for this type
      value: 1.05, // 5% increase to fish sale value
    },
    unlockCondition: {
      gamePhase: 'coastal',
      researchCompleted: ['marine_biology_fundamentals']
    },
  },
  // Example for future research
  // advanced_bait_techniques: {
  //   id: 'advanced_bait_techniques',
  //   name: 'Advanced Bait Techniques',
  //   description: 'Develop more effective bait, significantly boosting auto fishing rates.',
  //   knowledgeCost: 25,
  //   icon: '🧪',
  //   effect: {
  //     type: 'categoryMultiplier',
  //     category: 'autoFishing',
  //     value: 1.15, 
  //     targetStat: 'fishPerSecond'
  //   },
  //   unlockCondition: {
  //     researchCompleted: ['basic_lure_crafting'],
  //     gamePhase: 'lake' // Example: only available in Lake phase or later
  //   },
  // },
};

export const getAllResearchItems = () => researchItems;

export const getResearchItemById = (id) => researchItems[id];

/**
 * Checks if a research item is available to be researched.
 * @param {Object} researchItem - The research item to check.
 * @param {Object} gameState - The current game state (includes .knowledge, .researchedItems, .phase etc.)
 * @returns {boolean} True if the research item is available.
 */
export const isResearchAvailable = (researchItem, gameState) => {
  if (!researchItem) return false;

  // Check if already researched
  if (gameState.researchedItems && gameState.researchedItems[researchItem.id]) {
    return false; // Already completed
  }

  // Check unlock conditions
  if (researchItem.unlockCondition) {
    const { researchCompleted, gamePhase, fishOwned } = researchItem.unlockCondition;

    if (researchCompleted && researchCompleted.length > 0) {
      for (const reqResearchId of researchCompleted) {
        if (!gameState.researchedItems || !gameState.researchedItems[reqResearchId]) {
          return false; // Prerequisite research not done
        }
      }
    }

    if (gamePhase && gameState.phase !== gamePhase) {
      return false; // Not in the required game phase
    }
    
    if (fishOwned && gameState.fish < fishOwned) {
        return false; // Not enough fish (example condition type)
    }
    // Add other condition checks here: specific upgrades owned, total knowledge earned, etc.
  }

  return true; // All conditions met, or no conditions
}; 