import React from 'react';
import { Fish, BreedingEvent } from '../store/gameModels';

// Re-export the BreedingEvent interface for components that import it from this file
export type { BreedingEvent };

/**
 * Interface representing a breeding event in the game
 */
interface FishRendererProps {
  breedingEvent: BreedingEvent;
}

/**
 * Draws a fish entity on the canvas
 */
export const drawFish = (
  ctx: CanvasRenderingContext2D, 
  fishEntity: Fish, 
  canvas: HTMLCanvasElement,
  locationId: string,
  breedingEvent: BreedingEvent
) => {
  // Calculate actual position based on percentage
  const x = (fishEntity.position.x / 100) * canvas.width;
  const y = (fishEntity.position.y / 100) * canvas.height;
  
  // Determine fish direction (facing left or right)
  const isFacingRight = fishEntity.velocity.x > 0;
  
  // Base size scaled by the canvas and fish's size property
  const baseSize = Math.min(canvas.width, canvas.height) * 0.05 * fishEntity.size;
  
  // Save the current context state
  ctx.save();
  
  // Translate to fish position
  ctx.translate(x, y);
  
  // If facing left, flip the fish horizontally
  if (!isFacingRight) {
    ctx.scale(-1, 1);
  }
  
  // For breeding fish, add a subtle pulsing effect
  if (fishEntity.breeding) {
    const pulseScale = 1 + (Math.sin(Date.now() / 100) * 0.1);
    ctx.scale(pulseScale, pulseScale);
    
    // Add a glowing effect for breeding fish
    ctx.shadowColor = 'rgba(255, 255, 0, 0.6)';
    ctx.shadowBlur = baseSize * 0.6;
  }
  
  // For newly created fish (less than 1 second old), add a subtle growing effect
  if (fishEntity.isNew) {
    const age = Date.now() - fishEntity.lastUpdate;
    const growScale = Math.min(1, age / 1000); // Scale up over 1 second
    ctx.scale(growScale, growScale);
  }
  
  // Fish body
  ctx.fillStyle = fishEntity.color;
  ctx.beginPath();
  ctx.ellipse(0, 0, baseSize, baseSize * 0.6, 0, 0, 2 * Math.PI);
  ctx.fill();
  
  // Fish tail
  ctx.beginPath();
  ctx.moveTo(-baseSize * 0.7, 0);
  ctx.lineTo(-baseSize * 1.5, -baseSize * 0.7);
  ctx.lineTo(-baseSize * 1.5, baseSize * 0.7);
  ctx.closePath();
  
  // Tail color (slightly lighter than body)
  const tailColor = fishEntity.color === '#ff7700' 
    ? '#ff9900'
    : fishEntity.color; // For now, keep same as body for custom colors
  
  ctx.fillStyle = tailColor;
  ctx.fill();
  
  // Fish eye
  ctx.beginPath();
  ctx.arc(baseSize * 0.5, -baseSize * 0.25, baseSize * 0.15, 0, 2 * Math.PI);
  ctx.fillStyle = 'white';
  ctx.fill();
  
  // Fish pupil
  ctx.beginPath();
  ctx.arc(baseSize * 0.55, -baseSize * 0.25, baseSize * 0.07, 0, 2 * Math.PI);
  ctx.fillStyle = 'black';
  ctx.fill();
  
  // Fish fin on top
  ctx.beginPath();
  ctx.moveTo(0, -baseSize * 0.5);
  ctx.quadraticCurveTo(
    baseSize * 0.25, -baseSize * 1.2,
    baseSize * 0.5, -baseSize * 0.5
  );
  ctx.fillStyle = tailColor;
  ctx.fill();
  
  // Reset shadow blur after drawing fish
  ctx.shadowBlur = 0;
  
  // Restore context to previous state
  ctx.restore();
  
  // Draw breeding animation if this fish is breeding and event just occurred in this location
  if (
    breedingEvent.occurred && 
    breedingEvent.parentId === fishEntity.id && 
    breedingEvent.locationId === locationId &&
    Date.now() - breedingEvent.timestamp < 1000
  ) {
    drawBreedingEffect(ctx, x, y, canvas, Date.now() - breedingEvent.timestamp);
  }
};

/**
 * Draws breeding effect animation for fish
 */
export const drawBreedingEffect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  canvas: HTMLCanvasElement,
  age: number
) => {
  // Animation duration is 1000ms
  const progress = age / 1000;
  
  // Heart size and position calculations
  const heartSize = Math.min(canvas.width, canvas.height) * 0.04;
  const opacity = 1 - progress; // Fade out over time
  
  // Draw heart shape
  ctx.save();
  
  // Red heart with fading opacity
  ctx.fillStyle = `rgba(255, 0, 0, ${opacity})`;
  
  // Draw 2-3 hearts that float upwards and outwards
  for (let i = 0; i < 3; i++) {
    const angle = (Math.PI / 4) * i;
    const distance = progress * 30; // Move outward over time
    const heartX = x + Math.cos(angle) * distance;
    const heartY = y - 10 - (progress * 30) - (i * 5); // Float upward
    
    // Draw a simple heart shape
    ctx.beginPath();
    ctx.moveTo(heartX, heartY + heartSize * 0.3);
    ctx.bezierCurveTo(
      heartX, heartY, 
      heartX - heartSize, heartY, 
      heartX - heartSize, heartY + heartSize
    );
    ctx.bezierCurveTo(
      heartX - heartSize, heartY + heartSize * 1.5, 
      heartX, heartY + heartSize * 1.5, 
      heartX, heartY + heartSize * 0.3
    );
    ctx.bezierCurveTo(
      heartX, heartY + heartSize * 1.5, 
      heartX + heartSize, heartY + heartSize * 1.5, 
      heartX + heartSize, heartY + heartSize
    );
    ctx.bezierCurveTo(
      heartX + heartSize, heartY, 
      heartX, heartY, 
      heartX, heartY + heartSize * 0.3
    );
    ctx.fill();
  }
  
  ctx.restore();
};

/**
 * Utility component for fish rendering
 */
const FishRenderer: React.FC<FishRendererProps> = ({ breedingEvent }) => {
  return null; // This is a utility component that doesn't render anything itself
};

export default FishRenderer; 