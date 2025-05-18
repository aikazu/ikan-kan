import React from 'react';
import { Box, Tabs, Tab, Divider } from '@mui/material';

const CategoryTabs = ({ activeTab, categoryCounts, onChange }) => {
  try {
    return (
      <Box sx={{ 
        bgcolor: '#f5f9ff', 
        position: 'sticky', 
        top: 0, 
        zIndex: 10,
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <Tabs 
          value={activeTab} 
          onChange={onChange} 
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{ 
            px: 1,
            pt: 1,
            pb: 0.5,
            '& .MuiTab-root': {
              fontWeight: 'bold',
              minWidth: '60px',
              px: 1,
              py: 0.5,
              fontSize: '0.75rem'
            },
            '& .Mui-selected': {
              color: '#1976d2',
            },
            '& .MuiTabs-scrollButtons': {
              color: '#1976d2',
            }
          }}
        >
          <Tab 
            label="All"
            value={0}
          />
          <Tab 
            label={`Bait${categoryCounts[0] ? ` (${categoryCounts[0]})` : ''}`} 
            value={1} 
          />
          <Tab 
            label={`Rods${categoryCounts[1] ? ` (${categoryCounts[1]})` : ''}`} 
            value={2} 
          />
          <Tab 
            label={`Boats${categoryCounts[2] ? ` (${categoryCounts[2]})` : ''}`} 
            value={3} 
          />
          <Tab 
            label={`Facility${categoryCounts[3] ? ` (${categoryCounts[3]})` : ''}`} 
            value={4} 
          />
          <Tab 
            label={`Staff${categoryCounts[4] ? ` (${categoryCounts[4]})` : ''}`} 
            value={5} 
          />
        </Tabs>
        <Divider />
      </Box>
    );
  } catch (error) {
    console.error("Error rendering category tabs:", error);
    return null;
  }
};

export default CategoryTabs; 