import { useTranslation } from 'react-i18next';
import { GeneratedNumbers } from '../types/lottery';
import { getBallColor } from '../utils/numberGenerator';
import './ResultModal.css';

interface ResultModalProps {
  numbers: GeneratedNumbers;
  onClose: () => void;
  onReset: () => void;
  onShare: () => void;
}

const ResultModal = ({ numbers, onClose, onReset, onShare }: ResultModalProps) => {
  const { t } = useTranslation();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">{t('result.title')}</h2>

        <div className="result-section">
          <h3>{t('result.mainNumbers')}</h3>
          <div className="result-numbers">
            {numbers.mainNumbers.map((num, index) => (
              <div
                key={index}
                className="result-ball"
                style={{ backgroundColor: getBallColor(num) }}
              >
                {num}
              </div>
            ))}
          </div>
        </div>

        {numbers.bonusNumbers && numbers.bonusNumbers.length > 0 && (
          <div className="result-section">
            <h3>{t('result.bonusNumbers')}</h3>
            <div className="result-numbers">
              {numbers.bonusNumbers.map((num, index) => (
                <div
                  key={index}
                  className="result-ball bonus"
                  style={{ backgroundColor: getBallColor(num) }}
                >
                  {num}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="modal-buttons">
          <button className="modal-button reset-btn" onClick={onReset}>
            {t('buttons.reset')}
          </button>
          <button className="modal-button share-btn" onClick={onShare}>
            {t('buttons.share')}
          </button>
          <button className="modal-button close-btn" onClick={onClose}>
            {t('buttons.close')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultModal;
