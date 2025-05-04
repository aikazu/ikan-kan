import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { upgradeTank, spendFishPoints } from '../store/slices/tankSlice';
import { purchaseFeeder } from '../store/slices/feederSlice';
import { TankType, FeederType } from '../types/game';
import useAnimatedFeedback from '../hooks/useAnimatedFeedback';
import './FloatingUpgrades.css';

// Define costs for tank upgrades
const tankCosts: Record<TankType, number> = {
  [TankType.FISH_BOWL]: 0, // Base tank, costs nothing
  [TankType.SMALL_AQUARIUM]: 50,
  [TankType.MEDIUM_AQUARIUM]: 500,
  [TankType.LARGE_AQUARIUM]: 5000,
  [TankType.HOME_POND]: 50000,
  [TankType.INDOOR_REEF]: 500000,
};

// Auto-feed level costs (each level doubles the rate)
const autoFeedLevelCosts = [
  20,        // Level 1: 4 FP/s - 20 FP
  40,        // Level 2: 8 FP/s - 40 FP
  80,        // Level 3: 16 FP/s - 80 FP
  160,       // Level 4: 32 FP/s - 160 FP
  320,       // Level 5: 64 FP/s - 320 FP
  640,       // Level 6: 128 FP/s - 640 FP
  1280,      // Level 7: 256 FP/s - 1,280 FP
  2560,      // Level 8: 512 FP/s - 2,560 FP
  5120,      // Level 9: 1,024 FP/s - 5,120 FP
  10240,     // Level 10: 2,048 FP/s - 10,240 FP
  20480,     // Level 11: 4,096 FP/s - 20,480 FP
  40960,     // Level 12: 8,192 FP/s - 40,960 FP
  81920,     // Level 13: 16,384 FP/s - 81,920 FP
  163840,    // Level 14: 32,768 FP/s - 163,840 FP
  327680,    // Level 15: 65,536 FP/s - 327,680 FP
  655360,    // Level 16: 131,072 FP/s - 655,360 FP
  1310720,   // Level 17: 262,144 FP/s - 1,310,720 FP
  2621440,   // Level 18: 524,288 FP/s - 2,621,440 FP
  5242880,   // Level 19: 1,048,576 FP/s - 5,242,880 FP
  10485760,  // Level 20: 2,097,152 FP/s - 10,485,760 FP
];

// Tank display info
const tankInfo: Record<TankType, { name: string; capacity: number }> = {
  [TankType.FISH_BOWL]: { name: 'Fish Bowl', capacity: 5 },
  [TankType.SMALL_AQUARIUM]: { name: 'Small Aquarium', capacity: 30 },
  [TankType.MEDIUM_AQUARIUM]: { name: 'Medium Aquarium', capacity: 150 },
  [TankType.LARGE_AQUARIUM]: { name: 'Large Aquarium', capacity: 600 },
  [TankType.HOME_POND]: { name: 'Home Pond', capacity: 1800 },
  [TankType.INDOOR_REEF]: { name: 'Indoor Reef', capacity: 3200 },
};

const FloatingUpgrades: React.FC = () => {
  const dispatch = useDispatch();
  const fishPoints = useSelector((state: RootState) => state.tank.fishPoints);
  const currentTank = useSelector((state: RootState) => state.tank.currentTank);
  const feeders = useSelector((state: RootState) => state.feeder.feeders);
  const { showUpgrade } = useAnimatedFeedback();

  // Calculate the actual feeder level based on the feed rate
  // Using logarithm: level = log₂(feedRate/4) + 1
  const calculateFeederLevel = (): number => {
    if (feeders.length === 0) return 0;
    
    // Get the first (and only) feeder's feed rate
    const feedRate = feeders[0].feedRate;
    // Calculate the level based on the formula feedRate = 4 * 2^(level-1)
    // So level = log₂(feedRate/4) + 1
    return Math.max(1, Math.round(Math.log2(feedRate / 4) + 1));
  };

  // Helper to get button position for animations
  const getButtonPosition = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
  };

  // Handle purchasing a tank upgrade
  const handleUpgradeTank = (tankType: TankType, event: React.MouseEvent) => {
    const cost = tankCosts[tankType];
    if (fishPoints >= cost) {
      const { x, y } = getButtonPosition(event);
      dispatch(upgradeTank(tankType));
      dispatch(spendFishPoints(cost));
      showUpgrade(`New Tank: ${tankInfo[tankType].name}`, x, y);
    }
  };

  // Handle auto-feed upgrade (purchasing or upgrading)
  const handleAutoFeedUpgrade = (event: React.MouseEvent) => {
    // Use the calculated level instead of feeders.length
    const currentLevel = calculateFeederLevel();
    
    console.log(`Current auto-feed level: ${currentLevel}`);
    if (feeders.length > 0) {
      console.log(`Current feed rate: ${feeders[0].feedRate}`);
      console.log(`Current speed level: ${feeders[0].speedLevel}`);
    }
    
    // If maxed out at level 20, do nothing
    if (currentLevel >= 20) return;
    
    const cost = autoFeedLevelCosts[currentLevel];
    if (fishPoints >= cost) {
      const { x, y } = getButtonPosition(event);
      
      // Purchase new feeder (the game logic replaces existing feeders)
      dispatch(purchaseFeeder({ feederType: FeederType.BASIC, currentLevel }));
      dispatch(spendFishPoints(cost));
      
      // Calculate new level and rate for display
      const newLevel = currentLevel + 1;
      const newRate = 4 * Math.pow(2, currentLevel); // 4, 8, 16, 32, etc.
      showUpgrade(`Auto-feed Level ${newLevel}: ${newRate.toFixed(0)} FP/s`, x, y);
      
      console.log(`Upgraded to auto-feed level ${newLevel} with rate ${newRate}`);
    }
  };

  // Determine next available tank upgrade
  const getNextTankUpgrade = (): TankType | null => {
    switch (currentTank.type) {
      case TankType.FISH_BOWL:
        return TankType.SMALL_AQUARIUM;
      case TankType.SMALL_AQUARIUM:
        return TankType.MEDIUM_AQUARIUM;
      case TankType.MEDIUM_AQUARIUM:
        return TankType.LARGE_AQUARIUM;
      case TankType.LARGE_AQUARIUM:
        return TankType.HOME_POND;
      case TankType.HOME_POND:
        return TankType.INDOOR_REEF;
      default:
        return null;
    }
  };

  const nextTank = getNextTankUpgrade();
  // Use the calculated level for UI display
  const currentFeedLevel = calculateFeederLevel();
  const isMaxFeedLevel = currentFeedLevel >= 20;
  
  // Calculate current auto-feed rate
  const currentFeedRate = currentFeedLevel > 0 ? 4 * Math.pow(2, currentFeedLevel - 1) : 0;
  
  // Calculate next auto-feed rate (if not maxed)
  const nextFeedRate = !isMaxFeedLevel ? 4 * Math.pow(2, currentFeedLevel) : currentFeedRate;

  // Format large numbers with K, M, B suffixes
  const formatRate = (rate: number): string => {
    if (rate < 1000) return rate.toFixed(0);
    if (rate < 1000000) return (rate / 1000).toFixed(1) + 'K';
    if (rate < 1000000000) return (rate / 1000000).toFixed(1) + 'M';
    return (rate / 1000000000).toFixed(1) + 'B';
  };

  return (
    <div className="floating-upgrades">
      {/* Tank Upgrade Button */}
      {nextTank && (
        <div className="floating-upgrade-button tank-upgrade">
          <button
            className={`upgrade-button ${fishPoints >= tankCosts[nextTank] ? '' : 'disabled'}`}
            onClick={(e) => handleUpgradeTank(nextTank, e)}
            disabled={fishPoints < tankCosts[nextTank]}
          >
            <div className="upgrade-icon">🐠</div>
            <div className="upgrade-info">
              <div className="upgrade-label">Tank Lv.{Object.values(TankType).indexOf(currentTank.type) + 1}</div>
              <div className="upgrade-cost">{tankCosts[nextTank]} FP</div>
            </div>
          </button>
          <div className="tooltip">
            <div className="tooltip-title">{tankInfo[nextTank].name}</div>
            <div className="tooltip-description">Capacity: {tankInfo[nextTank].capacity} fish</div>
          </div>
        </div>
      )}

      {/* Auto-Feed Upgrade Button */}
      <div className="floating-upgrade-button feeder-upgrade">
        <button
          className={`upgrade-button ${!isMaxFeedLevel && fishPoints >= autoFeedLevelCosts[currentFeedLevel] ? '' : 'disabled'}`}
          onClick={handleAutoFeedUpgrade}
          disabled={isMaxFeedLevel || fishPoints < autoFeedLevelCosts[currentFeedLevel]}
        >
          <div className="upgrade-icon">🍽️</div>
          <div className="upgrade-info">
            <div className="upgrade-label">
              {currentFeedLevel === 0 ? 'Auto-Feed' : `Feed Lv.${currentFeedLevel}`}
            </div>
            <div className="upgrade-cost">
              {isMaxFeedLevel ? 'MAX' : `${autoFeedLevelCosts[currentFeedLevel]} FP`}
            </div>
          </div>
        </button>
        <div className="tooltip">
          <div className="tooltip-title">
            {currentFeedLevel === 0 ? 'Auto-feed Level 1' : `Auto-feed Level ${currentFeedLevel + 1}`}
          </div>
          <div className="tooltip-description">
            {isMaxFeedLevel ? 
              `Current: ${formatRate(currentFeedRate)} FP/s (MAX)` : 
              `${currentFeedLevel > 0 ? `${formatRate(currentFeedRate)} → ` : ''}${formatRate(nextFeedRate)} FP/s`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingUpgrades; 