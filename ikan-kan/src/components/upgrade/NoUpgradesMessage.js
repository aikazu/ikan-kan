import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { motion } from 'framer-motion';

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

export default NoUpgradesMessage; 