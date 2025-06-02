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