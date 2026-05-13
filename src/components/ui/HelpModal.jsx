import React from 'react';
import Modal from './Modal';
import styles from './HelpModal.module.css';

function HelpModal({ isOpen, onClose }) {
  const tips = [
    { icon: 'search', title: 'Search', description: 'Type a city name to fly the map there' },
    { icon: 'map', title: 'Map Controls', description: 'Use + / - to zoom, location button to find yourself, fullscreen for expanded view' },
    { icon: 'alerts', title: 'Alerts', description: 'Click Respond to take ownership, Resolve to close active alerts' },
    { icon: 'circles', title: 'Map Circles', description: 'Colored circles show affected zones with severity indicators' },
    { icon: 'fullscreen', title: 'Keyboard Shortcut', description: 'Press ESC to exit fullscreen mode' }
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Help & Tips">
      <div className={styles.content}>
        {tips.map((tip, index) => (
          <div key={index} className={styles.tipItem}>
            <div className={styles.tipIcon}>•</div>
            <div className={styles.tipContent}>
              <h4 className={styles.tipTitle}>{tip.title}</h4>
              <p className={styles.tipDescription}>{tip.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}

export default HelpModal;