// Gravel decoration utility functions for aquarium

/**
 * Creates gradient for gravel based on style
 */
const createGravelGradient = (
  ctx: CanvasRenderingContext2D,
  height: number,
  fancy: boolean
): CanvasGradient => {
  const gravelGradient = ctx.createLinearGradient(0, height - 25, 0, height);
  
  if (fancy) {
    gravelGradient.addColorStop(0, '#e6d7b3');
    gravelGradient.addColorStop(1, '#c4b27a');
  } else {
    gravelGradient.addColorStop(0, '#e0e0e0');
    gravelGradient.addColorStop(1, '#b5b5b5');
  }
  
  return gravelGradient;
};

/**
 * Draws the base and wavy top of gravel
 */
const drawGravelBase = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  gravelGradient: CanvasGradient
) => {
  // Draw gravel bed with gradient
  ctx.fillStyle = gravelGradient;
  ctx.beginPath();
  ctx.rect(0, height - 20, width, 20);
  ctx.fill();
  
  // Create a more natural looking gravel line
  ctx.beginPath();
  ctx.moveTo(0, height - 20);
  
  // Draw wavy top of gravel with small variations
  const segments = 40;
  const segmentWidth = width / segments;
  
  for (let i = 0; i <= segments; i++) {
    const x = i * segmentWidth;
    const y = height - 20 - (Math.random() * 3);
    
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      const prevX = (i - 1) * segmentWidth;
      const prevY = height - 20 - (Math.random() * 3);
      const cpX = prevX + (x - prevX) / 2;
      
      ctx.quadraticCurveTo(cpX, prevY - 1, x, y);
    }
  }
  
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  ctx.fill();
};

/**
 * Gets a random set of pebbles to apply shimmer effect
 */
const getShimmerPebbles = (pebbleCount: number): Set<number> => {
  const shimmerPebbles = new Set<number>();
  const shimmerCount = Math.min(10, Math.floor(pebbleCount / 20));
  
  // Choose random pebbles to shimmer
  for (let i = 0; i < shimmerCount; i++) {
    shimmerPebbles.add(Math.floor(Math.random() * pebbleCount));
  }
  
  return shimmerPebbles;
};

/**
 * Draws a single pebble with potential shimmer effect
 */
const drawSinglePebble = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string,
  hasShimmer: boolean,
  now: number
) => {
  ctx.fillStyle = color;
  
  // Draw oval-shaped pebbles for more natural look
  ctx.beginPath();
  ctx.ellipse(
    x, 
    y, 
    size, 
    size * 0.6, 
    Math.random() * Math.PI, 
    0, 
    Math.PI * 2
  );
  ctx.fill();
  
  // Add shimmer effect to some pebbles
  if (hasShimmer) {
    const shimmerOpacity = (Math.sin(now / 800) + 1) / 2 * 0.4;
    
    ctx.fillStyle = `rgba(255, 255, 255, ${shimmerOpacity})`;
    ctx.beginPath();
    ctx.ellipse(
      x - size * 0.3, 
      y - size * 0.2, 
      size * 0.3, 
      size * 0.15, 
      Math.PI / 4, 
      0, 
      Math.PI * 2
    );
    ctx.fill();
  }
};

/**
 * Draws individual pebbles on the gravel
 */
const drawPebbles = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  fancy: boolean
) => {
  const pebbleCount = width / 4; // Reduce number of pebbles
  const pebbleSizes = fancy ? [3, 4, 5, 6] : [2, 3, 4, 5];
  
  // Add some shimmer animation to random pebbles
  const now = Date.now();
  const shimmerPebbles = getShimmerPebbles(pebbleCount);
  
  // Color palettes for different gravel types
  const colors = fancy 
    ? ['#f4eacb', '#e6d7b3', '#d6c088', '#c4b27a']
    : ['#f5f5f5', '#e0e0e0', '#d0d0d0', '#c0c0c0'];
  
  for (let i = 0; i < pebbleCount; i++) {
    // Better distribution of pebbles
    const x = Math.random() * width;
    const y = height - 5 - (Math.random() * 12);
    const size = pebbleSizes[Math.floor(Math.random() * pebbleSizes.length)];
    
    // Get random color from the palette
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    // Draw the pebble
    drawSinglePebble(ctx, x, y, size, color, shimmerPebbles.has(i), now);
  }
};

/**
 * Draws gravel at the bottom of the tank
 */
export const drawGravel = (
  ctx: CanvasRenderingContext2D, 
  width: number,
  height: number,
  fancy = false
) => {
  // Create gradient for gravel
  const gravelGradient = createGravelGradient(ctx, height, fancy);
  
  // Draw the base and wavy top of gravel
  drawGravelBase(ctx, width, height, gravelGradient);
  
  // Draw individual pebbles
  drawPebbles(ctx, width, height, fancy);
}; 