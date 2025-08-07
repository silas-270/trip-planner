import React from 'react'

import useDevice from '../../../hooks/Utils/useDevice'
import styles from './TextButton.module.css'

const TextButton = ({
    mobileLabel,
    desktopLabel,
    onClick
}) => {
    const { isMobile } = useDevice()
    return (
        <button className={styles.textButton} onClick={onClick}>
            {isMobile ? mobileLabel || desktopLabel : desktopLabel || mobileLabel}
        </button>
    );
}

export default TextButton;