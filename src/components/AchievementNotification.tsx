import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { acknowledgeAchievement } from '../store/slices/achievementSlice';
import { AchievementTier } from '../types/game';
import './AchievementNotification.css';

const AchievementNotification: React.FC = () => {
  const dispatch = useDispatch();
  const recentAchievements = useSelector((state: RootState) => state.achievement.recentlyCompletedAchievements);
  
  // Display only the most recent achievement if there are any
  const achievement = recentAchievements.length > 0 ? recentAchievements[0] : null;
  
  // Automatically dismiss the achievement after 5 seconds
  useEffect(() => {
    if (achievement) {
      const timer = setTimeout(() => {
        dispatch(acknowledgeAchievement(achievement.id));
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [achievement, dispatch]);
  
  // If no achievement to display, return null
  if (!achievement) {
    return null;
  }
  
  // Get background color based on tier
  const getBgColor = (tier: AchievementTier): string => {
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
  
  // Handle dismiss click
  const handleDismiss = () => {
    dispatch(acknowledgeAchievement(achievement.id));
  };
  
  return (
    <div 
      className="achievement-notification"
      style={{ backgroundColor: getBgColor(achievement.tier) }}
    >
      <div className="achievement-icon">{achievement.icon}</div>
      <div className="achievement-content">
        <h3 className="achievement-title">Achievement Unlocked!</h3>
        <div className="achievement-name">{achievement.name}</div>
        <div className="achievement-description">{achievement.description}</div>
        <div className="achievement-reward">+{achievement.reward} Fish Points</div>
      </div>
      <button className="dismiss-button" onClick={handleDismiss}>×</button>
    </div>
  );
};

export default AchievementNotification; 