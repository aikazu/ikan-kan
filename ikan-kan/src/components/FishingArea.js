import React, { useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

// Import sub-components
import EnvironmentLabel from './FishingArea/EnvironmentLabel';
import BackgroundFish from './FishingArea/BackgroundFish';
import MainFish from './FishingArea/MainFish';
import ClickEffects from './FishingArea/ClickEffects';
import UnderwaterBubbles from './FishingArea/UnderwaterBubbles';
import WaterPlants from './FishingArea/WaterPlants';

// Component for environment label
// const EnvironmentLabel = ({ name }) => { ... }; // Moved to ./FishingArea/EnvironmentLabel.js

// Component for background fish
// const BackgroundFish = ({ position, fishIcon }) => { ... }; // Moved to ./FishingArea/BackgroundFish.js

// Component for the main fish target
// const MainFish = ({ fishIcon }) => { ... }; // Moved to ./FishingArea/MainFish.js

// Component for click effects
// const ClickEffects = ({ showClickEffect, clickPosition, fishIcon }) => { ... }; // Moved to ./FishingArea/ClickEffects.js

// Component for underwater bubbles
// const UnderwaterBubbles = () => { ... }; // Moved to ./FishingArea/UnderwaterBubbles.js

// Component for water plants
// const WaterPlants = () => { ... }; // Moved to ./FishingArea/WaterPlants.js

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