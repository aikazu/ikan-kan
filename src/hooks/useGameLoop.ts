import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { processAutomation } from '../store/gameSlice';

// Hook to run the game loop at a fixed interval
export const useGameLoop = (fps: number = 10) => {
  const dispatch = useDispatch();
  const frameTime = 1000 / fps; // Time between frames in ms
  const lastUpdateTimeRef = useRef<number>(Date.now());
  const requestRef = useRef<number | null>(null);
  const fpsIntervalRef = useRef<number | null>(null);

  // Track accumulated time to handle situations where frames are skipped
  const accumulatedTimeRef = useRef<number>(0);

  const gameLoop = () => {
    // Calculate time since last frame
    const currentTime = Date.now();
    const deltaTime = currentTime - lastUpdateTimeRef.current;
    
    // Add to accumulated time
    accumulatedTimeRef.current += deltaTime;
    
    // Process game updates based on accumulated time
    while (accumulatedTimeRef.current >= frameTime) {
      // Process automation at the specified frame rate
      dispatch(processAutomation());
      accumulatedTimeRef.current -= frameTime;
    }
    
    // Update last time
    lastUpdateTimeRef.current = currentTime;
    
    // Continue the loop
    requestRef.current = requestAnimationFrame(gameLoop);
  };

  useEffect(() => {
    // Start the game loop using both requestAnimationFrame for smooth animation
    // and a backup interval timer to ensure updates even if animations are throttled
    requestRef.current = requestAnimationFrame(gameLoop);
    
    // Backup interval to ensure processing happens even if animations are throttled
    fpsIntervalRef.current = window.setInterval(() => {
      const currentTime = Date.now();
      const deltaTime = currentTime - lastUpdateTimeRef.current;
      
      // Only update if animationFrame hasn't run recently
      if (deltaTime > frameTime * 2) {
        dispatch(processAutomation());
        lastUpdateTimeRef.current = currentTime;
      }
    }, frameTime * 2); // Slightly longer interval for backup
    
    // Clean up both animation loops on unmount
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      if (fpsIntervalRef.current) {
        clearInterval(fpsIntervalRef.current);
      }
    };
  }, [dispatch, frameTime]);
};

export default useGameLoop; 