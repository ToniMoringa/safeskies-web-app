import React from 'react';
import styles from './Button.module.css';

function Button({
  children,
  variant = 'primary',
  onClick,
  disabled = false,
  icon: Icon,
}) {
  const buttonClass = `${styles.button} ${styles[variant]}`;

  return (
    <button className={buttonClass} onClick={onClick} disabled={disabled}>
      {Icon && <Icon size={16} className={styles.icon} />}
      {children}
    </button>
  );
}

export default Button;
