import React from 'react';
import {
  Paper,
  Typography,
  Box,
  IconButton,
  Backdrop
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ResearchPanel from './ResearchPanel'; // Import the existing panel that shows research items

const ResearchModal = ({ open, onClose }) => {
  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: 1500,
        backdropFilter: 'blur(3px)'
      }}
      open={open}
      onClick={onClose} // Close when clicking on the backdrop
    >
      <Paper
        elevation={5}
        sx={{
          width: '90%',
          maxWidth: '700px',
          maxHeight: '80vh',
          borderRadius: 3,
          overflow: 'hidden',
          position: 'relative',
          p: 0
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
          bgcolor: 'rgba(255, 255, 255, 0.98)',
          zIndex: 10
        }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: 'secondary.main' }}>
            Research & Development
          </Typography>
          <IconButton onClick={onClose} size="small" sx={{ bgcolor: 'rgba(0,0,0,0.03)' }}>
            <CloseIcon />
          </IconButton>
        </Box>
        
        {/* Content Area - Renders the existing ResearchPanel */}
        {/* The original GameScreen used a Box with p:3 and text. We'll let ResearchPanel handle its own padding */}
        <ResearchPanel />
      </Paper>
    </Backdrop>
  );
};

export default ResearchModal; 