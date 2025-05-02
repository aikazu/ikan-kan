import { Tank, Upgrade, Location, GameState, FishSpecies } from './gameModels';
import { createRandomFish } from './gameUtils';

// Initial fish species data
export const initialFishSpecies: Record<string, FishSpecies> = {
  common: {
    id: 'common',
    name: 'Common Fish',
    color: '#FFA500', // Orange
    basePointValue: 1,
    breedingBonus: 0,
    rarity: 1, // Most common
  },
  goldie: {
    id: 'goldie',
    name: 'Goldie',
    color: '#FFD700', // Gold
    basePointValue: 2, // Generates more points
    breedingBonus: 0.01, // Slightly better breeding chance
    rarity: 3, // Less common
  },
  speedy: {
    id: 'speedy',
    name: 'Speedy Fin',
    color: '#ADD8E6', // Light blue
    basePointValue: 1,
    breedingBonus: 0,
    rarity: 2, // Somewhat common
    // Can add speed multiplier later
  },
};

// Initial tanks data with 5 levels
export const initialTanks: Record<string, Tank> = {
  fishBowl: {
    id: 'fishBowl',
    name: 'Fish Bowl',
    capacity: 3,
    cost: 0,
    unlocked: true,
    level: 1
  },
  smallAquarium: {
    id: 'smallAquarium',
    name: 'Small Aquarium',
    capacity: 10,
    cost: 50,
    unlocked: false,
    level: 2
  },
  largeAquarium: {
    id: 'largeAquarium',
    name: 'Large Aquarium',
    capacity: 30,
    cost: 250,
    unlocked: false,
    level: 3
  },
  homePond: {
    id: 'homePond',
    name: 'Home Pond',
    capacity: 100,
    cost: 1000,
    unlocked: false,
    level: 4
  },
  indoorReef: {
    id: 'indoorReef',
    name: 'Indoor Reef System',
    capacity: 300,
    cost: 5000,
    unlocked: false,
    level: 5
  }
};

// Initial upgrades data
export const initialUpgrades: Record<string, Upgrade> = {
  autoFeeder: {
    id: 'autoFeeder',
    name: 'Auto-Feeder',
    description: 'Feeds fish once every 10 seconds',
    cost: 100,
    purchased: false,
    unlocked: true,
    effect: {
      type: 'autoFeedRate',
      value: 0.1,
    },
  },
  premiumFood: {
    id: 'premiumFood',
    name: 'Premium Fish Food',
    description: 'Clicking produces 2 FP and 7% breeding chance',
    cost: 200,
    purchased: false,
    unlocked: true,
    effect: {
      type: 'clickPower',
      value: 2,
    },
  },
  breedingSupplements: {
    id: 'breedingSupplements',
    name: 'Breeding Supplements',
    description: 'Increases breeding chance by 5%',
    cost: 300,
    purchased: false,
    unlocked: true,
    effect: {
      type: 'breedingChance',
      value: 0.1, // 10% total chance
    },
  },
};

// Initial locations
export const initialLocations: Record<string, Location> = {
  'location-1': {
    id: 'location-1',
    name: 'Home Aquarium',
    active: true,
    tankId: 'fishBowl',
    fishCount: 1,
    fish: [
      createRandomFish('fish-1', 'common', false, 'location-1', initialFishSpecies['common'])
    ],
    unlocked: true,
    cost: 0
  },
  'location-2': {
    id: 'location-2',
    name: 'Office Tank',
    active: false,
    tankId: 'fishBowl',
    fishCount: 0,
    fish: [],
    unlocked: false,
    cost: 2500
  },
  'location-3': {
    id: 'location-3',
    name: 'Beach Resort',
    active: false,
    tankId: 'fishBowl',
    fishCount: 0,
    fish: [],
    unlocked: false,
    cost: 10000
  }
};

// Define initial state
export const initialState: GameState = {
  version: '0.3.4',
  fishPoints: 0,
  fishCount: 1, // Start with one fish
  clickPower: 1,
  autoFeedRate: 0,
  breedingChance: 0.05, // 5% initial chance
  currentLocationId: 'location-1',
  tanks: initialTanks,
  locations: initialLocations,
  upgrades: initialUpgrades,
  fishSpecies: initialFishSpecies,
  discoveredSpecies: ['common'],
  lastSaved: Date.now(),
  lastTick: Date.now(),
  capacityReached: false,
  breedingEvent: {
    occurred: false,
    position: null,
    timestamp: 0,
    parentId: undefined,
    locationId: 'location-1'
  },
}; 