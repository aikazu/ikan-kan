// Tank decoration utility functions for drawing various aquarium elements

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
  
  // Plant leaves with varying shapes and subtle animation
  for (let i = 1; i <= 5; i++) {
    const leafY = canvasHeight - (height - i * 15);
    const leafSway = sway * (0.5 + (i / 10)); // More sway at the top
    const leafAngle = Math.PI / 4 + (Math.sin(now / 800 + i) * 0.1);
    const leafSize = 15 - (5 - i); // Smaller leaves at bottom, larger at top
    
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
    if (i > 3) { // Only add details to larger leaves
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
  
  // Lily flower with petal animation
  if (Math.random() > 0.3) { // 70% chance to have a flower
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
  }
  
  // Add shadow under lily pad
  ctx.fillStyle = 'rgba(0, 30, 20, 0.2)';
  ctx.beginPath();
  ctx.ellipse(x, y + floatY + 2, radius * 0.95, radius * 0.5, 0, 0, Math.PI * 2);
  ctx.fill();
};

/**
 * Draws a coral reef decoration with swaying animation
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
    const curveX = branchX + sway;
    const curveAmp = Math.sin(now / 3000 + i) * (branchWidth * 0.7);
    
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
    
    // Add texture/patterns to coral
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 0.5;
    
    // Draw some texture lines
    for (let j = 1; j <= 3; j++) {
      const lineY = y - branchHeight * (j / 4);
      ctx.beginPath();
      ctx.moveTo(curveX - branchWidth / 2, lineY);
      ctx.lineTo(curveX + branchWidth / 2, lineY);
      ctx.stroke();
    }
    
    // Small polyps on the coral with animated movement
    for (let j = 0; j < 4; j++) {
      const polyp = Math.cos(now / 1500 + j) * 0.1;
      ctx.beginPath();
      
      // Different polyp colors for variety
      const polyColors = ['#ffcc99', '#ffeecc', '#ffeedd', '#ffddaa'];
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
  }
};

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
  const shimmerPebbles = new Set();
  const shimmerCount = Math.min(10, Math.floor(pebbleCount / 20));
  
  // Choose random pebbles to shimmer
  for (let i = 0; i < shimmerCount; i++) {
    shimmerPebbles.add(Math.floor(Math.random() * pebbleCount));
  }
  
  for (let i = 0; i < pebbleCount; i++) {
    // Better distribution of pebbles
    const x = Math.random() * width;
    const y = height - 5 - (Math.random() * 12);
    const size = pebbleSizes[Math.floor(Math.random() * pebbleSizes.length)];
    
    // Random colors for pebbles with better contrast
    const colors = fancy 
      ? ['#f4eacb', '#e6d7b3', '#d6c088', '#c4b27a']
      : ['#f5f5f5', '#e0e0e0', '#d0d0d0', '#c0c0c0'];
      
    ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
    
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
    
    // Add shimmer effect to random pebbles
    if (shimmerPebbles.has(i)) {
      const shimmerOpacity = Math.abs(Math.sin(now / 500 + i * 0.5)) * 0.5;
      ctx.beginPath();
      ctx.fillStyle = `rgba(255, 255, 255, ${shimmerOpacity})`;
      ctx.ellipse(
        x - size * 0.3, 
        y - size * 0.2, 
        size * 0.4, 
        size * 0.2, 
        Math.PI / 4, 
        0, 
        Math.PI * 2
      );
      ctx.fill();
    }
    // Add subtle highlight to some pebbles
    else if (Math.random() > 0.7) {
      ctx.beginPath();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.ellipse(
        x - size * 0.3, 
        y - size * 0.2, 
        size * 0.4, 
        size * 0.2, 
        Math.random() * Math.PI / 4, 
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
  fancy = false
) => {
  // Create gradient for gravel
  const gravelGradient = createGravelGradient(ctx, height, fancy);
  
  // Draw the base and wavy top of gravel
  drawGravelBase(ctx, width, height, gravelGradient);
  
  // Draw individual pebbles
  drawPebbles(ctx, width, height, fancy);
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
  
  ctx.fillStyle = castleGradient;
  ctx.beginPath();
  
  // Castle base with slightly uneven edges for realism
  const baseWidth = 50;
  const baseLeft = x - baseWidth / 2;
  
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
  
  // Castle top with multiple towers and detail
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
  
  // Add window details to castle
  ctx.fillStyle = '#006699';
  
  // Animated water shimmer in windows
  const windowShimmer = Math.abs(Math.sin(now / 1000) * 0.3);
  
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
  
  // Add bubbles coming from castle occasionally
  if (Math.random() < 0.05) { // 5% chance per frame
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
  }
};

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
 * Draws random bubbles in the tank with improved animation
 */
export const drawBubbles = (
  ctx: CanvasRenderingContext2D, 
  width: number,
  height: number
) => {
  const now = Date.now();
  
  // Create persistent bubbles that move over time instead of random ones each frame
  const bubbleCount = 6 + Math.floor(Math.random() * 4);
  
  for (let i = 0; i < bubbleCount; i++) {
    // Create a seed for this bubble for consistent random values
    const bubbleSeed = (i * 937 + Math.floor(now / 10000)) % 2048;
    const pseudoRandom = (offset = 0) => {
      // Simple hash function for pseudorandom values from seed
      return ((bubbleSeed * 9301 + offset * 49297 + 233280) % 233280) / 233280;
    };
    
    // Position bubbles with consistent horizontal position but moving upward
    const x = width * pseudoRandom();
    
    // Bubble vertical position cycles from bottom to top
    const cycleTime = 5000 + pseudoRandom(1) * 10000; // 5-15 second cycle
    const cycleProgress = (now % cycleTime) / cycleTime;
    const y = height - (height * 1.2 * cycleProgress); // Start below bottom, end above top
    
    // Skip if bubble is out of view
    if (y < -20 || y > height + 20) continue;
    
    // Bubble size with slight pulsing
    const baseSize = 1.5 + pseudoRandom(2) * 3;
    const pulse = Math.sin(now / 400 + i * 10) * 0.1;
    const size = baseSize * (1 + pulse);
    
    // Horizontal wobble as bubble rises
    const wobble = Math.sin(now / 300 + i * 5) * (size * 0.8);
    const adjustedX = x + wobble;
    
    // Create a gradient for more natural bubble appearance
    const bubbleGradient = ctx.createRadialGradient(
      adjustedX - size * 0.3, y - size * 0.3, size * 0.1,
      adjustedX, y, size
    );
    
    bubbleGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    bubbleGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
    bubbleGradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
    
    // Draw bubble with gradient
    ctx.beginPath();
    ctx.arc(adjustedX, y, size, 0, 2 * Math.PI);
    ctx.fillStyle = bubbleGradient;
    ctx.fill();
    
    // Subtle outline
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 0.5;
    ctx.stroke();
    
    // Small white highlight with subtle movement
    const highlightOffset = Math.sin(now / 200 + i) * 0.1;
    ctx.beginPath();
    ctx.arc(
      adjustedX - size * (0.3 - highlightOffset), 
      y - size * (0.3 + highlightOffset), 
      size * 0.2, 
      0, 
      Math.PI * 2
    );
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fill();
  }
}; 