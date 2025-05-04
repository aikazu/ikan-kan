import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { processGameLoop } from '../store/utils/gameLoop';

/**
 * Custom hook that handles the game loop
 * @param frameRate Optional target frame rate for updates (defaults to 30)
 */
const useGameLoop = (frameRate: number = 30) => {
  const dispatch = useDispatch();
  const lastUpdateTimeRef = useRef(Date.now());
  
  // Calculate interval based on frame rate (e.g., 30 FPS = 33.33ms interval)
  const interval = 1000 / frameRate;
  
  useEffect(() => {
    // Game loop function
    let animationFrameId: number;
    
    const gameLoop = () => {
      const now = Date.now();
      const elapsed = now - lastUpdateTimeRef.current;
      
      // Only update if enough time has passed
      if (elapsed >= interval) {
        // Get the latest state inside the loop
        const currentState = dispatch((_, getState) => getState()) as RootState;
        
        // Process the game loop and get the updated timestamp
        const newTime = processGameLoop(currentState, lastUpdateTimeRef.current, dispatch);
        
        // Update the reference time
        lastUpdateTimeRef.current = newTime;
      }
      
      // Schedule next frame
      animationFrameId = requestAnimationFrame(gameLoop);
    };
    
    // Start game loop
    animationFrameId = requestAnimationFrame(gameLoop);
    
    // Clean up when component unmounts
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [dispatch, interval]);
};

export default useGameLoop; 