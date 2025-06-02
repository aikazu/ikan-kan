import React, { useMemo } from 'react';
import { Box, Typography, Paper, Button, Alert, Chip } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { completeResearch /*, selectKnowledge, selectResearchedItems, selectGamePhase*/ } from '../store/gameSlice'; // Actions from gameSlice
import { 
  selectKnowledge, 
  selectResearchedItems, 
  selectGamePhase 
} from '../store/gameSelectors'; // Selectors from gameSelectors
import { getAllResearchItems, isResearchAvailable, getResearchItemById } from '../data/research';
import { formatNumber } from '../game/core';

const ResearchItem = ({ researchItem, currentKnowledge, researchedItems, gamePhase, onResearch }) => {
  const dispatch = useDispatch();
  if (!researchItem) return null;

  const isCompleted = researchedItems[researchItem.id];
  const canAfford = currentKnowledge >= researchItem.knowledgeCost;
  
  // Check availability based on unlock conditions (which also checks for completion)
  const available = isResearchAvailable(researchItem, { 
    knowledge: currentKnowledge, 
    researchedItems,
    phase: gamePhase
    // fish: gameState.fish - if needed by any research condition
  });

  // If an item is completed, we might still want to show it as \"Researched\"
  // If not available due to other unmet conditions (e.g. prerequisites), it shouldn't be shown by the parent filter.
  // This component now mostly cares about affordance and completion status for its button.

  const handleButtonClick = () => {
    if (!isCompleted && canAfford) {
      onResearch(researchItem);
    }
  };

  return (
    <Paper 
      elevation={1}
      sx={{ 
        p: 2, 
        mb: 2, 
        borderRadius: 2,
        border: isCompleted ? '1px solid rgba(76, 175, 80, 0.3)' : '1px solid rgba(0,0,0,0.1)',
        opacity: isCompleted ? 0.7 : 1,
        background: isCompleted ? 'linear-gradient(to right, rgba(76, 175, 80, 0.03), rgba(76, 175, 80, 0.06))' : 'white',
        transition: 'all 0.2s ease',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
            {researchItem.icon} {researchItem.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem', my: 1, lineHeight: 1.4 }}>
            {researchItem.description}
          </Typography>
        </Box>
        {isCompleted && (
          <Chip label="Researched" color="success" size="small" sx={{ height: 22, fontSize: '0.7rem' }} />
        )}
      </Box>
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1.5}}>
        <Typography variant="body2" sx={{ fontWeight: 'medium', fontSize: '0.8rem' }}>
          Cost: {formatNumber(researchItem.knowledgeCost)} Knowledge 🧠
        </Typography>
        <Button 
          variant={isCompleted ? "outlined" : "contained"}
          size="small" 
          disabled={!canAfford || isCompleted}
          onClick={handleButtonClick}
          color={isCompleted ? "success" : "primary"}
          sx={{ 
            fontSize: '0.75rem', 
            fontWeight: 'bold', 
            minWidth: '100px',
            borderRadius: 1.5
          }}
        >
          {isCompleted ? 'Completed' : 'Research'}
        </Button>
      </Box>
    </Paper>
  );
};

const ResearchPanel = () => {
  const dispatch = useDispatch();
  const currentKnowledge = useSelector(selectKnowledge);
  const researchedItems = useSelector(selectResearchedItems);
  const gamePhase = useSelector(selectGamePhase);
  // Add other gameState properties if research unlock conditions depend on them (e.g., fish count, specific upgrades)
  const gameState = { knowledge: currentKnowledge, researchedItems, phase: gamePhase }; 

  const allResearch = useMemo(() => getAllResearchItems(), []);

  const availableResearchItems = useMemo(() => {
    return Object.values(allResearch).filter(item => 
      isResearchAvailable(item, gameState) && !researchedItems[item.id]
    );
  }, [allResearch, gameState, researchedItems]);

  const completedResearchItems = useMemo(() => {
    return Object.values(allResearch).filter(item => researchedItems[item.id]);
  }, [allResearch, researchedItems]);

  const handleResearch = (item) => {
    if (currentKnowledge >= item.knowledgeCost && !researchedItems[item.id]) {
      dispatch(completeResearch({ researchId: item.id, cost: item.knowledgeCost }));
    }
  };

  return (
    <Box sx={{ p: {xs: 1.5, sm: 2}, height: '100%', overflowY: 'auto' }}>
      {availableResearchItems.length === 0 && completedResearchItems.length === 0 && (
         <Alert severity="info" sx={{ mb: 2 }}>
          No research available yet. Gain more Knowledge or advance to new game phases to unlock research!
        </Alert>
      )}

      {availableResearchItems.length > 0 && (
        <Box mb={3}>
          <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb:1.5, fontWeight: 600}}>Available Research</Typography>
          {availableResearchItems.map(item => (
            <ResearchItem 
              key={item.id} 
              researchItem={item} 
              currentKnowledge={currentKnowledge} 
              researchedItems={researchedItems}
              gamePhase={gamePhase}
              onResearch={handleResearch} 
            />
          ))}
        </Box>
      )}

      {completedResearchItems.length > 0 && (
        <Box>
          <Typography variant="overline" color="text.secondary" sx={{ display: 'block', mb:1.5, fontWeight: 600}}>Completed Research</Typography>
          {completedResearchItems.map(item => (
            <ResearchItem 
              key={item.id} 
              researchItem={item} 
              currentKnowledge={currentKnowledge} 
              researchedItems={researchedItems}
              gamePhase={gamePhase}
              onResearch={() => {}} // No action for completed
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ResearchPanel; 