import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Fish, FishRarity, FishType, Statistics } from '../../types/game';

// Initialize empty statistics object
const initialStatistics: Statistics = {
  totalClicks: 0,
  totalFishBred: 0,
  totalFishDiscovered: 0,
  totalLuckyBubbles: 0,
  totalOfflineEarnings: 0,
  totalActiveBubbleTime: 0,
  highestPointsPerSecond: 0,
  currentPointsPerSecond: 0,
  totalUpgradesPurchased: 0,
  totalFeedersPurchased: 0,
  totalAchievementsCompleted: 0,
  totalFishPointsEarned: 0,
  playTime: 0,
  fishByType: Object.values(FishType).reduce((acc, type) => {
    acc[type] = 0;
    return acc;
  }, {} as Record<FishType, number>),
  fishByRarity: Object.values(FishRarity).reduce((acc, rarity) => {
    acc[rarity] = 0;
    return acc;
  }, {} as Record<FishRarity, number>),
  startDate: Date.now(),
  lastSessionDate: Date.now()
};

interface StatisticsState {
  statistics: Statistics;
}

const initialState: StatisticsState = {
  statistics: initialStatistics
};

export const statisticsSlice = createSlice({
  name: 'statistics',
  initialState,
  reducers: {
    incrementClicks: (state) => {
      state.statistics.totalClicks += 1;
    },
    
    recordNewFish: (state, action: PayloadAction<Fish>) => {
      const fish = action.payload;
      
      // Update fish count by type
      state.statistics.fishByType[fish.type] = (state.statistics.fishByType[fish.type] || 0) + 1;
      
      // Update fish count by rarity
      state.statistics.fishByRarity[fish.rarity] = (state.statistics.fishByRarity[fish.rarity] || 0) + 1;
    },
    
    incrementFishDiscovered: (state) => {
      state.statistics.totalFishDiscovered += 1;
    },
    
    incrementFishBred: (state) => {
      state.statistics.totalFishBred += 1;
    },
    
    incrementUpgradesPurchased: (state) => {
      state.statistics.totalUpgradesPurchased += 1;
    },
    
    incrementFeedersPurchased: (state) => {
      state.statistics.totalFeedersPurchased += 1;
    },
    
    incrementLuckyBubbles: (state) => {
      state.statistics.totalLuckyBubbles += 1;
    },
    
    incrementAchievementsCompleted: (state) => {
      state.statistics.totalAchievementsCompleted += 1;
    },
    
    addOfflineEarnings: (state, action: PayloadAction<number>) => {
      state.statistics.totalOfflineEarnings += action.payload;
    },
    
    addActiveBubbleTime: (state, action: PayloadAction<number>) => {
      state.statistics.totalActiveBubbleTime += action.payload;
    },
    
    updateCurrentPointsPerSecond: (state, action: PayloadAction<number>) => {
      state.statistics.currentPointsPerSecond = action.payload;
      
      // Check if this is a new highest points per second
      if (action.payload > state.statistics.highestPointsPerSecond) {
        state.statistics.highestPointsPerSecond = action.payload;
      }
    },
    
    addPlayTime: (state, action: PayloadAction<number>) => {
      state.statistics.playTime += action.payload;
      state.statistics.lastSessionDate = Date.now();
    },
    
    resetStatistics: (state) => {
      state.statistics = {
        ...initialStatistics,
        startDate: state.statistics.startDate, // Preserve original start date
        lastSessionDate: Date.now()
      };
    },
    
    // Action to help deserialize saved state
    updateStatisticsState: (state, action: PayloadAction<Partial<StatisticsState>>) => {
      return { ...state, ...action.payload };
    },
  }
});

export const { 
  incrementClicks,
  recordNewFish,
  incrementFishDiscovered,
  incrementFishBred,
  incrementUpgradesPurchased,
  incrementFeedersPurchased,
  incrementLuckyBubbles,
  incrementAchievementsCompleted,
  addOfflineEarnings,
  addActiveBubbleTime,
  updateCurrentPointsPerSecond,
  addPlayTime,
  resetStatistics,
  updateStatisticsState
} = statisticsSlice.actions;

export default statisticsSlice.reducer; 