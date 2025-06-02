import React from 'react';
import { Box, Tabs, Tab, Paper, Divider } from '@mui/material';

const CategoryTabs = ({ activeTab, categoryCounts, onChange }) => {
  const tabCategories = [
    { value: 'clickPower', label: 'CLICK', countKey: 'clickPower' },
    { value: 'fishingRod', label: 'RODS', countKey: 'fishingRod' },
    { value: 'autoFishing', label: 'AUTO', countKey: 'autoFishing' },
    { value: 'pond', label: 'POND', countKey: 'pond' },
    { value: 'staff', label: 'STAFF', countKey: 'staff' },
    { value: 'vessels', label: 'VESSELS', countKey: 'vessels' },
    { value: 'special', label: 'SPECIAL', countKey: 'special' }
  ];

  try {
    return (
      <Paper 
        elevation={0} 
        sx={{ 
          borderRadius: 0,
          borderBottom: '1px solid rgba(0,0,0,0.08)',
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.95), rgba(245,249,255,0.95))',
          backdropFilter: 'blur(8px)',
          position: 'sticky', 
          top: 0, 
          zIndex: 10,
        }}
      >
        <Tabs 
          value={activeTab} 
          onChange={onChange} 
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{ 
            px: 2,
            minHeight: 48,
            '& .MuiTab-root': {
              fontWeight: 600,
              minWidth: 'auto',
              px: 1.5,
              py: 1.5,
              fontSize: '0.8rem',
              minHeight: 36,
              borderRadius: 2,
              mx: 0.3,
              transition: 'all 0.2s ease',
              color: 'rgba(0, 0, 0, 0.6)',
            },
            '& .Mui-selected': {
              color: '#1976d2',
              bgcolor: 'rgba(25, 118, 210, 0.08)',
            },
            '& .MuiTabs-indicator': {
              display: 'none',
            },
            '& .MuiTabs-scrollButtons': {
              color: '#1976d2',
            }
          }}
        >
          {tabCategories.map(tab => {
            const count = categoryCounts[tab.countKey] || 0;
            return (
              <Tab 
                key={tab.value}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <span>{tab.label}</span>
                    {count > 0 && (
                      <Box 
                        component="span" 
                        sx={{ 
                          ml: 0.7,
                          bgcolor: activeTab === tab.value ? 'primary.main' : 'rgba(0, 0, 0, 0.12)',
                          color: activeTab === tab.value ? 'white' : 'text.secondary',
                          borderRadius: '50%',
                          width: 18,
                          height: 18,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.65rem',
                          fontWeight: 700,
                        }}
                      >
                        {count}
                      </Box>
                    )}
                  </Box>
                }
                value={tab.value}
              />
            );
          })}
        </Tabs>
      </Paper>
    );
  } catch (error) {
    console.error("Error rendering category tabs:", error);
    return null;
  }
};

export default CategoryTabs; 