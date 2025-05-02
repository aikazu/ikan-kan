import React from 'react';

import { 
  drawPlant, 
  drawLilyPad, 
  drawCoral, 
  drawGravel, 
  drawCastle, 
  drawBubbles
} from '../utils/tankDecorations';

/**
 * Draws the tank background with appropriate decorations based on tank type
 */
export const drawTankBackground = (
  ctx: CanvasRenderingContext2D, 
  canvas: HTMLCanvasElement, 
  tankId: string
) => {
  const width = canvas.width;
  const height = canvas.height;
  
  // Clear canvas first
  ctx.clearRect(0, 0, width, height);
  
  // Draw water background based on tank type
  drawWaterBackground(ctx, width, height, tankId);
  
  // Add tank decorations based on tank ID
  drawDecorations(ctx, width, height, tankId);
};

/**
 * Draws water with animated gradient based on tank type
 */
const drawWaterBackground = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  tankId: string
) => {
  const now = Date.now();
  
  // Create gradient based on tank type
  let gradient;
  
  // Get water colors based on tank type
  let topColor;
  let bottomColor;
  let midColor;
  
  switch (tankId) {
    case 'tank2': // Medium tank
      topColor = '#77ccff';
      midColor = '#55bbee';
      bottomColor = '#1199cc';
      break;
    case 'tank3': // Large tank
      topColor = '#44aaff';
      midColor = '#3399ee';
      bottomColor = '#0077cc';
      break;
    case 'tank4': // Huge tank
      topColor = '#0088ee';
      midColor = '#0077cc';
      bottomColor = '#004488';
      break;
    case 'tank1': // Small tank (default)
    default:
      topColor = '#99ddff';
      midColor = '#77ccff';
      bottomColor = '#55aaee';
      break;
  }
  
  // Create a subtle animation for gradients by shifting color values slightly
  const pulse = Math.sin(now / 3000) * 0.05; // Subtle pulse between 0.95 and 1.05
  
  // Apply subtle color pulsing
  const adjustColor = (color: string, factor: number) => {
    // Extract RGB values
    const rgb = color.match(/\d+/g);
    if (!rgb || rgb.length < 3) return color;
    
    // Apply factor to each channel with limits
    const newR = Math.min(255, Math.max(0, Math.round(parseInt(rgb[0]) * factor)));
    const newG = Math.min(255, Math.max(0, Math.round(parseInt(rgb[1]) * factor)));
    const newB = Math.min(255, Math.max(0, Math.round(parseInt(rgb[2]) * factor)));
    
    return `rgb(${newR}, ${newG}, ${newB})`;
  };
  
  // Apply subtle color pulse to create ambient animation
  topColor = adjustColor(topColor, 1 + pulse);
  midColor = adjustColor(midColor, 1 + pulse * 0.8);
  bottomColor = adjustColor(bottomColor, 1 + pulse * 0.5);
  
  // Create a more complex gradient with subtle movement
  gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, topColor);
  gradient.addColorStop(0.4 + Math.sin(now / 5000) * 0.05, midColor); // Subtle stop movement
  gradient.addColorStop(1, bottomColor);
  
  // Fill water background (extend to full height)
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  // Add light rays streaming through water (for deeper tanks)
  if (tankId === 'tank3' || tankId === 'tank4') {
    drawLightRays(ctx, width, height, now);
  }
  
  // Add water surface shimmering effect
  drawWaterSurface(ctx, width, now);
};

/**
 * Draws light rays streaming through the water
 */
const drawLightRays = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  now: number
) => {
  // Number of light rays
  const rayCount = 3 + Math.floor(Math.random() * 3);
  
  // Create light ray effect
  for (let i = 0; i < rayCount; i++) {
    // Ray properties with animation
    const seed = i * 1000;
    const rayWidth = width * (0.05 + Math.random() * 0.1);
    const rayX = width * ((i + 1) / (rayCount + 1)) + Math.sin(now / 8000 + seed) * (width * 0.1);
    const opacity = 0.03 + Math.sin(now / 4000 + seed) * 0.02; // Animate opacity
    
    // Draw the light ray
    const rayGradient = ctx.createLinearGradient(0, 0, 0, height);
    rayGradient.addColorStop(0, `rgba(255, 255, 255, ${opacity * 2})`);
    rayGradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
    
    ctx.fillStyle = rayGradient;
    
    // Draw with a slight curve
    ctx.beginPath();
    ctx.moveTo(rayX - rayWidth / 2, 0);
    ctx.quadraticCurveTo(
      rayX + Math.sin(now / 5000 + seed) * (width * 0.05), height * 0.5,
      rayX + rayWidth / 2, height
    );
    ctx.lineTo(rayX + rayWidth * 1.5, height);
    ctx.quadraticCurveTo(
      rayX + rayWidth + Math.sin(now / 6000 + seed) * (width * 0.05), height * 0.5,
      rayX + rayWidth, 0
    );
    ctx.closePath();
    ctx.fill();
  }
};

/**
 * Draws the water surface with a shimmering effect
 */
const drawWaterSurface = (
  ctx: CanvasRenderingContext2D,
  width: number,
  now: number
) => {
  ctx.beginPath();
  ctx.moveTo(0, 5);
  
  // Draw wavy water surface with time-based animation
  const waveAmplitude = 2; // Base wave height
  const waveFrequency = 20; // Wave frequency (lower = longer waves)
  const animSpeed = 10000; // Animation cycle duration
  
  for (let i = 0; i < width; i += waveFrequency / 2) {
    // Create animated wave with phase shift
    const wavePhase = (i / width) * Math.PI * 4;
    const animOffset = now / animSpeed * Math.PI * 2;
    const y = 5 + Math.sin(wavePhase + animOffset) * waveAmplitude;
    
    ctx.quadraticCurveTo(
      i + waveFrequency / 4, 
      y, 
      i + waveFrequency / 2, 
      5
    );
  }
  
  ctx.lineTo(width, 0);
  ctx.lineTo(0, 0);
  ctx.closePath();
  
  // Semi-transparent white for water surface with subtle color shift
  const blueShift = Math.sin(now / 3000) * 20; // Range -20 to +20
  ctx.fillStyle = `rgba(255, 255, ${235 + blueShift}, 0.35)`; // Subtle color animation
  ctx.fill();
  
  // Add extra shimmer highlights with animation
  drawWaterShimmer(ctx, width, now);
};

/**
 * Draws extra shimmer highlights on the water surface
 */
const drawWaterShimmer = (
  ctx: CanvasRenderingContext2D,
  width: number,
  now: number
) => {
  // Add some random shimmering highlights
  const shimmerCount = 8 + Math.floor(Math.random() * 4);
  
  for (let i = 0; i < shimmerCount; i++) {
    // Create a consistent position for each shimmer
    const shimmerSeed = i * 1000;
    const shimmerX = (i / shimmerCount) * width + Math.sin(now / 4000 + shimmerSeed) * 20;
    const shimmerWidth = 30 + Math.random() * 20;
    const shimmerOpacity = 0.1 + Math.abs(Math.sin(now / 2000 + shimmerSeed)) * 0.15;
    
    // Draw shimmer highlight
    ctx.fillStyle = `rgba(255, 255, 255, ${shimmerOpacity})`;
    ctx.beginPath();
    ctx.ellipse(
      shimmerX, 
      5, 
      shimmerWidth, 
      2, 
      0, 
      0, 
      Math.PI * 2
    );
    ctx.fill();
  }
};

/**
 * Draws decorations specific to each tank type
 */
const drawDecorations = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  tankId: string
) => {
  // Always draw gravel at bottom for all tank types
  drawGravel(ctx, width, height, tankId !== 'tank1');
  
  // Add decorations based on tank type
  switch (tankId) {
    case 'tank1': // Small tank - simple plant
      drawPlant(ctx, width * 0.2, height * 0.4, height);
      drawBubbles(ctx, width, height);
      break;
      
    case 'tank2': // Medium tank - plants and castle
      drawPlant(ctx, width * 0.1, height * 0.5, height);
      drawPlant(ctx, width * 0.8, height * 0.4, height);
      drawCastle(ctx, width * 0.5, height * 0.3, height);
      drawBubbles(ctx, width, height);
      break;
      
    case 'tank3': // Large tank - coral, plants, lily pads
      drawCoral(ctx, width * 0.7, height, width * 0.2, height * 0.4);
      drawPlant(ctx, width * 0.2, height * 0.6, height);
      drawPlant(ctx, width * 0.4, height * 0.5, height);
      drawLilyPad(ctx, width * 0.3, height * 0.1, 20);
      drawLilyPad(ctx, width * 0.7, height * 0.15, 15);
      drawBubbles(ctx, width, height);
      break;
      
    case 'tank4': // Huge tank - elaborate decorations
      drawCoral(ctx, width * 0.2, height, width * 0.15, height * 0.4);
      drawCoral(ctx, width * 0.8, height, width * 0.2, height * 0.5);
      drawPlant(ctx, width * 0.1, height * 0.7, height);
      drawPlant(ctx, width * 0.35, height * 0.5, height);
      drawPlant(ctx, width * 0.6, height * 0.6, height);
      drawCastle(ctx, width * 0.5, height * 0.4, height);
      drawLilyPad(ctx, width * 0.2, height * 0.1, 25);
      drawLilyPad(ctx, width * 0.5, height * 0.15, 20);
      drawLilyPad(ctx, width * 0.8, height * 0.12, 18);
      drawBubbles(ctx, width, height);
      break;
  }
};

/**
 * Tank Renderer component 
 * Currently a placeholder for potential future use
 */
const TankRenderer: React.FC = () => {
  return <div>Tank Renderer Component</div>;
};

export default TankRenderer; 