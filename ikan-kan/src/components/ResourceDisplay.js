import React from 'react';
import { Box, Typography } from '@mui/material';
import { formatNumber } from '../game/core';

const ResourceDisplay = ({ fish, scales, knowledge, fishPerSecond, clickPower, sx = {} }) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      width: '100%',
      px: 2,
      ...sx
    }}>
      {/* Fish Counter */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ fontSize: '1.8rem', color: '#2196F3', mr: 1 }}>🐟</Typography>
          <Typography variant="h4" sx={{ 
            fontWeight: 'bold',
            color: '#2196F3',
            fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2rem' }
          }}>
            {formatNumber(fish)}
          </Typography>
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
          +{formatNumber(fishPerSecond)}/second
        </Typography>
      </Box>
      
      {/* Scales Counter */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ fontSize: '1.8rem', color: '#FFC107', mr: 1 }}>✨</Typography>
          <Typography variant="h4" sx={{ 
            fontWeight: 'bold',
            color: '#FFC107',
            fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2rem' }
          }}>
            {formatNumber(scales)}
          </Typography>
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
          Rare scales
        </Typography>
      </Box>
      
      {/* Knowledge Counter */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ fontSize: '1.8rem', color: '#4CAF50', mr: 1 }}>📚</Typography>
          <Typography variant="h4" sx={{ 
            fontWeight: 'bold',
            color: '#4CAF50',
            fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2rem' }
          }}>
            {formatNumber(knowledge)}
          </Typography>
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
          Knowledge points
        </Typography>
      </Box>
      
      {/* Click Power */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ fontSize: '1.8rem', color: '#F44336', mr: 1 }}>👆</Typography>
          <Typography variant="h4" sx={{ 
            fontWeight: 'bold',
            color: '#F44336',
            fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2rem' }
          }}>
            {formatNumber(clickPower)}
          </Typography>
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
          Fish per click
        </Typography>
      </Box>
    </Box>
  );
};

export default ResourceDisplay; 