import React from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const WaterPlants = () => {
  return (
    <>
      <Box sx={{ position: 'absolute', bottom: -10, left: '5%', zIndex: 3, transform: 'rotate(5deg)' }}>
        <motion.div
          animate={{ rotate: [0, 5, 0, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Typography sx={{ fontSize: '70px', color: 'rgba(0,100,0,0.5)' }}>🌿</Typography>
        </motion.div>
      </Box>
      
      <Box sx={{ position: 'absolute', bottom: -15, right: '7%', zIndex: 3, transform: 'rotate(-10deg)' }}>
        <motion.div
          animate={{ rotate: [0, -7, 0, 7, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
          <Typography sx={{ fontSize: '80px', color: 'rgba(0,100,0,0.4)' }}>🌿</Typography>
        </motion.div>
      </Box>
    </>
  );
};

export default WaterPlants; 