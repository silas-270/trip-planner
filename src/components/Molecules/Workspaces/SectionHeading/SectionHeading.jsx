import React from 'react'

import styles from './SectionHeading.module.css'
import TextButton from '../../../Atoms/Buttons/TextButton'

const SectionHeading = ({
    name,
    buttonLabelMobile,
    buttonLabelDesktop,
    onClick
}) => {
    return (
        <div className={styles.sectionWrapper}>
            <div className={styles.leftGroup}>
                <h2 className={styles.sectionHeading}>{name}</h2>
            </div>
            <TextButton
                mobileLabel={buttonLabelMobile}
                desktopLabel={buttonLabelDesktop}
                onClick={onClick} />
        </div>
    )
}

export default SectionHeading;