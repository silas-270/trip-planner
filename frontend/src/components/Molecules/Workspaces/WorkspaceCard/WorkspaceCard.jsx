import React from 'react'

import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import ImagePlaceholder from '../../../../assets/ImagePlaceholder'
import styles from './WorkspaceCard.module.css'

const WorkspaceCard = ({
    id,
    name,
    image
}) => {
    const navigate = useNavigate()

    const forwardToWorkspace = () => {
        navigate(`/ws/${id}`)
    }

    return (
        <div
            className={styles.card}
            data-id={id}
            onClick={forwardToWorkspace}
        >
            <div className={styles.imgbox}>
                <img src={image.src} alt={image.alt || ''} />
            </div>
            <div className={styles.info}>
                <h2>{name}</h2>
            </div>
        </div>
    )
}

const WorkspacePreview = ({
    name,
    images,
    onSlideChange
}) => {
    const swiperRef = useRef(null)
    const hasImages = images && images.length > 0
    const hasMultipleImages = images && images.length > 1

    useEffect(() => {
        if (swiperRef.current) {
            swiperRef.current.slideTo(0)
            if (onSlideChange) onSlideChange(0)
        }
    }, [images])

    return (
        <div className={styles.PreviewCard} data-name={name}>
            {hasImages ? (
                <Swiper
                    modules={[Navigation, Pagination]}
                    onSwiper={(swiper) => (swiperRef.current = swiper)}
                    onSlideChange={(swiper) => {
                        if (onSlideChange) onSlideChange(swiper.activeIndex)
                    }}
                    navigation={hasMultipleImages ? {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    } : false}
                    pagination={hasMultipleImages ? {
                        el: 'swiper-pagination up',
                        clickable: true,
                    } : false}
                    observer={true}
                    observeParents={true}
                >
                    {(images || []).map(({ src, alt }, index) => (
                        <SwiperSlide key={index}>
                            <img src={src} alt={alt} className='crop' />
                        </SwiperSlide>
                    ))}

                    {hasMultipleImages && (
                        <>
                            <div className='swiper-button-prev'></div>
                            <div className='swiper-button-next'></div>
                            <div className='swiper-pagination'></div>
                        </>
                    )}
                </Swiper>
            ) : (
                <div className={styles.placeholderWrapper}>
                    <ImagePlaceholder color='#343434' />
                </div>
            )}

            < div className={styles.PreviewCardInfo}>
                <h2>{name?.trim() ? name : 'Kartentitel'}</h2>
            </div>
        </div >
    )
}

export { WorkspaceCard, WorkspacePreview }