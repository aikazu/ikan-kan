// Plant decoration utility functions for aquarium

/**
 * Draws the stem of a water plant
 */
const drawPlantStem = (
  ctx: CanvasRenderingContext2D,
  x: number,
  height: number,
  canvasHeight: number,
  sway: number
) => {
  // Draw plant stem with gradient for depth
  const stemGradient = ctx.createLinearGradient(
    x, canvasHeight - height, 
    x + 5, canvasHeight
  );
  stemGradient.addColorStop(0, '#00aa44');
  stemGradient.addColorStop(1, '#007733');
  
  ctx.fillStyle = stemGradient;
  ctx.beginPath();
  
  // Curved stem instead of straight
  ctx.moveTo(x, canvasHeight);
  ctx.quadraticCurveTo(
    x + sway, canvasHeight - height / 2,
    x + sway / 2, canvasHeight - height
  );
  ctx.lineTo(x + 5 + sway / 2, canvasHeight - height);
  ctx.quadraticCurveTo(
    x + 5 + sway, canvasHeight - height / 2,
    x + 5, canvasHeight
  );
  
  ctx.fill();
};

/**
 * Draws a single leaf with veins
 */
const drawPlantLeaf = (
  ctx: CanvasRenderingContext2D,
  x: number,
  leafY: number,
  leafSway: number,
  leafAngle: number,
  leafSize: number
) => {
  // Leaf gradient
  const leafGradient = ctx.createRadialGradient(
    x + 15 + leafSway, leafY, 0,
    x + 15 + leafSway, leafY, leafSize * 1.5
  );
  leafGradient.addColorStop(0, '#00dd77');
  leafGradient.addColorStop(1, '#00aa55');
  
  ctx.fillStyle = leafGradient;
  ctx.beginPath();
  ctx.ellipse(
    x + 15 + leafSway, 
    leafY, 
    leafSize, 
    leafSize * 0.6, 
    leafAngle, 
    0, 
    2 * Math.PI
  );
  ctx.fill();
  
  // Add vein details to leaves
  if (leafSize > 10) { // Only add details to larger leaves
    ctx.strokeStyle = 'rgba(0, 85, 40, 0.5)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(x + 15 + leafSway - leafSize * 0.8, leafY);
    ctx.lineTo(x + 15 + leafSway + leafSize * 0.8, leafY);
    ctx.stroke();
    
    // Add a few leaf veins
    for (let v = 1; v <= 3; v++) {
      const veinOffset = (v - 2) * leafSize * 0.4;
      ctx.beginPath();
      ctx.moveTo(x + 15 + leafSway, leafY + veinOffset);
      ctx.lineTo(x + 15 + leafSway + leafSize * 0.7, leafY + veinOffset * 0.5);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(x + 15 + leafSway, leafY + veinOffset);
      ctx.lineTo(x + 15 + leafSway - leafSize * 0.7, leafY + veinOffset * 0.5);
      ctx.stroke();
    }
  }
};

/**
 * Draws a decorative water plant with swaying animation
 */
export const drawPlant = (
  ctx: CanvasRenderingContext2D, 
  x: number, 
  height: number,
  canvasHeight: number
) => {
  // Create swaying animation
  const now = Date.now();
  const sway = Math.sin(now / 1000) * 5;
  
  // Draw the plant stem
  drawPlantStem(ctx, x, height, canvasHeight, sway);
  
  // Plant leaves with varying shapes and subtle animation
  for (let i = 1; i <= 5; i++) {
    const leafY = canvasHeight - (height - i * 15);
    const leafSway = sway * (0.5 + (i / 10)); // More sway at the top
    const leafAngle = Math.PI / 4 + (Math.sin(now / 800 + i) * 0.1);
    const leafSize = 15 - (5 - i); // Smaller leaves at bottom, larger at top
    
    drawPlantLeaf(ctx, x, leafY, leafSway, leafAngle, leafSize);
  }
};

/**
 * Draws the main lily pad shape with ripples
 */
const drawLilyPadShape = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  ripple: number,
  floatY: number,
  now: number
) => {
  // Lily pad gradient for better depth
  const padGradient = ctx.createRadialGradient(
    x, y + floatY, radius * 0.2,
    x, y + floatY, radius * 1.1
  );
  padGradient.addColorStop(0, '#008844');
  padGradient.addColorStop(0.7, '#006633');
  padGradient.addColorStop(1, '#004422');
  
  // Lily pad (circle with a cut and small ripples)
  ctx.beginPath();
  ctx.fillStyle = padGradient;
  
  // Draw the lily pad with ripples
  const segments = 36;
  const angleIncrement = (Math.PI * 2) / segments;
  
  ctx.moveTo(x + (radius + ripple) * Math.cos(0.2), y + floatY + (radius + ripple) * Math.sin(0.2));
  
  for (let i = 1; i <= segments; i++) {
    const angle = i * angleIncrement;
    
    // Skip a segment to create the cut in the lily pad
    if (angle > 0.2 && angle < Math.PI * 2 - 0.2) {
      const radiusVariation = radius + ripple + Math.sin(angle * 5 + now / 1000) * (radius * 0.05);
      const xPos = x + radiusVariation * Math.cos(angle);
      const yPos = y + floatY + radiusVariation * Math.sin(angle);
      
      ctx.lineTo(xPos, yPos);
    }
  }
  
  ctx.closePath();
  ctx.fill();
  
  // Add shadow under lily pad
  ctx.fillStyle = 'rgba(0, 30, 20, 0.2)';
  ctx.beginPath();
  ctx.ellipse(x, y + floatY + 5, radius * 0.9, radius * 0.7, 0, 0, Math.PI * 2);
  ctx.fill();
};

/**
 * Draws vein details on the lily pad
 */
const drawLilyPadVeins = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  floatY: number
) => {
  // Add texture/vein details to the lily pad
  ctx.strokeStyle = 'rgba(0, 60, 30, 0.3)';
  ctx.lineWidth = 0.8;
  
  // Draw veins radiating from center
  for (let i = 0; i < 8; i++) {
    const angle = (Math.PI / 4) * i;
    ctx.beginPath();
    ctx.moveTo(x, y + floatY);
    ctx.lineTo(
      x + (radius * 0.9) * Math.cos(angle),
      y + floatY + (radius * 0.9) * Math.sin(angle)
    );
    ctx.stroke();
  }
};

/**
 * Draws a flower on the lily pad
 */
const drawLilyFlower = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  floatY: number,
  now: number
) => {
  // Animate flower opening/closing slightly
  const petalSpread = 0.2 + Math.sin(now / 3000) * 0.05;
  
  // Flower center
  ctx.beginPath();
  ctx.fillStyle = '#ffcc00';
  ctx.arc(x - radius * 0.3, y + floatY - radius * 0.3, radius * 0.15, 0, Math.PI * 2);
  ctx.fill();
  
  // Flower petals
  const petalCount = 5 + Math.floor(Math.random() * 3);
  const petalColors = ['#ff99cc', '#ffaadd', '#ff88bb'];
  
  for (let i = 0; i < petalCount; i++) {
    const angle = (Math.PI * 2 / petalCount) * i;
    const petalColor = petalColors[i % petalColors.length];
    
    ctx.beginPath();
    ctx.fillStyle = petalColor;
    
    const petalX = x - radius * 0.3 + Math.cos(angle) * (radius * petalSpread);
    const petalY = y + floatY - radius * 0.3 + Math.sin(angle) * (radius * petalSpread);
    
    ctx.ellipse(
      petalX, 
      petalY, 
      radius * 0.15, 
      radius * 0.25, 
      angle,
      0, 
      Math.PI * 2
    );
    ctx.fill();
  }
};

/**
 * Draws a lily pad decoration with ripple effect
 */
export const drawLilyPad = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number
) => {
  // Subtle ripple/floating animation
  const now = Date.now();
  const ripple = Math.sin(now / 1200) * (radius * 0.03);
  const floatY = Math.sin(now / 2000) * 2;
  
  // Draw the main lily pad shape
  drawLilyPadShape(ctx, x, y, radius, ripple, floatY, now);
  
  // Draw veins on the lily pad
  drawLilyPadVeins(ctx, x, y, radius, floatY);
  
  // 70% chance to have a flower
  if (Math.random() > 0.3) {
    drawLilyFlower(ctx, x, y, radius, floatY, now);
  }
}; 