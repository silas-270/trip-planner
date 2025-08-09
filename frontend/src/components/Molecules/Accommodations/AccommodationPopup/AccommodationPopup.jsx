import React from 'react'

import { useState } from 'react'
import { IconT, IconBooking, IconImmoScout } from '../../../../assets/svg'

import styles from './AccommodationPopup.module.css'

const AccommodationPopup = ({
    createMethod,   setCreateMethod,
    scraperUrl,     setScraperUrl,
    name,           setName,
    price,          setPrice,
    location,       setLocation,
    rating,         setRating
}) => {
    const providers = [
        {
            id: 'raw',
            label: 'Manuell eingeben',
            icon: <IconT size={40} />,
        },
        {
            id: 'scraperBooking',
            label: 'Booking URL',
            icon: <IconBooking size={35} />,
        },
        {
            id: 'immoscout',
            label: 'ImmoScout URL',
            icon: <IconImmoScout size={30} />,
        },
    ]

    return (
        <div className={styles.inputWrapper}>
            <div className={styles.buttonBar}>
                {providers.map((provider) => {
                    const isActive = createMethod === provider.id
                    return (
                        <button
                            key={provider.id}
                            className={`${styles.inputModeButton} ${isActive ? styles.active : styles.inactive}`}
                            onClick={() => setCreateMethod(provider.id)}
                        >
                            <span className={styles.iconWrapper}>
                                <span className={styles.icon}>{provider.icon}</span>
                            </span>
                            <span className={styles.labelWrapper}>
                                {provider.label}
                            </span>
                        </button>
                    )
                })}
            </div>
            {(createMethod === 'raw') ? (
                <>
                    <input
                        className={`${styles.Input} glassmorphic`}
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder='Unterkunftsname'
                    />
                    <input
                        className={`${styles.Input} glassmorphic`}
                        value={location}
                        onChange={e => setLocation(e.target.value)}
                        placeholder='Ort'
                    />
                    <div className={styles.doubleInputRow}>
                        <input
                            className={`${styles.Input} glassmorphic`}
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                            placeholder='Preis'
                        />
                        <input
                            className={`${styles.Input} glassmorphic`}
                            value={rating}
                            onChange={e => setRating(e.target.value)}
                            placeholder='Bewertung'
                        />
                    </div>
                </>
            ) : (
                <input
                    className={`${styles.Input} glassmorphic`}
                    value={scraperUrl}
                    onChange={e => setScraperUrl(e.target.value)}
                    placeholder='Booking URL'
                />
            )}
        </div>
    )
}

export default AccommodationPopup