import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Paper, 
  Box, 
  IconButton,
  Backdrop,
  Grid,
  Chip,
  Card,
  CardContent,
  LinearProgress,
  Tabs,
  Tab
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ReplayIcon from '@mui/icons-material/Replay';
import BiotechIcon from '@mui/icons-material/Biotech';

import { catchFish, resetGame } from '../store/gameSlice';
import {
  selectFish,
  selectScales,
  selectKnowledge,
  selectClickPower,
  selectFishPerSecond,
  selectGamePhase
} from '../store/gameSelectors';
import FishingArea from './FishingArea';
import ResourceDisplay from './ResourceDisplay';
import InfoPanel from './InfoPanel';
import ResearchModal from './ResearchModal';
import UpgradeModal from './UpgradeModal';
import TitleBar from './TitleBar';
import OverlayActions from './OverlayActions';

const GameScreen = () => {
  const dispatch = useDispatch();
  
  // Game state from Redux
  const fish = useSelector(selectFish);
  const scales = useSelector(selectScales);
  const knowledge = useSelector(selectKnowledge);
  const clickPower = useSelector(selectClickPower);
  const fishPerSecond = useSelector(selectFishPerSecond);
  const gamePhase = useSelector(selectGamePhase);
  
  // Local state for UI effects and drawer visibility
  const [showClickEffect, setShowClickEffect] = useState(false);
  const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  const [showUpgradePanel, setShowUpgradePanel] = useState(false);
  const [showResearchPanel, setShowResearchPanel] = useState(false);
  
  // Handle fish click
  const handleFishClick = (e) => {
    dispatch(catchFish(clickPower));
    
    // Show click effect
    const rect = e.currentTarget.getBoundingClientRect();
    setClickPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setShowClickEffect(true);
    setTimeout(() => setShowClickEffect(false), 300);
  };
  
  // Handle reset game
  const handleResetGame = () => {
    if (window.confirm('Are you sure you want to reset your game? All progress will be lost!')) {
      dispatch(resetGame());
    }
  };
  
  // Toggle panel visibility
  const toggleInfoPanel = () => {
    setShowInfoPanel(!showInfoPanel);
    setShowUpgradePanel(false);
    setShowResearchPanel(false);
  };
  
  const toggleUpgradePanel = () => {
    setShowUpgradePanel(!showUpgradePanel);
    setShowInfoPanel(false);
    setShowResearchPanel(false);
  };
  
  const toggleResearchPanel = () => {
    setShowResearchPanel(!showResearchPanel);
    setShowInfoPanel(false);
    setShowUpgradePanel(false);
  };
  
  return (
    <Box sx={{ 
      width: '100%',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(180deg, #f5f9ff 0%, #d9eaff 100%)',
      overflow: 'hidden',
      position: 'relative',
      userSelect: 'none',
      WebkitUserSelect: 'none',
      MozUserSelect: 'none',
      msUserSelect: 'none',
      WebkitTouchCallout: 'none',
    }}>
      <TitleBar onResetGame={handleResetGame} />
      
      {/* Main Game Area */}
      <Box sx={{ 
        flexGrow: 1,
        display: 'flex',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Main Game Content */}
        <Box sx={{
          flexGrow: 1,
          position: 'relative',
          p: 3,
        }}>
          {/* Game Area */}
          <Paper
            elevation={3}
            sx={{
              width: '100%',
              height: '100%',
              borderRadius: 3,
              overflow: 'hidden',
              border: '6px solid #fff',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              position: 'relative'
            }}
          >
            <OverlayActions 
              onToggleUpgradePanel={toggleUpgradePanel}
              onToggleResearchPanel={toggleResearchPanel}
              onToggleInfoPanel={toggleInfoPanel}
            />
            
            {/* Fishing Area (Main Game Area) */}
            <FishingArea 
              gamePhase={gamePhase}
              onFishClick={handleFishClick}
              showClickEffect={showClickEffect}
              clickPosition={clickPosition}
              clickPower={clickPower}
            />
            
            {/* Resource Display (Bottom Left) */}
            <Box sx={{
              position: 'absolute',
              bottom: 20,
              left: 20,
              zIndex: 5,
            }}>
              <ResourceDisplay 
                  fish={fish}
                  scales={scales}
                  knowledge={knowledge}
                  fishPerSecond={fishPerSecond}
                  clickPower={clickPower}
                  />
            </Box>
          </Paper>
        </Box>
      </Box>
      
      {/* Info Panel Modal */}
      <InfoPanel open={showInfoPanel} onClose={() => setShowInfoPanel(false)} />
      
      {/* Research Panel Modal (Placeholder) */}
      <ResearchModal open={showResearchPanel} onClose={() => setShowResearchPanel(false)} />
      
      {/* Upgrade Panel Modal */}
      <UpgradeModal open={showUpgradePanel} onClose={() => setShowUpgradePanel(false)} />
    </Box>
  );
};

export default GameScreen; 