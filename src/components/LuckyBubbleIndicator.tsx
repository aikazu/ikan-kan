import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { LuckyBubbleType, removeLuckyBubble } from '../store/gameSlice';
import './LuckyBubbleIndicator.css';

// Display names and descriptions for lucky bubble types
const luckyBubbleInfo = {
  [LuckyBubbleType.FEEDING_FRENZY]: {
    name: 'Feeding Frenzy',
    description: '+500% clicking power',
    icon: '🍔'
  },
  [LuckyBubbleType.BREEDING_BOOM]: {
    name: 'Breeding Boom',
    description: '20× breeding chance',
    icon: '🐟'
  },
  [LuckyBubbleType.SCHOOLS_IN]: {
    name: 'School\'s In',
    description: 'All fish produce double FP',
    icon: '🏫'
  },
  [LuckyBubbleType.FISH_SHOWER]: {
    name: 'Fish Shower',
    description: 'Instant FP bonus',
    icon: '🌧️'
  },
  [LuckyBubbleType.VISITOR_RUSH]: {
    name: 'Visitor Rush',
    description: 'Instant cash bonus',
    icon: '👥'
  }
};

const LuckyBubbleIndicator: React.FC = () => {
  const dispatch = useDispatch();
  const { activeLuckyBubbles } = useSelector((state: RootState) => state.game);
  const [timeLeft, setTimeLeft] = useState<Record<string, number>>({});

  // Update timers every second
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const newTimeLeft: Record<string, number> = {};
      
      activeLuckyBubbles.forEach(bubble => {
        const remaining = Math.max(0, (bubble.startTime + bubble.duration - now) / 1000);
        newTimeLeft[bubble.id] = remaining;
        
        // Auto-remove expired bubbles
        if (remaining <= 0) {
          dispatch(removeLuckyBubble(bubble.id));
        }
      });
      
      setTimeLeft(newTimeLeft);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [activeLuckyBubbles, dispatch]);

  if (activeLuckyBubbles.length === 0) {
    return null;
  }

  return (
    <div className="lucky-bubble-container">
      {activeLuckyBubbles.map(bubble => {
        const bubbleType = bubble.type as LuckyBubbleType;
        const info = luckyBubbleInfo[bubbleType] || {
          name: 'Lucky Bubble',
          description: 'Special effect active',
          icon: '✨'
        };
        
        const seconds = timeLeft[bubble.id] || 0;
        const percent = (seconds / (bubble.duration / 1000)) * 100;
        
        return (
          <div key={bubble.id} className="lucky-bubble">
            <div className="lucky-bubble-icon">{info.icon}</div>
            <div className="lucky-bubble-info">
              <div className="lucky-bubble-name">{info.name}</div>
              <div className="lucky-bubble-description">{info.description}</div>
              <div className="lucky-bubble-timer">
                <div 
                  className="lucky-bubble-progress" 
                  style={{ width: `${percent}%` }}
                />
                <span className="lucky-bubble-time">{Math.ceil(seconds)}s</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LuckyBubbleIndicator; 