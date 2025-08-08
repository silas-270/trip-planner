import React from 'react'

import styles from './AccommodationContainer.module.css'
import { AccommodationCard } from '../../../Molecules/Accommodations/AccommodationCard/AccommodationCard'

const WorkspaceContainer = ({
    accommodations,
    gridStyle
}) => {
    return (
        <>
            {(accommodations && accommodations.length > 0) ? (
                <div
                    className={`${styles.accommodationContainer} glassmorphic`}
                    style={gridStyle}
                >
                    {accommodations.map(acc => (
                        <AccommodationCard key={acc.id} {...acc} />
                    ))}
                </div>
            ) : (
                <div className={`${styles.emptyMessageContainer} glassmorphic`}>
                    <div className={styles.emptyMessage}>Keine Unterkünfte.</div>
                </div>
            )}
        </>
    )
}

export default WorkspaceContainer