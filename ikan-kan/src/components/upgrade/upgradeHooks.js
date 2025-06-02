import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  selectFish,
  selectUpgrades,
  selectGamePhase
} from '../../store/gameSelectors'; // Path to gameSelectors.js
import { isUpgradeAvailable, getUpgradesByCategory, getAllUpgrades } from '../../data/upgrades'; // Corrected path for upgrades.js

/**
 * Custom hook to filter upgrades by selected category and availability.
 * @param {string} activeTab - The currently selected upgrade category tab.
 * @param {function} setError - Function to set error messages if issues occur.
 * @returns {Array} An array of available upgrades for the active tab.
 */
export const useFilteredUpgrades = (activeTab, setError) => {
  const fish = useSelector(selectFish);
  const ownedUpgrades = useSelector(selectUpgrades);
  const gamePhase = useSelector(selectGamePhase);

  return useMemo(() => {
    try {
      if (!activeTab) return [];
      
      const gameState = { fish, upgrades: ownedUpgrades, phase: gamePhase };
      const categoryUpgrades = getUpgradesByCategory(activeTab);
      
      if (!Array.isArray(categoryUpgrades)) {
        console.error('getUpgradesByCategory did not return an array:', categoryUpgrades);
        if (setError) setError('Error loading upgrades by category.');
        return [];
      }
      
      const availableUpgrades = categoryUpgrades.filter(upgrade => {
        if (!upgrade || typeof upgrade !== 'object') {
          console.error('Invalid upgrade in category:', upgrade);
          return false; // Skip this invalid upgrade
        }
        return isUpgradeAvailable(upgrade, gameState);
      });
      
      return availableUpgrades;
    } catch (err) {
      console.error('Error filtering upgrades:', err);
      if (setError) setError('Error filtering upgrades. Please try again.');
      return [];
    }
  }, [activeTab, fish, ownedUpgrades, gamePhase, setError]);
};

/**
 * Custom hook to calculate upgrade counts for each category.
 * @param {function} setError - Function to set error messages if issues occur.
 * @returns {Object} An object with counts of available upgrades for each category.
 */
export const useCategoryCounts = (setError) => {
  const fish = useSelector(selectFish);
  const ownedUpgrades = useSelector(selectUpgrades);
  const gamePhase = useSelector(selectGamePhase);

  return useMemo(() => {
    try {
      const gameState = { fish, upgrades: ownedUpgrades, phase: gamePhase };
      const allUpgradesData = getAllUpgrades(); // Renamed to avoid conflict with selector
      const counts = {};
      
      ['clickPower', 'fishingRod', 'autoFishing', 'pond', 'staff', 'vessels', 'special'].forEach(category => {
        const categoryUpgrades = Object.values(allUpgradesData).filter(upgrade => 
          upgrade.category === category && isUpgradeAvailable(upgrade, gameState)
        );
        counts[category] = categoryUpgrades.length;
      });
      
      return counts;
    } catch (err) {
      console.error('Error calculating category counts:', err);
      if (setError) setError('Error calculating category counts. Please try again.');
      return {};
    }
  }, [fish, ownedUpgrades, gamePhase, setError]);
}; 