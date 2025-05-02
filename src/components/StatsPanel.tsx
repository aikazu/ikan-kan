import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import './StatsPanel.css';

const StatsPanel: React.FC = () => {
  const { fishPoints, fishCount, locations, tanks, currentLocationId } = useSelector((state: RootState) => state.game);
  
  const currentLocation = locations[currentLocationId];
  const currentTankData = tanks[currentLocation.tankId];
  
  return (
    <div className="stats-panel">
      <div className="stat-item">
        <div className="stat-value">{fishPoints.toFixed(1)}</div>
        <div className="stat-label">Fish Points</div>
      </div>
      
      <div className="stat-item">
        <div className="stat-value">{fishCount}</div>
        <div className="stat-label">Fish</div>
      </div>
      
      <div className="stat-item">
        <div className="stat-value">{currentTankData.name}</div>
        <div className="stat-label">Current Tank</div>
      </div>
      
      <div className="stat-item">
        <div className="stat-value">{currentLocation.fish.length}/{currentTankData.capacity}</div>
        <div className="stat-label">Capacity</div>
      </div>
    </div>
  );
};

export default StatsPanel; 