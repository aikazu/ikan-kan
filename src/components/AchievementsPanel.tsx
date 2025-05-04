import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { AchievementTier } from '../types/game';
import { getAchievementProgress } from '../utils/achievementUtils';
import './AchievementsPanel.css';

const AchievementsPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const achievements = useSelector((state: RootState) => state.achievement.achievements);
  const statistics = useSelector((state: RootState) => state.statistics.statistics);
  const [activeFilter, setActiveFilter] = useState<AchievementTier | 'all'>('all');
  
  // Calculate completion percentage
  const completedCount = achievements.filter(a => a.completed).length;
  const completionPercentage = Math.floor((completedCount / achievements.length) * 100);
  
  // Toggle panel open/closed
  const togglePanel = () => {
    setIsOpen(!isOpen);
  };
  
  // Filter achievements by tier
  const filteredAchievements = activeFilter === 'all' 
    ? achievements 
    : achievements.filter(a => a.tier === activeFilter);
  
  // Sort achievements: completed first, then by tier
  const sortedAchievements = [...filteredAchievements].sort((a, b) => {
    // First sort by completion status
    if (a.completed && !b.completed) return -1;
    if (!a.completed && b.completed) return 1;
    
    // Then sort by tier
    const tierOrder = {
      [AchievementTier.BRONZE]: 1,
      [AchievementTier.SILVER]: 2,
      [AchievementTier.GOLD]: 3,
      [AchievementTier.PLATINUM]: 4,
      [AchievementTier.DIAMOND]: 5,
    };
    
    return tierOrder[a.tier] - tierOrder[b.tier];
  });
  
  // Background colors for different tiers
  const getTierColor = (tier: AchievementTier): string => {
    switch (tier) {
      case AchievementTier.BRONZE:
        return '#cd7f32';
      case AchievementTier.SILVER:
        return '#c0c0c0';
      case AchievementTier.GOLD:
        return '#ffd700';
      case AchievementTier.PLATINUM:
        return '#e5e4e2';
      case AchievementTier.DIAMOND:
        return '#b9f2ff';
      default:
        return '#ffffff';
    }
  };
  
  // Format completion date
  const formatDate = (timestamp?: number): string => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleString();
  };
  
  if (!isOpen) {
    return (
      <button 
        className="achievements-toggle-button" 
        onClick={togglePanel}
      >
        Achievements ({completedCount}/{achievements.length})
      </button>
    );
  }
  
  return (
    <div className="achievements-overlay">
      <div className="achievements-panel">
        <div className="achievements-header">
          <h2>Achievements ({completedCount}/{achievements.length})</h2>
          <button className="close-button" onClick={togglePanel}>×</button>
        </div>
        
        <div className="completion-progress">
          <div className="progress-label">Overall Completion: {completionPercentage}%</div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>
        
        <div className="achievements-filters">
          <button 
            className={`filter-button ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            All
          </button>
          {Object.values(AchievementTier).map(tier => (
            <button 
              key={tier}
              className={`filter-button ${activeFilter === tier ? 'active' : ''}`}
              onClick={() => setActiveFilter(tier)}
              style={{ 
                backgroundColor: getTierColor(tier),
                color: tier === AchievementTier.GOLD || tier === AchievementTier.BRONZE ? '#333' : '#fff'
              }}
            >
              {tier.charAt(0).toUpperCase() + tier.slice(1)}
            </button>
          ))}
        </div>
        
        <div className="achievements-list">
          {sortedAchievements.map(achievement => {
            const progress = getAchievementProgress(achievement, statistics);
            
            return (
              <div 
                key={achievement.id} 
                className={`achievement-item ${achievement.completed ? 'completed' : ''}`}
                style={{ 
                  borderColor: getTierColor(achievement.tier),
                  backgroundColor: achievement.completed 
                    ? `${getTierColor(achievement.tier)}33` 
                    : 'transparent' 
                }}
              >
                <div className="achievement-item-icon">{achievement.icon}</div>
                <div className="achievement-item-content">
                  <div className="achievement-item-header">
                    <h3 className="achievement-item-name">{achievement.name}</h3>
                    <span className="achievement-item-tier" style={{ color: getTierColor(achievement.tier) }}>
                      {achievement.tier.charAt(0).toUpperCase() + achievement.tier.slice(1)}
                    </span>
                  </div>
                  
                  <div className="achievement-item-description">{achievement.description}</div>
                  
                  {achievement.completed ? (
                    <div className="achievement-item-completed">
                      <span className="completed-checkmark">✓</span> 
                      Completed on {formatDate(achievement.completedAt)}
                    </div>
                  ) : (
                    <div className="achievement-item-progress">
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                      </div>
                      <span className="progress-text">{progress}% Complete</span>
                    </div>
                  )}
                  
                  <div className="achievement-item-reward">
                    Reward: {achievement.reward} Fish Points
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AchievementsPanel; 