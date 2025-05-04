import React, { useCallback, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { feedFish } from '../store/utils/gameActions';
import { LuckyBubbleType } from '../store/slices/luckyBubbleSlice';
import { TankType, FishType } from '../types/game';
import useAnimatedFeedback from '../hooks/useAnimatedFeedback';
import './FishTank.css';

// Tank background images mapping
const tankBackgrounds: Record<TankType, string> = {
  [TankType.FISH_BOWL]: '/tank-fishbowl.png',
  [TankType.SMALL_AQUARIUM]: '/tank-small.png',
  [TankType.MEDIUM_AQUARIUM]: '/tank-medium.png',
  [TankType.LARGE_AQUARIUM]: '/tank-large.png',
  [TankType.HOME_POND]: '/tank-pond.png',
  [TankType.INDOOR_REEF]: '/tank-reef.png',
};

const FishTank: React.FC = () => {
  const dispatch = useDispatch();
  const currentTank = useSelector((state: RootState) => state.tank.currentTank);
  const firstClickPerformed = useSelector((state: RootState) => state.tank.firstClickPerformed);
  const activeLuckyBubbles = useSelector((state: RootState) => state.luckyBubble.activeLuckyBubbles);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [prevFishCount, setPrevFishCount] = useState(currentTank.fish.length);
  const [showFeedIndicator, setShowFeedIndicator] = useState(true);
  
  // Import our animated feedback hook
  const { showPoints, showFishAdded, showMultiplePoints } = useAnimatedFeedback();
  
  // Track fish count to show animations when fish are added
  useEffect(() => {
    const currFishCount = currentTank.fish.length;
    // If fish were added, show animation
    if (currFishCount > prevFishCount) {
      const newFishCount = currFishCount - prevFishCount;
      // Show animation in a random position in the tank
      const x = Math.random() * dimensions.width * 0.8 + dimensions.width * 0.1;
      const y = Math.random() * dimensions.height * 0.8 + dimensions.height * 0.1;
      showFishAdded(newFishCount, x, y);
    }
    setPrevFishCount(currFishCount);
  }, [currentTank.fish.length, dimensions, prevFishCount, showFishAdded]);
  
  // Ref for the tank container
  const tankRef = useCallback((node: HTMLDivElement) => {
    if (node !== null) {
      setDimensions({
        width: node.clientWidth,
        height: node.clientHeight,
      });
    }
  }, []);

  // Handle click on the tank to feed fish
  const handleTankClick = (e: React.MouseEvent) => {
    // Get click position relative to the tank
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Hide the feed indicator after first click
    setShowFeedIndicator(false);
    
    // Dispatch the feedFish action
    dispatch(feedFish() as any);
    
    // Check for feeding frenzy lucky bubble
    const feedingFrenzy = activeLuckyBubbles.find(
      bubble => bubble.type === LuckyBubbleType.FEEDING_FRENZY
    );
    
    if (feedingFrenzy) {
      // Show multiple point indicators for feeding frenzy
      showMultiplePoints(2, 5, x, y, 60);
    } else {
      // Show normal point indicator
      showPoints(2, x, y);
    }
  };

  // Generate positions for fish icons
  const generateFishPositions = () => {
    if (!dimensions.width || !dimensions.height) return [];
    
    // Create a grid pattern to position fish
    const fishSize = 30; // Size of each fish icon in pixels
    const padding = 10; // Padding between fish icons
    const gridSize = fishSize + padding;
    
    // Calculate how many fish can fit in the tank horizontally and vertically
    const fishPerRow = Math.floor((dimensions.width - padding * 2) / gridSize);
    const fishPerColumn = Math.floor((dimensions.height - padding * 2) / gridSize);
    
    // Generate positions for each fish
    return currentTank.fish.map((fish, index) => {
      // Calculate the row and column for this fish
      const row = Math.floor(index / fishPerRow);
      const col = index % fishPerRow;
      
      // Skip if we've exceeded the number of rows that can fit
      if (row >= fishPerColumn) {
        return null;
      }
      
      // Calculate the position
      const x = padding + col * gridSize;
      const y = padding + row * gridSize;
      
      // Return fish display data
      return {
        id: fish.id,
        x,
        y,
        type: fish.type,
      };
    }).filter(Boolean); // Remove null entries (fish that don't fit)
  };

  return (
    <div className="fish-tank-container">
      <div 
        className="fish-tank" 
        onClick={handleTankClick}
        ref={tankRef}
        style={{
          backgroundImage: `url(${tankBackgrounds[currentTank.type] || tankBackgrounds[TankType.FISH_BOWL]})`,
          backgroundSize: 'cover'
        }}
      >
        {/* Individual fish icons */}
        <div className="fish-icons-container">
          {dimensions.width > 0 && generateFishPositions().map((fishData: any) => (
            <img 
              key={fishData.id}
              src="/fish.png"
              alt="Fish"
              className="fish-icon"
              style={{
                left: `${fishData.x}px`,
                top: `${fishData.y}px`,
                filter: fishData.type === FishType.GOLDFISH ? 'sepia(100%) saturate(300%) brightness(70%) hue-rotate(20deg)' : 
                       fishData.type === FishType.TETRA ? 'sepia(100%) saturate(300%) brightness(70%) hue-rotate(300deg)' :
                       fishData.type === FishType.ANGELFISH ? 'grayscale(50%) brightness(120%)' :
                       fishData.type === FishType.CLOWNFISH ? 'sepia(100%) saturate(300%) brightness(70%) hue-rotate(30deg)' :
                       fishData.type === FishType.DISCUS ? 'sepia(100%) saturate(300%) brightness(70%) hue-rotate(180deg)' : 
                       'none'
              }}
            />
          ))}
        </div>
        
        {/* Enhanced first-click indicator */}
        {!firstClickPerformed && (
          <div className="start-game-indicator">
            Click to start the game!
          </div>
        )}
        
        {/* Standard feeding indicator that appears after first click */}
        {firstClickPerformed && showFeedIndicator && (
          <div className="center-feed-indicator">
            Click to feed!
          </div>
        )}
      </div>
    </div>
  );
};

export default FishTank; 