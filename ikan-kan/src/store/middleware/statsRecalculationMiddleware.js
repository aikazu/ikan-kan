import {
  setClickPower,
  setFishPerSecond,
  setGlobalFishValueMultiplier,
  setBonusRareFishChance
} from '../gameSlice';
import { getAllUpgrades } from '../../data/upgrades';
import { getAllResearchItems } from '../../data/research';

const statsRecalculationMiddleware = store => next => action => {
  const result = next(action);

  if (action.type === 'game/purchaseUpgrade' || action.type === 'game/completeResearch') {
    const state = store.getState().game;
    const allUpgradesData = getAllUpgrades();
    const allResearchData = getAllResearchItems();
    const ownedUpgrades = state.upgrades;
    const researchedItems = state.researchedItems;

    let totalClickPowerFromUpgrades = 0;
    let totalFishPerSecondFromUpgrades = 0;
    let globalClickMultiplierFromUpgrades = 1;
    let globalFpsMultiplierFromUpgrades = 1;

    const baseValuesPerCategory = {
      clickPower: {},
      fishPerSecond: {}
    };

    Object.values(ownedUpgrades).forEach(upgrade => {
      const upgradeData = allUpgradesData[upgrade.id];
      if (!upgradeData) return;
      const { effect, category } = upgradeData;
      const level = upgrade.level;

      if (effect.type === 'clickPower') {
        totalClickPowerFromUpgrades += effect.value * level;
        baseValuesPerCategory.clickPower[category] = (baseValuesPerCategory.clickPower[category] || 0) + (effect.value * level);
      } else if (effect.type === 'fishPerSecond') {
        totalFishPerSecondFromUpgrades += effect.value * level;
        baseValuesPerCategory.fishPerSecond[category] = (baseValuesPerCategory.fishPerSecond[category] || 0) + (effect.value * level);
      } else if (effect.type === 'multiplier') {
        if (effect.target === 'clickPower') globalClickMultiplierFromUpgrades *= Math.pow(effect.value, level);
        else if (effect.target === 'fishPerSecond') globalFpsMultiplierFromUpgrades *= Math.pow(effect.value, level);
      }
    });

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

    let adjustedTotalClickPower = 0;
    for (const category in baseValuesPerCategory.clickPower) {
      const baseValue = baseValuesPerCategory.clickPower[category];
      const multiplier = researchCategoryMultipliers.clickPower[category] || 1;
      adjustedTotalClickPower += baseValue * multiplier;
    }
    if (Object.keys(baseValuesPerCategory.clickPower).length === 0 && totalClickPowerFromUpgrades > 0) {
        adjustedTotalClickPower = totalClickPowerFromUpgrades;
    }

    let adjustedTotalFishPerSecond = 0;
    for (const category in baseValuesPerCategory.fishPerSecond) {
      const baseValue = baseValuesPerCategory.fishPerSecond[category];
      const multiplier = researchCategoryMultipliers.fishPerSecond[category] || 1;
      adjustedTotalFishPerSecond += baseValue * multiplier;
    }
    if (Object.keys(baseValuesPerCategory.fishPerSecond).length === 0 && totalFishPerSecondFromUpgrades > 0) {
        adjustedTotalFishPerSecond = totalFishPerSecondFromUpgrades;
    }

    let finalClickPower = 1 + adjustedTotalClickPower;
    let finalFishPerSecond = adjustedTotalFishPerSecond;

    finalClickPower *= globalClickMultiplierFromUpgrades;
    finalFishPerSecond *= globalFpsMultiplierFromUpgrades;

    Object.values(ownedUpgrades).forEach(upgrade => {
      const upgradeData = allUpgradesData[upgrade.id];
      // Ensure upgradeData and its effect exist, and effect has a target property
      if (upgradeData && upgradeData.effect && typeof upgradeData.effect.target !== 'undefined') {
        if (upgradeData.effect.type === 'globalMultiplier') {
          if (upgradeData.effect.target === 'allFishIncome' || upgradeData.effect.target === 'clickPower') {
            finalClickPower *= upgradeData.effect.value;
          }
          // Check effect.target for fishPerSecond specifically for this part
          if (upgradeData.effect.target === 'allFishIncome' || upgradeData.effect.target === 'fishPerSecond') { 
            finalFishPerSecond *= upgradeData.effect.value;
          }
        }
      }
    });
    
    finalClickPower = Math.floor(finalClickPower);
    finalFishPerSecond = Math.floor(finalFishPerSecond * 10) / 10;

    store.dispatch(setClickPower(finalClickPower));
    store.dispatch(setFishPerSecond(finalFishPerSecond));
    store.dispatch(setGlobalFishValueMultiplier(calculatedGlobalFishValueMultiplier));
    store.dispatch(setBonusRareFishChance(calculatedBonusRareFishChance));
  }
  
  return result;
};

export default statsRecalculationMiddleware; 