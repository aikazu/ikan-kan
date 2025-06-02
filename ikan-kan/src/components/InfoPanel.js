import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Paper,
  Typography,
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
import EqualizerIcon from '@mui/icons-material/Equalizer';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TimerIcon from '@mui/icons-material/Timer';
import ScienceIcon from '@mui/icons-material/Science';

// Removed imports of selectors from gameSlice, as they are now in gameSelectors
import {
  selectFish,
  selectScales,
  selectKnowledge,
  selectClickPower,
  selectFishPerSecond,
  selectGamePhase
} from '../store/gameSelectors'; // Corrected path
import { formatNumber } from '../game/core';

const InfoPanel = ({ open, onClose }) => {
// ... rest of the component code ...
};

export default InfoPanel; 