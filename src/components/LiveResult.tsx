import { useTranslation } from 'react-i18next';
import { getBallColor } from '../utils/numberGenerator';
import './LiveResult.css';

interface LiveResultProps {
  numbers: number[];
  bonusNumbers?: number[];
  totalRequired: number;
  isComplete: boolean;
}

const LiveResult = ({ numbers, bonusNumbers, totalRequired, isComplete }: LiveResultProps) => {
  const { t } = useTranslation();

  // Sort numbers when complete
  const displayNumbers = isComplete ? [...numbers].sort((a, b) => a - b) : numbers;
  const displayBonusNumbers = isComplete && bonusNumbers
    ? [...bonusNumbers].sort((a, b) => a - b)
    : bonusNumbers;

  return (
    <div className="live-result">
      <div className="live-result-header">
        <h2>{t('result.title')}</h2>
        <div className="progress-indicator">
          {numbers.length} / {totalRequired}
        </div>
      </div>

      <div className="live-result-content">
        <div className="result-section-live">
          <h3>{t('result.mainNumbers')}</h3>
          <div className="live-numbers-grid">
            {displayNumbers.map((num, index) => (
              <div
                key={`${num}-${index}`}
                className="live-ball"
                style={{ backgroundColor: getBallColor(num) }}
              >
                {num}
              </div>
            ))}
            {/* Empty slots */}
            {!isComplete && Array.from({ length: totalRequired - numbers.length }).map((_, index) => (
              <div key={`empty-${index}`} className="live-ball empty">
                ?
              </div>
            ))}
          </div>
        </div>

        {displayBonusNumbers && displayBonusNumbers.length > 0 && (
          <div className="result-section-live">
            <h3>{t('result.bonusNumbers')}</h3>
            <div className="live-numbers-grid">
              {displayBonusNumbers.map((num, index) => (
                <div
                  key={`bonus-${num}-${index}`}
                  className="live-ball bonus"
                  style={{ backgroundColor: getBallColor(num) }}
                >
                  {num}
                </div>
              ))}
            </div>
          </div>
        )}

        {isComplete && (
          <div className="completion-message">
            <div className="complete-icon">✨</div>
            <p>{t('result.complete') || 'Complete!'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveResult;
