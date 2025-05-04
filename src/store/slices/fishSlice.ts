import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FishType } from '../../types/game';

interface FishState {
  discoveredFishTypes: FishType[];
  totalFishPointsEarned: number;
  totalFishBred: number;
}

const initialState: FishState = {
  discoveredFishTypes: [FishType.GUPPY],
  totalFishPointsEarned: 0,
  totalFishBred: 0
};

export const fishSlice = createSlice({
  name: 'fish',
  initialState,
  reducers: {
    discoverFishType: (state, action: PayloadAction<FishType>) => {
      const fishType = action.payload;
      
      // Only add if not already discovered
      if (!state.discoveredFishTypes.includes(fishType)) {
        state.discoveredFishTypes.push(fishType);
      }
    },
    trackFishBred: (state) => {
      state.totalFishBred += 1;
    },
    addFishPoints: (state, action: PayloadAction<number>) => {
      state.totalFishPointsEarned += action.payload;
    },
    // Action to help deserialize saved state
    updateFishState: (state, action: PayloadAction<Partial<FishState>>) => {
      return { ...state, ...action.payload };
    },
  }
});

export const { 
  discoverFishType, 
  trackFishBred, 
  addFishPoints,
  updateFishState
} = fishSlice.actions;

export default fishSlice.reducer; 