import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const BackgroundFish = ({ position, fishIcon }) => {
  return (
    <Box sx={{ position: 'absolute', top: position.top, left: position.left, zIndex: 1 }}>
      <motion.div
        animate={{
          x: ['0%', '100%', '0%'],
          y: ['0%', '-15%', '15%', '0%'],
        }}
        transition={{
          x: { duration: position.duration, repeat: Infinity, ease: 'linear' },
          y: { duration: position.duration / 3, repeat: Infinity, ease: 'easeInOut', repeatType: 'mirror' },
          delay: position.delay,
        }}
        style={{ opacity: position.opacity }}
      >
        <Typography sx={{ fontSize: position.size, color: 'rgba(255,255,255,0.8)' }}>
          {fishIcon}
        </Typography>
      </motion.div>
    </Box>
  );
};

export default BackgroundFish; 