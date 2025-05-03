/**
 * Format large numbers with appropriate suffixes
 * @param num Number to format
 * @returns Formatted string with appropriate suffix (K, M, B, T, etc.)
 */
export const formatNumber = (num: number): string => {
  if (num < 1000) return Math.floor(num).toString();
  
  const suffixes = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];
  const exponent = Math.min(Math.floor(Math.log10(num) / 3), suffixes.length - 1);
  const divisor = Math.pow(10, exponent * 3);
  const shortNum = num / divisor;
  
  return `${shortNum.toFixed(1)}${suffixes[exponent]}`;
}; 