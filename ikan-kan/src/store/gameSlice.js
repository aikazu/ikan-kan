import { createSlice } from '@reduxjs/toolkit';
import { initialDiscoveredFish, getFishSpeciesById } from '../data/fishSpecies';

const initialState = {
  // Resources
  fish: 0,
  scales: 0,
  knowledge: 0,
  
  // Game state
  clickPower: 1,
  fishPerSecond: 0,
  phase: 'pond', // pond, lake, coastal, deepSea, ocean
  pondScaleChance: 0,
  globalFishValueMultiplier: 1, // New state for fish value
  bonusRareFishChance: 0, // New state for rare fish/item chance
  
  // Upgrades
  upgrades: {},
  researchedItems: {},
  
  // Collection
  discoveredFish: initialDiscoveredFish,
  
  // Staff
  staff: {},
  
  // Statistics
  totalFishClicked: 0,
  totalFishEarned: 0,
  
  // Settings
  lastSaved: null,
  lastActive: null,
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    // Click to catch fish
    catchFish: (state, action) => {
      // Determine which fish is caught. For now, let's assume a simple model.
      // This part would need to be more sophisticated to actually "catch" a specific species.
      // For now, the `amount` is just the number of generic fish.
      // The money from fish will use the base value of a 'representative' fish or a global average.
      // Let's assume for now `action.payload` can be an object `{ count: number, speciesId: string }`
      // or just `state.clickPower` for generic fish.

      let fishCaughtCount = state.clickPower;
      let moneyEarned = state.clickPower; // Base money, will be adjusted

      // If a specific species is caught (e.g., through a more complex catch mechanic later)
      // For now, we'll simplify and assume clickPower is # of generic "pond fish" value equivalent
      // and apply bonuses based on current phase and discovered special fish.

      // Apply global fish value multiplier
      moneyEarned *= state.globalFishValueMultiplier;


      state.fish += moneyEarned; // Using 'fish' as currency for now.
      state.totalFishClicked += fishCaughtCount; // Tracks number of clicks/catches
      state.totalFishEarned += moneyEarned; // Tracks total currency earned

      // Bonuses based on game phase and discovered fish (or research)
      // This section needs to be more dynamic based on actual caught fish species in a more advanced model.
      // For now, it applies generally per click.

      const currentRareBonus = state.bonusRareFishChance;

      if (state.phase === 'pond') {
        if (state.pondScaleChance > 0 && Math.random() < (state.pondScaleChance + currentRareBonus)) {
          state.scales += 1;
        }
      } else if (state.phase === 'lake') {
        const lakeTrout = state.discoveredFish['lake_trout'];
        if (lakeTrout && lakeTrout.scaleChance && Math.random() < (lakeTrout.scaleChance + currentRareBonus)) {
          state.scales += 1;
        }
        const goldenPerch = state.discoveredFish['golden_perch'];
        if (goldenPerch && goldenPerch.knowledgeChance && Math.random() < (goldenPerch.knowledgeChance + currentRareBonus)) {
          state.knowledge += 1;
        }
      } else if (state.phase === 'coastal') {
        // Example: If coastal_cod (or other coastal fish) has a scaleChance or other bonus
        const coastalCod = state.discoveredFish['coastal_cod']; // Assuming coastal_cod is defined
        if (coastalCod && coastalCod.scaleChance && Math.random() < (coastalCod.scaleChance + currentRareBonus)) {
            state.scales += 1; // Example: coastal cod drops scales
        }
        // Add other coastal fish bonuses here
      }
      // Future: Add logic for other phases and more specific fish bonuses
    },
    
    // Add passive fish income
    addFishPassive: (state, action) => {
      const amount = action.payload || state.fishPerSecond;
      state.fish += amount;
      state.totalFishEarned += amount;
    },
    
    // Add knowledge points
    addKnowledge: (state, action) => {
      const amount = action.payload;
      if (amount > 0) {
        state.knowledge += amount;
        // Potentially add a notification for knowledge gain
      }
    },
    
    // Complete a research item
    completeResearch: (state, action) => {
      const { researchId, cost } = action.payload;
      if (state.knowledge >= cost && !state.researchedItems[researchId]) {
        state.knowledge -= cost;
        state.researchedItems[researchId] = {
          completedAt: new Date().toISOString(),
        };
        // Effects of research will be handled by middleware or by recalculating stats
      }
    },
    
    // Purchase upgrade
    purchaseUpgrade: (state, action) => {
      const { id, cost, level = 1 } = action.payload;
      
      // Check if player can afford upgrade
      if (state.fish >= cost) {
        state.fish -= cost;
        
        // Add or update upgrade
        if (state.upgrades[id]) {
          state.upgrades[id].level += level;
        } else {
          state.upgrades[id] = { 
            id, 
            level,
            purchasedAt: new Date().toISOString(),
          };
        }
        
        // Apply upgrade effects - handled by middleware (middleware will dispatch discoverFish)
      }
    },
    
    // Discover a new fish
    discoverFish: (state, action) => {
      const { speciesId } = action.payload;
      const speciesData = getFishSpeciesById(speciesId);

      if (speciesData && !state.discoveredFish[speciesId]) {
        state.discoveredFish[speciesId] = {
          ...speciesData,
          discoveredAt: new Date().toISOString(),
        };

        // If this fish provides a scale chance and is a pond fish (for this specific upgrade)
        if (speciesData.scaleChance && speciesData.locations.includes('pond')) {
            // This logic is tied to the 'attract_new_fish' upgrade's bonusEffect design.
            // A more generic system might directly use speciesData.scaleChance for any fish.
            state.pondScaleChance = Math.max(state.pondScaleChance, speciesData.scaleChance);
        }
      }
    },
    
    // Hire staff
    hireStaff: (state, action) => {
      const { id, cost, details } = action.payload;
      
      // Check if player can afford staff
      if (state.fish >= cost) {
        state.fish -= cost;
        
        // Add or update staff
        if (state.staff[id]) {
          state.staff[id].count += 1;
        } else {
          state.staff[id] = { 
            ...details,
            count: 1,
            hiredAt: new Date().toISOString(),
          };
        }
      }
    },
    
    // Update game phase
    setGamePhase: (state, action) => {
      state.phase = action.payload;
    },
    
    // Update click power
    setClickPower: (state, action) => {
      state.clickPower = action.payload;
    },
    
    // Update fish per second rate
    setFishPerSecond: (state, action) => {
      state.fishPerSecond = action.payload;
    },
    
    // New reducers for global multipliers
    setGlobalFishValueMultiplier: (state, action) => {
      state.globalFishValueMultiplier = action.payload;
    },
    setBonusRareFishChance: (state, action) => {
      state.bonusRareFishChance = action.payload;
    },
    
    // Save game timestamp
    saveGame: (state) => {
      state.lastSaved = new Date().toISOString();
      state.lastActive = new Date().toISOString();
    },
    
    // Update last active timestamp
    updateLastActive: (state) => {
      state.lastActive = new Date().toISOString();
    },
    
    // Load saved game
    loadGame: (state, action) => {
      const loadedState = {
        ...state,
        ...action.payload,
        lastActive: new Date().toISOString(),
      };
      // Ensure pondScaleChance has a default if not in save
      if (loadedState.pondScaleChance === undefined) {
        loadedState.pondScaleChance = 0;
      }
      // Ensure discoveredFish has a default if not in save (or merge if needed)
      if (!loadedState.discoveredFish || Object.keys(loadedState.discoveredFish).length === 0) {
        loadedState.discoveredFish = initialDiscoveredFish;
      }
      // Ensure researchedItems has a default if not in save
      if (loadedState.researchedItems === undefined) {
        loadedState.researchedItems = {};
      }
      return loadedState;
    },
    
    // Reset game (for prestige or testing)
    resetGame: () => {
      return { 
        ...initialState, 
        discoveredFish: { ...initialDiscoveredFish }, 
        pondScaleChance: 0, 
        knowledge: 0,
        researchedItems: {} // Reset research
      };
    },
  },
});

export const {
  catchFish,
  addFishPassive,
  addKnowledge,
  completeResearch,
  purchaseUpgrade,
  discoverFish,
  hireStaff,
  setGamePhase,
  setClickPower,
  setFishPerSecond,
  setGlobalFishValueMultiplier,
  setBonusRareFishChance,
  saveGame,
  updateLastActive,
  loadGame,
  resetGame,
} = gameSlice.actions;

// Selectors
export const selectFish = (state) => state.game.fish;
export const selectScales = (state) => state.game.scales;
export const selectKnowledge = (state) => state.game.knowledge;
export const selectClickPower = (state) => state.game.clickPower;
export const selectFishPerSecond = (state) => state.game.fishPerSecond;
export const selectGamePhase = (state) => state.game.phase;
export const selectUpgrades = (state) => state.game.upgrades;
export const selectResearchedItems = (state) => state.game.researchedItems;
export const selectGlobalFishValueMultiplier = (state) => state.game.globalFishValueMultiplier;
export const selectBonusRareFishChance = (state) => state.game.bonusRareFishChance;
export const selectDiscoveredFish = (state) => state.game.discoveredFish;
export const selectStaff = (state) => state.game.staff;
export const selectStatistics = (state) => ({
  totalFishClicked: state.game.totalFishClicked,
  totalFishEarned: state.game.totalFishEarned,
});

export default gameSlice.reducer; 