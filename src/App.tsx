import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { lotteryGames } from './data/lotteryGames';
import { LotteryGame, GeneratorType, GeneratedNumbers } from './types/lottery';
import LotteryMachine from './components/LotteryMachine';
import RouletteMachine from './components/RouletteMachine';
import SlotMachine from './components/SlotMachine';
import LiveResult from './components/LiveResult';
import ResultModal from './components/ResultModal';
import './App.css';

function App() {
  const { t, i18n } = useTranslation();
  const [selectedGame, setSelectedGame] = useState<LotteryGame>(lotteryGames[17]); // Default: Korea
  const [generatorType, setGeneratorType] = useState<GeneratorType>('lottery');
  const [liveNumbers, setLiveNumbers] = useState<number[]>([]);
  const [liveBonusNumbers, setLiveBonusNumbers] = useState<number[]>([]);
  const [generatedNumbers, setGeneratedNumbers] = useState<GeneratedNumbers | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const totalRequired = selectedGame.mainNumbers.count + (selectedGame.bonusNumbers?.count || 0);
  const prevTotalRef = useRef(0);

  // Change language based on selected country
  const handleGameChange = (gameId: string) => {
    const game = lotteryGames.find((g) => g.id === gameId);
    if (game) {
      setSelectedGame(game);
      // Reset numbers when changing game
      setLiveNumbers([]);
      setLiveBonusNumbers([]);
      setGeneratedNumbers(null);
      setShowModal(false);
      prevTotalRef.current = 0; // Reset previous total
      setResetKey(prev => prev + 1); // Force remount of generator components

      // Set language based on country code
      const languageMap: Record<string, string> = {
        'KR': 'ko',
        'JP': 'ja',
        'DE': 'de',
        'FR': 'fr',
        'ES': 'es',
        'IT': 'it',
        'BR': 'pt',
        'VIKING': 'sv',
      };

      const lang = languageMap[game.countryCode] || 'en';
      i18n.changeLanguage(lang);
    }
  };

  const handleGeneratorTypeChange = (type: GeneratorType) => {
    setGeneratorType(type);
    // Reset numbers when changing generator type
    setLiveNumbers([]);
    setLiveBonusNumbers([]);
    setGeneratedNumbers(null);
    setShowModal(false);
    prevTotalRef.current = 0; // Reset previous total
    setResetKey(prev => prev + 1); // Force remount of generator components
  };

  // Update live numbers
  const handleNumberUpdate = (numbers: number[], bonusNumbers?: number[]) => {
    setLiveNumbers(numbers);
    if (bonusNumbers) {
      setLiveBonusNumbers(bonusNumbers);
    }
  };

  // Check if generation is complete
  useEffect(() => {
    const currentTotal = liveNumbers.length + liveBonusNumbers.length;
    const prevTotal = prevTotalRef.current;

    // Only open modal when numbers JUST became complete (transition from incomplete to complete)
    if (currentTotal === totalRequired && prevTotal < totalRequired && currentTotal > 0) {
      // Sort numbers
      const sortedMain = [...liveNumbers].sort((a, b) => a - b);
      const sortedBonus = liveBonusNumbers.length > 0
        ? [...liveBonusNumbers].sort((a, b) => a - b)
        : undefined;

      const finalNumbers: GeneratedNumbers = {
        mainNumbers: sortedMain,
        bonusNumbers: sortedBonus,
      };

      setGeneratedNumbers(finalNumbers);
      // Auto-open modal after a short delay
      setTimeout(() => {
        setShowModal(true);
      }, 500);
    }

    // Update previous total
    prevTotalRef.current = currentTotal;
  }, [liveNumbers, liveBonusNumbers, totalRequired]);

  const handleReset = () => {
    setLiveNumbers([]);
    setLiveBonusNumbers([]);
    setGeneratedNumbers(null);
    setShowModal(false);
    prevTotalRef.current = 0; // Reset previous total
    setResetKey(prev => prev + 1); // Force remount of generator components
  };

  const handleShare = () => {
    if (generatedNumbers) {
      const text = `${t('result.mainNumbers')}: ${generatedNumbers.mainNumbers.join(', ')}${
        generatedNumbers.bonusNumbers
          ? `\n${t('result.bonusNumbers')}: ${generatedNumbers.bonusNumbers.join(', ')}`
          : ''
      }`;

      if (navigator.share) {
        navigator.share({
          title: t('title'),
          text: text,
        });
      } else {
        navigator.clipboard.writeText(text);
        alert('Copied to clipboard!');
      }
    }
  };

  // Get country flag emoji
  const getFlagEmoji = (countryCode: string): string => {
    const flags: Record<string, string> = {
      'US': '🇺🇸',
      'EU': '🇪🇺',
      'UK': '🇬🇧',
      'DE': '🇩🇪',
      'IT': '🇮🇹',
      'ES': '🇪🇸',
      'FR': '🇫🇷',
      'CA': '🇨🇦',
      'BR': '🇧🇷',
      'AU': '🇦🇺',
      'JP': '🇯🇵',
      'VIKING': '🇳🇴',
      'KR': '🇰🇷',
      'ZA': '🇿🇦',
      'NZ': '🇳🇿',
    };
    return flags[countryCode] || '🌍';
  };

  const isComplete = liveNumbers.length + liveBonusNumbers.length === totalRequired;

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">{t('title')}</h1>
      </header>

      <main className="app-main">
        <div className="controls">
          <div className="control-group">
            <label htmlFor="game-select">{t('selectCountry')}</label>
            <select
              id="game-select"
              value={selectedGame.id}
              onChange={(e) => handleGameChange(e.target.value)}
              className="select-box"
            >
              {lotteryGames.map((game) => (
                <option key={game.id} value={game.id}>
                  {getFlagEmoji(game.countryCode)} {game.countryName} - {game.gameName}
                </option>
              ))}
            </select>
          </div>

          <div className="control-group">
            <label htmlFor="generator-select">{t('selectGenerator')}</label>
            <select
              id="generator-select"
              value={generatorType}
              onChange={(e) => handleGeneratorTypeChange(e.target.value as GeneratorType)}
              className="select-box"
            >
              <option value="lottery">{t('generatorTypes.lottery')}</option>
              <option value="roulette">{t('generatorTypes.roulette')}</option>
              <option value="slot">{t('generatorTypes.slot')}</option>
            </select>
          </div>
        </div>

        <div className="content-layout">
          <div className="generator-area">
            {generatorType === 'lottery' && (
              <LotteryMachine
                key={`lottery-${resetKey}`}
                game={selectedGame}
                onNumberUpdate={handleNumberUpdate}
                onReset={handleReset}
              />
            )}
            {generatorType === 'roulette' && (
              <RouletteMachine
                key={`roulette-${resetKey}`}
                game={selectedGame}
                onNumberUpdate={handleNumberUpdate}
                onReset={handleReset}
              />
            )}
            {generatorType === 'slot' && (
              <SlotMachine
                key={`slot-${resetKey}`}
                game={selectedGame}
                onNumberUpdate={handleNumberUpdate}
                onReset={handleReset}
              />
            )}
          </div>

          <div className="result-area">
            <LiveResult
              numbers={liveNumbers}
              bonusNumbers={liveBonusNumbers.length > 0 ? liveBonusNumbers : undefined}
              totalRequired={totalRequired}
              isComplete={isComplete}
            />
          </div>
        </div>
      </main>

      {showModal && generatedNumbers && (
        <ResultModal
          numbers={generatedNumbers}
          onClose={() => setShowModal(false)}
          onReset={handleReset}
          onShare={handleShare}
        />
      )}
    </div>
  );
}

export default App;
