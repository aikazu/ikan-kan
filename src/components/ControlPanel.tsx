import React, { useCallback } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../store';
import { Tank, Upgrade, Location } from '../store/gameModels';
import { buyTank, buyUpgrade, buyLocation } from '../store/gameSlice';
import './ControlPanel.css';

// Component for tank upgrades section
const TankUpgradesSection: React.FC<{
  capacityReached: boolean;
  availableTanks: Tank[];
  fishPoints: number;
  onBuyTank: (tankId: string) => void;
}> = ({ capacityReached, availableTanks, fishPoints, onBuyTank }) => {
  if (!capacityReached || availableTanks.length === 0) return null;
  
  return (
    <div className="control-section upgrade-section">
      <h2>Tank Upgrades</h2>
      <p className="upgrade-hint">Your tank is full! Time to upgrade.</p>
      {availableTanks.map((tank: Tank) => (
        <div key={tank.id} className="purchase-item">
          <div className="purchase-info">
            <div className="purchase-name">{tank.name}</div>
            <div className="purchase-description">Capacity: {tank.capacity} fish</div>
          </div>
          <button 
            className="purchase-button"
            onClick={() => onBuyTank(tank.id)}
            disabled={tank.cost > fishPoints}
          >
            {`${tank.cost} FP`}
          </button>
        </div>
      ))}
    </div>
  );
};

// Component for locations section
const LocationsSection: React.FC<{
  availableLocations: Location[];
  fishPoints: number;
  isMaxTankLevel: boolean;
  capacityReached: boolean;
  availableTanks: Tank[];
  onBuyLocation: (locationId: string) => void;
}> = ({ availableLocations, fishPoints, isMaxTankLevel, capacityReached, availableTanks, onBuyLocation }) => {
  if (availableLocations.length === 0) return null;
  
  return (
    <div className="control-section">
      <h2>New Locations</h2>
      {isMaxTankLevel && (
        <p className="upgrade-hint">You&apos;ve reached the maximum tank level here! Expand to new locations.</p>
      )}
      {capacityReached && !isMaxTankLevel && availableTanks.length === 0 && (
        <p className="upgrade-hint">Your tank is full but you can&apos;t afford an upgrade yet. Consider a new location!</p>
      )}
      {availableLocations.map((location: Location) => (
        <div key={location.id} className="purchase-item">
          <div className="purchase-info">
            <div className="purchase-name">{location.name}</div>
            <div className="purchase-description">Start a new tank in a different location</div>
          </div>
          <button 
            className="purchase-button"
            onClick={() => onBuyLocation(location.id)}
            disabled={location.cost > fishPoints}
          >
            {`${location.cost} FP`}
          </button>
        </div>
      ))}
    </div>
  );
};

// Component for upgrades section
const UpgradesSection: React.FC<{
  availableUpgrades: Upgrade[];
  fishPoints: number;
  onBuyUpgrade: (upgradeId: string) => void;
}> = ({ availableUpgrades, fishPoints, onBuyUpgrade }) => {
  if (availableUpgrades.length === 0) return null;
  
  return (
    <div className="control-section">
      <h2>Upgrades</h2>
      {availableUpgrades.map((upgrade: Upgrade) => (
        <div key={upgrade.id} className="purchase-item">
          <div className="purchase-info">
            <div className="purchase-name">{upgrade.name}</div>
            <div className="purchase-description">{upgrade.description}</div>
          </div>
          <button 
            className="purchase-button"
            onClick={() => onBuyUpgrade(upgrade.id)}
            disabled={upgrade.cost > fishPoints}
          >
            {upgrade.cost} FP
          </button>
        </div>
      ))}
    </div>
  );
};

const ControlPanel: React.FC = () => {
  const dispatch = useDispatch();
  const { 
    fishPoints, 
    tanks, 
    upgrades, 
    locations,
    currentLocationId,
    capacityReached
  } = useSelector((state: RootState) => state.game);
  
  const handleBuyTank = useCallback((tankId: string) => {
    dispatch(buyTank(tankId));
  }, [dispatch]);
  
  const handleBuyUpgrade = useCallback((upgradeId: string) => {
    dispatch(buyUpgrade(upgradeId));
  }, [dispatch]);
  
  const handleBuyLocation = useCallback((locationId: string) => {
    dispatch(buyLocation(locationId));
  }, [dispatch]);
  
  const currentLocation = locations[currentLocationId];
  const currentTank = tanks[currentLocation.tankId];
  
  // Check if we've reached maximum tank level for this location
  const isMaxTankLevel = Object.values(tanks).every(tank => 
    tank.level <= currentTank.level || tank.unlocked
  );
  
  // Filter available tanks that can be purchased (next level only)
  const availableTanks = Object.values(tanks).filter((tank: Tank) => 
    !tank.unlocked && 
    tank.level === currentTank.level + 1 && 
    tank.cost <= fishPoints
  );
  
  // Find new locations that can be purchased (only show when tank is at capacity or max level)
  const availableLocations = Object.values(locations).filter((location: Location) => 
    !location.unlocked && 
    location.cost <= fishPoints &&
    (capacityReached || isMaxTankLevel)
  );
  
  // Filter available upgrades (only show unlocked and not purchased)
  const availableUpgrades = Object.values(upgrades).filter((upgrade: Upgrade) => 
    upgrade.unlocked && !upgrade.purchased
  );
  
  const showHint = !capacityReached && 
                   availableTanks.length === 0 && 
                   availableLocations.length === 0 && 
                   availableUpgrades.length === 0;
  
  return (
    <div className="control-panel">
      <div className="control-section">
        <h2>Game Controls</h2>
        <p className="instruction-text">Click on the tank to feed fish!</p>
      </div>
      
      <TankUpgradesSection 
        capacityReached={capacityReached}
        availableTanks={availableTanks}
        fishPoints={fishPoints}
        onBuyTank={handleBuyTank}
      />
      
      <LocationsSection 
        availableLocations={availableLocations}
        fishPoints={fishPoints}
        isMaxTankLevel={isMaxTankLevel}
        capacityReached={capacityReached}
        availableTanks={availableTanks}
        onBuyLocation={handleBuyLocation}
      />
      
      <UpgradesSection 
        availableUpgrades={availableUpgrades}
        fishPoints={fishPoints}
        onBuyUpgrade={handleBuyUpgrade}
      />
      
      {showHint && (
        <div className="control-section">
          <p className="upgrade-hint">Keep feeding your fish to fill your tank and unlock upgrades!</p>
        </div>
      )}
    </div>
  );
};

export default ControlPanel; 