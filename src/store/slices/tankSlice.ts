import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { Fish, FishType, Tank, TankType } from '../../types/game';
import { createFish } from '../../utils/fishUtils';

interface TankState {
  currentTank: Tank;
  fishPoints: number;
  firstClickPerformed: boolean; // Track if user has clicked to start the game
}

const initialState: TankState = {
  fishPoints: 0,
  firstClickPerformed: false, // Start with no click
  currentTank: {
    id: uuidv4(),
    type: TankType.FISH_BOWL,
    capacity: 5,
    fish: [
      createFish(FishType.GUPPY)
    ],
  }
};

export const tankSlice = createSlice({
  name: 'tank',
  initialState,
  reducers: {
    upgradeTank: (state, action: PayloadAction<TankType>) => {
      const newTankType = action.payload;
      let newCapacity = 5; // Default fish bowl
      
      switch (newTankType) {
        case TankType.SMALL_AQUARIUM:
          newCapacity = 30;
          break;
        case TankType.MEDIUM_AQUARIUM:
          newCapacity = 150;
          break;
        case TankType.LARGE_AQUARIUM:
          newCapacity = 600;
          break;
        case TankType.HOME_POND:
          newCapacity = 1800;
          break;
        case TankType.INDOOR_REEF:
          newCapacity = 3200;
          break;
      }
      
      state.currentTank = {
        ...state.currentTank,
        type: newTankType,
        capacity: newCapacity,
      };
    },
    
    addFish: (state, action: PayloadAction<Fish>) => {
      if (state.currentTank.fish.length < state.currentTank.capacity) {
        state.currentTank.fish.push(action.payload);
      }
    },
    
    levelUpFish: (state, action: PayloadAction<string>) => {
      const fishId = action.payload;
      const fishIndex = state.currentTank.fish.findIndex(fish => fish.id === fishId);
      
      if (fishIndex !== -1) {
        const fish = state.currentTank.fish[fishIndex];
        const newLevel = fish.level + 1;
        
        // Create an updated fish with the new level
        const updatedFish = {
          ...fish,
          level: newLevel,
          pointsPerSecond: fish.pointsPerSecond * 1.5, // 50% increase per level
        };
        
        // Replace the fish in the tank
        state.currentTank.fish[fishIndex] = updatedFish;
      }
    },
    
    addFishPoints: (state, action: PayloadAction<number>) => {
      state.fishPoints += action.payload;
    },
    
    spendFishPoints: (state, action: PayloadAction<number>) => {
      state.fishPoints -= action.payload;
    },
    
    // Mark the first click as performed
    setFirstClickPerformed: (state) => {
      state.firstClickPerformed = true;
    },
    
    // Action to help deserialize saved state
    updateTankState: (state, action: PayloadAction<Partial<TankState>>) => {
      return { ...state, ...action.payload };
    },
  }
});

export const { 
  upgradeTank, 
  addFish, 
  levelUpFish, 
  addFishPoints,
  spendFishPoints,
  setFirstClickPerformed,
  updateTankState
} = tankSlice.actions;

export default tankSlice.reducer; 