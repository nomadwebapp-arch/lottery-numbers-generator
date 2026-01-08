import { useEffect } from 'react';

const AdBottomBanner = () => {
  useEffect(() => {
    // Adsterra 배너 설정
    // @ts-ignore
    window.atOptions = {
      key: '1bb109ed1d4f2c442e7d7d9109348df0',
      format: 'iframe',
      height: 50,
      width: 320,
      params: {},
    };

    // 스크립트 로드
    const script = document.createElement('script');
    script.src =
      'https://www.highperformanceformat.com/1bb109ed1d4f2c442e7d7d9109348df0/invoke.js';
    script.async = true;

    const container = document.getElementById('bottom-banner-container');
    if (container) {
      container.appendChild(script);
    } else {
      document.body.appendChild(script);
    }

    return () => {
      // 클린업: 스크립트 제거
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <div
      id="bottom-banner-container"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        height: '50px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        zIndex: 1000,
        padding: '0',
      }}
    ></div>
  );
};

export default AdBottomBanner;
