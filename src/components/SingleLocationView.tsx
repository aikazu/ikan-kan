import React, { useRef, useEffect } from 'react';
import StatsDisplay from './StatsDisplay';
import GameControls from './GameControls';
import { drawTankBackground } from './TankRenderer';
import { drawFish, BreedingEvent } from './FishRenderer';
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
            onClick={(e) => handleTankClick(e, currentLocationId)} 
            style={{ cursor: 'pointer', width: '100%', height: '100%' }}
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
          
          {/* Instruction tooltip */}
          <div className="instruction-tooltip">
            Click tank to feed fish
          </div>
        </div>
        
        {/* Game controls */}
        <GameControls
          capacityReached={capacityReached}
          fishPoints={fishPoints}
          availableTanks={availableTanks}
          availableLocations={availableLocations}
          availableUpgrades={availableUpgrades}
          isMaxTankLevel={isMaxTankLevel}
          onBuyTank={handleBuyTank}
          onBuyLocation={handleBuyLocation}
          onBuyUpgrade={handleBuyUpgrade}
          controlsVisible={controlsVisible}
          onToggleControls={() => {}}
        />
      </div>
    </div>
  );
};

export default SingleLocationView; 