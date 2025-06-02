import React, { useMemo } from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';

const UnderwaterBubbles = () => {
  // Generate unique keys for each bubble
  const bubbles = useMemo(() => {
    return Array.from({ length: 6 }).map((_, i) => ({
      id: `bubble-${i}`,
      bottom: Math.floor(Math.random() * 50),
      left: `${Math.floor(Math.random() * 90)}%`,
      size: Math.floor(10 + Math.random() * 15),
      opacity: 0.2 + Math.random() * 0.5,
      duration: 3 + Math.random() * 5,
      delay: Math.random() * 5
    }));
  }, []);

  return (
    <>
      {bubbles.map(bubble => (
        <Box 
          key={bubble.id}
          sx={{ 
            position: 'absolute', 
            bottom: bubble.bottom, 
            left: bubble.left, 
            zIndex: 2 
          }}
        >
          <motion.div
            initial={{ y: 0, opacity: bubble.opacity }}
            animate={{ y: -300 - Math.random() * 200, opacity: 0 }}
            transition={{ 
              duration: bubble.duration,
              repeat: Infinity,
              delay: bubble.delay,
              ease: "easeOut"
            }}
            style={{ fontSize: `${bubble.size}px` }}
          >
            ○
          </motion.div>
        </Box>
      ))}
    </>
  );
};

export default UnderwaterBubbles; 