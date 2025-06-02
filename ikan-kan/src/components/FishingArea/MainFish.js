import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const MainFish = ({ fishIcon }) => {
  return (
    <Box sx={{ 
      position: 'absolute', 
      top: '40%', 
      left: '50%', 
      transform: 'translate(-50%, -50%)',
      zIndex: 5 
    }}>
      <motion.div
        whileHover={{ scale: 1.1 }}
        animate={{
          y: [0, -15, 0, 15, 0],
          rotate: [0, 5, 0, -5, 0],
          scale: [1, 1.05, 1, 0.95, 1],
        }}
        transition={{
          duration: 4,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      >
        <Typography variant="h1" sx={{ 
          fontSize: '200px', 
          color: 'rgba(255,255,255,0.95)',
          textShadow: '0 0 20px rgba(0,0,0,0.5), 0 0 40px rgba(255,255,255,0.3)',
          cursor: 'pointer',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
          WebkitTouchCallout: 'none',
          WebkitTapHighlightColor: 'transparent',
          pointerEvents: 'all',
        }}>
          {fishIcon}
        </Typography>
      </motion.div>
    </Box>
  );
};

export default MainFish; 