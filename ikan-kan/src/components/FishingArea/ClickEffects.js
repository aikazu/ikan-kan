import React from 'react';
import { Box } from '@mui/material'; // Only Box is needed from MUI for this component
import { motion } from 'framer-motion';

const ClickEffects = ({ showClickEffect, clickPosition, fishIcon }) => {
  if (!showClickEffect) return null;
  
  return (
    <>
      {/* Fish icon effect */}
      <motion.div
        initial={{ scale: 0.5, opacity: 1 }}
        animate={{ scale: 2, opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{
          position: 'absolute',
          top: clickPosition.y,
          left: clickPosition.x,
          fontSize: '32px',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 20,
          filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.8))',
        }}
      >
        {fishIcon}
      </motion.div>

      {/* Ripple effect */}
      <motion.div
        initial={{ scale: 0, opacity: 0.8 }}
        animate={{ scale: 2, opacity: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          position: 'absolute',
          top: clickPosition.y,
          left: clickPosition.x,
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.3)',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 15,
        }}
      />
    </>
  );
};

export default ClickEffects; 