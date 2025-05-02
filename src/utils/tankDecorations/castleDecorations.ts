// Castle decoration utility functions for aquarium

/**
 * Creates a stone texture pattern for castle
 */
const createStonePattern = (ctx: CanvasRenderingContext2D) => {
  // Create small pattern canvas
  const patternCanvas = document.createElement('canvas');
  patternCanvas.width = 20;
  patternCanvas.height = 20;
  const patternCtx = patternCanvas.getContext('2d');
  
  if (!patternCtx) return '#ccc'; // Fallback if context fails
  
  // Clear pattern canvas
  patternCtx.fillStyle = 'rgba(0, 0, 0, 0)';
  patternCtx.fillRect(0, 0, 20, 20);
  
  // Draw stone pattern
  patternCtx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  
  // Random stone shapes
  for (let i = 0; i < 6; i++) {
    const x = Math.random() * 20;
    const y = Math.random() * 20;
    const w = 3 + Math.random() * 4;
    const h = 2 + Math.random() * 3;
    
    patternCtx.beginPath();
    patternCtx.roundRect(x, y, w, h, 1);
    patternCtx.fill();
  }
  
  // Create pattern from the small canvas
  return ctx.createPattern(patternCanvas, 'repeat') || '#ccc';
};

/**
 * Draws the base of the castle
 */
const drawCastleBase = (
  ctx: CanvasRenderingContext2D,
  baseLeft: number,
  baseWidth: number,
  castleGradient: CanvasGradient,
  stonePattern: CanvasPattern | string,
  height: number,
  canvasHeight: number
) => {
  ctx.fillStyle = castleGradient;
  ctx.beginPath();
  
  // Draw the castle base with slight irregularities
  ctx.beginPath();
  ctx.moveTo(baseLeft, canvasHeight);
  ctx.lineTo(baseLeft, canvasHeight - height);
  ctx.lineTo(baseLeft + baseWidth, canvasHeight - height);
  ctx.lineTo(baseLeft + baseWidth, canvasHeight);
  ctx.closePath();
  ctx.fill();
  
  // Add stone texture to base
  ctx.fillStyle = stonePattern;
  ctx.globalAlpha = 0.3;
  ctx.fill();
  ctx.globalAlpha = 1.0;
};

/**
 * Draws the castle top with battlements
 */
const drawCastleTop = (
  ctx: CanvasRenderingContext2D,
  baseLeft: number,
  baseWidth: number,
  castleGradient: CanvasGradient,
  stonePattern: CanvasPattern | string,
  height: number,
  canvasHeight: number
) => {
  ctx.fillStyle = castleGradient;
  
  // Main castle top with towers
  ctx.beginPath();
  // Left edge
  ctx.moveTo(baseLeft - 5, canvasHeight - height);
  ctx.lineTo(baseLeft - 5, canvasHeight - height - 15);
  
  // Draw battlements (the teeth at the top of castle walls)
  for (let i = 0; i < 6; i++) {
    const towerX = baseLeft + (i * baseWidth / 5);
    const towerHeight = 15 + (i % 2 === 0 ? 5 : 0);
    
    // Draw tower
    ctx.lineTo(towerX - 5, canvasHeight - height - towerHeight);
    ctx.lineTo(towerX, canvasHeight - height - towerHeight + 5);
    ctx.lineTo(towerX + 5, canvasHeight - height - towerHeight);
  }
  
  // Right edge
  ctx.lineTo(baseLeft + baseWidth + 5, canvasHeight - height - 15);
  ctx.lineTo(baseLeft + baseWidth + 5, canvasHeight - height);
  ctx.closePath();
  
  ctx.fill();
  
  // Add stone texture to top
  ctx.fillStyle = stonePattern;
  ctx.globalAlpha = 0.3;
  ctx.fill();
  ctx.globalAlpha = 1.0;
};

/**
 * Draws windows on the castle
 */
const drawCastleWindows = (
  ctx: CanvasRenderingContext2D,
  baseLeft: number,
  height: number,
  canvasHeight: number,
  windowShimmer: number
) => {
  ctx.fillStyle = '#006699';
  
  // Castle windows
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      const windowX = baseLeft + 10 + (i * 25);
      const windowY = canvasHeight - height + 15 + (j * 25);
      
      // Window shape
      ctx.beginPath();
      ctx.arc(windowX, windowY, 5, 0, Math.PI, true);
      ctx.rect(windowX - 5, windowY, 10, 7);
      ctx.fill();
      
      // Window shimmer
      ctx.fillStyle = `rgba(150, 200, 255, ${0.4 + windowShimmer})`;
      ctx.beginPath();
      ctx.arc(windowX, windowY, 3, 0, Math.PI, true);
      ctx.rect(windowX - 3, windowY, 6, 4);
      ctx.fill();
      
      // Reset window color
      ctx.fillStyle = '#006699';
    }
  }
};

/**
 * Draws the castle door
 */
const drawCastleDoor = (
  ctx: CanvasRenderingContext2D,
  x: number,
  canvasHeight: number
) => {
  // Castle door with slight arch
  ctx.fillStyle = '#554433';
  ctx.beginPath();
  ctx.arc(x, canvasHeight - 20, 10, Math.PI, 0, true);
  ctx.rect(x - 10, canvasHeight - 20, 20, 20);
  ctx.fill();
  
  // Door details
  ctx.strokeStyle = '#332211';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(x, canvasHeight - 20, 8, Math.PI, 0, true);
  ctx.moveTo(x, canvasHeight - 20);
  ctx.lineTo(x, canvasHeight);
  ctx.stroke();
};

/**
 * Draws a bubble coming from the castle
 */
const drawCastleBubble = (
  ctx: CanvasRenderingContext2D,
  x: number,
  height: number,
  canvasHeight: number
) => {
  const bubbleSize = 2 + Math.random() * 2;
  const bubbleX = x - 15 + Math.random() * 30;
  const bubbleY = canvasHeight - height - 15 - Math.random() * 10;
  
  // Create bubble gradient
  const bubbleGradient = ctx.createRadialGradient(
    bubbleX - bubbleSize * 0.3, bubbleY - bubbleSize * 0.3, 0,
    bubbleX, bubbleY, bubbleSize
  );
  bubbleGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
  bubbleGradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.4)');
  bubbleGradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
  
  ctx.fillStyle = bubbleGradient;
  ctx.beginPath();
  ctx.arc(bubbleX, bubbleY, bubbleSize, 0, Math.PI * 2);
  ctx.fill();
};

/**
 * Draws a decorative castle with animated elements
 */
export const drawCastle = (
  ctx: CanvasRenderingContext2D, 
  x: number, 
  height: number,
  canvasHeight: number
) => {
  const now = Date.now();
  
  // Create stone texture pattern for castle
  const stonePattern = createStonePattern(ctx);
  
  // Castle base with texture
  const castleGradient = ctx.createLinearGradient(
    x - 25, canvasHeight - height, 
    x - 25, canvasHeight
  );
  castleGradient.addColorStop(0, '#ccaa88');
  castleGradient.addColorStop(1, '#aa8866');
  
  // Castle dimensions
  const baseWidth = 50;
  const baseLeft = x - baseWidth / 2;
  
  // Draw the castle components
  drawCastleBase(ctx, baseLeft, baseWidth, castleGradient, stonePattern, height, canvasHeight);
  drawCastleTop(ctx, baseLeft, baseWidth, castleGradient, stonePattern, height, canvasHeight);
  
  // Animated water shimmer in windows
  const windowShimmer = Math.abs(Math.sin(now / 1000) * 0.3);
  drawCastleWindows(ctx, baseLeft, height, canvasHeight, windowShimmer);
  
  // Draw the castle door
  drawCastleDoor(ctx, x, canvasHeight);
  
  // Add bubbles coming from castle occasionally
  if (Math.random() < 0.05) { // 5% chance per frame
    drawCastleBubble(ctx, x, height, canvasHeight);
  }
}; 