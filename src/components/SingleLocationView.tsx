import React, { useRef, useEffect, useState } from 'react';

import { drawFish, BreedingEvent } from './FishRenderer';
import GameControls from './GameControls';
import StatsDisplay from './StatsDisplay';
import { drawTankBackground } from './TankRenderer';
import { Location, Tank, Upgrade, Fish } from '../store/gameModels';

interface SingleLocationViewProps {
  currentLocation: Location;
  currentTank: Tank;
  handleTankClick: (e: React.MouseEvent<HTMLCanvasElement>, locationId: string) => void;
  feedbackPopups: Array<{id: number, x: number, y: number, opacity: number, timestamp: number}>;
  capacityReached: boolean;
  fishPoints: number;
  availableTanks: Tank[];
  availableLocations: Location[];
  availableUpgrades: Upgrade[];
  isMaxTankLevel: boolean;
  handleBuyTank: (tankId: string) => void;
  handleBuyLocation: (locationId: string) => void;
  handleBuyUpgrade: (upgradeId: string) => void;
  controlsVisible: boolean;
  clickPower: number;
  currentLocationId: string;
  breedingEvent: BreedingEvent;
}

const SingleLocationView: React.FC<SingleLocationViewProps> = ({
  currentLocation,
  currentTank,
  handleTankClick,
  feedbackPopups,
  capacityReached,
  fishPoints,
  availableTanks,
  availableLocations,
  availableUpgrades,
  isMaxTankLevel,
  handleBuyTank,
  handleBuyLocation,
  handleBuyUpgrade,
  controlsVisible,
  clickPower,
  currentLocationId,
  breedingEvent
}) => {
  // Add ref for the canvas
  const singleCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  // Add state to track if user has clicked
  const [hasClicked, setHasClicked] = useState(false);
  // Add ref to track active touch points
  const activeTouchesRef = useRef<Record<string, { id: number, x: number, y: number }>>({});
  
  // Set up animation
  useEffect(() => {
    if (!singleCanvasRef.current) return;
    
    const canvas = singleCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Size canvas to its container
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
      }
    };
    
    // Initialize canvas size
    resizeCanvas();
    
    // Re-size on window resize
    window.addEventListener('resize', resizeCanvas);
    
    // Animation function
    const render = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw tank background
      drawTankBackground(ctx, canvas, currentLocation.tankId);
      
      // Draw each fish in this location
      currentLocation.fish.forEach((fish: Fish) => {
        drawFish(ctx, fish, canvas, currentLocationId, breedingEvent);
      });
      
      // Request next frame
      animationFrameIdRef.current = requestAnimationFrame(render);
    };
    
    // Start animation loop
    render();
    
    // Cleanup function
    return () => {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [currentLocation, breedingEvent, currentLocationId]);

  // Custom click handler to track first click
  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!hasClicked) {
      setHasClicked(true);
    }
    handleTankClick(e, currentLocationId);
  };
  
  // Touch event handlers for multi-touch support
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!hasClicked) {
      setHasClicked(true);
    }
    
    // Process all touch points
    for (let i = 0; i < e.touches.length; i++) {
      const touch = e.touches[i];
      const rect = e.currentTarget.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      
      // Create a synthetic mouse event with proper methods
      const syntheticEvent = {
        clientX: touch.clientX,
        clientY: touch.clientY,
        currentTarget: e.currentTarget,
        preventDefault: function() { /* Implementation to satisfy ESLint */ return true; },
        stopPropagation: function() { /* Implementation to satisfy ESLint */ return true; }
      } as unknown as React.MouseEvent<HTMLCanvasElement>;
      
      // Store touch point for tracking
      activeTouchesRef.current[touch.identifier] = { id: touch.identifier, x, y };
      
      // Trigger the tank click handler
      handleTankClick(syntheticEvent, currentLocationId);
    }
  };
  
  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    // Touch move handling can be added if needed for future features
  };
  
  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    
    // Remove ended touches from tracking
    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      delete activeTouchesRef.current[touch.identifier];
    }
  };
  
  return (
    <div className="single-location">
      <div className="tank-with-controls">
        {/* Stats display */}
        <StatsDisplay 
          fishPoints={fishPoints}
          location={currentLocation}
          tank={currentTank}
        />
        
        <div className="canvas-container">
          <canvas 
            ref={singleCanvasRef}
            onClick={handleClick}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          />
          
          {/* Render feedback popups */}
          {feedbackPopups.map(popup => (
            <div
              key={popup.id}
              className="feedback-popup"
              style={{
                left: `${popup.x}px`,
                top: `${popup.y}px`,
                opacity: popup.opacity,
              }}
            >
              +{clickPower} FP
            </div>
          ))}
          
          {/* Instruction tooltip - only show if user hasn't clicked */}
          {!hasClicked && (
            <div className="instruction-tooltip">
              Click or tap tank to feed fish
            </div>
          )}
        </div>
        
        {/* Game controls */}
        <GameControls
          _capacityReached={capacityReached}
          fishPoints={fishPoints}
          availableTanks={availableTanks}
          availableLocations={availableLocations}
          availableUpgrades={availableUpgrades}
          _isMaxTankLevel={isMaxTankLevel}
          onBuyTank={handleBuyTank}
          onBuyLocation={handleBuyLocation}
          onBuyUpgrade={handleBuyUpgrade}
          _controlsVisible={controlsVisible}
          onToggleControls={() => {
            // Controls visibility is managed by parent component
            // This is a required prop but not needed in this view
          }}
        />
      </div>
    </div>
  );
};

export default SingleLocationView; 