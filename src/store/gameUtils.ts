import { Fish } from './gameModels';

// Helper function to generate a random fish with location
export const createRandomFish = (id: string, type: string = 'guppy', isNew: boolean = true, locationId: string = 'location-1'): Fish => {
  // Generate random color based on type
  let color = '#ff7700'; // Default orange
  if (type === 'guppy') {
    // Random orange to red hue
    const r = 220 + Math.floor(Math.random() * 35);
    const g = 100 + Math.floor(Math.random() * 50);
    const b = Math.floor(Math.random() * 50);
    color = `rgb(${r}, ${g}, ${b})`;
  }
  
  return {
    id,
    type,
    position: {
      x: 10 + Math.random() * 80, // Keep away from edges (10%-90% of container)
      y: 10 + Math.random() * 80,
    },
    velocity: {
      x: (Math.random() - 0.5) * 5, // Random direction, speed between -2.5 and 2.5
      y: (Math.random() - 0.5) * 3,
    },
    size: 0.8 + Math.random() * 0.4, // Size multiplier between 0.8 and 1.2
    color,
    lastUpdate: Date.now(),
    isNew,
    locationId
  };
};

// Helper function to update fish positions for a specific location
export const updateFishPositions = (fish: Fish[], deltaTime: number): Fish[] => {
  return fish.map(fishEntity => {
    // Remove isNew flag after a second
    const isNew = fishEntity.isNew && (Date.now() - fishEntity.lastUpdate < 1000);
    
    // Calculate new position based on velocity and time
    const newX = fishEntity.position.x + (fishEntity.velocity.x * deltaTime * 0.05);
    const newY = fishEntity.position.y + (fishEntity.velocity.y * deltaTime * 0.05);
    
    // Check for collisions with tank walls and reverse direction if needed
    let newVelocityX = fishEntity.velocity.x;
    let newVelocityY = fishEntity.velocity.y;
    
    // Bounds check (5% and 95% of the container)
    if (newX < 5) {
      newVelocityX = Math.abs(newVelocityX); // Move right
    } else if (newX > 95) {
      newVelocityX = -Math.abs(newVelocityX); // Move left
    }
    
    if (newY < 5) {
      newVelocityY = Math.abs(newVelocityY); // Move down
    } else if (newY > 95) {
      newVelocityY = -Math.abs(newVelocityY); // Move up
    }
    
    // Occasionally change direction randomly (5% chance per update)
    if (Math.random() < 0.05) {
      newVelocityX += (Math.random() - 0.5) * 2;
      newVelocityY += (Math.random() - 0.5) * 2;
      
      // Limit max speed
      const maxSpeed = 8;
      const speed = Math.sqrt(newVelocityX * newVelocityX + newVelocityY * newVelocityY);
      if (speed > maxSpeed) {
        newVelocityX = (newVelocityX / speed) * maxSpeed;
        newVelocityY = (newVelocityY / speed) * maxSpeed;
      }
    }
    
    // Return updated fish
    return {
      ...fishEntity,
      position: {
        x: Math.max(5, Math.min(95, newX)),
        y: Math.max(5, Math.min(95, newY)),
      },
      velocity: {
        x: newVelocityX,
        y: newVelocityY,
      },
      lastUpdate: Date.now(),
      isNew,
    };
  });
}; 