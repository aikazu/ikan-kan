// Tank decoration utility functions for drawing various aquarium elements

/**
 * Draws a decorative water plant
 */
export const drawPlant = (
  ctx: CanvasRenderingContext2D, 
  x: number, 
  height: number,
  canvasHeight: number
) => {
  ctx.fillStyle = '#00cc66';
  ctx.beginPath();
  
  // Plant stem
  ctx.rect(x, canvasHeight - height, 5, height);
  
  // Plant leaves
  for (let i = 1; i <= 5; i++) {
    ctx.ellipse(
      x + 15, 
      canvasHeight - (height - i * 15), 
      15, 
      8, 
      Math.PI / 4, 
      0, 
      2 * Math.PI
    );
  }
  
  ctx.fill();
};

/**
 * Draws a lily pad decoration
 */
export const drawLilyPad = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number
) => {
  // Lily pad (circle with a cut)
  ctx.beginPath();
  ctx.fillStyle = '#006633';
  ctx.arc(x, y, radius, 0.2, Math.PI * 2 - 0.2);
  ctx.lineTo(x, y);
  ctx.fill();
  
  // Lily flower (optional)
  if (Math.random() > 0.5) {
    ctx.beginPath();
    ctx.fillStyle = '#ff99cc';
    ctx.arc(x - radius * 0.3, y - radius * 0.3, radius * 0.2, 0, Math.PI * 2);
    ctx.fill();
  }
};

/**
 * Draws a coral reef decoration
 */
export const drawCoral = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number
) => {
  // Base coral structure
  ctx.beginPath();
  ctx.fillStyle = '#ff6666';
  
  // Draw branching coral
  for (let i = 0; i < 5; i++) {
    const branchX = x + (i * width / 5);
    const branchHeight = height * (0.7 + Math.random() * 0.3);
    const branchWidth = width / 10;
    
    // Coral branch
    ctx.beginPath();
    ctx.fillStyle = `rgb(${220 + Math.random() * 35}, ${100 + Math.random() * 50}, ${120 + Math.random() * 50})`;
    ctx.moveTo(branchX, y);
    ctx.quadraticCurveTo(
      branchX + branchWidth, y - branchHeight / 2,
      branchX, y - branchHeight
    );
    ctx.quadraticCurveTo(
      branchX - branchWidth, y - branchHeight / 2,
      branchX, y
    );
    ctx.fill();
    
    // Small polyps on the coral
    for (let j = 0; j < 3; j++) {
      ctx.beginPath();
      ctx.fillStyle = '#ffcc99';
      ctx.arc(
        branchX + (Math.random() * 2 - 1) * branchWidth,
        y - branchHeight * (0.3 + j * 0.2),
        branchWidth * 0.4,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
  }
};

/**
 * Draws gravel at the bottom of the tank
 */
export const drawGravel = (
  ctx: CanvasRenderingContext2D, 
  width: number,
  height: number,
  fancy: boolean = false
) => {
  ctx.fillStyle = fancy ? '#d6c088' : '#cccccc';
  ctx.beginPath();
  ctx.rect(0, height - 20, width, 20);
  ctx.fill();
  
  // Draw individual pebbles
  for (let i = 0; i < width; i += 10) {
    ctx.beginPath();
    ctx.arc(
      i + Math.random() * 10, 
      height - 10 - Math.random() * 5, 
      2 + Math.random() * 4, 
      0, 
      2 * Math.PI
    );
    
    // Random colors for pebbles
    const colors = fancy 
      ? ['#f0e68c', '#daa520', '#b8860b', '#cd853f']
      : ['#999', '#aaa', '#888', '#777'];
    ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
    ctx.fill();
  }
};

/**
 * Draws a decorative castle
 */
export const drawCastle = (
  ctx: CanvasRenderingContext2D, 
  x: number, 
  height: number,
  canvasHeight: number
) => {
  // Castle base
  ctx.fillStyle = '#cc9966';
  ctx.beginPath();
  ctx.rect(x - 25, canvasHeight - height, 50, height);
  ctx.fill();
  
  // Castle top
  ctx.beginPath();
  ctx.moveTo(x - 30, canvasHeight - height);
  ctx.lineTo(x - 30, canvasHeight - height - 15);
  ctx.lineTo(x - 25, canvasHeight - height - 10);
  ctx.lineTo(x - 15, canvasHeight - height - 15);
  ctx.lineTo(x - 10, canvasHeight - height - 10);
  ctx.lineTo(x, canvasHeight - height - 15);
  ctx.lineTo(x + 10, canvasHeight - height - 10);
  ctx.lineTo(x + 15, canvasHeight - height - 15);
  ctx.lineTo(x + 25, canvasHeight - height - 10);
  ctx.lineTo(x + 30, canvasHeight - height - 15);
  ctx.lineTo(x + 30, canvasHeight - height);
  ctx.closePath();
  ctx.fill();
  
  // Castle door
  ctx.fillStyle = '#333';
  ctx.beginPath();
  ctx.rect(x - 10, canvasHeight - 40, 20, 40);
  ctx.fill();
  
  // Castle windows
  ctx.fillStyle = '#66ccff';
  ctx.beginPath();
  ctx.rect(x - 20, canvasHeight - height + 15, 10, 10);
  ctx.rect(x + 10, canvasHeight - height + 15, 10, 10);
  ctx.rect(x - 5, canvasHeight - height + 40, 10, 10);
  ctx.fill();
};

/**
 * Draws random bubbles in the tank
 */
export const drawBubbles = (
  ctx: CanvasRenderingContext2D, 
  width: number,
  height: number
) => {
  // Create random bubbles
  const bubbleCount = 5 + Math.floor(Math.random() * 5);
  
  for (let i = 0; i < bubbleCount; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const size = 2 + Math.random() * 6;
    
    ctx.beginPath();
    ctx.arc(x, y, size, 0, 2 * Math.PI);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.stroke();
    
    // Add a highlight to the bubble
    ctx.beginPath();
    ctx.arc(x - size * 0.3, y - size * 0.3, size * 0.2, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fill();
  }
}; 