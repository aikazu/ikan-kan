import { PayloadAction } from '@reduxjs/toolkit';

import { GameState } from '../gameModels';

// Buy a tank upgrade
export const buyTankReducer = (state: GameState, action: PayloadAction<string>) => {
  const tankId = action.payload;
  const tank = state.tanks[tankId];
  const currentLocation = state.locations[state.currentLocationId];
  
  if (tank && !tank.unlocked && state.fishPoints >= tank.cost) {
    // Purchase a new tank
    state.fishPoints -= tank.cost;
    state.tanks[tankId].unlocked = true;
    
    // Update the current location's tank
    currentLocation.tankId = tankId;
    
    // Reset capacity reached flag when buying a new tank
    state.capacityReached = currentLocation.fishCount >= tank.capacity;
    
    // Check if there's a next tank available
    const tankIds = Object.keys(state.tanks).sort((a, b) => 
      state.tanks[a].level - state.tanks[b].level
    );
    const currentIndex = tankIds.indexOf(tankId);
    // Confirm there is a next tank, but don't mark it as unlocked yet
    if (currentIndex < tankIds.length - 1) {
      // Next tank will be available for purchase
    }
  }
};

// Buy a new location
export const buyLocationReducer = (state: GameState, action: PayloadAction<string>) => {
  const locationId = action.payload;
  const location = state.locations[locationId];
  
  if (location && !location.unlocked && state.fishPoints >= location.cost) {
    // Purchase the new location
    state.fishPoints -= location.cost;
    state.locations[locationId].unlocked = true;
  }
};

// Buy an upgrade
export const buyUpgradeReducer = (state: GameState, action: PayloadAction<string>) => {
  const upgradeId = action.payload;
  const upgrade = state.upgrades[upgradeId];
  
  if (upgrade && !upgrade.purchased && state.fishPoints >= upgrade.cost) {
    state.fishPoints -= upgrade.cost;
    state.upgrades[upgradeId].purchased = true;
    
    // Apply upgrade effect
    if (upgrade.effect.type === 'clickPower') {
      state.clickPower = upgrade.effect.value;
      // The Premium Food also increases breeding chance
      if (upgradeId === 'premiumFood') {
        state.breedingChance = 0.07; // 7% chance
      }
    } else if (upgrade.effect.type === 'autoFeedRate') {
      state.autoFeedRate += upgrade.effect.value;
    } else if (upgrade.effect.type === 'breedingChance') {
      state.breedingChance = upgrade.effect.value;
    }
  }
}; 