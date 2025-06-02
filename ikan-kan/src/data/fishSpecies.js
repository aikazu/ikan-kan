// ikan-kan/src/data/fishSpecies.js
export const fishSpecies = {
  default_pond_fish: {
    id: 'default_pond_fish',
    name: 'Common Minnow',
    icon: '🐠',
    baseValue: 1,
    rarity: 'common',
    locations: ['pond'],
    description: 'A common fish found in small ponds.'
  },
  pond_dweller_1: {
    id: 'pond_dweller_1',
    name: 'Spotted Guppy',
    icon: '🐟', // Consider a distinct icon if available
    baseValue: 1, // Keep base value same for simplicity, bonus is scale chance
    rarity: 'uncommon',
    scaleChance: 0.01, // 1% chance to drop 1 scale
    locations: ['pond'],
    description: 'A slightly more exotic pond fish. Sometimes carries shiny scales.'
  },
  // Lake Fish
  default_lake_fish: { // A default, less exciting fish for the lake to start
    id: 'default_lake_fish',
    name: 'Common Bream',
    icon: '🐟', // This is the current lake icon from FishingArea.js
    baseValue: 3, 
    rarity: 'common',
    locations: ['lake'],
    description: 'A standard fish often found in lakes.'
  },
  lake_trout: {
    id: 'lake_trout',
    name: 'Lake Trout',
    icon: '🎣', // Placeholder, could be same as Bream or distinct if we have more icons
    baseValue: 5,
    rarity: 'uncommon_lake', // Using a more specific rarity
    scaleChance: 0.02, 
    locations: ['lake'],
    description: 'A prized game fish found in cool, clear lakes.'
  },
  golden_perch: {
    id: 'golden_perch',
    name: 'Golden Perch',
    icon: '🌟', // Placeholder
    baseValue: 10,
    rarity: 'rare_lake',
    scaleChance: 0.05, 
    knowledgeChance: 0.01, // 1% chance to grant 1 Knowledge point
    locations: ['lake'],
    description: 'A rare and valuable perch, known for its shimmering scales and the insights it offers.'
  },
  // Coastal Fish
  default_coastal_fish: {
    id: 'default_coastal_fish',
    name: 'Common Sardine',
    icon: '🐡', // Matches FishingArea.js icon for coastal
    baseValue: 8, 
    rarity: 'common',
    locations: ['coastal'],
    description: 'A small, oily fish commonly found in coastal waters, often schooling in large numbers.'
  },
  coastal_cod: {
    id: 'coastal_cod',
    name: 'Coastal Cod',
    icon: '🐟', // Placeholder icon, can be updated
    baseValue: 15,
    rarity: 'uncommon_coastal',
    scaleChance: 0.03, // Example value
    locations: ['coastal'],
    description: 'A popular saltwater fish, valued for its mild flavor. Found along the coast.'
  },
  // More fish for other locations can be added later
  // lake_fish_1: { ... }
};

export const getFishSpeciesById = (id) => fishSpecies[id];

export const getFishByLocation = (location) => {
  return Object.values(fishSpecies).filter(fish => fish.locations.includes(location));
};

// Initially, the player only knows about the default pond fish
export const initialDiscoveredFish = {
  default_pond_fish: {
    ...fishSpecies.default_pond_fish,
    discoveredAt: new Date().toISOString(), // Or null until first catch
  },
  // default_lake_fish will be discovered upon entering Lake phase or via an early Lake research/upgrade
  // default_coastal_fish will be discovered upon entering Coastal phase
}; 