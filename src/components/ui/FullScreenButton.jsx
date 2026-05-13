import React, { useState, useEffect, useRef } from 'react';
import { Maximize, Minimize } from 'lucide-react';
import styles from './FullScreenButton.module.css';

function FullscreenButton({ targetRef }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () =>
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    // Get the map container element
    const mapElement =
      targetRef?.current?.getContainer?.() || targetRef?.current;

    if (!document.fullscreenElement) {
      // Enter fullscreen
      if (mapElement?.requestFullscreen) {
        mapElement.requestFullscreen();
      } else if (mapElement?.webkitRequestFullscreen) {
        mapElement.webkitRequestFullscreen();
      } else if (mapElement?.msRequestFullscreen) {
        mapElement.msRequestFullscreen();
      }
    } else {
      // Exit fullscreen
      document.exitFullscreen();
    }
  };

  return (
    <button
      onClick={toggleFullscreen}
      className={styles.button}
      ref={buttonRef}
    >
      {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
    </button>
  );
}

export default FullscreenButton;
