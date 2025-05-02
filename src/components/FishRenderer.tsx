import React from 'react';

import { Fish, BreedingEvent, FishSpecies } from '../store/gameModels';

// Re-export the BreedingEvent interface for components that import it from this file
export type { BreedingEvent };

/**
 * Interface representing a breeding event in the game
 */
interface FishRendererProps {
  breedingEvent: BreedingEvent;
  fishSpeciesData: Record<string, FishSpecies>; // Pass all species data
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
  
  // Create time-based animation values
  const now = Date.now();
  const swimCycle = Math.sin(now / 200) * 0.2;
  const tailWag = Math.sin(now / 100) * 0.3;
  const finWave = Math.sin(now / 150) * 0.2;
  
  // Translate to fish position with a slight vertical swimming motion
  ctx.translate(x, y + swimCycle * baseSize * 0.2);
  
  // If facing left, flip the fish horizontally
  if (!isFacingRight) {
    ctx.scale(-1, 1);
  }
  
  // For breeding fish, add a subtle pulsing effect
  if (fishEntity.breeding) {
    const pulseScale = 1 + (Math.sin(now / 100) * 0.1);
    ctx.scale(pulseScale, pulseScale);
    
    // Add a glowing effect for breeding fish
    ctx.shadowColor = 'rgba(255, 255, 0, 0.6)';
    ctx.shadowBlur = baseSize * 0.6;
  }
  
  // For newly created fish (less than 1 second old), add a subtle growing effect
  if (fishEntity.isNew) {
    const age = now - fishEntity.lastUpdate;
    const growScale = Math.min(1, age / 1000); // Scale up over 1 second
    ctx.scale(growScale, growScale);
  }
  
  // Fish tail with animation
  ctx.beginPath();
  // Use tailWag to animate the tail
  ctx.moveTo(-baseSize * 0.7, 0);
  ctx.lineTo(-baseSize * (1.5 + tailWag * 0.2), -baseSize * (0.7 - tailWag * 0.1));
  ctx.lineTo(-baseSize * (1.5 + tailWag * 0.2), baseSize * (0.7 - tailWag * 0.1));
  ctx.closePath();
  
  // Tail color (slightly darker than body for better contrast)
  const tailColor = fishEntity.color;
  ctx.fillStyle = tailColor;
  ctx.fill();
  
  // Small fin on bottom
  ctx.beginPath();
  ctx.moveTo(-baseSize * 0.2, baseSize * 0.3);
  ctx.quadraticCurveTo(
    -baseSize * 0.1, baseSize * (0.7 + finWave * 0.5),
    baseSize * 0.2, baseSize * 0.3
  );
  ctx.closePath();
  ctx.fillStyle = tailColor;
  ctx.fill();
  
  // Fish body with a more dynamic shape
  ctx.fillStyle = fishEntity.color;
  ctx.beginPath();
  // Use a slightly elongated ellipse shape with subtle breathing motion
  ctx.ellipse(
    0, 
    0, 
    baseSize * (1 + swimCycle * 0.05), // subtle "breathing" effect
    baseSize * 0.6, 
    0, 
    0, 
    2 * Math.PI
  );
  ctx.fill();
  
  // Add subtle gradient to body for more depth
  const gradient = ctx.createRadialGradient(
    baseSize * 0.2, -baseSize * 0.2, 0,
    0, 0, baseSize
  );
  gradient.addColorStop(0, fishEntity.color);
  // Create a slightly darker color for the gradient's outer edge
  const darkerColor = fishEntity.color.replace(/rgb\((\d+), (\d+), (\d+)\)/, (_, r, g, b) => 
    `rgba(${Math.max(0, parseInt(r) - 40)}, ${Math.max(0, parseInt(g) - 40)}, ${Math.max(0, parseInt(b) - 40)}, 0.7)`
  );
  gradient.addColorStop(1, darkerColor || fishEntity.color);
  
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.ellipse(0, 0, baseSize * (1 + swimCycle * 0.05), baseSize * 0.6, 0, 0, 2 * Math.PI);
  ctx.fill();
  
  // Fish eye
  ctx.beginPath();
  ctx.arc(baseSize * 0.5, -baseSize * 0.25, baseSize * 0.15, 0, 2 * Math.PI);
  ctx.fillStyle = 'white';
  ctx.fill();
  
  // Fish pupil with subtle movement
  ctx.beginPath();
  ctx.arc(
    baseSize * (0.55 + swimCycle * 0.05), 
    -baseSize * (0.25 - swimCycle * 0.05), 
    baseSize * 0.07, 
    0, 
    2 * Math.PI
  );
  ctx.fillStyle = 'black';
  ctx.fill();
  
  // Highlight in eye for more life-like appearance
  ctx.beginPath();
  ctx.arc(
    baseSize * 0.45, 
    -baseSize * 0.3, 
    baseSize * 0.05, 
    0, 
    2 * Math.PI
  );
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.fill();
  
  // Fish fin on top with wave animation
  ctx.beginPath();
  ctx.moveTo(0, -baseSize * 0.5);
  ctx.quadraticCurveTo(
    baseSize * (0.25 + finWave * 0.2), -baseSize * (1.2 + finWave * 0.3),
    baseSize * 0.5, -baseSize * 0.5
  );
  ctx.fillStyle = tailColor;
  ctx.fill();
  
  // Add scales pattern for larger fish
  if (fishEntity.size > 0.8) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    const scaleSize = baseSize * 0.15;
    const rows = 3;
    const cols = 5;
    
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        ctx.beginPath();
        ctx.arc(
          -baseSize * 0.5 + c * scaleSize,
          -baseSize * 0.3 + r * scaleSize,
          scaleSize * 0.5,
          0,
          Math.PI
        );
        ctx.fill();
      }
    }
  }
  
  // Add occasional bubbles from fish mouth
  if (Math.random() < 0.02) { // 2% chance each frame
    drawBubbleTrail(ctx, canvas, x, y, baseSize, isFacingRight);
  }
  
  // Reset shadow blur after drawing fish
  ctx.shadowBlur = 0;
  
  // Restore context to previous state
  ctx.restore();
  
  // Draw breeding animation if this fish is breeding and event just occurred in this location
  if (
    breedingEvent.occurred && 
    breedingEvent.parentId === fishEntity.id && 
    breedingEvent.locationId === locationId &&
    now - breedingEvent.timestamp < 1000
  ) {
    drawBreedingEffect(ctx, x, y, canvas, now - breedingEvent.timestamp);
  }
};

/**
 * Draws bubble trail for fish
 */
const drawBubbleTrail = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  x: number,
  y: number,
  baseSize: number,
  isFacingRight: boolean
) => {
  const bubbleSize = baseSize * 0.1;
  const bubbleX = x + (isFacingRight ? baseSize : -baseSize);
  
  ctx.save();
  
  // Create bubble gradient
  const gradient = ctx.createRadialGradient(
    bubbleX - bubbleSize * 0.3, y - bubbleSize * 0.3, 0,
    bubbleX, y, bubbleSize
  );
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
  gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.3)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
  
  // Draw bubble
  ctx.beginPath();
  ctx.arc(bubbleX, y, bubbleSize, 0, 2 * Math.PI);
  ctx.fillStyle = gradient;
  ctx.fill();
  
  // Highlight in bubble
  ctx.beginPath();
  ctx.arc(bubbleX - bubbleSize * 0.3, y - bubbleSize * 0.3, bubbleSize * 0.3, 0, 2 * Math.PI);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.fill();
  
  ctx.restore();
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
  
  // Red heart with fading opacity and glow effect
  ctx.fillStyle = `rgba(255, 50, 50, ${opacity})`;
  ctx.shadowColor = 'rgba(255, 0, 0, 0.5)';
  ctx.shadowBlur = 5;
  
  // Draw 3-4 hearts that float upwards and outwards
  for (let i = 0; i < 4; i++) {
    const angle = (Math.PI / 4) * i;
    const distance = progress * 40; // Move outward over time
    const heartX = x + Math.cos(angle) * distance;
    const heartY = y - 10 - (progress * 40) - (i * 5); // Float upward
    const rotation = Math.sin(Date.now() / 200 + i) * 0.2; // Gentle swaying
    
    ctx.save();
    ctx.translate(heartX, heartY);
    ctx.rotate(rotation);
    
    // Draw a heart shape with better detail
    ctx.beginPath();
    ctx.moveTo(0, heartSize * 0.3);
    ctx.bezierCurveTo(
      0, heartSize * 0.2, 
      -heartSize, -heartSize * 0.3, 
      0, -heartSize * 0.8
    );
    ctx.bezierCurveTo(
      heartSize, -heartSize * 0.3, 
      0, heartSize * 0.2, 
      0, heartSize * 0.3
    );
    ctx.closePath();
    ctx.fill();
    
    ctx.restore();
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