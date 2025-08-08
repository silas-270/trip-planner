import React from 'react'

import useDevice from '../../../hooks/Utils/useDevice'
import styles from './TextButton.module.css'

const TextButton = ({
    mobileLabel,
    desktopLabel,
    type,
    onClick
}) => {
    const { isMobile } = useDevice()
    const buttonStyles = {
        green: styles.green,
        red: styles.red
      };
    return (
        <button className={`${styles.textButton}  ${buttonStyles[type]}`} onClick={onClick}>
            {isMobile ? mobileLabel || desktopLabel : desktopLabel || mobileLabel}
        </button>
    );
}

export default TextButton;