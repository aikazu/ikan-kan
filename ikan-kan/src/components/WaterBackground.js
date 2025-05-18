import React from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';

const WaterBackground = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        overflow: 'hidden',
        background: 'linear-gradient(to bottom, #E3F2FD 0%, #BBDEFB 100%)',
      }}
    >
      {/* Water surface highlight */}
      <Box
        component={motion.div}
        initial={{ opacity: 0.7 }}
        animate={{ 
          opacity: [0.7, 0.9, 0.7],
          y: [0, 5, 0]
        }}
        transition={{ 
          repeat: Infinity,
          duration: 5,
          ease: "easeInOut"
        }}
        sx={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: '90%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.7) 50%, transparent 100%)',
          boxShadow: '0 0 20px 10px rgba(255,255,255,0.4)',
          borderRadius: '50%',
        }}
      />

      {/* Animated bubbles */}
      {[...Array(15)].map((_, i) => (
        <Bubble key={i} />
      ))}
      
      {/* Water wave overlay */}
      <Box
        component={motion.div}
        initial={{ opacity: 0.05 }}
        animate={{ 
          opacity: [0.05, 0.08, 0.05],
        }}
        transition={{ 
          repeat: Infinity,
          duration: 3,
          ease: "easeInOut"
        }}
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='smallGrid' width='40' height='40' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 40 0 L 0 0 0 40' fill='none' stroke='%23FFFFFF' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23smallGrid)'/%3E%3C/svg%3E")`,
          opacity: 0.05,
        }}
      />
    </Box>
  );
};

// Individual bubble component
const Bubble = () => {
  const size = Math.floor(Math.random() * 30) + 10; // Random size between 10-40px
  const startX = Math.floor(Math.random() * 100); // Random horizontal position
  const startY = 100 + Math.floor(Math.random() * 20); // Start below the viewport
  const duration = Math.floor(Math.random() * 15) + 10; // Random duration between 10-25s
  const delay = Math.floor(Math.random() * 20); // Random delay before animation starts
  
  return (
    <Box
      component={motion.div}
      initial={{ x: `${startX}%`, y: `${startY}%`, opacity: 0 }}
      animate={{ 
        y: '-20%', 
        x: [`${startX}%`, `${startX + (Math.random() * 10) - 5}%`, `${startX + (Math.random() * 10) - 5}%`],
        opacity: [0, 0.7, 0]
      }}
      transition={{ 
        duration: duration, 
        repeat: Infinity,
        delay: delay,
        ease: "easeInOut"
      }}
      sx={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), rgba(255,255,255,0.1))',
        filter: 'blur(1px)',
      }}
    />
  );
};

export default WaterBackground; 