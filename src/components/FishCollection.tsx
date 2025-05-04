import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { FishType, FISH_PROPERTIES, FishRarity, SpecialAbility } from '../types/game';
import './FishCollection.css';

// Map rarity to display names and colors
const rarityDisplay: Record<FishRarity, { name: string, color: string }> = {
  [FishRarity.COMMON]: { name: 'Common', color: '#aaaaaa' },
  [FishRarity.UNCOMMON]: { name: 'Uncommon', color: '#4caf50' },
  [FishRarity.RARE]: { name: 'Rare', color: '#2196f3' },
  [FishRarity.EPIC]: { name: 'Epic', color: '#9c27b0' },
  [FishRarity.LEGENDARY]: { name: 'Legendary', color: '#ff9800' },
};

// Map abilities to readable names and descriptions
const abilityDisplay: Record<SpecialAbility, { name: string, description: string }> = {
  [SpecialAbility.FEEDING_BOOST]: { 
    name: 'Feeding Boost', 
    description: 'Increases chance of Feeding Frenzy bonus by 30% per fish'
  },
  [SpecialAbility.BREEDING_MASTER]: { 
    name: 'Breeding Master', 
    description: 'Increases breeding rate for all fish by 20% per fish'
  },
  [SpecialAbility.LUCKY_CHARM]: { 
    name: 'Lucky Charm', 
    description: 'Increases chance of Lucky Bubbles by 25% per fish'
  },
  [SpecialAbility.POINT_MULTIPLIER]: { 
    name: 'Point Multiplier', 
    description: 'Increases points earned from clicking by 10% per fish'
  },
  [SpecialAbility.FEEDER_EFFICIENCY]: { 
    name: 'Feeder Efficiency', 
    description: 'Makes feeders 15% more efficient per fish'
  },
  [SpecialAbility.DISCOVERY_BOOST]: { 
    name: 'Discovery Boost', 
    description: 'Increases chance of discovering new fish by 50% per fish'
  },
};

interface FishDetailsProps {
  fishType: FishType;
  onClose: () => void;
}

// Component to display detailed info about a selected fish
const FishDetails: React.FC<FishDetailsProps> = ({ fishType, onClose }) => {
  const props = FISH_PROPERTIES[fishType];
  const rarityInfo = rarityDisplay[props.rarity];
  
  return (
    <div className="fish-details">
      <div className="fish-details-header">
        <h3>{fishType.charAt(0).toUpperCase() + fishType.slice(1)}</h3>
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      
      <div className="fish-image-large">
        <img 
          src="/fish.png" 
          alt={fishType}
          style={{
            filter: fishType === FishType.GOLDFISH ? 'sepia(100%) saturate(300%) brightness(70%) hue-rotate(20deg)' : 
                   fishType === FishType.TETRA ? 'sepia(100%) saturate(300%) brightness(70%) hue-rotate(300deg)' :
                   fishType === FishType.ANGELFISH ? 'grayscale(50%) brightness(120%)' :
                   fishType === FishType.CLOWNFISH ? 'sepia(100%) saturate(300%) brightness(70%) hue-rotate(30deg)' :
                   fishType === FishType.DISCUS ? 'sepia(100%) saturate(300%) brightness(70%) hue-rotate(180deg)' : 
                   fishType === FishType.BETTA ? 'sepia(100%) saturate(200%) brightness(70%) hue-rotate(330deg)' :
                   fishType === FishType.MOLLY ? 'sepia(100%) saturate(150%) brightness(90%) hue-rotate(160deg)' :
                   fishType === FishType.PLATY ? 'sepia(100%) saturate(250%) brightness(80%) hue-rotate(10deg)' :
                   fishType === FishType.SWORDTAIL ? 'sepia(100%) saturate(250%) brightness(70%) hue-rotate(350deg)' :
                   fishType === FishType.KOI ? 'sepia(100%) saturate(300%) brightness(90%) hue-rotate(5deg)' :
                   fishType === FishType.AROWANA ? 'sepia(100%) saturate(300%) brightness(60%) hue-rotate(250deg)' :
                   'none'
          }}
        />
      </div>
      
      <div className="fish-stats">
        <div className="stat-row">
          <div className="stat-label">Rarity:</div>
          <div className="stat-value" style={{ color: rarityInfo.color }}>
            {rarityInfo.name}
          </div>
        </div>
        
        <div className="stat-row">
          <div className="stat-label">Points Per Second:</div>
          <div className="stat-value">{props.basePointsPerSecond.toFixed(1)}</div>
        </div>
        
        <div className="stat-row">
          <div className="stat-label">Breeding Rate:</div>
          <div className="stat-value">{Math.round(props.breedingRate * 100)}%</div>
        </div>
        
        {props.specialAbility && (
          <div className="special-ability">
            <div className="ability-header">
              Special Ability: {abilityDisplay[props.specialAbility].name}
            </div>
            <div className="ability-description">
              {abilityDisplay[props.specialAbility].description}
            </div>
          </div>
        )}
        
        <div className="fish-description">
          {props.description}
        </div>
      </div>
    </div>
  );
};

// Main component to display the collection of discovered fish
const FishCollection: React.FC = () => {
  const discoveredFishTypes = useSelector((state: RootState) => state.fish.discoveredFishTypes);
  const currentTank = useSelector((state: RootState) => state.tank.currentTank);
  const [selectedFish, setSelectedFish] = useState<FishType | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  
  const openCollection = () => {
    setIsOpen(true);
  };
  
  const closeCollection = () => {
    setIsOpen(false);
    setSelectedFish(null);
  };
  
  const selectFish = (fishType: FishType) => {
    setSelectedFish(fishType);
  };
  
  const closeDetails = () => {
    setSelectedFish(null);
  };
  
  // Count each type of fish in the tank
  const fishCounts = currentTank.fish.reduce((counts: Record<FishType, number>, fish) => {
    counts[fish.type] = (counts[fish.type] || 0) + 1;
    return counts;
  }, {} as Record<FishType, number>);
  
  if (!isOpen) {
    return (
      <button className="collection-toggle-button" onClick={openCollection}>
        Fish Collection <span className="collection-counter">({currentTank.fish.length})</span>
      </button>
    );
  }
  
  return (
    <div className="collection-overlay">
      <div className="fish-collection">
        <div className="collection-header">
          <h2>Fish Collection ({discoveredFishTypes.length}/{Object.keys(FishType).length})</h2>
          <button className="close-button" onClick={closeCollection}>×</button>
        </div>
        
        {selectedFish ? (
          <FishDetails fishType={selectedFish} onClose={closeDetails} />
        ) : (
          <div className="fish-grid">
            {Object.values(FishType).map(fishType => {
              const isDiscovered = discoveredFishTypes.includes(fishType);
              const props = FISH_PROPERTIES[fishType];
              const count = fishCounts[fishType] || 0;
              
              return (
                <div 
                  key={fishType}
                  className={`fish-tile ${isDiscovered ? 'discovered' : 'undiscovered'}`}
                  onClick={() => isDiscovered && selectFish(fishType)}
                >
                  {isDiscovered ? (
                    <>
                      <div className="fish-image">
                        <img 
                          src="/fish.png" 
                          alt={fishType}
                          style={{
                            filter: fishType === FishType.GOLDFISH ? 'sepia(100%) saturate(300%) brightness(70%) hue-rotate(20deg)' : 
                                  fishType === FishType.TETRA ? 'sepia(100%) saturate(300%) brightness(70%) hue-rotate(300deg)' :
                                  fishType === FishType.ANGELFISH ? 'grayscale(50%) brightness(120%)' :
                                  fishType === FishType.CLOWNFISH ? 'sepia(100%) saturate(300%) brightness(70%) hue-rotate(30deg)' :
                                  fishType === FishType.DISCUS ? 'sepia(100%) saturate(300%) brightness(70%) hue-rotate(180deg)' : 
                                  fishType === FishType.BETTA ? 'sepia(100%) saturate(200%) brightness(70%) hue-rotate(330deg)' :
                                  fishType === FishType.MOLLY ? 'sepia(100%) saturate(150%) brightness(90%) hue-rotate(160deg)' :
                                  fishType === FishType.PLATY ? 'sepia(100%) saturate(250%) brightness(80%) hue-rotate(10deg)' :
                                  fishType === FishType.SWORDTAIL ? 'sepia(100%) saturate(250%) brightness(70%) hue-rotate(350deg)' :
                                  fishType === FishType.KOI ? 'sepia(100%) saturate(300%) brightness(90%) hue-rotate(5deg)' :
                                  fishType === FishType.AROWANA ? 'sepia(100%) saturate(300%) brightness(60%) hue-rotate(250deg)' :
                                  'none'
                          }}
                        />
                      </div>
                      <div className="fish-info">
                        <div className="fish-name">
                          {fishType.charAt(0).toUpperCase() + fishType.slice(1)}
                        </div>
                        <div 
                          className="fish-rarity" 
                          style={{ color: rarityDisplay[props.rarity].color }}
                        >
                          {rarityDisplay[props.rarity].name}
                        </div>
                        {count > 0 && (
                          <div className="fish-count">
                            Owned: {count}
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="undiscovered-placeholder">
                      <div className="question-mark">?</div>
                      <div>Not Discovered</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
        
        <div className="collection-footer">
          Click on a fish to see details
        </div>
      </div>
    </div>
  );
};

export default FishCollection; 