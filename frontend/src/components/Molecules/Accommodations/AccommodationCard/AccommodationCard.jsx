import React from 'react'

import { useState, useEffect, useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import useAccommodations from '../../../../hooks/useAccommodations'
import { useConfirm } from '../../../../hooks/Utils/useConfirm'
import ContextMenu from '../../ContextMenu/ContextMenu'

import VoteBox from './VoteBox/VoteBox'
import ImagePlaceholder from '../../../../assets/ImagePlaceholder'
import { Edit } from '../../../../assets/svg'
import styles from './AccommodationCard.module.css'

export function AccommodationCard({ id, name, location, price, rating, images, url, voteState, voteCount }) {
    const { deleteAccom, voteAccom } = useAccommodations()
    const [confirm, ConfirmDialog] = useConfirm()

    const swiperRef = useRef(null)

    const uniqueId = `swiper-${id}`
    const hasImages = images && images.length > 0
    const hasMultipleImages = images && images.length > 1

    const [showEditMenu, setShowEditMenu] = useState(false)

    useEffect(() => {
        if (swiperRef.current) {
            swiperRef.current.slideTo(0)
        }
    }, [images])

    const handleDeleteCardClick = async () => {
        if (!(await confirm(`Bestätige Löschen von ${name}`))) return
        setShowEditMenu(false)
        try {
            await deleteAccom(id)
        } catch (err) {
            console.error('Failed to delete Accommodation', err)
        }
    }

    const handleEditCardClick = () => {
        onDeleteAccommodation(id)
        setShowEditMenu(false)
    }

    return (
        <div className={styles.card} data-id={id}>
            {hasImages ? (
                <Swiper
                    modules={[Navigation, Pagination]}
                    onSwiper={(swiper) => (swiperRef.current = swiper)}
                    navigation={hasMultipleImages ? {
                        nextEl: `#${uniqueId}-next`,
                        prevEl: `#${uniqueId}-prev`,
                    } : false}
                    pagination={hasMultipleImages ? {
                        el: `#${uniqueId}-pagination`,
                        clickable: true,
                    } : false}
                    observer={true}
                    observeParents={true}
                >
                    {images.map(({ src, alt }, index) => (
                        <SwiperSlide key={index}>
                            <img src={src} alt={alt} />
                        </SwiperSlide>
                    ))}

                    {hasMultipleImages && (
                        <>
                            <div id={`${uniqueId}-prev`} className='swiper-button-prev'></div>
                            <div id={`${uniqueId}-next`} className='swiper-button-next'></div>
                            <div id={`${uniqueId}-pagination`} className='swiper-pagination'></div>
                        </>
                    )}
                </Swiper>
            ) : (
                <div className={styles.placeholderWrapper}>
                    <ImagePlaceholder color='#343434' />
                </div>
            )}

            {/* Information Section */}
            <div className={styles.info}>
                <div className={styles.rowTop}>
                    <h2>
                        <a href={url} target='_blank' rel='noopener noreferrer' className={styles.nameLink}>
                            {name}
                        </a>
                    </h2>
                    <div className={styles.price}>€ {price ?? '–'}</div>
                </div>
                <div className={styles.rowBottom}>
                    <div className={styles.location}>{location}</div>
                    <div className={styles.rating}>⭐ {rating?.toFixed(1) ?? '–'}</div>
                </div>
            </div>

            <div className={styles.footer}>
                {/* Votebox Section */}
                <VoteBox
                    id={id}
                    voteState={voteState}
                    voteCount={voteCount}
                    voteAccom={voteAccom}
                />

                {/* Edit Popup */}
                <div style={{ position: 'relative' }}>
                    <div className={styles.btnWrapper}>
                        <button className={styles.editBtn} onClick={() => setShowEditMenu(true)}>
                            <Edit size={10} />
                        </button>
                    </div>
                    {showEditMenu && (
                        <ContextMenu
                            showEditMenu={showEditMenu}
                            setShowEditMenu={setShowEditMenu}
                            handleDeleteCardClick={handleDeleteCardClick}
                            handleEditCardClick={handleEditCardClick}
                        />
                    )}
                    {ConfirmDialog}
                </div>
            </div>
        </div>
    )
}