import React from 'react';
import {
  Paper,
  Typography,
  Box
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InfoIcon from '@mui/icons-material/Info';
import BiotechIcon from '@mui/icons-material/Biotech';

const OverlayActions = ({ 
  onToggleUpgradePanel, 
  onToggleResearchPanel, 
  onToggleInfoPanel 
}) => {
  return (
    <>
      {/* Upgrade & Research Buttons (Top Right Corner) */}
      <Box sx={{ 
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 5,
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
        alignItems: 'center'
      }}>
        <Paper
          elevation={4}
          onClick={onToggleUpgradePanel}
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
        <Paper
          elevation={4}
          onClick={onToggleResearchPanel}
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
          <BiotechIcon sx={{ mr: 1, color: 'secondary.main' }} />
          <Typography variant="button" sx={{ 
            fontWeight: 'bold', 
            color: 'secondary.main'
          }}>
            Research
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
          onClick={onToggleInfoPanel}
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
    </>
  );
};

export default OverlayActions; 