// Define types for the game state

export interface Fish {
  id: string;
  type: string;
  position: { x: number; y: number };
  velocity: { x: number; y: number };
  size: number;
  color: string;
  lastUpdate: number;
  isNew?: boolean; // Flag for newly created fish
  breeding?: boolean; // Flag for fish currently breeding
  locationId: string; // Which location this fish belongs to
}

export interface Tank {
  id: string;
  name: string;
  capacity: number;
  cost: number;
  unlocked: boolean;
  level: number; // Tank level 1-5
}

export interface Location {
  id: string;
  name: string;
  active: boolean;
  tankId: string;
  fishCount: number;
  fish: Fish[];
  unlocked: boolean;
  cost: number;
}

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  purchased: boolean;
  unlocked: boolean;
  effect: {
    type: string;
    value: number;
  };
}

export interface BreedingEvent {
  occurred: boolean;
  position: { x: number; y: number } | null;
  timestamp: number;
  parentId?: string; // ID of the parent fish
  locationId?: string; // Which location had the breeding event
}

export interface GameState {
  version: string;
  fishPoints: number;
  fishCount: number;
  clickPower: number;
  autoFeedRate: number;
  breedingChance: number;
  currentLocationId: string;
  capacityReached: boolean; // Flag to show when tank is full
  locations: Record<string, Location>;
  tanks: Record<string, Tank>;
  upgrades: Record<string, Upgrade>;
  lastSaved: number;
  lastTick: number;
  breedingEvent: BreedingEvent;
} 