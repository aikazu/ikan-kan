import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { Feeder, FeederType, AutoFeederSpeed } from '../../types/game';

interface FeederState {
  feeders: Feeder[];
  totalFeedersPurchased: number;
}

const initialState: FeederState = {
  feeders: [],
  totalFeedersPurchased: 0
};

// Helper function to map a level number to the appropriate AutoFeederSpeed enum value
const getSpeedLevelForLevel = (level: number): AutoFeederSpeed => {
  // Ensure the level is within bounds (1-5 for the enum)
  const cappedLevel = Math.min(Math.max(level, 1), 5);
  
  switch (cappedLevel) {
    case 1:
      return AutoFeederSpeed.LEVEL_1;
    case 2:
      return AutoFeederSpeed.LEVEL_2;
    case 3:
      return AutoFeederSpeed.LEVEL_3;
    case 4:
      return AutoFeederSpeed.LEVEL_4;
    case 5:
    default:
      return AutoFeederSpeed.LEVEL_5;
  }
};

export const feederSlice = createSlice({
  name: 'feeder',
  initialState,
  reducers: {
    purchaseFeeder: (state, action: PayloadAction<{feederType: FeederType, currentLevel: number}>) => {
      const { feederType, currentLevel } = action.payload;
      
      // Calculate feed rate for the new level: 4 * 2^currentLevel 
      // This gives us 4, 8, 16, 32, etc. FP/s
      const feedRate = 4 * Math.pow(2, currentLevel);
      const efficiency = 1.0; // All feeders have the same efficiency
      
      // Create new feeder with appropriate rate and proper level information
      const newFeeder: Feeder = {
        id: uuidv4(),
        type: feederType,
        feedRate,
        efficiency,
        // Store the current level as a number property to avoid issues with enum serialization
        speedLevel: getSpeedLevelForLevel(currentLevel + 1)
      };
      
      // Replace all existing feeders with the new, higher-level feeder
      // This ensures we only have one feeder at a time with the appropriate rate
      state.feeders = [newFeeder];
      
      // Update statistics for feeders
      state.totalFeedersPurchased += 1;
    },
    
    // Action to help deserialize saved state
    updateFeederState: (state, action: PayloadAction<Partial<FeederState>>) => {
      return { ...state, ...action.payload };
    },
  }
});

// Calculate the actual feeder level based on the feed rate
// Using logarithm: level = log₂(feedRate/4) + 1
export function calculateFeederLevel(feeders: Feeder[]): number {
  if (feeders.length === 0) return 0;
  
  // Get the first (and only) feeder's feed rate
  const feedRate = feeders[0].feedRate;
  // Calculate the level based on the formula feedRate = 4 * 2^(level-1)
  // So level = log₂(feedRate/4) + 1
  return Math.max(1, Math.round(Math.log2(feedRate / 4) + 1));
}

export const { 
  purchaseFeeder,
  updateFeederState
} = feederSlice.actions;

export default feederSlice.reducer; 