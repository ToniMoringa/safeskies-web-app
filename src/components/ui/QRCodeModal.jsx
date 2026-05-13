import React from 'react';
import QRCode from 'qrcode.react';
import Modal from './Modal';
import styles from './QRCodeModal.module.css';

function QRCodeModal({ isOpen, onClose }) {
  const appStoreUrl = 'https://apps.apple.com/app/placeholder';
  const googlePlayUrl = 'https://play.google.com/store/apps/placeholder';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Get the SafeSkies App">
      <div className={styles.content}>
        <div className={styles.qrContainer}>
          <QRCode
            value={appStoreUrl}
            size={180}
            bgColor="#ffffff"
            fgColor="#000000"
            level="H"
          />
        </div>
        <p className={styles.instructions}>
          Scan with your phone's camera or QR code scanner app
        </p>
        <div className={styles.storeButtons}>
          <a
            href={appStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.storeLink}
          >
            <img
              src="https://developer.apple.com/app-store/marketing/guidelines/images/badge-download-on-the-app-store.svg"
              alt="Download on App Store"
              className={styles.storeBadge}
            />
          </a>
          <a
            href={googlePlayUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.storeLink}
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
              alt="Get it on Google Play"
              className={styles.storeBadge}
            />
          </a>
        </div>
      </div>
    </Modal>
  );
}

export default QRCodeModal;
