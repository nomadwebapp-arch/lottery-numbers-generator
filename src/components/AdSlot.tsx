import { useEffect } from 'react';
import './AdSlot.css';

interface AdSlotProps {
  slot: string; // AdSense slot ID
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical';
  responsive?: boolean;
  className?: string;
}

const AdSlot = ({ slot, format = 'auto', responsive = true, className = '' }: AdSlotProps) => {
  useEffect(() => {
    // Load AdSense script if not already loaded
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  return (
    <div className={`ad-slot-container ${className}`}>
      <div className="ad-label">Advertisement</div>
      {/*
        Google AdSense Ad Unit

        실제 운영 시 아래 주석을 해제하고 data-ad-client, data-ad-slot을
        본인의 Google AdSense 정보로 교체하세요
      */}
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // 여기에 본인의 AdSense ID 입력
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />

      {/* 개발 중 플레이스홀더 */}
      <div className="ad-placeholder">
        <div className="ad-placeholder-content">
          <span>📢</span>
          <p>Google AdSense</p>
          <small>광고가 여기에 표시됩니다</small>
        </div>
      </div>
    </div>
  );
};

export default AdSlot;
