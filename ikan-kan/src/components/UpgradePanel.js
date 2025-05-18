import React, { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  Tab, 
  Tabs, 
  Divider, 
  Tooltip,
  Chip,
  Grid,
  Alert,
  CircularProgress
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

import { selectFish, selectUpgrades, purchaseUpgrade } from '../store/gameSlice';
import { isUpgradeAvailable, getUpgradesByCategory, getAllUpgrades } from '../data/upgrades';
import { calculateUpgradePrice, formatNumber } from '../game/core';

// Component for displaying upgrade effect description
const UpgradeEffectDescription = ({ upgrade }) => {
  const getEffectDescription = () => {
    if (upgrade.effect.type === 'clickPower') {
      return `+${upgrade.effect.value} fish per click`;
    } else if (upgrade.effect.type === 'fishPerSecond') {
      return `+${upgrade.effect.value} fish per second`;
    } else if (upgrade.effect.type === 'multiplier') {
      const percent = (upgrade.effect.value - 1) * 100;
      return `+${percent}% ${upgrade.effect.target === 'fishPerSecond' ? 'fish per second' : 'fish per click'}`;
    } else if (upgrade.effect.type === 'special') {
      if (upgrade.effect.value === 'doubleClick') {
        return `${upgrade.effect.chance * 100}% chance to double click`;
      } else if (upgrade.effect.value === 'rareFish') {
        return `+${upgrade.effect.chance * 100}% chance to find rare fish`;
      }
      return 'Special effect';
    }
    return '';
  };

  return (
    <Typography variant="body2" color="primary.main" sx={{ 
      fontWeight: 'medium',
      fontSize: '0.7rem',
      mb: 0.3,
      bgcolor: 'rgba(25, 118, 210, 0.08)',
      px: 0.8,
      py: 0.2,
      borderRadius: 1,
      display: 'inline-block'
    }}>
      {getEffectDescription()}
    </Typography>
  );
};

// Component for upgrade purchase button
const UpgradePurchaseButton = ({ upgrade, fish, ownedLevel, maxLevel, onPurchase }) => {
  const cost = calculateUpgradePrice(upgrade.basePrice, ownedLevel, upgrade.priceGrowth);
  const canAfford = fish >= cost;
  const isMaxLevel = ownedLevel >= maxLevel;
  const isDisabled = isMaxLevel || !canAfford;

  return (
    <Tooltip 
      title={
        isMaxLevel 
          ? 'Max level reached' 
          : !canAfford 
            ? 'Not enough fish' 
            : 'Purchase upgrade'
      } 
      arrow
    >
      <div> {/* Wrapper div for disabled button tooltip */}
        <Button
          variant={isMaxLevel ? "outlined" : "contained"}
          size="small"
          color={isMaxLevel ? "success" : canAfford ? "success" : "primary"}
          disabled={isDisabled}
          onClick={() => onPurchase(upgrade)}
          sx={{ 
            minWidth: '80px',
            py: 0.2,
            px: 1,
            fontWeight: 'bold',
            fontSize: '0.75rem',
            height: 24,
            borderRadius: 1.5,
            textTransform: 'none'
          }}
        >
          {isMaxLevel ? 'Maxed' : `${formatNumber(cost)} 🐟`}
        </Button>
      </div>
    </Tooltip>
  );
};

// Component for a single upgrade item
const UpgradeItem = ({ upgrade, fish, ownedUpgrades, onPurchase }) => {
  if (!upgrade || !upgrade.id) {
    return null;
  }
  
  try {
    const ownedLevel = ownedUpgrades[upgrade.id]?.level || 0;
    const maxLevel = upgrade.maxLevel;
    const isMaxLevel = ownedLevel >= maxLevel;
    
    const cost = calculateUpgradePrice(upgrade.basePrice, ownedLevel, upgrade.priceGrowth);
    const canAfford = fish >= cost;
    
    const isDisabled = isMaxLevel || !canAfford;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.3 }}
        key={upgrade.id}
        layout
      >
        <Card 
          sx={{ 
            mb: 1.5, 
            borderRadius: 2,
            overflow: 'hidden',
            position: 'relative',
            border: canAfford && !isMaxLevel ? '1px solid #4caf50' : '1px solid rgba(0,0,0,0.12)',
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: isDisabled ? 'none' : 'translateY(-2px)',
              boxShadow: isDisabled ? 1 : 3
            },
            opacity: isDisabled ? 0.8 : 1,
            bgcolor: isMaxLevel ? 'rgba(76, 175, 80, 0.04)' : 'white',
          }}
          elevation={1}
        >
          <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
            <Grid container spacing={1} alignItems="center">
              {/* Icon and name section */}
              <Grid item xs={7} sx={{ display: 'flex', alignItems: 'center' }}>
                <Box 
                  sx={{ 
                    fontSize: '1.2rem', 
                    mr: 1.2, 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'rgba(25, 118, 210, 0.1)',
                    borderRadius: '50%',
                    width: 32,
                    height: 32,
                    flexShrink: 0
                  }}
                >
                  {upgrade.icon}
                </Box>
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', mb: 0.3 }}>
                    <Typography variant="subtitle1" sx={{ 
                      fontWeight: 'bold',
                      fontSize: '0.9rem',
                      lineHeight: 1.2,
                      mr: 1
                    }}>
                      {upgrade.name}
                    </Typography>
                    {ownedLevel > 0 && (
                      <Chip 
                        label={`Lvl ${ownedLevel}`} 
                        size="small"
                        color="primary"
                        sx={{ 
                          height: 18, 
                          fontSize: '0.65rem', 
                          fontWeight: 'bold',
                          '& .MuiChip-label': { px: 0.8 } 
                        }}
                      />
                    )}
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ 
                    fontSize: '0.75rem',
                    lineHeight: 1.2, 
                    display: '-webkit-box',
                    overflow: 'hidden',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 1,
                  }}>
                    {upgrade.description}
                  </Typography>
                </Box>
              </Grid>
              
              {/* Effect and purchase button */}
              <Grid item xs={5} sx={{ textAlign: 'right' }}>
                {isMaxLevel ? (
                  <Typography variant="body2" color="success.main" sx={{ 
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    fontSize: '0.7rem',
                    mb: 0.3
                  }}>
                    ✓ MAX
                  </Typography>
                ) : (
                  canAfford && (
                    <Chip 
                      label="Available!" 
                      size="small"
                      color="success"
                      sx={{ 
                        height: 18, 
                        fontSize: '0.65rem', 
                        fontWeight: 'bold',
                        mb: 0.3,
                        '& .MuiChip-label': { px: 0.8 } 
                      }}
                    />
                  )
                )}
                
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end'
                }}>
                  <UpgradeEffectDescription upgrade={upgrade} />
                  <UpgradePurchaseButton 
                    upgrade={upgrade}
                    fish={fish}
                    ownedLevel={ownedLevel}
                    maxLevel={maxLevel}
                    onPurchase={onPurchase}
                  />
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </motion.div>
    );
  } catch (err) {
    console.error(`Error rendering upgrade ${upgrade?.id}:`, err);
    return null;
  }
};

// Component for category tabs
const CategoryTabs = ({ activeTab, categoryCounts, onChange }) => {
  return (
    <Box sx={{ 
      bgcolor: '#f5f9ff', 
      position: 'sticky', 
      top: 0, 
      zIndex: 10,
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
    }}>
      <Tabs 
        value={activeTab} 
        onChange={onChange} 
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{ 
          px: 1,
          pt: 1,
          pb: 0.5,
          '& .MuiTab-root': {
            fontWeight: 'bold',
            minWidth: '60px',
            px: 1,
            py: 0.5,
            fontSize: '0.7rem'
          },
          '& .Mui-selected': {
            color: '#1976d2',
          },
          '& .MuiTabs-scrollButtons': {
            color: '#1976d2',
          }
        }}
      >
        <Tab 
          label={`CLICK${categoryCounts.clickPower ? ` (${categoryCounts.clickPower})` : ''}`} 
          value="clickPower" 
        />
        <Tab 
          label={`RODS${categoryCounts.fishingRod ? ` (${categoryCounts.fishingRod})` : ''}`} 
          value="fishingRod" 
        />
        <Tab 
          label={`AUTO${categoryCounts.autoFishing ? ` (${categoryCounts.autoFishing})` : ''}`} 
          value="autoFishing" 
        />
        <Tab 
          label={`POND${categoryCounts.pond ? ` (${categoryCounts.pond})` : ''}`} 
          value="pond" 
        />
        <Tab 
          label={`STAFF${categoryCounts.staff ? ` (${categoryCounts.staff})` : ''}`} 
          value="staff" 
        />
        <Tab 
          label={`SPEC${categoryCounts.special ? ` (${categoryCounts.special})` : ''}`} 
          value="special" 
        />
      </Tabs>
      <Divider />
    </Box>
  );
};

// Component for no upgrades available message
const NoUpgradesMessage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      key="no-upgrades"
    >
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        height: '100%',
        p: 2
      }}>
        <Typography variant="body2" color="text.secondary" sx={{ 
          p: 2, 
          textAlign: 'center',
          bgcolor: 'rgba(0,0,0,0.03)',
          borderRadius: 2,
          width: '100%',
          fontSize: '0.85rem'
        }}>
          <Box sx={{ fontSize: '2rem', mb: 1 }}>🔍</Box>
          No upgrades available in this category yet.
          <Box component="p" sx={{ mt: 1, fontWeight: 'bold' }}>
            Keep fishing to unlock more!
          </Box>
        </Typography>
      </Box>
    </motion.div>
  );
};

// Main UpgradePanel component
const UpgradePanel = () => {
  const dispatch = useDispatch();
  const fish = useSelector(selectFish);
  const ownedUpgrades = useSelector(selectUpgrades);
  
  const [activeTab, setActiveTab] = useState('clickPower');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
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
      const validCategories = ['clickPower', 'fishingRod', 'autoFishing', 'pond', 'staff', 'special'];
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
  
  // Filter upgrades by selected category and availability
  const filteredUpgrades = useMemo(() => {
    try {
      if (!activeTab) return [];
      
      const gameState = { fish, upgrades: ownedUpgrades };
      const categoryUpgrades = getUpgradesByCategory(activeTab);
      
      if (!Array.isArray(categoryUpgrades)) {
        console.error('getUpgradesByCategory did not return an array:', categoryUpgrades);
        return [];
      }
      
      const availableUpgrades = categoryUpgrades.filter(upgrade => {
        if (!upgrade || typeof upgrade !== 'object') {
          console.error('Invalid upgrade in category:', upgrade);
          return false;
        }
        return isUpgradeAvailable(upgrade, gameState);
      });
      
      return availableUpgrades;
    } catch (err) {
      console.error('Error filtering upgrades:', err);
      setError('Error loading upgrades. Please try again.');
      return [];
    }
  }, [activeTab, fish, ownedUpgrades]);
  
  // Calculate upgrade counts for each category
  const categoryCounts = useMemo(() => {
    try {
      const gameState = { fish, upgrades: ownedUpgrades };
      const allUpgrades = getAllUpgrades();
      const counts = {};
      
      ['clickPower', 'fishingRod', 'autoFishing', 'pond', 'staff', 'special'].forEach(category => {
        const categoryUpgrades = Object.values(allUpgrades).filter(upgrade => 
          upgrade.category === category && isUpgradeAvailable(upgrade, gameState)
        );
        counts[category] = categoryUpgrades.length;
      });
      
      return counts;
    } catch (err) {
      console.error('Error calculating category counts:', err);
      return {};
    }
  }, [fish, ownedUpgrades]);

  return (
    <Box sx={{ 
      width: '100%', 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column'
    }}>
      {/* Error alert */}
      {error && (
        <Alert 
          severity="error" 
          onClose={() => setError(null)}
          sx={{ m: 1, mt: 0, py: 0.5 }}
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
        px: 1,
        py: 1,
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column'
      }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
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