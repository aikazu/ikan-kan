import { discoverFish, addKnowledge } from '../gameSlice';
import { getAllUpgrades } from '../../data/upgrades';

const itemEffectMiddleware = store => next => action => {
  // Let the action pass through first, so the state is updated by reducers
  const result = next(action);

  // Handle effects after specific actions
  if (action.type === 'game/setGamePhase') {
    const newPhase = action.payload;
    // Get state *after* phase has been set by the reducer
    const state = store.getState().game;

    if (newPhase === 'lake' && !state.discoveredFish['default_lake_fish']) {
      store.dispatch(discoverFish({ speciesId: 'default_lake_fish' }));
    } else if (newPhase === 'coastal' && !state.discoveredFish['default_coastal_fish']) {
      store.dispatch(discoverFish({ speciesId: 'default_coastal_fish' }));
    }
    // Add similar logic for other phases if they have default fish
  }

  if (action.type === 'game/purchaseUpgrade') {
    const purchasedUpgradeId = action.payload.id;
    const allUpgradesData = getAllUpgrades(); // Assuming this function fetches all static upgrade data
    const purchasedUpgradeData = allUpgradesData[purchasedUpgradeId];

    if (purchasedUpgradeData) {
      if (purchasedUpgradeData.effect.type === 'unlockFish') {
        const speciesIdToUnlock = purchasedUpgradeData.effect.speciesId;
        if (speciesIdToUnlock) {
          store.dispatch(discoverFish({ speciesId: speciesIdToUnlock }));
        }
      } else if (purchasedUpgradeData.effect.type === 'grantKnowledge') {
        const knowledgeToGrant = purchasedUpgradeData.effect.value;
        if (knowledgeToGrant > 0) {
          store.dispatch(addKnowledge(knowledgeToGrant));
        }
      }
    }
  }
  
  return result;
};

export default itemEffectMiddleware;
