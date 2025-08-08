import React from 'react'

import useDevice from '../../../../hooks/Utils/useDevice'
import styles from './SectionHeading.module.css'
import TextButton from '../../../Atoms/Buttons/TextButton'

const SectionHeading = ({
    sectionHeadlineDesktop,
    sectionHeadlineMobile,
    buttonLabelMobile,
    buttonLabelDesktop,
    onClick
}) => {
    const { isMobile } = useDevice()
    return (
        <div className={styles.sectionWrapper}>
            <div className={styles.leftGroup}>
                <h2 className={styles.sectionHeading}>
                    {isMobile ? sectionHeadlineMobile || sectionHeadlineDesktop : sectionHeadlineDesktop || sectionHeadlineMobile}
                </h2>
            </div>
            <TextButton
                mobileLabel={buttonLabelMobile}
                desktopLabel={buttonLabelDesktop}
                type='green'
                onClick={onClick} />
        </div>
    )
}

export default SectionHeading;