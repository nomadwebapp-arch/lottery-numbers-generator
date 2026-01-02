import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LotteryGame } from '../types/lottery';
import { generateUniqueNumbers, getBallColor } from '../utils/numberGenerator';
import './RouletteMachine.css';

interface RouletteMachineProps {
  game: LotteryGame;
  onNumberUpdate: (numbers: number[], bonusNumbers?: number[]) => void;
  onReset: () => void;
}

const RouletteMachine = ({ game, onNumberUpdate, onReset }: RouletteMachineProps) => {
  const { t } = useTranslation();
  const [selectedMainNumbers, setSelectedMainNumbers] = useState<number[]>([]);
  const [selectedBonusNumbers, setSelectedBonusNumbers] = useState<number[]>([]);
  const [rouletteNumbers, setRouletteNumbers] = useState<number[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  const mainRequired = game.mainNumbers.count;
  const bonusRequired = game.bonusNumbers?.count || 0;
  const totalRequired = mainRequired + bonusRequired;

  // Initialize roulette numbers from both pools
  useEffect(() => {
    const mainRange = game.mainNumbers.max - game.mainNumbers.min + 1;
    const mainCount = Math.min(15, mainRange);
    const mainNums = generateUniqueNumbers(game.mainNumbers.min, game.mainNumbers.max, mainCount);

    let allNumbers = mainNums;

    if (game.bonusNumbers) {
      const bonusRange = game.bonusNumbers.max - game.bonusNumbers.min + 1;
      const bonusCount = Math.min(5, bonusRange);
      const bonusNums = generateUniqueNumbers(game.bonusNumbers.min, game.bonusNumbers.max, bonusCount);
      allNumbers = [...mainNums, ...bonusNums];
    }

    setRouletteNumbers(allNumbers);
    setSelectedMainNumbers([]);
    setSelectedBonusNumbers([]);
  }, [game]);

  // Update parent when numbers change
  useEffect(() => {
    if (selectedMainNumbers.length > 0 || selectedBonusNumbers.length > 0) {
      onNumberUpdate(
        selectedMainNumbers,
        selectedBonusNumbers.length > 0 ? selectedBonusNumbers : undefined
      );
    }
  }, [selectedMainNumbers, selectedBonusNumbers, onNumberUpdate]);

  const handleSpin = () => {
    const currentTotal = selectedMainNumbers.length + selectedBonusNumbers.length;
    if (isSpinning || currentTotal >= totalRequired) return;

    setIsSpinning(true);

    // Determine if we're selecting main or bonus
    const isSelectingBonus = selectedMainNumbers.length >= mainRequired;

    // Get appropriate pool
    let availableNumbers: number[];
    if (isSelectingBonus && game.bonusNumbers) {
      // Select from bonus pool
      const bonusMin = game.bonusNumbers.min;
      const bonusMax = game.bonusNumbers.max;
      availableNumbers = rouletteNumbers.filter(
        (num) => num >= bonusMin && num <= bonusMax && !selectedBonusNumbers.includes(num)
      );
    } else {
      // Select from main pool
      const mainMin = game.mainNumbers.min;
      const mainMax = game.mainNumbers.max;
      availableNumbers = rouletteNumbers.filter(
        (num) => num >= mainMin && num <= mainMax && !selectedMainNumbers.includes(num)
      );
    }

    const selectedIndex = Math.floor(Math.random() * availableNumbers.length);
    const selectedNum = availableNumbers[selectedIndex];

    // Find the index of this number in rouletteNumbers array
    const targetIndex = rouletteNumbers.indexOf(selectedNum);

    // Calculate rotation needed to land on this number
    const segmentAngle = 360 / rouletteNumbers.length;
    const targetAngle = targetIndex * segmentAngle;

    // Add multiple full rotations for spinning effect
    const spins = 5 + Math.random() * 3;
    const fullRotations = Math.floor(spins) * 360;

    // Calculate the desired final angle (where we want to end up)
    const desiredFinalAngle = (360 - targetAngle) % 360;

    // Get current angle position
    const currentAngle = rotation % 360;

    // Calculate how much more we need to rotate
    let rotationNeeded = (desiredFinalAngle - currentAngle + 360) % 360;
    if (rotationNeeded === 0) rotationNeeded = 360; // Ensure at least one full rotation

    // Final target rotation
    const targetRotation = rotation + fullRotations + rotationNeeded;
    setRotation(targetRotation);

    setTimeout(() => {
      if (isSelectingBonus) {
        setSelectedBonusNumbers([...selectedBonusNumbers, selectedNum]);
      } else {
        setSelectedMainNumbers([...selectedMainNumbers, selectedNum]);
      }
      setIsSpinning(false);
    }, 3000);
  };

  const handleResetLocal = () => {
    setSelectedMainNumbers([]);
    setSelectedBonusNumbers([]);
    setRotation(0);

    const mainRange = game.mainNumbers.max - game.mainNumbers.min + 1;
    const mainCount = Math.min(15, mainRange);
    const mainNums = generateUniqueNumbers(game.mainNumbers.min, game.mainNumbers.max, mainCount);

    let allNumbers = mainNums;

    if (game.bonusNumbers) {
      const bonusRange = game.bonusNumbers.max - game.bonusNumbers.min + 1;
      const bonusCount = Math.min(5, bonusRange);
      const bonusNums = generateUniqueNumbers(game.bonusNumbers.min, game.bonusNumbers.max, bonusCount);
      allNumbers = [...mainNums, ...bonusNums];
    }

    setRouletteNumbers(allNumbers);
    onNumberUpdate([], undefined); // Clear parent's live numbers immediately
    onReset();
  };

  const segmentAngle = 360 / rouletteNumbers.length;

  // Create conic gradient for segments
  const createSegmentGradient = () => {
    let gradient = 'conic-gradient(from 0deg, ';
    rouletteNumbers.forEach((num, index) => {
      const color = getBallColor(num);
      const startAngle = (index * segmentAngle);
      const endAngle = ((index + 1) * segmentAngle);
      gradient += `${color} ${startAngle}deg ${endAngle}deg${index < rouletteNumbers.length - 1 ? ', ' : ''}`;
    });
    gradient += ')';
    return gradient;
  };

  const currentTotal = selectedMainNumbers.length + selectedBonusNumbers.length;

  return (
    <div className="roulette-machine">
      <div className="roulette-container-glass">
        <div className="roulette-pointer">▼</div>
        <div
          className={`roulette-wheel-glass ${isSpinning ? 'spinning' : ''}`}
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning ? 'transform 3s cubic-bezier(0.25, 0.1, 0.25, 1)' : 'none',
            background: createSegmentGradient(),
          }}
        >
          {/* Dividing lines */}
          {rouletteNumbers.map((_, index) => (
            <div
              key={`divider-${index}`}
              className="roulette-divider"
              style={{
                transform: `rotate(${index * segmentAngle}deg)`,
              }}
            />
          ))}

          {/* Numbers */}
          {rouletteNumbers.map((num, index) => {
            const angle = index * segmentAngle + segmentAngle / 2;
            return (
              <div
                key={index}
                className="roulette-number"
                style={{
                  transform: `rotate(${angle}deg) translateY(-135px) rotate(${-angle}deg)`,
                }}
              >
                {num}
              </div>
            );
          })}
          <div className="roulette-center-glass">
            <span>{game.gameName}</span>
          </div>
        </div>

        <button
          className="spin-button-glass"
          onClick={handleSpin}
          disabled={isSpinning || currentTotal >= totalRequired}
        >
          {isSpinning ? '...' : t('buttons.spin')}
        </button>
      </div>

      {currentTotal > 0 && (
        <button className="reset-button-glass" onClick={handleResetLocal}>
          {t('buttons.reset')}
        </button>
      )}
    </div>
  );
};

export default RouletteMachine;
