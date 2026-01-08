import { useEffect, useRef } from 'react';

/**
 * Adsterra 팝언더 광고 훅
 * 5회 클릭마다 팝언더 광고 표시
 */
export const usePopAds = () => {
  const clickCount = useRef(0);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    // 컴포넌트 마운트 시 초기화
    clickCount.current = 0;
    scriptLoaded.current = false;
  }, []);

  const trackClick = () => {
    clickCount.current += 1;

    // 5회 클릭마다 팝언더 스크립트 로드 (한 번만)
    if (clickCount.current >= 5 && !scriptLoaded.current) {
      scriptLoaded.current = true;

      const script = document.createElement('script');
      script.src =
        'https://pl28426844.effectivegatecpm.com/d4/93/45/d49345d3dd32d1307dff1500cb18ac23.js';
      script.async = true;
      document.body.appendChild(script);

      console.log('🎯 Popunder 광고 로드 (5회 클릭 달성)');
    }
  };

  return { trackClick };
};
