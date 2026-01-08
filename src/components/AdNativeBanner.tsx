import { useEffect } from 'react';

const AdNativeBanner = () => {
  useEffect(() => {
    // Adsterra Native Banner 스크립트 로드
    const script = document.createElement('script');
    script.src = 'https://pl28426847.effectivegatecpm.com/32f269016e061100edff0f0c2c75decb/invoke.js';
    script.async = true;
    script.setAttribute('data-cfasync', 'false');

    const container = document.getElementById('native-banner-container');
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
      id="native-banner-container"
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px 0',
      }}
    >
      <div id="container-32f269016e061100edff0f0c2c75decb"></div>
    </div>
  );
};

export default AdNativeBanner;
