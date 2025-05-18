import React from 'react';
import { Button, Tooltip } from '@mui/material';
import { calculateUpgradePrice, formatNumber } from '../../game/core';

const UpgradePurchaseButton = ({ upgrade, fish, ownedLevel, maxLevel, onPurchase }) => {
  try {
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
  } catch (error) {
    console.error("Error rendering purchase button:", error);
    return null;
  }
};

export default UpgradePurchaseButton; 