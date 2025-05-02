// Coral decoration utility functions for aquarium

/**
 * Draws a single coral branch
 */
const drawCoralBranch = (
  ctx: CanvasRenderingContext2D,
  branchX: number,
  y: number,
  sway: number,
  branchHeight: number,
  branchWidth: number,
  curveAmp: number
) => {
  // Calculate curve parameters
  const curveX = branchX + sway;
  
  // Coral branch with gradient
  const coralGradient = ctx.createLinearGradient(
    branchX, y,
    branchX, y - branchHeight
  );
  
  coralGradient.addColorStop(0, `rgb(${180 + Math.random() * 75}, ${80 + Math.random() * 50}, ${100 + Math.random() * 50})`);
  coralGradient.addColorStop(0.5, `rgb(${220 + Math.random() * 35}, ${100 + Math.random() * 50}, ${120 + Math.random() * 50})`);
  coralGradient.addColorStop(1, `rgb(${255 - Math.random() * 30}, ${150 + Math.random() * 50}, ${170 + Math.random() * 50})`);
  
  ctx.beginPath();
  ctx.fillStyle = coralGradient;
  ctx.moveTo(branchX, y);
  ctx.quadraticCurveTo(
    curveX + curveAmp, y - branchHeight / 2,
    curveX, y - branchHeight
  );
  ctx.quadraticCurveTo(
    curveX - curveAmp, y - branchHeight / 2,
    branchX, y
  );
  ctx.fill();
  
  return curveX; // Return curve x for polyp positioning
};

/**
 * Adds texture lines to coral branch
 */
const addCoralTexture = (
  ctx: CanvasRenderingContext2D,
  curveX: number,
  y: number,
  branchHeight: number,
  branchWidth: number
) => {
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 0.5;
  
  // Draw texture lines
  for (let j = 1; j <= 3; j++) {
    const lineY = y - branchHeight * (j / 4);
    ctx.beginPath();
    ctx.moveTo(curveX - branchWidth / 2, lineY);
    ctx.lineTo(curveX + branchWidth / 2, lineY);
    ctx.stroke();
  }
};

/**
 * Draws polyps on the coral branch
 */
const drawCoralPolyps = (
  ctx: CanvasRenderingContext2D,
  curveX: number,
  y: number,
  branchHeight: number,
  branchWidth: number,
  now: number
) => {
  // Polyp colors for variety
  const polyColors = ['#ffcc99', '#ffeecc', '#ffeedd', '#ffddaa'];
  
  // Small polyps on the coral with animated movement
  for (let j = 0; j < 4; j++) {
    const polyp = Math.cos(now / 1500 + j) * 0.1;
    ctx.beginPath();
    
    ctx.fillStyle = polyColors[Math.floor(Math.random() * polyColors.length)];
    
    const polypX = curveX + (Math.random() * 2 - 1) * branchWidth * 0.7;
    const polypY = y - branchHeight * (0.3 + j * 0.2);
    
    ctx.ellipse(
      polypX, 
      polypY, 
      branchWidth * (0.2 + polyp),
      branchWidth * (0.3 + polyp),
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();
    
    // Add subtle highlight to polyps
    ctx.beginPath();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.arc(
      polypX - branchWidth * 0.05,
      polypY - branchWidth * 0.05,
      branchWidth * 0.1,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }
};

/**
 * Draws a coral decoration
 */
export const drawCoral = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number
) => {
  // Base coral structure with subtle animation
  const now = Date.now();
  
  // Draw branching coral with animation
  for (let i = 0; i < 5; i++) {
    const branchX = x + (i * width / 5);
    const sway = Math.sin(now / 2000 + i * 0.5) * (width / 20);
    const branchHeight = height * (0.7 + Math.random() * 0.3);
    const branchWidth = width / 10;
    
    // Create animated curve parameters
    const curveAmp = Math.sin(now / 3000 + i) * (branchWidth * 0.7);
    
    // Draw the main branch
    const curveX = drawCoralBranch(ctx, branchX, y, sway, branchHeight, branchWidth, curveAmp);
    
    // Add texture to the branch
    addCoralTexture(ctx, curveX, y, branchHeight, branchWidth);
    
    // Add polyps to the branch
    drawCoralPolyps(ctx, curveX, y, branchHeight, branchWidth, now);
  }
}; 