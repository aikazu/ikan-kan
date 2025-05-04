import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { formatNumber } from '../utils/numberUtils';
import { LuckyBubbleType } from '../store/slices/luckyBubbleSlice';
import './ResourcePanel.css';

const ResourcePanel: React.FC = () => {
  const fishPoints = useSelector((state: RootState) => state.tank.fishPoints);
  const currentTank = useSelector((state: RootState) => state.tank.currentTank);
  const feeders = useSelector((state: RootState) => state.feeder.feeders);
  const activeLuckyBubbles = useSelector((state: RootState) => state.luckyBubble.activeLuckyBubbles);
  
  // Calculate FP per second from fish
  let fishPointsPerSecond = 0;
  
  // Check for active 'School's In' bubble for bonus fish production
  const schoolsInBubble = activeLuckyBubbles.find(
    bubble => bubble.type === LuckyBubbleType.SCHOOLS_IN &&
    Date.now() < bubble.startTime + bubble.duration
  );
  const schoolsMultiplier = schoolsInBubble ? 2 : 1;
  
  // Sum points per second from all fish, with schools multiplier if active
  currentTank.fish.forEach(fish => {
    fishPointsPerSecond += fish.pointsPerSecond;
  });
  
  fishPointsPerSecond *= schoolsMultiplier;
  
  // Calculate FP per second from feeders
  // Feeder rate now directly represents FP/s
  const feederRate = feeders.reduce((sum, feeder) => sum + feeder.feedRate, 0);
  
  // Total rate is fish points (passive) + feeder points (automation)
  const totalRate = fishPointsPerSecond + feederRate;

  // Update document title with current FP for real-time updates
  useEffect(() => {
    document.title = `${Math.floor(fishPoints)} FP - Ikan-kan`;
  }, [fishPoints]);

  return (
    <div className="resource-panel">
      <div className="resource-item main">
        <div className="resource-value">{formatNumber(fishPoints)} FP</div>
      </div>
      
      <div className="resource-item rate">
        <div className="resource-value">+{totalRate.toFixed(1)}/s</div>
      </div>
    </div>
  );
};

export default ResourcePanel; 