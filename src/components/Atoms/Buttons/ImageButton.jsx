import React from 'react'

import ProfilePicturePlaceholder from '../../../assets/profilePicturePlaceholder'
import styles from './ImageButton.module.css'

const ImageButton = ({
    imgLink,
    onClick
}) => {
    return (
        <button className={`${styles.imageButton} ${imgLink ? '' : styles.svgBtn}`} onClick={onClick}>
            {imgLink ? (
                <img src={imgLink} alt='pb' />
            ) : (
                <ProfilePicturePlaceholder />
            )}
        </button>
    )
}

export default ImageButton