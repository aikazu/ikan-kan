import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { formatNumber } from '../game/core';

const ResourceDisplay = ({ fish, scales, knowledge, fishPerSecond, clickPower, sx = {} }) => {
  return (
    <Paper 
      elevation={0}
      sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        width: '100%',
        py: 1.5,
        px: 2.5,
        borderRadius: 3,
        background: 'linear-gradient(to right, rgba(255,255,255,0.92), rgba(245,249,255,0.92))',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
        ...sx
      }}
    >
      {/* Fish Counter */}
      <ResourceItem 
        icon="🐟" 
        value={fish} 
        label={`+${formatNumber(fishPerSecond)}/s`}
        color="#2196F3" 
        bgColor="rgba(33,150,243,0.08)"
      />
      
      {/* Scales Counter */}
      <ResourceItem 
        icon="✨" 
        value={scales} 
        label="Scales"
        color="#FFC107" 
        bgColor="rgba(255,193,7,0.08)"
      />
      
      {/* Knowledge Counter */}
      <ResourceItem 
        icon="📚" 
        value={knowledge} 
        label="Knowledge"
        color="#4CAF50" 
        bgColor="rgba(76,175,80,0.08)"
      />
      
      {/* Click Power */}
      <ResourceItem 
        icon="👆" 
        value={clickPower} 
        label="Per click"
        color="#F44336" 
        bgColor="rgba(244,67,54,0.08)"
      />
    </Paper>
  );
};

// Extracted component for each resource item
const ResourceItem = ({ icon, value, label, color, bgColor }) => (
  <Box sx={{ 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center',
    mx: 0.5,
  }}>
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
    }}>
      <Box sx={{ 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 2,
        p: 0.5,
        mb: 0.5,
        width: 36,
        height: 36,
        bgcolor: bgColor,
      }}>
        <Typography sx={{ fontSize: '1.3rem' }}>
          {icon}
        </Typography>
      </Box>
      
      <Typography variant="h5" sx={{ 
        fontWeight: 700,
        color: color,
        fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.6rem' },
        lineHeight: 1,
        letterSpacing: '-0.02em',
        mb: 0.5,
      }}>
        {formatNumber(value)}
      </Typography>
      
      <Typography 
        variant="caption" 
        sx={{ 
          fontSize: '0.7rem', 
          color: 'text.secondary',
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: '0.03em',
        }}
      >
        {label}
      </Typography>
    </Box>
  </Box>
);

export default ResourceDisplay; 