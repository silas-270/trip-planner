import React, { useEffect } from 'react';
import styles from './Toast.module.css';

const Toast = ({ type, message, onClose, index }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000); // Toast verschwindet nach 3 Sekunden
    return () => clearTimeout(timer);
  }, [onClose]);

  // Dynamisch die richtige Style-Klasse basierend auf dem Typ
  const toastStyles = {
    success: styles.success,
    warn: styles.warn,
    error: styles.error,
    info: styles.info,
  };

  return (
    <div className={`${styles.toast} ${toastStyles[type]}`} style={{ animationDelay: `${index * 0.1}s` }}>
      <div>{message}</div>
    </div>
  );
};

export default Toast;
