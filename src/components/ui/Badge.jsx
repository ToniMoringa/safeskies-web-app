import React from 'react';
import styles from './Badge.module.css';

function Badge({ children, severity = 'low' }) {
  const badgeClass = `${styles.badge} ${styles[severity]}`;

  return <span className={badgeClass}>{children}</span>;
}

export default Badge;
