import React, { useEffect, useState } from 'react';
import './OfflineEarningsModal.css';

interface OfflineEarningsData {
  points: string;
  timeDiff: string;
  newFish: number;
  wasLongOffline: boolean;
}

interface OfflineEarningsModalProps {
  getOfflineEarnings: () => OfflineEarningsData | null;
}

const OfflineEarningsModal: React.FC<OfflineEarningsModalProps> = ({ getOfflineEarnings }) => {
  const [earnings, setEarnings] = useState<OfflineEarningsData | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check for offline earnings on component mount
    const offlineEarnings = getOfflineEarnings();
    if (offlineEarnings) {
      setEarnings(offlineEarnings);
      setIsVisible(true);
    }
  }, [getOfflineEarnings]);

  const closeModal = () => {
    setIsVisible(false);
  };

  if (!isVisible || !earnings) {
    return null;
  }

  return (
    <div className="offline-earnings-modal-overlay">
      <div className="offline-earnings-modal">
        <h2>Welcome Back!</h2>
        
        <div className="offline-earnings-content">
          <p>While you were gone for <strong>{earnings.timeDiff}</strong>:</p>
          
          <div className="earnings-detail">
            <div className="earnings-icon">💰</div>
            <div className="earnings-text">
              Your fish generated <strong>{earnings.points} Fish Points</strong>
            </div>
          </div>
          
          {earnings.newFish > 0 && (
            <div className="earnings-detail">
              <div className="earnings-icon">🐠</div>
              <div className="earnings-text">
                <strong>{earnings.newFish}</strong> new fish spawned in your tank
              </div>
            </div>
          )}
          
          {earnings.wasLongOffline && (
            <div className="offline-note">
              <strong>Note:</strong> Offline earnings are capped at 8 hours.
            </div>
          )}
        </div>
        
        <button className="close-button" onClick={closeModal}>
          Claim Rewards
        </button>
      </div>
    </div>
  );
};

export default OfflineEarningsModal; 