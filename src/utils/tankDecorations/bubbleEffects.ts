// Bubble animation utility functions for aquarium

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