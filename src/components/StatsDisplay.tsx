import React from 'react';

import { Tank, Location } from '../store/gameModels';
import './StatsDisplay.css';

interface StatsDisplayProps {
  fishPoints: number;
  location: Location;
  tank: Tank;
}

const StatsDisplay: React.FC<StatsDisplayProps> = ({ fishPoints, location, tank }) => {
  return (
    <div className="tank-indicators">
      <div className="indicator">
        <div className="indicator-icon">FP</div>
        <div className="indicator-value">{fishPoints.toFixed(1)}</div>
        <div className="indicator-label">Points</div>
      </div>
      <div className="indicator">
        <div className="indicator-icon">🐟</div>
        <div className="indicator-value">{location.fish.length}</div>
        <div className="indicator-label">Fish</div>
      </div>
      <div className="indicator">
        <div className="indicator-icon">🏆</div>
        <div className="indicator-value">{tank.name}</div>
        <div className="indicator-label">{location.name}</div>
      </div>
      <div className="indicator">
        <div className="indicator-icon">📊</div>
        <div className="indicator-value">{location.fish.length}/{tank.capacity}</div>
        <div className="indicator-label">Capacity</div>
      </div>
    </div>
  );
};

export default StatsDisplay; 