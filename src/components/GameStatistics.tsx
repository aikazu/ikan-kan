import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { FishType, FishRarity, TankType } from '../types/game';
import { formatNumber } from '../utils/numberUtils';
import './GameStatistics.css';

// Tank display names
const tankDisplayNames: Record<TankType, string> = {
  [TankType.FISH_BOWL]: 'Fish Bowl',
  [TankType.SMALL_AQUARIUM]: 'Small Aquarium',
  [TankType.MEDIUM_AQUARIUM]: 'Medium Aquarium',
  [TankType.LARGE_AQUARIUM]: 'Large Aquarium',
  [TankType.HOME_POND]: 'Home Pond',
  [TankType.INDOOR_REEF]: 'Indoor Reef',
};

const GameStatistics: React.FC = () => {
  const { 
    statistics, 
    currentTank, 
    feeders, 
    totalFishPointsEarned,
    fishPoints,
    activeLuckyBubbles
  } = useSelector((state: RootState) => state.game);
  const [isOpen, setIsOpen] = useState(false);

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString();
  };

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${Math.floor(seconds)}s`;
    if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = Math.floor(seconds % 60);
      return `${minutes}m ${remainingSeconds}s`;
    }
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const toggleStatistics = () => {
    setIsOpen(!isOpen);
  };

  // Calculate FP per second from fish
  let fishPointsPerSecond = 0;
  
  // Check for active 'School's In' bubble for bonus fish production
  const schoolsInBubble = activeLuckyBubbles.find(
    bubble => bubble.type === 'schoolsIn' &&
    Date.now() < bubble.startTime + bubble.duration
  );
  const schoolsMultiplier = schoolsInBubble ? 2 : 1;
  
  // Sum points per second from all fish, with schools multiplier if active
  currentTank.fish.forEach(fish => {
    fishPointsPerSecond += fish.pointsPerSecond;
  });
  
  fishPointsPerSecond *= schoolsMultiplier;
  
  // Calculate FP per second from feeders
  // Feeder rate now directly represents FP/s
  const feederRate = feeders.reduce((sum, feeder) => sum + feeder.feedRate, 0);
  
  // Total rate is fish points (passive) + feeder points (automation)
  const totalRate = fishPointsPerSecond + feederRate;

  if (!isOpen) {
    return (
      <button className="statistics-toggle-button" onClick={toggleStatistics}>
        Statistics
      </button>
    );
  }

  return (
    <div className="statistics-overlay">
      <div className="statistics-container">
        <div className="statistics-header">
          <h2>Game Statistics</h2>
          <button className="close-button" onClick={toggleStatistics}>×</button>
        </div>

        <div className="statistics-content">
          <div className="statistics-section">
            <h3>Resources</h3>
            <div className="stat-row">
              <div className="stat-label">Current Fish Points (FP)</div>
              <div className="stat-value">{formatNumber(fishPoints)}</div>
            </div>
            <div className="stat-row">
              <div className="stat-label">Total FP Earned</div>
              <div className="stat-value">{formatNumber(totalFishPointsEarned)}</div>
            </div>
            <div className="stat-row">
              <div className="stat-label">FP Per Second</div>
              <div className="stat-value">{totalRate.toFixed(1)}</div>
            </div>
            <div className="stat-row">
              <div className="stat-label">- From Fish</div>
              <div className="stat-value">{fishPointsPerSecond.toFixed(1)}</div>
            </div>
            <div className="stat-row">
              <div className="stat-label">- From Feeders</div>
              <div className="stat-value">{feederRate.toFixed(1)}</div>
            </div>
          </div>

          <div className="statistics-section">
            <h3>Tank Information</h3>
            <div className="stat-row">
              <div className="stat-label">Current Tank</div>
              <div className="stat-value">{tankDisplayNames[currentTank.type]}</div>
            </div>
            <div className="stat-row">
              <div className="stat-label">Fish Count</div>
              <div className="stat-value">{currentTank.fish.length} / {currentTank.capacity}</div>
            </div>
            <div className="stat-row">
              <div className="stat-label">Auto-Feeders</div>
              <div className="stat-value">{feeders.length}</div>
            </div>
          </div>

          <div className="statistics-section">
            <h3>General</h3>
            <div className="stat-row">
              <div className="stat-label">Started Playing</div>
              <div className="stat-value">{formatDate(statistics.startDate)}</div>
            </div>
            <div className="stat-row">
              <div className="stat-label">Total Play Time</div>
              <div className="stat-value">{formatTime(statistics.playTime)}</div>
            </div>
            <div className="stat-row">
              <div className="stat-label">Total Clicks</div>
              <div className="stat-value">{formatNumber(statistics.totalClicks)}</div>
            </div>
          </div>

          <div className="statistics-section">
            <h3>Fish</h3>
            <div className="stat-row">
              <div className="stat-label">Total Fish Bred</div>
              <div className="stat-value">{formatNumber(statistics.totalFishBred)}</div>
            </div>
            <div className="stat-row">
              <div className="stat-label">Fish Types Discovered</div>
              <div className="stat-value">{formatNumber(statistics.totalFishDiscovered)}</div>
            </div>
            <div className="stat-row">
              <div className="stat-label">Current Points/Second</div>
              <div className="stat-value">{statistics.currentPointsPerSecond.toFixed(1)}</div>
            </div>
            <div className="stat-row">
              <div className="stat-label">Highest Points/Second</div>
              <div className="stat-value">{statistics.highestPointsPerSecond.toFixed(1)}</div>
            </div>
          </div>

          <div className="statistics-section">
            <h3>Fish by Rarity</h3>
            {Object.values(FishRarity).map((rarity) => (
              <div className="stat-row" key={rarity}>
                <div className="stat-label">{rarity.charAt(0).toUpperCase() + rarity.slice(1)}</div>
                <div className="stat-value">{formatNumber(statistics.fishByRarity[rarity] || 0)}</div>
              </div>
            ))}
          </div>

          <div className="statistics-section">
            <h3>Upgrades & Events</h3>
            <div className="stat-row">
              <div className="stat-label">Total Upgrades Purchased</div>
              <div className="stat-value">{formatNumber(statistics.totalUpgradesPurchased)}</div>
            </div>
            <div className="stat-row">
              <div className="stat-label">Total Feeders Purchased</div>
              <div className="stat-value">{formatNumber(statistics.totalFeedersPurchased)}</div>
            </div>
            <div className="stat-row">
              <div className="stat-label">Lucky Bubbles Triggered</div>
              <div className="stat-value">{formatNumber(statistics.totalLuckyBubbles)}</div>
            </div>
            <div className="stat-row">
              <div className="stat-label">Active Bubble Time</div>
              <div className="stat-value">{formatTime(statistics.totalActiveBubbleTime)}</div>
            </div>
            <div className="stat-row">
              <div className="stat-label">Offline Earnings</div>
              <div className="stat-value">{formatNumber(Math.round(statistics.totalOfflineEarnings))}</div>
            </div>
          </div>

          <div className="statistics-section expandable">
            <h3>Fish Types Collected</h3>
            <div className="fish-types-grid">
              {Object.values(FishType).map((type) => (
                <div className="fish-stat-item" key={type}>
                  <div className="fish-name">{type.charAt(0).toUpperCase() + type.slice(1)}</div>
                  <div className="fish-count">{formatNumber(statistics.fishByType[type] || 0)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameStatistics; 