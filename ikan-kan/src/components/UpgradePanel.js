import React, { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Box, 
  Button, 
  CardContent, 
  Typography, 
  Tab, 
  Tabs, 
  Tooltip,
  Chip,
  Grid,
  Alert,
  CircularProgress,
  Paper,
  Stack,
  LinearProgress
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

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
    <Chip
      label={getEffectDescription()}
      size="small"
      sx={{ 
        fontWeight: 500,
        fontSize: '0.7rem',
        height: 20,
        bgcolor: 'rgba(33, 150, 243, 0.08)',
        color: '#1976d2',
        '& .MuiChip-label': { px: 1 },
        mb: 1,
      }}
    />
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
      placement="top"
    >
      <div> {/* Wrapper div for disabled button tooltip */}
        <Button
          variant={isMaxLevel ? "outlined" : "contained"}
          size="small"
          color={isMaxLevel ? "success" : "primary"}
          disabled={isDisabled}
          onClick={() => onPurchase(upgrade)}
          sx={{ 
            minWidth: '100px',
            py: 0.5,
            px: 1.5,
            fontWeight: 600,
            fontSize: '0.8rem',
            borderRadius: 2,
            textTransform: 'none',
            boxShadow: canAfford && !isMaxLevel ? 2 : 0,
            opacity: isDisabled && !isMaxLevel ? 0.85 : 1,
            '&:hover': {
              boxShadow: canAfford && !isMaxLevel ? 3 : 0,
            },
            '&.Mui-disabled': {
              bgcolor: isMaxLevel ? 'transparent' : 'primary.main',
              color: isMaxLevel ? 'success.main' : 'white',
              opacity: isMaxLevel ? 1 : 0.7,
            }
          }}
          endIcon={!isMaxLevel ? <KeyboardArrowRightIcon /> : null}
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
        <Paper 
          elevation={0}
          sx={{ 
            mb: 2,
            borderRadius: 3,
            overflow: 'hidden',
            position: 'relative',
            border: canAfford && !isMaxLevel 
              ? '1px solid rgba(25, 118, 210, 0.3)' 
              : isMaxLevel 
                ? '1px solid rgba(76, 175, 80, 0.3)' 
                : '1px solid rgba(0,0,0,0.08)',
            background: isMaxLevel 
              ? 'linear-gradient(to right, rgba(76, 175, 80, 0.04), rgba(76, 175, 80, 0.08))' 
              : canAfford 
                ? 'linear-gradient(to right, rgba(255,255,255,0.95), rgba(240,247,255,0.95))' 
                : 'rgba(255,255,255,0.85)',
            transition: 'all 0.2s ease',
            '&:hover': {
              transform: isDisabled ? 'none' : 'translateY(-2px)',
              boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
            },
            backdropFilter: 'blur(8px)',
          }}
        >
          <CardContent sx={{ p: 2 }}>
            <Grid container spacing={2} alignItems="center">
              {/* Icon and name section */}
              <Grid item xs={7}>
                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                  <Box 
                    sx={{ 
                      fontSize: '1.2rem', 
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: isMaxLevel ? 'rgba(76, 175, 80, 0.1)' : 'rgba(25, 118, 210, 0.1)',
                      borderRadius: 2,
                      width: 40,
                      height: 40,
                      flexShrink: 0,
                      mt: 0.3
                    }}
                  >
                    {upgrade.icon}
                  </Box>
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                      <Typography variant="subtitle1" sx={{ 
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        lineHeight: 1.2,
                        letterSpacing: '-0.01em',
                        mr: 1
                      }}>
                        {upgrade.name}
                      </Typography>
                      {ownedLevel > 0 && (
                        <Chip 
                          label={`Lvl ${ownedLevel}`} 
                          size="small"
                          color={isMaxLevel ? "success" : "primary"}
                          sx={{ 
                            height: 20, 
                            fontSize: '0.65rem', 
                            fontWeight: 600,
                            '& .MuiChip-label': { px: 1 } 
                          }}
                        />
                      )}
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ 
                      fontSize: '0.78rem',
                      lineHeight: 1.3, 
                      display: '-webkit-box',
                      overflow: 'hidden',
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: 2,
                      mb: 0.5,
                      maxWidth: '95%'
                    }}>
                      {upgrade.description}
                    </Typography>
                    <UpgradeEffectDescription upgrade={upgrade} />
                  </Box>
                </Stack>
              </Grid>
              
              {/* Progress and purchase button */}
              <Grid item xs={5} sx={{ textAlign: 'right' }}>
                <Stack spacing={1} alignItems="flex-end">
                  {isMaxLevel ? (
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      bgcolor: 'rgba(76, 175, 80, 0.1)',
                      color: '#4CAF50',
                      fontWeight: 600,
                      fontSize: '0.75rem',
                      borderRadius: 1,
                      px: 1,
                      py: 0.3,
                      mb: 0.5
                    }}>
                      Max Level Reached ✓
                    </Box>
                  ) : (
                    <Box sx={{ width: '100%', mb: 0.5 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                          {`Level ${ownedLevel}/${maxLevel}`}
                          {!isMaxLevel && (
                            <Typography 
                              component="span" 
                              variant="caption" 
                              color="primary" 
                              sx={{ 
                                fontWeight: 600,
                                display: 'inline',
                                ml: 0.5
                              }}
                            >
                              Ready to Upgrade!
                            </Typography>
                          )}
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={(ownedLevel / maxLevel) * 100} 
                        sx={{ 
                          height: 6, 
                          borderRadius: 3,
                          bgcolor: 'rgba(0,0,0,0.05)',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: isMaxLevel ? '#4CAF50' : '#1976d2',
                          }
                        }}
                      />
                    </Box>
                  )}
                  
                  <UpgradePurchaseButton 
                    upgrade={upgrade}
                    fish={fish}
                    ownedLevel={ownedLevel}
                    maxLevel={maxLevel}
                    onPurchase={onPurchase}
                  />
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Paper>
      </motion.div>
    );
  } catch (err) {
    console.error(`Error rendering upgrade ${upgrade?.id}:`, err);
    return null;
  }
};

// Component for category tabs
const CategoryTabs = ({ activeTab, categoryCounts, onChange }) => {
  const tabCategories = [
    { value: 'clickPower', label: 'CLICK', count: categoryCounts.clickPower || 0 },
    { value: 'fishingRod', label: 'RODS', count: categoryCounts.fishingRod || 0 },
    { value: 'autoFishing', label: 'AUTO', count: categoryCounts.autoFishing || 0 },
    { value: 'pond', label: 'POND', count: categoryCounts.pond || 0 },
    { value: 'staff', label: 'STAFF', count: categoryCounts.staff || 0 },
    { value: 'special', label: 'SPEC', count: categoryCounts.special || 0 }
  ];

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        borderRadius: 0,
        borderBottom: '1px solid rgba(0,0,0,0.08)',
        background: 'linear-gradient(to bottom, rgba(255,255,255,0.95), rgba(245,249,255,0.95))',
        backdropFilter: 'blur(8px)',
        position: 'sticky', 
        top: 0, 
        zIndex: 10,
      }}
    >
      <Tabs 
        value={activeTab} 
        onChange={onChange} 
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
        sx={{ 
          px: 2,
          pt: 1,
          pb: 1,
          minHeight: 48,
          '& .MuiTab-root': {
            fontWeight: 600,
            minWidth: '60px',
            px: 1.5,
            py: 1,
            fontSize: '0.8rem',
            minHeight: 36,
            borderRadius: 2,
            mx: 0.3,
            transition: 'all 0.2s ease',
            color: 'rgba(0, 0, 0, 0.6)',
          },
          '& .Mui-selected': {
            color: '#1976d2',
            bgcolor: 'rgba(25, 118, 210, 0.08)',
          },
          '& .MuiTabs-indicator': {
            display: 'none',
          }
        }}
      >
        {tabCategories.map(tab => (
          <Tab 
            key={tab.value}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <Box 
                    component="span" 
                    sx={{ 
                      ml: 0.7,
                      bgcolor: activeTab === tab.value ? 'primary.main' : 'rgba(0, 0, 0, 0.12)',
                      color: activeTab === tab.value ? 'white' : 'text.secondary',
                      borderRadius: '50%',
                      width: 18,
                      height: 18,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                    }}
                  >
                    {tab.count}
                  </Box>
                )}
              </Box>
            }
            value={tab.value}
          />
        ))}
      </Tabs>
    </Paper>
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
        p: 3
      }}>
        <Paper
          elevation={0}
          sx={{ 
            p: 3, 
            textAlign: 'center',
            borderRadius: 3,
            width: '100%',
            background: 'linear-gradient(to right, rgba(255,255,255,0.9), rgba(245,249,255,0.9))',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(0,0,0,0.06)',
          }}
        >
          <Box 
            sx={{ 
              fontSize: '3rem', 
              mb: 2,
              bgcolor: 'rgba(25, 118, 210, 0.08)',
              width: 80,
              height: 80,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              mx: 'auto'
            }}
          >
            🔍
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            No Upgrades Available
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem' }}>
            Keep fishing to discover and unlock more upgrades in this category!
          </Typography>
        </Paper>
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