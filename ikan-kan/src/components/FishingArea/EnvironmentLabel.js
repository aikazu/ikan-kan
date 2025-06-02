import React from 'react';
import { Typography } from '@mui/material';

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

export default EnvironmentLabel; 