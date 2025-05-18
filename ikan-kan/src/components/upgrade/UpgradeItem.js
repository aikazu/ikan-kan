import React from 'react';
import { Box, Card, CardContent, Chip, Grid, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { calculateUpgradePrice } from '../../game/core';
import UpgradeEffectDescription from './UpgradeEffectDescription';
import UpgradePurchaseButton from './UpgradePurchaseButton';

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
  } catch (error) {
    console.error(`Error rendering upgrade ${upgrade?.id}:`, error);
    return null;
  }
};

export default UpgradeItem; 