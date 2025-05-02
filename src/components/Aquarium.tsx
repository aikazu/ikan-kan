import React, { useState, useEffect, useCallback } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import { RootState } from '../store';
import LocationBox from './LocationBox';
import SingleLocationView from './SingleLocationView';
import { Tank, Upgrade, Location, GameState } from '../store/gameModels';
import { switchLocation, feedFish, buyTank, buyUpgrade, buyLocation } from '../store/gameSlice';
import './Aquarium.css';

/**
 * Hook to manage feedback popups for fish feeding
 */
const useFeedbackPopups = () => {
  const [feedbackPopups, setFeedbackPopups] = useState<Array<{id: number, x: number, y: number, opacity: number, timestamp: number}>>([]);
  const [popupCounter, setPopupCounter] = useState(0);
  
  // Create a new popup at click position
  const addPopup = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Add new popup
    const newPopup = {
      id: popupCounter,
      x,
      y,
      opacity: 1,
      timestamp: Date.now(),
    };
    
    setFeedbackPopups(prev => [...prev, newPopup]);
    setPopupCounter(prev => prev + 1);
  }, [popupCounter]);
  
  // Animation for feedback popups
  useEffect(() => {
    if (feedbackPopups.length === 0) return;
    
    const animationFrame = requestAnimationFrame(() => {
      const now = Date.now();
      // Update popups (reduce opacity and move up)
      setFeedbackPopups(prev => 
        prev
          .map(popup => ({
            ...popup,
            y: popup.y - 1.5, // Move up faster
            opacity: Math.max(0, 1 - (now - popup.timestamp) / 800), // Fade out over 0.8 seconds
          }))
          // Remove completely faded popups
          .filter(popup => popup.opacity > 0)
      );
    });
    
    return () => cancelAnimationFrame(animationFrame);
  }, [feedbackPopups]);
  
  return { feedbackPopups, addPopup };
};

/**
 * Hook to handle tank and upgrade actions
 */
const useAquariumActions = () => {
  const dispatch = useDispatch();
  
  const handleTankClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>, locationId: string, currentLocationId: string) => {
    if (locationId === currentLocationId) {
      dispatch(feedFish());
      return true; // Return true if we processed a feed action
    }
    return false; // Return false if no action taken
  }, [dispatch]);
  
  const handleBuyTank = useCallback((tankId: string) => {
    dispatch(buyTank(tankId));
  }, [dispatch]);
  
  const handleBuyUpgrade = useCallback((upgradeId: string) => {
    dispatch(buyUpgrade(upgradeId));
  }, [dispatch]);
  
  const handleBuyLocation = useCallback((locationId: string) => {
    dispatch(buyLocation(locationId));
  }, [dispatch]);
  
  const handleLocationClick = useCallback((locationId: string, locations: Record<string, Location>, currentLocationId: string) => {
    if (locations[locationId].unlocked && locationId !== currentLocationId) {
      dispatch(switchLocation(locationId));
    }
  }, [dispatch]);
  
  return { 
    handleTankClick, 
    handleBuyTank, 
    handleBuyUpgrade, 
    handleBuyLocation, 
    handleLocationClick 
  };
};

/**
 * Main Aquarium component that manages the fish tank display and interactions
 */
const Aquarium: React.FC = () => {
  const [controlsVisible] = useState(true);
  const { feedbackPopups, addPopup } = useFeedbackPopups();
  const { 
    handleTankClick, 
    handleBuyTank, 
    handleBuyUpgrade, 
    handleBuyLocation, 
    handleLocationClick 
  } = useAquariumActions();
  
  const { 
    fishPoints, 
    locations, 
    tanks, 
    upgrades,
    breedingEvent, 
    capacityReached, 
    currentLocationId, 
    clickPower 
  } = useSelector((state: RootState) => state.game as GameState);
  
  // Wrapper for tank click that also triggers popup
  const onTankClick = (e: React.MouseEvent<HTMLCanvasElement>, locationId: string) => {
    const feedAction = handleTankClick(e, locationId, currentLocationId);
    if (feedAction) {
      addPopup(e);
    }
  };
  
  const currentLocation = locations[currentLocationId];
  const currentTank = tanks[currentLocation.tankId];
  
  // Check if we've reached maximum tank level for this location
  const isMaxTankLevel = Object.values(tanks as Record<string, Tank>).every(tank => 
    tank.level <= currentTank.level || tank.unlocked
  );
  
  // Filter available tanks that can be purchased (next level only)
  const availableTanks = Object.values(tanks as Record<string, Tank>).filter((tank) => 
    !tank.unlocked && 
    tank.level === currentTank.level + 1 && 
    tank.cost <= fishPoints
  );
  
  // Find new locations that can be purchased
  const availableLocations = Object.values(locations as Record<string, Location>).filter((location) => 
    !location.unlocked && 
    location.cost <= fishPoints &&
    (capacityReached || isMaxTankLevel)
  );
  
  // Filter available upgrades
  const availableUpgrades = Object.values(upgrades as Record<string, Upgrade>).filter((upgrade) => 
    upgrade.unlocked && !upgrade.purchased
  );
  
  // Get all unlocked locations
  const unlockedLocations = Object.values(locations as Record<string, Location>).filter(location => location.unlocked);
  
  const onLocationClick = (locationId: string) => {
    handleLocationClick(locationId, locations, currentLocationId);
  };
  
  return (
    <div className="integrated-aquarium">
      {/* Full-screen tank display */}
      <div className="aquarium-container">
        {unlockedLocations.length > 1 ? (
          // Multi-location view
          <div className="locations-grid">
            {unlockedLocations.map(location => {
              const locationTank = tanks[location.tankId];
              
              return (
                <LocationBox
                  key={location.id}
                  location={location}
                  tank={locationTank}
                  isCurrentLocation={location.id === currentLocationId}
                  onLocationClick={onLocationClick}
                  onTankClick={onTankClick}
                  feedbackPopups={feedbackPopups}
                  clickPower={clickPower}
                  breedingEvent={breedingEvent}
                />
              );
            })}
          </div>
        ) : (
          // Single location view with integrated controls
          <SingleLocationView
            currentLocation={currentLocation}
            currentTank={currentTank}
            handleTankClick={onTankClick}
            feedbackPopups={feedbackPopups}
            capacityReached={capacityReached}
            fishPoints={fishPoints}
            availableTanks={availableTanks}
            availableLocations={availableLocations}
            availableUpgrades={availableUpgrades}
            isMaxTankLevel={isMaxTankLevel}
            handleBuyTank={handleBuyTank}
            handleBuyLocation={handleBuyLocation}
            handleBuyUpgrade={handleBuyUpgrade}
            controlsVisible={controlsVisible}
            clickPower={clickPower}
            currentLocationId={currentLocationId}
            breedingEvent={breedingEvent}
          />
        )}
      </div>
    </div>
  );
};

export default Aquarium; 