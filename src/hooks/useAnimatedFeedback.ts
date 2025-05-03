import { useCallback } from 'react';
import { FeedbackType } from '../components/AnimatedFeedback';

/**
 * Hook to easily trigger animated feedback from any component
 */
const useAnimatedFeedback = () => {
  /**
   * Show animated feedback at the specified position
   * @param type The type of feedback to show
   * @param value The value to display (e.g., points earned)
   * @param x The x-coordinate where the animation should appear
   * @param y The y-coordinate where the animation should appear
   */
  const showFeedback = useCallback((
    type: FeedbackType,
    value: string | number,
    x: number,
    y: number
  ) => {
    // Access the global gameAnimations object
    if ((window as any).gameAnimations?.addFeedback) {
      (window as any).gameAnimations.addFeedback(type, value, x, y);
    }
  }, []);

  /**
   * Show animated points feedback (convenience method)
   * @param points The number of points to display
   * @param x The x-coordinate where the animation should appear
   * @param y The y-coordinate where the animation should appear
   */
  const showPoints = useCallback((points: number, x: number, y: number) => {
    showFeedback('points', points, x, y);
  }, [showFeedback]);

  /**
   * Show animated fish feedback (convenience method)
   * @param count The number of fish to display
   * @param x The x-coordinate where the animation should appear
   * @param y The y-coordinate where the animation should appear
   */
  const showFishAdded = useCallback((count: number, x: number, y: number) => {
    showFeedback('fish', count, x, y);
  }, [showFeedback]);

  /**
   * Show upgrade feedback (convenience method)
   * @param message The upgrade message to display
   * @param x The x-coordinate where the animation should appear
   * @param y The y-coordinate where the animation should appear
   */
  const showUpgrade = useCallback((message: string, x: number, y: number) => {
    showFeedback('upgrade', message, x, y);
  }, [showFeedback]);

  /**
   * Show level up feedback (convenience method)
   * @param message The level up message to display
   * @param x The x-coordinate where the animation should appear
   * @param y The y-coordinate where the animation should appear
   */
  const showLevelUp = useCallback((message: string, x: number, y: number) => {
    showFeedback('levelUp', message, x, y);
  }, [showFeedback]);

  /**
   * Show multiple random points animations (useful for feeding frenzy, etc.)
   * @param basePoints The base number of points to display
   * @param count How many animations to show
   * @param baseX The center x-coordinate
   * @param baseY The center y-coordinate
   * @param radius Max distance from center to randomize positions
   */
  const showMultiplePoints = useCallback((
    basePoints: number,
    count: number,
    baseX: number,
    baseY: number,
    radius: number = 100
  ) => {
    for (let i = 0; i < count; i++) {
      // Randomize position within radius
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * radius;
      const x = baseX + Math.cos(angle) * distance;
      const y = baseY + Math.sin(angle) * distance;
      
      // Randomize point values slightly
      const pointVariation = Math.random() * 0.4 + 0.8; // 0.8 to 1.2
      const points = Math.round(basePoints * pointVariation);
      
      // Slight delay between animations for a more natural look
      setTimeout(() => {
        showPoints(points, x, y);
      }, Math.random() * 300);
    }
  }, [showPoints]);

  return {
    showFeedback,
    showPoints,
    showFishAdded,
    showUpgrade,
    showLevelUp,
    showMultiplePoints
  };
};

export default useAnimatedFeedback; 