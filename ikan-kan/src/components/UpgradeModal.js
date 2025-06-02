import React from 'react';
import {
  Paper,
  Typography,
  Box,
  IconButton,
  Backdrop
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import UpgradePanel from './UpgradePanel'; // The actual content of the upgrade panel

const UpgradeModal = ({ open, onClose }) => {
  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: 1500,
        backdropFilter: 'blur(4px)' // From original GameScreen.js
      }}
      open={open}
      onClick={onClose} // Close when clicking on the backdrop
    >
      <Paper
        elevation={0} // From original GameScreen.js
        sx={{
          width: '90%',
          maxWidth: '800px',
          maxHeight: '85vh',
          borderRadius: 3,
          overflow: 'hidden',
          position: 'relative',
          p: 0,
          boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
          border: '1px solid rgba(255,255,255,0.2)',
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(16px)' // Inner paper blur
        }}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        {/* Header for the modal */}
        <Box sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2.5, // Match styling from GameScreen.js
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          position: 'sticky',
          top: 0,
          bgcolor: 'rgba(255, 255, 255, 0.98)', // Match styling
          backdropFilter: 'blur(10px)', // Match styling
          zIndex: 10
        }}>
          <Typography variant="h5" sx={{
            fontWeight: 700,
            color: '#1976d2',
            letterSpacing: '-0.02em',
            fontSize: { xs: '1.4rem', sm: '1.5rem' }
          }}>
            Upgrades
          </Typography>
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              bgcolor: 'rgba(0,0,0,0.03)',
              '&:hover': {
                bgcolor: 'rgba(0,0,0,0.06)',
              },
              width: 36,
              height: 36
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        {/* Content Area - Renders the existing UpgradePanel */}
        <Box sx={{
          height: 'calc(85vh - 70px)', // Match styling (approx header height)
          overflow: 'auto'
        }}>
          <UpgradePanel />
        </Box>
      </Paper>
    </Backdrop>
  );
};

export default UpgradeModal; 