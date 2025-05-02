import React, { useRef, useEffect } from 'react';
import { Location, Tank, Fish } from '../store/gameModels';
import { drawTankBackground } from './TankRenderer';
import { drawFish, BreedingEvent } from './FishRenderer';
import './LocationBox.css';

interface LocationBoxProps {
  location: Location;
  tank: Tank;
  isCurrentLocation: boolean;
  onLocationClick: (locationId: string) => void;
  onTankClick: (e: React.MouseEvent<HTMLCanvasElement>, locationId: string) => void;
  feedbackPopups: Array<{id: number, x: number, y: number, opacity: number, timestamp: number}>;
  clickPower: number;
  breedingEvent: BreedingEvent;
}

const LocationBox: React.FC<LocationBoxProps> = ({
  location,
  tank,
  isCurrentLocation,
  onLocationClick,
  onTankClick,
  feedbackPopups,
  clickPower,
  breedingEvent
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameIdRef = useRef<number | null>(null);
  
  const isAtCapacity = location.fish.length >= tank.capacity;
  const tankFillPercentage = (location.fish.length / tank.capacity) * 100;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
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
      drawTankBackground(ctx, canvas, location.tankId);
      
      // Draw each fish in this location
      location.fish.forEach((fish: Fish) => {
        drawFish(ctx, fish, canvas, location.id, breedingEvent);
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
  }, [location, breedingEvent]);

  return (
    <div 
      className={`location-box ${isCurrentLocation ? 'active-location' : ''}`}
      onClick={() => onLocationClick(location.id)}
    >
      <div className="tank-info">
        <span className="location-name">{location.name}</span>
        <div className="capacity-container">
          <div 
            className={`capacity-bar ${isAtCapacity ? 'capacity-full' : ''}`}
            style={{ width: `${Math.min(100, tankFillPercentage)}%` }}
          ></div>
          <span className="capacity-text">
            {location.fish.length}/{tank.capacity}
          </span>
        </div>
      </div>
      <div className={`canvas-container ${isAtCapacity ? 'tank-full' : ''}`}>
        <canvas 
          ref={canvasRef} 
          onClick={(e) => onTankClick(e, location.id)}
          style={{ cursor: isCurrentLocation ? 'pointer' : 'default' }}
        />
        
        {/* Render feedback popups */}
        {isCurrentLocation && feedbackPopups.map(popup => (
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
      </div>
    </div>
  );
};

export default LocationBox; 