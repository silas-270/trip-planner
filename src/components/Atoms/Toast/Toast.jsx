import React from 'react'

import styles from './Toast.module.css';

const Toast = ({ 
    type, 
    message, 
    index 
}) => {
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
