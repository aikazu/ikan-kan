import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Box, 
  Alert,
  CircularProgress,
} from '@mui/material';
import { AnimatePresence } from 'framer-motion';

import { purchaseUpgrade } from '../store/gameSlice';
import { selectFish, selectUpgrades } from '../store/gameSelectors';
import { calculateUpgradePrice } from '../game/core';

// Import sub-components
import UpgradeEffectDescription from './upgrade/UpgradeEffectDescription';
import UpgradePurchaseButton from './upgrade/UpgradePurchaseButton';
import UpgradeItem from './upgrade/UpgradeItem';
import CategoryTabs from './upgrade/CategoryTabs';
import NoUpgradesMessage from './upgrade/NoUpgradesMessage';

// Import custom hooks
import { useFilteredUpgrades, useCategoryCounts } from './upgrade/upgradeHooks';

// Main UpgradePanel component
const UpgradePanel = () => {
  const dispatch = useDispatch();
  const fish = useSelector(selectFish);
  const ownedUpgrades = useSelector(selectUpgrades);
  
  const [activeTab, setActiveTab] = useState('clickPower');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Use custom hooks
  const filteredUpgrades = useFilteredUpgrades(activeTab, setError);
  const categoryCounts = useCategoryCounts(setError);

  // Force rerender on tab change
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 50);
  }, [activeTab]);
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    try {
      const validCategories = ['clickPower', 'fishingRod', 'autoFishing', 'pond', 'staff', 'vessels', 'special'];
      if (validCategories.includes(newValue)) {
        setActiveTab(newValue);
        setError(null);
      } else {
        console.error(`Invalid tab category: ${newValue}`);
        setError(`Error: Invalid category "${newValue}"`);
      }
    } catch (err) {
      console.error('Error changing tabs:', err);
      setError('Error changing tabs. Please try again.');
    }
  };
  
  // Handle upgrade purchase
  const handlePurchase = (upgrade) => {
    try {
      const level = ownedUpgrades[upgrade.id]?.level || 0;
      const cost = calculateUpgradePrice(upgrade.basePrice, level, upgrade.priceGrowth);
      
      dispatch(
        purchaseUpgrade({
          id: upgrade.id,
          cost,
          level: 1,
        })
      );
    } catch (err) {
      console.error('Error purchasing upgrade:', err);
      setError('Error purchasing upgrade. Please try again.');
    }
  };

  return (
    <Box sx={{ 
      width: '100%', 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      bgcolor: 'rgba(245, 249, 255, 0.5)',
    }}>
      {/* Error alert */}
      {error && (
        <Alert 
          severity="error" 
          onClose={() => setError(null)}
          sx={{ m: 2, mt: 1, py: 0.5 }}
        >
          {error}
        </Alert>
      )}
      
      {/* Tab navigation */}
      <CategoryTabs 
        activeTab={activeTab}
        categoryCounts={categoryCounts}
        onChange={handleTabChange}
      />
      
      {/* Upgrade list */}
      <Box sx={{ 
        overflowY: 'auto', 
        px: 2,
        py: 2,
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column'
      }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
            <CircularProgress size={30} />
          </Box>
        ) : (
          <AnimatePresence>
            {filteredUpgrades.length > 0 ? (
              filteredUpgrades.map(upgrade => (
                <UpgradeItem 
                  key={upgrade.id}
                  upgrade={upgrade}
                  fish={fish}
                  ownedUpgrades={ownedUpgrades}
                  onPurchase={handlePurchase}
                />
              ))
            ) : (
              <NoUpgradesMessage />
            )}
          </AnimatePresence>
        )}
      </Box>
    </Box>
  );
};

export default UpgradePanel; 