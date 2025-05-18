import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Resources
  fish: 0,
  scales: 0,
  knowledge: 0,
  
  // Game state
  clickPower: 1,
  fishPerSecond: 0,
  phase: 'pond', // pond, lake, coastal, deepSea, ocean
  
  // Upgrades
  upgrades: {},
  
  // Collection
  discoveredFish: {},
  
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
      const amount = action.payload || state.clickPower;
      state.fish += amount;
      state.totalFishClicked += amount;
      state.totalFishEarned += amount;
    },
    
    // Add passive fish income
    addFishPassive: (state, action) => {
      const amount = action.payload || state.fishPerSecond;
      state.fish += amount;
      state.totalFishEarned += amount;
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
        
        // Apply upgrade effects - handled by middleware
      }
    },
    
    // Discover a new fish
    discoverFish: (state, action) => {
      const { id, details } = action.payload;
      if (!state.discoveredFish[id]) {
        state.discoveredFish[id] = {
          ...details,
          discoveredAt: new Date().toISOString(),
        };
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
      return {
        ...state,
        ...action.payload,
        lastActive: new Date().toISOString(),
      };
    },
    
    // Reset game (for prestige or testing)
    resetGame: () => {
      return { ...initialState };
    },
  },
});

export const {
  catchFish,
  addFishPassive,
  purchaseUpgrade,
  discoverFish,
  hireStaff,
  setGamePhase,
  setClickPower,
  setFishPerSecond,
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
export const selectDiscoveredFish = (state) => state.game.discoveredFish;
export const selectStaff = (state) => state.game.staff;
export const selectStatistics = (state) => ({
  totalFishClicked: state.game.totalFishClicked,
  totalFishEarned: state.game.totalFishEarned,
});

export default gameSlice.reducer; 