import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Paper, 
  Typography, 
  Box, 
  Button,
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
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TimerIcon from '@mui/icons-material/Timer';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import ScienceIcon from '@mui/icons-material/Science';
import ReplayIcon from '@mui/icons-material/Replay';

import { 
  catchFish, 
  selectFish, 
  selectScales,
  selectKnowledge,
  selectClickPower,
  selectFishPerSecond,
  selectGamePhase,
  resetGame
} from '../store/gameSlice';
import UpgradePanel from './UpgradePanel';
import FishingArea from './FishingArea';
import ResourceDisplay from './ResourceDisplay';
import { formatNumber } from '../game/core';

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
  const [infoTabValue, setInfoTabValue] = useState(0);
  
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
  };
  
  const toggleUpgradePanel = () => {
    setShowUpgradePanel(!showUpgradePanel);
    setShowInfoPanel(false);
  };
  
  // Handle info tab change
  const handleInfoTabChange = (event, newValue) => {
    setInfoTabValue(newValue);
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
      {/* Title Bar */}
      <Box sx={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        px: 3,
        py: 1,
        bgcolor: 'rgba(255,255,255,0.9)',
        borderBottom: '1px solid rgba(0,0,0,0.1)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        zIndex: 10,
      }}>
        <Box sx={{ width: '110px' }} /> {/* Empty spacer to maintain layout */}
        
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            fontWeight: 'bold',
            color: '#1976d2',
            fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
            textAlign: 'center'
          }}
        >
          Ikan Kan: Mancing Mania
        </Typography>
        
        <Button
          variant="outlined"
          startIcon={<ReplayIcon />}
          onClick={handleResetGame}
          size="small"
          sx={{
            borderRadius: 2,
            fontWeight: 'bold',
            px: 2,
            width: '110px'
          }}
        >
          Reset
        </Button>
      </Box>
      
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
            {/* Upgrade Button (Top Right Corner) */}
            <Box sx={{ 
              position: 'absolute',
              top: 20,
              right: 20,
              zIndex: 5,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <Paper
                elevation={4}
                onClick={toggleUpgradePanel}
                sx={{
                  borderRadius: 2,
                  p: 1,
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '130px',
                  bgcolor: 'rgba(255,255,255,0.9)'
                }}
              >
                <ShoppingCartIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="button" sx={{ 
                  fontWeight: 'bold', 
                  color: 'primary.main'
                }}>
                  Upgrade
                </Typography>
              </Paper>
            </Box>
            
            {/* Info Button (Bottom Right Corner) */}
            <Box sx={{ 
              position: 'absolute',
              bottom: 20,
              right: 20,
              zIndex: 5,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <Paper
                elevation={4}
                onClick={toggleInfoPanel}
                sx={{
                  borderRadius: 2,
                  p: 1,
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '130px',
                  bgcolor: 'rgba(255,255,255,0.9)'
                }}
              >
                <InfoIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="button" sx={{ 
                  fontWeight: 'bold', 
                  color: 'primary.main'
                }}>
                  Info
                </Typography>
              </Paper>
            </Box>
            
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
              <Paper
                elevation={3}
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.7)',
                  borderRadius: 2,
                  py: 1,
                }}
              >
                <ResourceDisplay 
                  fish={fish}
                  scales={scales}
                  knowledge={knowledge}
                  fishPerSecond={fishPerSecond}
                  clickPower={clickPower}
                  sx={{ bgcolor: 'transparent' }}
                />
              </Paper>
            </Box>
          </Paper>
        </Box>
      </Box>
      
      {/* Info Panel Modal */}
      <Backdrop
        sx={{ 
          color: '#fff', 
          zIndex: 1500,
          backdropFilter: 'blur(3px)'
        }}
        open={showInfoPanel}
        onClick={() => setShowInfoPanel(false)}
      >
        <Paper
          elevation={5}
          sx={{
            width: '90%',
            maxWidth: '800px',
            maxHeight: '80vh',
            borderRadius: 3,
            overflow: 'hidden',
            position: 'relative',
            p: 0
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            p: 2, 
            borderBottom: '1px solid #eee',
            position: 'sticky',
            top: 0,
            bgcolor: 'rgba(255, 255, 255, 0.98)',
            zIndex: 10
          }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2', pl: 1 }}>
              Information
            </Typography>
            <IconButton onClick={toggleInfoPanel} size="small" sx={{ bgcolor: '#f5f5f5' }}>
              <CloseIcon />
            </IconButton>
          </Box>
          
          {/* Tab Navigation */}
          <Tabs 
            value={infoTabValue} 
            onChange={handleInfoTabChange} 
            variant="fullWidth"
            sx={{ 
              bgcolor: '#f5f9ff',
              borderBottom: '1px solid #eee',
              '& .MuiTab-root': {
                py: 1.5,
                fontWeight: 'medium',
                fontSize: '0.85rem'
              }
            }}
          >
            <Tab label="Resources" icon={<EqualizerIcon />} iconPosition="start" />
            <Tab label="Stats" icon={<TrendingUpIcon />} iconPosition="start" />
            <Tab label="Achievements" icon={<EmojiEventsIcon />} iconPosition="start" />
          </Tabs>
          
          {/* Content Area */}
          <Box sx={{ 
            maxHeight: 'calc(80vh - 112px)', // Header + Tabs height
            overflow: 'auto',
            p: 2
          }}>
            {/* Resources Tab */}
            {infoTabValue === 0 && (
              <Box>
                {/* Primary Resource */}
                <Card elevation={0} sx={{ mb: 3, border: '1px solid rgba(0,0,0,0.08)', borderRadius: 2 }}>
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ 
                          fontSize: '2rem', 
                          mr: 1.5, 
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: 'rgba(33, 150, 243, 0.1)',
                          borderRadius: '50%',
                          width: 50,
                          height: 50
                        }}>
                          🐟
                        </Box>
                        <Box>
                          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2196F3', lineHeight: 1.1 }}>
                            {formatNumber(fish)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Fish
                          </Typography>
                        </Box>
                      </Box>
                      <Chip 
                        icon={<TimerIcon fontSize="small" />}
                        label={`+${formatNumber(fishPerSecond)}/s`} 
                        color="primary"
                        variant="outlined"
                        size="small"
                      />
                    </Box>
                    
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, display: 'flex', justifyContent: 'space-between' }}>
                        <span>Per click</span>
                        <span>+{formatNumber(clickPower)}</span>
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={Math.min((clickPower / 20) * 100, 100)} 
                        sx={{ height: 6, borderRadius: 3 }}
                      />
                    </Box>
                  </CardContent>
                </Card>
                
                {/* Secondary Resources */}
                <Typography variant="subtitle1" sx={{ 
                  fontWeight: 'bold', 
                  color: 'text.primary', 
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <ScienceIcon sx={{ mr: 1, fontSize: '1.2rem', color: 'primary.main' }} />
                  Special Resources
                </Typography>
                
                <Grid container spacing={2}>
                  {/* Scales */}
                  <Grid item xs={6}>
                    <Card elevation={0} sx={{ 
                      height: '100%', 
                      border: '1px solid rgba(0,0,0,0.08)', 
                      borderRadius: 2,
                      bgcolor: 'rgba(255, 193, 7, 0.05)'
                    }}>
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Box sx={{ 
                            fontSize: '1.5rem', 
                            mr: 1, 
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: 'rgba(255, 193, 7, 0.1)',
                            borderRadius: '50%',
                            width: 35,
                            height: 35
                          }}>
                            ✨
                          </Box>
                          <Typography variant="subtitle1" sx={{ color: '#FFC107', fontWeight: 'bold' }}>
                            Scales
                          </Typography>
                        </Box>
                        <Typography variant="h6" sx={{ 
                          fontWeight: 'bold', 
                          color: '#FFC107',
                          textAlign: 'center',
                          my: 1
                        }}>
                          {formatNumber(scales)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
                          Use for rare upgrades
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  
                  {/* Knowledge */}
                  <Grid item xs={6}>
                    <Card elevation={0} sx={{ 
                      height: '100%', 
                      border: '1px solid rgba(0,0,0,0.08)', 
                      borderRadius: 2,
                      bgcolor: 'rgba(76, 175, 80, 0.05)'
                    }}>
                      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Box sx={{ 
                            fontSize: '1.5rem', 
                            mr: 1, 
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: 'rgba(76, 175, 80, 0.1)',
                            borderRadius: '50%',
                            width: 35,
                            height: 35
                          }}>
                            📚
                          </Box>
                          <Typography variant="subtitle1" sx={{ color: '#4CAF50', fontWeight: 'bold' }}>
                            Knowledge
                          </Typography>
                        </Box>
                        <Typography variant="h6" sx={{ 
                          fontWeight: 'bold', 
                          color: '#4CAF50',
                          textAlign: 'center',
                          my: 1
                        }}>
                          {formatNumber(knowledge)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center' }}>
                          Unlock research options
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
                
                {/* Game Phase Info */}
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle1" sx={{ 
                    fontWeight: 'bold', 
                    color: 'text.primary', 
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    Current Phase
                  </Typography>
                  
                  <Card elevation={0} sx={{ 
                    border: '1px solid rgba(0,0,0,0.08)', 
                    borderRadius: 2,
                    bgcolor: 'rgba(25, 118, 210, 0.05)'
                  }}>
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center'
                      }}>
                        <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                          Game Phase:
                        </Typography>
                        <Chip 
                          label={gamePhase.charAt(0).toUpperCase() + gamePhase.slice(1)} 
                          color="primary"
                          sx={{ 
                            fontWeight: 'bold',
                            textTransform: 'capitalize'
                          }}
                        />
                      </Box>
                      
                      <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                        As you progress, you'll unlock new environments, fish species, and fishing techniques.
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              </Box>
            )}
            
            {/* Stats Tab */}
            {infoTabValue === 1 && (
              <Box>
                <Typography variant="body1" sx={{ mb: 2, textAlign: 'center', color: 'text.secondary' }}>
                  Your fishing statistics will be displayed here as you progress in the game.
                </Typography>
                
                <Card elevation={0} sx={{ mb: 2, border: '1px solid rgba(0,0,0,0.08)', borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                      Progress
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Box sx={{ p: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Fish caught:
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {formatNumber(fish)}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ p: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Click power:
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {formatNumber(clickPower)}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ p: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Production:
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {formatNumber(fishPerSecond)}/s
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box sx={{ p: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Environment:
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                            {gamePhase}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Box>
            )}
            
            {/* Achievements Tab */}
            {infoTabValue === 2 && (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <Box sx={{ 
                  fontSize: '3rem', 
                  mb: 2, 
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'rgba(25, 118, 210, 0.1)',
                  borderRadius: '50%',
                  width: 80,
                  height: 80
                }}>
                  🏆
                </Box>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                  Achievements Coming Soon
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Continue fishing to unlock achievements and earn special rewards!
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>
      </Backdrop>
      
      {/* Upgrade Panel Modal */}
      <Backdrop
        sx={{ 
          color: '#fff', 
          zIndex: 1500,
          backdropFilter: 'blur(3px)'
        }}
        open={showUpgradePanel}
        onClick={() => setShowUpgradePanel(false)}
      >
        <Paper
          elevation={5}
          sx={{
            width: '90%',
            maxWidth: '800px',
            maxHeight: '80vh',
            borderRadius: 3,
            overflow: 'auto',
            position: 'relative',
            p: 0
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            p: 2, 
            borderBottom: '2px solid #eee',
            position: 'sticky',
            top: 0,
            bgcolor: 'rgba(255, 255, 255, 0.98)',
            zIndex: 10
          }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1976d2', pl: 1 }}>
              Upgrades
            </Typography>
            <IconButton onClick={toggleUpgradePanel} size="small" sx={{ bgcolor: '#f5f5f5' }}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box sx={{ 
            maxHeight: 'calc(80vh - 60px)',
            overflow: 'auto'
          }}>
            <UpgradePanel />
          </Box>
        </Paper>
      </Backdrop>
    </Box>
  );
};

export default GameScreen; 