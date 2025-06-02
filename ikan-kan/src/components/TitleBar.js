import React from 'react';
import {
  Typography,
  Box,
  Button
} from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';

const TitleBar = ({ onResetGame }) => {
  return (
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
        onClick={onResetGame}
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
  );
};

export default TitleBar; 