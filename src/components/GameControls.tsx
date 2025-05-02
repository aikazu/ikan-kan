import React from 'react';
import { Tank, Location, Upgrade } from '../store/gameModels';
import './GameControls.css';

interface GameControlsProps {
  capacityReached: boolean;
  fishPoints: number;
  availableTanks: Tank[];
  availableLocations: Location[];
  availableUpgrades: Upgrade[];
  isMaxTankLevel: boolean;
  onBuyTank: (tankId: string) => void;
  onBuyLocation: (locationId: string) => void;
  onBuyUpgrade: (upgradeId: string) => void;
  controlsVisible: boolean;
  onToggleControls: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({
  capacityReached,
  fishPoints,
  availableTanks,
  availableLocations,
  availableUpgrades,
  isMaxTankLevel,
  onBuyTank,
  onBuyLocation,
  onBuyUpgrade,
  controlsVisible
}) => {
  const showNoUpgradesMessage = 
    availableTanks.length === 0 && 
    availableLocations.length === 0 && 
    availableUpgrades.length === 0;

  return (
    <div className="integrated-controls">
      {/* Tank Upgrades */}
      {availableTanks.length > 0 && 
        availableTanks.map((tank) => (
          <div key={tank.id} className="upgrade-card">
            <div className="upgrade-info">
              <div className="upgrade-name">{tank.name}</div>
              <div className="upgrade-description">Capacity: {tank.capacity} fish</div>
            </div>
            <button 
              className="upgrade-button"
              onClick={() => onBuyTank(tank.id)}
              disabled={tank.cost > fishPoints}
            >
              {`${tank.cost} FP`}
            </button>
          </div>
        ))
      }
      
      {/* New Locations */}
      {availableLocations.length > 0 && 
        availableLocations.map((location) => (
          <div key={location.id} className="upgrade-card">
            <div className="upgrade-info">
              <div className="upgrade-name">{location.name}</div>
              <div className="upgrade-description">Start a new tank in a different location</div>
            </div>
            <button 
              className="upgrade-button"
              onClick={() => onBuyLocation(location.id)}
              disabled={location.cost > fishPoints}
            >
              {`${location.cost} FP`}
            </button>
          </div>
        ))
      }
      
      {/* Upgrades */}
      {availableUpgrades.length > 0 && 
        availableUpgrades.map((upgrade) => (
          <div key={upgrade.id} className="upgrade-card">
            <div className="upgrade-info">
              <div className="upgrade-name">{upgrade.name}</div>
              <div className="upgrade-description">{upgrade.description}</div>
            </div>
            <button 
              className="upgrade-button"
              onClick={() => onBuyUpgrade(upgrade.id)}
              disabled={upgrade.cost > fishPoints}
            >
              {upgrade.cost} FP
            </button>
          </div>
        ))
      }
      
      {/* Message when no upgrades available */}
      {showNoUpgradesMessage && (
        <div className="upgrade-card hint-card">
          <p className="no-upgrade-hint">Keep feeding your fish to fill your tank and unlock upgrades!</p>
        </div>
      )}
    </div>
  );
};

export default GameControls; 