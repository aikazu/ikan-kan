import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import './AnimatedFeedback.css';

export type FeedbackType = 'points' | 'coins' | 'fish' | 'upgrade' | 'levelUp';

interface FeedbackItem {
  id: string;
  type: FeedbackType;
  value: string | number;
  x: number;
  y: number;
  timestamp: number;
}

interface AnimatedFeedbackProps {
  duration?: number; // Duration in ms that feedback items remain visible
  maxItems?: number; // Maximum number of feedback items to display simultaneously
}

const AnimatedFeedback: React.FC<AnimatedFeedbackProps> = ({
  duration = 1200,
  maxItems = 15
}) => {
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  
  // Clean up expired items
  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = Date.now();
      setFeedbackItems(prevItems => 
        prevItems.filter(item => now - item.timestamp < duration)
      );
    }, 200);
    
    return () => clearInterval(intervalId);
  }, [duration]);
  
  // Add a new feedback item
  const addFeedback = useCallback((
    type: FeedbackType,
    value: string | number,
    x: number,
    y: number
  ) => {
    setFeedbackItems(prevItems => {
      // If we have too many items, remove the oldest ones
      const newItems = [...prevItems];
      if (newItems.length >= maxItems) {
        newItems.splice(0, newItems.length - maxItems + 1);
      }
      
      // Add the new item
      return [
        ...newItems,
        {
          id: `feedback-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          type,
          value,
          x,
          y,
          timestamp: Date.now()
        }
      ];
    });
  }, [maxItems]);
  
  // Expose the addFeedback method to the window object for global access
  useEffect(() => {
    (window as any).gameAnimations = {
      addFeedback
    };
    
    return () => {
      delete (window as any).gameAnimations;
    };
  }, [addFeedback]);
  
  // Get icon and class based on feedback type
  const getFeedbackContent = (item: FeedbackItem) => {
    switch (item.type) {
      case 'points':
        return (
          <div className="feedback-content points">
            +{item.value} FP
          </div>
        );
      case 'coins':
        return (
          <div className="feedback-content coins">
            <span className="feedback-icon">🪙</span> {item.value}
          </div>
        );
      case 'fish':
        return (
          <div className="feedback-content fish">
            <span className="feedback-icon">🐠</span> +{item.value}
          </div>
        );
      case 'upgrade':
        return (
          <div className="feedback-content upgrade">
            <span className="feedback-icon">⬆️</span> {item.value}
          </div>
        );
      case 'levelUp':
        return (
          <div className="feedback-content level-up">
            <span className="feedback-icon">🎉</span> {item.value}
          </div>
        );
      default:
        return (
          <div className="feedback-content">
            {item.value}
          </div>
        );
    }
  };
  
  // Create a portal to render these animations at the root level
  return createPortal(
    <div className="animated-feedback-container">
      {feedbackItems.map(item => (
        <div
          key={item.id}
          className={`feedback-item ${item.type}`}
          style={{
            left: `${item.x}px`,
            top: `${item.y}px`
          }}
        >
          {getFeedbackContent(item)}
        </div>
      ))}
    </div>,
    document.body
  );
};

export default AnimatedFeedback; 