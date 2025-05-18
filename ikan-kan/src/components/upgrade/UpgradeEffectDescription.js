import React from 'react';
import { Typography } from '@mui/material';

// Component for displaying upgrade effect description
const UpgradeEffectDescription = ({ upgrade }) => {
  const getEffectDescription = () => {
    try {
      if (!upgrade || !upgrade.effect) {
        return 'Unknown effect';
      }
      
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
      
      return 'Unknown effect';
    } catch (error) {
      console.error("Error getting effect description:", error);
      return 'Error displaying effect';
    }
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

export default UpgradeEffectDescription; 