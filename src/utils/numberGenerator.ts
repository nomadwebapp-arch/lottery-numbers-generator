import { LotteryGame, GeneratedNumbers } from '../types/lottery';

/**
 * Generate unique random numbers for lottery
 */
export const generateLotteryNumbers = (game: LotteryGame): GeneratedNumbers => {
  const mainNumbers = generateUniqueNumbers(
    game.mainNumbers.min,
    game.mainNumbers.max,
    game.mainNumbers.count
  ).sort((a, b) => a - b);

  const bonusNumbers = game.bonusNumbers
    ? generateUniqueNumbers(
        game.bonusNumbers.min,
        game.bonusNumbers.max,
        game.bonusNumbers.count
      ).sort((a, b) => a - b)
    : undefined;

  return { mainNumbers, bonusNumbers };
};

/**
 * Generate unique random numbers within a range
 */
export const generateUniqueNumbers = (
  min: number,
  max: number,
  count: number
): number[] => {
  const numbers = new Set<number>();

  while (numbers.size < count) {
    const num = Math.floor(Math.random() * (max - min + 1)) + min;
    numbers.add(num);
  }

  return Array.from(numbers);
};

/**
 * Get ball color based on number range
 * 0-9: yellow, 10-19: red, 20-29: blue, 30-39: green, 40-49: purple, 50+: orange
 */
export const getBallColor = (num: number): string => {
  if (num < 10) return '#FFD700'; // yellow (includes 0 for Germany bonus)
  if (num < 20) return '#FF4444'; // red
  if (num < 30) return '#4444FF'; // blue
  if (num < 40) return '#44FF44'; // green
  if (num < 50) return '#AA44FF'; // purple
  return '#FF8844'; // orange
};
