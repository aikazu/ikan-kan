import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateGameState, trackOfflineEarnings } from '../store/gameSlice';
import { initialState } from '../store/gameSlice';
import { RootState } from '../store';
import { GameState, FishType, FISH_PROPERTIES, FishRarity } from '../types/game';
import { AutoFeederSpeed } from '../types/game';

const SAVE_KEY = 'ikan-kan-save';
const SAVE_INTERVAL = 2000; // Save every 2 seconds (reduced from 10 seconds)
const MAX_OFFLINE_TIME = 3600 * 8; // Cap offline progression at 8 hours

export const useLocalStorage = () => {
  const dispatch = useDispatch();
  const gameState = useSelector((state: RootState) => state.game);
  const lastSavedStateRef = useRef<string>(JSON.stringify(gameState));

  // Helper function to update fish count statistics
  const updateFishCountStats = (statistics: GameState['statistics'], fishType: FishType, fishRarity: FishRarity) => {
    // Increment count by fish type
    statistics.fishByType[fishType] = (statistics.fishByType[fishType] || 0) + 1;
    
    // Increment count by fish rarity
    statistics.fishByRarity[fishRarity] = (statistics.fishByRarity[fishRarity] || 0) + 1;
    
    return statistics;
  };

  // Load game state from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem(SAVE_KEY);
    
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData) as GameState;
        
        // Initialize statistics if it doesn't exist (backward compatibility)
        if (!parsedData.statistics) {
          parsedData.statistics = {
            totalClicks: 0,
            totalFishBred: 0,
            totalFishDiscovered: parsedData.discoveredFishTypes.length,
            totalLuckyBubbles: 0,
            totalOfflineEarnings: 0,
            totalActiveBubbleTime: 0,
            highestPointsPerSecond: 0,
            currentPointsPerSecond: 0,
            totalUpgradesPurchased: 0,
            totalFeedersPurchased: 0,
            totalAchievementsCompleted: 0,
            totalFishPointsEarned: parsedData.totalFishPointsEarned || 0,
            playTime: 0,
            fishByType: Object.values(FishType).reduce((acc, type) => {
              acc[type] = 0;
              return acc;
            }, {} as Record<FishType, number>),
            fishByRarity: Object.values(FishRarity).reduce((acc, rarity) => {
              acc[rarity] = 0;
              return acc;
            }, {} as Record<FishRarity, number>),
            startDate: Date.now(),
            lastSessionDate: Date.now()
          };
          
          // Populate initial fish counts for existing fish
          parsedData.currentTank.fish.forEach(fish => {
            updateFishCountStats(parsedData.statistics, fish.type, fish.rarity);
          });
        }
        
        // Migrate existing fish to include new properties if needed
        parsedData.currentTank.fish = parsedData.currentTank.fish.map(fish => {
          // Check if this is an old format fish without pointsPerSecond
          if (fish.pointsPerSecond === undefined || fish.breedingRate === undefined) {
            const fishProps = FISH_PROPERTIES[fish.type];
            return {
              ...fish,
              rarity: fishProps.rarity,
              pointsPerSecond: fishProps.basePointsPerSecond * fish.level,
              breedingRate: fishProps.breedingRate,
              specialAbility: fishProps.specialAbility
            };
          }
          return fish;
        });
        
        // Ensure feeders have the correct properties
        if (parsedData.feeders && parsedData.feeders.length > 0) {
          // The current level is determined by the feed rate and the formula feedRate = 4 * 2^(level-1)
          // So level = log2(feedRate/4) + 1
          parsedData.feeders = parsedData.feeders.map(feeder => {
            // If the feeder has no level info or the rate doesn't match the expected level,
            // recalculate the level based on the feed rate
            const level = Math.log2(feeder.feedRate / 4) + 1;
            const adjustedLevel = Math.round(level); // Round to nearest whole number
            
            // Map the level to the appropriate enum value
            let speedLevel = feeder.speedLevel;
            if (!speedLevel || adjustedLevel > 1) {
              switch(Math.min(adjustedLevel, 5)) {
                case 1: speedLevel = AutoFeederSpeed.LEVEL_1; break;
                case 2: speedLevel = AutoFeederSpeed.LEVEL_2; break;
                case 3: speedLevel = AutoFeederSpeed.LEVEL_3; break;
                case 4: speedLevel = AutoFeederSpeed.LEVEL_4; break;
                case 5: speedLevel = AutoFeederSpeed.LEVEL_5; break;
              }
            }
            
            return {
              ...feeder,
              speedLevel
            };
          });
        }
        
        // Add missing statistics properties if needed (backward compatibility)
        if (parsedData.statistics && parsedData.statistics.currentPointsPerSecond === undefined) {
          parsedData.statistics.currentPointsPerSecond = 0;
        }
        
        // Calculate offline progress
        const currentTime = Date.now();
        let timeDiff = (currentTime - parsedData.lastSavedAt) / 1000; // in seconds
        
        // Cap offline time at MAX_OFFLINE_TIME
        const wasLongOffline = timeDiff > MAX_OFFLINE_TIME;
        if (wasLongOffline) {
          timeDiff = MAX_OFFLINE_TIME;
        }
        
        if (timeDiff > 5) { // Only calculate if more than 5 seconds have passed
          // Track offline earnings for notification
          let totalOfflineEarnings = 0;
          let newFishSpawned = 0;
          
          // Calculate passive income during time away (90% of what would have been earned)
          const totalFeeders = parsedData.feeders.length;
          const totalFish = parsedData.currentTank.fish.length;
          
          // Calculate points earned from feeders (90% efficiency while offline)
          // Each feeder now directly represents FP/s based on level (4, 8, 16, 32, etc.)
          const feedRate = totalFeeders > 0 ? 4 * Math.pow(2, totalFeeders - 1) : 0;
          const feedersPoints = feedRate * 0.9 * timeDiff;
          totalOfflineEarnings += feedersPoints;
          
          // Calculate points earned from fish
          let fishPointsPerSecond = 0;
          
          // Sum the points per second from each fish
          parsedData.currentTank.fish.forEach(fish => {
            fishPointsPerSecond += fish.pointsPerSecond;
          });
          
          // Update highest points per second statistic if applicable
          if (fishPointsPerSecond > parsedData.statistics.highestPointsPerSecond) {
            parsedData.statistics.highestPointsPerSecond = fishPointsPerSecond;
          }
          
          const fishPoints = fishPointsPerSecond * 0.9 * timeDiff;
          totalOfflineEarnings += fishPoints;
          
          // Calculate potential new fish spawns (reduced probability while offline)
          const breedingChance = 0.05 * timeDiff * (totalFish / Math.max(10, parsedData.currentTank.capacity));
          const possibleNewFish = Math.min(
            Math.floor(breedingChance),
            parsedData.currentTank.capacity - totalFish
          );
          
          // Add new fish if there's room
          if (possibleNewFish > 0) {
            for (let i = 0; i < possibleNewFish; i++) {
              // Only add if there's still capacity
              if (parsedData.currentTank.fish.length < parsedData.currentTank.capacity) {
                // Pick a random discovered fish type
                const fishType = pickRandomFishType(parsedData.discoveredFishTypes);
                const fishProps = FISH_PROPERTIES[fishType];
                
                const newFish = {
                  id: crypto.randomUUID ? crypto.randomUUID() : `fish-${Date.now()}-${i}`,
                  type: fishType,
                  level: 1,
                  createdAt: currentTime - Math.random() * timeDiff * 1000, // Random creation time during offline period
                  rarity: fishProps.rarity,
                  pointsPerSecond: fishProps.basePointsPerSecond,
                  breedingRate: fishProps.breedingRate,
                  specialAbility: fishProps.specialAbility
                };
                
                parsedData.currentTank.fish.push(newFish);
                newFishSpawned++;
                
                // Update statistics for fish counts
                parsedData.statistics.totalFishBred += 1;
                updateFishCountStats(parsedData.statistics, fishType, fishProps.rarity);
              }
            }
          }
          
          // Update game state with offline progress
          parsedData.fishPoints += totalOfflineEarnings;
          parsedData.totalFishPointsEarned += totalOfflineEarnings;
          
          // Update statistics for offline earnings
          parsedData.statistics.totalOfflineEarnings += totalOfflineEarnings;
          
          // Store offline earnings data in sessionStorage for notification
          sessionStorage.setItem('offlineEarnings', JSON.stringify({
            points: totalOfflineEarnings.toFixed(1),
            timeDiff: formatOfflineTime(timeDiff),
            newFish: newFishSpawned,
            wasLongOffline
          }));
        }
        
        // Clear any active lucky bubbles as they would have expired
        parsedData.activeLuckyBubbles = [];
        
        // Update lastSavedAt to current time
        parsedData.lastSavedAt = currentTime;
        parsedData.statistics.lastSessionDate = currentTime;
        
        // Calculate and set current points per second
        let currentPointsPerSecond = 0;
        parsedData.currentTank.fish.forEach(fish => {
          currentPointsPerSecond += fish.pointsPerSecond;
        });
        
        // Set initial current points per second based on fish in the tank
        parsedData.statistics.currentPointsPerSecond = currentPointsPerSecond;
        
        // Update game state with loaded data
        dispatch(updateGameState(parsedData));
      } catch (error) {
        console.error('Error loading save data:', error);
      }
    }
  }, [dispatch]);

  // Helper function to detect significant changes in state that warrant immediate saving
  const hasSignificantChanges = (prevStateStr: string, currentState: GameState): boolean => {
    try {
      const prevState = JSON.parse(prevStateStr) as GameState;
      
      // Check for changes in fish count
      if (prevState.currentTank.fish.length !== currentState.currentTank.fish.length) {
        return true;
      }
      
      // Check for significant changes in fish points (more than 10% or 100 points)
      const fpDiff = Math.abs(prevState.fishPoints - currentState.fishPoints);
      if (fpDiff > 100 || fpDiff / Math.max(1, prevState.fishPoints) > 0.1) {
        return true;
      }
      
      // Check for changes in tank type
      if (prevState.currentTank.type !== currentState.currentTank.type) {
        return true;
      }
      
      // Check for changes in feeder count
      if (prevState.feeders.length !== currentState.feeders.length) {
        return true;
      }
      
      return false;
    } catch (error) {
      // If there's an error parsing, assume there are significant changes
      return true;
    }
  };

  // Save game state to localStorage at regular intervals
  useEffect(() => {
    const intervalId = setInterval(() => {
      const saveData = {
        ...gameState,
        lastSavedAt: Date.now()
      };
      
      localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
    }, SAVE_INTERVAL);
    
    // Also check for significant changes and save immediately when needed
    const currentStateStr = JSON.stringify(gameState);
    if (hasSignificantChanges(lastSavedStateRef.current, gameState)) {
      const saveData = {
        ...gameState,
        lastSavedAt: Date.now()
      };
      
      localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
    }
    lastSavedStateRef.current = currentStateStr;
    
    return () => clearInterval(intervalId);
  }, [gameState]);

  // Helper function to manually save
  const saveGame = () => {
    localStorage.setItem(SAVE_KEY, JSON.stringify({
      ...gameState,
      lastSavedAt: Date.now()
    }));
    alert('Game saved successfully!');
  };

  // Helper function to reset save data
  const resetGame = () => {
    // Remove all game-related data
    localStorage.removeItem(SAVE_KEY);
    sessionStorage.removeItem('offlineEarnings');
    
    // Dispatch an update to reset the state in memory
    dispatch(updateGameState({
      ...initialState,
      lastSavedAt: Date.now()
    }));
    
    // Force reload the page to completely reset the app state
    setTimeout(() => {
      window.location.href = window.location.pathname;
    }, 100);
  };

  // Helper function to get offline earnings data (if any)
  const getOfflineEarnings = () => {
    const earningsData = sessionStorage.getItem('offlineEarnings');
    sessionStorage.removeItem('offlineEarnings'); // Clear after reading
    
    // If there are offline earnings, track them in statistics
    if (earningsData) {
      const data = JSON.parse(earningsData);
      const pointsEarned = parseFloat(data.points);
      
      // Dispatch action to update statistics
      dispatch(trackOfflineEarnings(pointsEarned));
    }
    
    return earningsData ? JSON.parse(earningsData) : null;
  };

  return { saveGame, resetGame, getOfflineEarnings };
};

// Helper function to format offline time in a readable format
const formatOfflineTime = (seconds: number): string => {
  if (seconds < 60) return `${Math.floor(seconds)} seconds`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes`;
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  return `${hours} hours${minutes > 0 ? ` and ${minutes} minutes` : ''}`;
};

// Helper function to pick a random fish type from discovered types
const pickRandomFishType = (discoveredTypes: FishType[]): FishType => {
  return discoveredTypes[Math.floor(Math.random() * discoveredTypes.length)];
};

export default useLocalStorage; 