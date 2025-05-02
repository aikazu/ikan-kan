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
 * Draws water with gradient based on tank type
 */
const drawWaterBackground = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  tankId: string
) => {
  // Create gradient based on tank type
  let gradient;
  
  switch (tankId) {
    case 'tank2': // Medium tank
      gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#66ccff');
      gradient.addColorStop(1, '#0099cc');
      break;
    case 'tank3': // Large tank
      gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#3399ff');
      gradient.addColorStop(1, '#0066cc');
      break;
    case 'tank4': // Huge tank
      gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#0066cc');
      gradient.addColorStop(1, '#003366');
      break;
    case 'tank1': // Small tank (default)
    default:
      gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#99ccff');
      gradient.addColorStop(1, '#66aaff');
      break;
  }
  
  // Fill water background
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  
  // Add water surface shimmering effect
  drawWaterSurface(ctx, width);
};

/**
 * Draws the water surface with a shimmering effect
 */
const drawWaterSurface = (
  ctx: CanvasRenderingContext2D,
  width: number
) => {
  ctx.beginPath();
  ctx.moveTo(0, 5);
  
  // Draw wavy water surface
  for (let i = 0; i < width; i += 20) {
    ctx.quadraticCurveTo(
      i + 10, 
      Math.random() < 0.5 ? 3 : 7, 
      i + 20, 
      5
    );
  }
  
  ctx.lineTo(width, 0);
  ctx.lineTo(0, 0);
  ctx.closePath();
  
  // Semi-transparent white for water surface
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.fill();
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
  // Draw gravel for all tanks
  const isFancyGravel = ['tank3', 'tank4'].includes(tankId);
  drawGravel(ctx, width, height, isFancyGravel);
  
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