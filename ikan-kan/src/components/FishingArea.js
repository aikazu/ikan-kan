import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

// Component for environment label
const EnvironmentLabel = ({ name }) => {
  return (
    <Typography
      variant="h5"
      component="h3"
      sx={{
        position: 'absolute',
        top: 16,
        left: 16,
        color: 'white',
        textShadow: '0 0 5px rgba(0,0,0,0.7)',
        fontWeight: 'bold',
        zIndex: 10,
        backgroundColor: 'rgba(0,0,0,0.2)',
        padding: '8px 16px',
        borderRadius: '8px',
      }}
    >
      {name}
    </Typography>
  );
};

// Component for background fish
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

// Component for the main fish target
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

// Component for click effects
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

// Component for underwater bubbles
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

// Component for water plants
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

// Main FishingArea component
const FishingArea = ({ gamePhase = 'pond', onFishClick, clickPosition, showClickEffect, clickPower }) => {
  // Get background styles based on game phase
  const backgroundStyles = useMemo(() => {
    try {
      switch (gamePhase) {
        case 'pond':
          return {
            background: 'linear-gradient(180deg, #87CEEB 0%, #4682B4 100%)',
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2)',
          };
        case 'lake':
          return {
            background: 'linear-gradient(180deg, #6495ED 0%, #191970 100%)',
            boxShadow: 'inset 0 0 30px rgba(0,0,0,0.3)',
          };
        case 'coastal':
          return {
            background: 'linear-gradient(180deg, #48D1CC 0%, #00008B 100%)',
            boxShadow: 'inset 0 0 40px rgba(0,0,0,0.4)',
          };
        case 'deepSea':
          return {
            background: 'linear-gradient(180deg, #0000CD 0%, #000033 100%)',
            boxShadow: 'inset 0 0 50px rgba(0,0,0,0.5)',
          };
        case 'ocean':
          return {
            background: 'linear-gradient(180deg, #00008B 0%, #000000 100%)',
            boxShadow: 'inset 0 0 60px rgba(0,0,0,0.6)',
          };
        default:
          return {
            background: 'linear-gradient(180deg, #87CEEB 0%, #4682B4 100%)',
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2)',
          };
      }
    } catch (err) {
      console.error('Error generating background styles:', err);
      // Fallback style
      return {
        background: 'linear-gradient(180deg, #87CEEB 0%, #4682B4 100%)',
        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.2)',
      };
    }
  }, [gamePhase]);
  
  // Get environment name and fish icon based on game phase
  const { environmentName, fishIcon } = useMemo(() => {
    try {
      let name, icon;
      
      switch (gamePhase) {
        case 'pond': 
          name = 'Backyard Pond';
          icon = '🐠';
          break;
        case 'lake': 
          name = 'Lake';
          icon = '🐟';
          break;
        case 'coastal': 
          name = 'Coastal Waters';
          icon = '🐡';
          break;
        case 'deepSea': 
          name = 'Deep Sea';
          icon = '🦈';
          break;
        case 'ocean': 
          name = 'Ocean';
          icon = '🐋';
          break;
        default: 
          name = 'Backyard Pond';
          icon = '🐠';
      }
      
      return { environmentName: name, fishIcon: icon };
    } catch (err) {
      console.error('Error getting environment details:', err);
      // Fallback values
      return { environmentName: 'Fishing Area', fishIcon: '🐠' };
    }
  }, [gamePhase]);
  
  // Background fish positions
  const bgFishPositions = useMemo(() => [
    { top: '20%', left: '15%', delay: 0, duration: 25, size: '40px', opacity: 0.4 },
    { top: '40%', left: '80%', delay: 1.5, duration: 20, size: '30px', opacity: 0.3 },
    { top: '75%', left: '25%', delay: 3, duration: 23, size: '35px', opacity: 0.5 },
  ], []);
  
  // Handle click with error handling
  const handleClick = (e) => {
    try {
      if (typeof onFishClick === 'function') {
        onFishClick(e);
      }
    } catch (err) {
      console.error('Error handling fish click:', err);
    }
  };
  
  return (
    <Box 
      sx={{ 
        width: '100%', 
        height: '100%', 
        position: 'relative',
        overflow: 'hidden',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        WebkitTouchCallout: 'none',
        cursor: 'pointer',
        ...backgroundStyles,
      }}
      onClick={handleClick}
    >
      {/* Environment Label */}
      <EnvironmentLabel name={environmentName} />
      
      {/* Background Fish Swimming Around */}
      {bgFishPositions.map((pos, index) => (
        <BackgroundFish 
          key={`bg-fish-${index}`} 
          position={pos} 
          fishIcon={fishIcon} 
        />
      ))}
      
      {/* Main Animated Fish - Central target */}
      <MainFish fishIcon={fishIcon} />
      
      {/* Click and Ripple Effects */}
      <ClickEffects 
        showClickEffect={showClickEffect} 
        clickPosition={clickPosition} 
        fishIcon={fishIcon} 
      />
      
      {/* Water Surface Effects */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '30px',
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)',
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          zIndex: 1,
        }}
      />
      
      {/* Underwater Bubbles */}
      <UnderwaterBubbles />
      
      {/* Water Plants */}
      <WaterPlants />
    </Box>
  );
};

export default FishingArea; 