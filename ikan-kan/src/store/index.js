import { configureStore } from '@reduxjs/toolkit';
import gameReducer, {
  setClickPower,
  setFishPerSecond,
  discoverFish,
  setGamePhase,
  addKnowledge,
  completeResearch,
  setGlobalFishValueMultiplier,
  setBonusRareFishChance
} from './gameSlice';

// Middleware to handle game logic after certain actions
const gameLogicMiddleware = store => next => action => {
  const result = next(action);

  // Handle automatic discovery of default fish for a new phase
  if (action.type === 'game/setGamePhase') {
    const newPhase = action.payload;
    const state = store.getState().game; // Get state *after* phase has been set
    if (newPhase === 'lake' && !state.discoveredFish['default_lake_fish']) {
      store.dispatch(discoverFish({ speciesId: 'default_lake_fish' }));
    }
    // Add similar logic for other phases if they have default fish
    else if (newPhase === 'coastal' && !state.discoveredFish['default_coastal_fish']) {
      store.dispatch(discoverFish({ speciesId: 'default_coastal_fish' }));
    }
  }

  // Actions that might trigger a recalculation of game stats (FPS, ClickPower)
  if (action.type === 'game/purchaseUpgrade' || action.type === 'game/completeResearch') {
    const state = store.getState();
    const allUpgradesData = require('../data/upgrades').getAllUpgrades();
    const allResearchData = require('../data/research').getAllResearchItems();
    const ownedUpgrades = state.game.upgrades;
    const researchedItems = state.game.researchedItems;

    // Handle one-time effects of the specific action that triggered the middleware
    if (action.type === 'game/purchaseUpgrade') {
      const purchasedUpgradeId = action.payload.id;
      const purchasedUpgradeData = allUpgradesData[purchasedUpgradeId];
      if (purchasedUpgradeData) {
        if (purchasedUpgradeData.effect.type === 'unlockFish') {
          const speciesIdToUnlock = purchasedUpgradeData.effect.speciesId;
          if (speciesIdToUnlock) store.dispatch(discoverFish({ speciesId: speciesIdToUnlock }));
        } else if (purchasedUpgradeData.effect.type === 'grantKnowledge') {
          const knowledgeToGrant = purchasedUpgradeData.effect.value;
          if (knowledgeToGrant > 0) store.dispatch(addKnowledge(knowledgeToGrant));
        }
      }
    }
    // No specific one-time effects for completeResearch needed here, handled by reducer.

    // --- Recalculate click power and fish per second ---
    let totalClickPowerFromUpgrades = 0;
    let totalFishPerSecondFromUpgrades = 0;
    let globalClickMultiplierFromUpgrades = 1;
    let globalFpsMultiplierFromUpgrades = 1;

    // Temporary storage for base values per category from upgrades
    const baseValuesPerCategory = {
      clickPower: {},
      fishPerSecond: {}
    };

    // 1. Calculate base values from direct effect upgrades & collect global multipliers from upgrades
    Object.values(ownedUpgrades).forEach(upgrade => {
      const upgradeData = allUpgradesData[upgrade.id];
      if (!upgradeData) return;
      const { effect, category } = upgradeData;
      const level = upgrade.level;

      if (effect.type === 'clickPower') {
        totalClickPowerFromUpgrades += effect.value * level;
        // Store for category-specific research multipliers
        baseValuesPerCategory.clickPower[category] = (baseValuesPerCategory.clickPower[category] || 0) + (effect.value * level);
      } else if (effect.type === 'fishPerSecond') {
        totalFishPerSecondFromUpgrades += effect.value * level;
        baseValuesPerCategory.fishPerSecond[category] = (baseValuesPerCategory.fishPerSecond[category] || 0) + (effect.value * level);
      } else if (effect.type === 'multiplier') { // These are global multipliers from upgrades
        if (effect.target === 'clickPower') globalClickMultiplierFromUpgrades *= Math.pow(effect.value, level);
        else if (effect.target === 'fishPerSecond') globalFpsMultiplierFromUpgrades *= Math.pow(effect.value, level);
      }
    });

    // 2. Prepare research multipliers (category-specific)
    const researchCategoryMultipliers = {
      clickPower: {},
      fishPerSecond: {}
    };
    let calculatedGlobalFishValueMultiplier = 1;
    let calculatedBonusRareFishChance = 0;

    Object.keys(researchedItems).forEach(researchId => {
      const researchData = allResearchData[researchId];
      if (researchData && researchData.effect) {
        if (researchData.effect.type === 'categoryMultiplier') {
          const { category, value, targetStat } = researchData.effect;
          const statMap = targetStat === 'clickPower' ? researchCategoryMultipliers.clickPower : researchCategoryMultipliers.fishPerSecond;
          statMap[category] = (statMap[category] || 1) * value;
        } else if (researchData.effect.type === 'globalMultiplier' && researchData.effect.targetStat === 'fishValue') {
          calculatedGlobalFishValueMultiplier *= researchData.effect.value;
        } else if (researchData.effect.type === 'passiveBonus' && researchData.effect.bonusTarget === 'rareFishChance') {
          calculatedBonusRareFishChance += researchData.effect.value;
        }
      }
    });

    // 3. Apply research category multipliers to the base values from those categories
    let adjustedTotalClickPower = 0;
    for (const category in baseValuesPerCategory.clickPower) {
      const baseValue = baseValuesPerCategory.clickPower[category];
      const multiplier = researchCategoryMultipliers.clickPower[category] || 1;
      adjustedTotalClickPower += baseValue * multiplier;
    }
    // If no category-specific click power upgrades were present, but there might be global click power research
    if (Object.keys(baseValuesPerCategory.clickPower).length === 0 && totalClickPowerFromUpgrades > 0) {
        adjustedTotalClickPower = totalClickPowerFromUpgrades; // Should be 0 if no direct effect upgrades
    }


    let adjustedTotalFishPerSecond = 0;
    for (const category in baseValuesPerCategory.fishPerSecond) {
      const baseValue = baseValuesPerCategory.fishPerSecond[category];
      const multiplier = researchCategoryMultipliers.fishPerSecond[category] || 1;
      adjustedTotalFishPerSecond += baseValue * multiplier;
    }
    if (Object.keys(baseValuesPerCategory.fishPerSecond).length === 0 && totalFishPerSecondFromUpgrades > 0) {
        adjustedTotalFishPerSecond = totalFishPerSecondFromUpgrades; // Should be 0 if no direct effect upgrades
    }

    // Add the base 1 click power if no direct click power upgrades existed but research might apply to it.
    // Or ensure the base 1 click power is always the starting point before multipliers.
    let finalClickPower = 1 + adjustedTotalClickPower; // Start with base 1 click
    let finalFishPerSecond = adjustedTotalFishPerSecond; // Starts at 0 unless upgrades add to it

    // 4. Apply global multipliers from upgrades (type: 'multiplier')
    finalClickPower *= globalClickMultiplierFromUpgrades;
    finalFishPerSecond *= globalFpsMultiplierFromUpgrades;

    // 5. Apply truly global multipliers from upgrades (e.g., market_stall with type: 'globalMultiplier')
    Object.values(ownedUpgrades).forEach(upgrade => {
      const upgradeData = allUpgradesData[upgrade.id];
      if (upgradeData && upgradeData.effect && upgradeData.effect.type === 'globalMultiplier') {
        if (upgradeData.effect.target === 'allFishIncome' || upgradeData.effect.target === 'clickPower') {
          finalClickPower *= upgradeData.effect.value;
        }
        if (upgradeData.effect.target === 'allFishIncome' || upgrade.effect.target === 'fishPerSecond') {
          finalFishPerSecond *= upgradeData.effect.value;
        }
      }
    });
    
    // Ensure final values are reasonable (floor, decimal places)
    finalClickPower = Math.floor(finalClickPower);
    finalFishPerSecond = Math.floor(finalFishPerSecond * 10) / 10; // Round to 1 decimal

    store.dispatch(setClickPower(finalClickPower));
    store.dispatch(setFishPerSecond(finalFishPerSecond));
    store.dispatch(setGlobalFishValueMultiplier(calculatedGlobalFishValueMultiplier));
    store.dispatch(setBonusRareFishChance(calculatedBonusRareFishChance));

    // Check for Lake phase unlock conditions (only if an upgrade was purchased)
    if (action.type === 'game/purchaseUpgrade') {
      const finalState = store.getState().game; 
      if (finalState.phase === 'pond') {
        const fiberRodOwned = finalState.upgrades['fiber_rod']?.level >= 1;
        const hasEnoughFish = finalState.fish >= 1000;
        if (fiberRodOwned && hasEnoughFish) {
          store.dispatch(setGamePhase('lake'));
          console.log("Lake phase unlocked!"); 
        }
      }
    }

    // Check for Coastal Waters phase unlock conditions (after upgrade purchase or research completion)
    if (action.type === 'game/purchaseUpgrade' || action.type === 'game/completeResearch') {
      const finalState = store.getState().game;
      if (finalState.phase === 'lake') {
        const smallFishingBoatOwned = finalState.upgrades['small_fishing_boat']?.level >= 1;
        const lakeEcologyStudied = finalState.researchedItems['lake_ecology_study'];
        const hasEnoughFishCoastal = finalState.fish >= 5000;

        if (smallFishingBoatOwned && lakeEcologyStudied && hasEnoughFishCoastal) {
          store.dispatch(setGamePhase('coastal'));
          console.log("Coastal Waters phase unlocked!");
        }
      }
    }
  }
  
  return result;
};

export const store = configureStore({
  reducer: {
    game: gameReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }).concat(gameLogicMiddleware), // Renamed middleware
});

export default store; 