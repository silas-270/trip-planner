import React from 'react';

import { placeholderImages } from '../../config';
import styles from './WorkspaceCard.module.css';
import { useEffect, useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import { useNavigate } from "react-router-dom";

export function WorkspaceCard({ id, name, image }) {
    const navigate = useNavigate();
    const imgToShow = image?.src ? image : placeholderImages[0];

    const forwardToWorkspace = () => {
        navigate(`/ws/${id}`);
    };

    return (
        <div
            className={styles.card}
            data-id={id}
            onClick={forwardToWorkspace}
        >
            <div className={styles.imgbox}>
                <img src={imgToShow.src} alt={imgToShow.alt || ''} />
            </div>
            <div className={styles.info}>
                <h2>{name}</h2>
            </div>
        </div>
    );
}

export function WorkspacePreview({ name, images, onSlideChange }) {
    const swiperRef = useRef(null);
    const hasMultipleImages = images && images.length > 1;

    useEffect(() => {
        if (swiperRef.current) {
            swiperRef.current.slideTo(0);
            if (onSlideChange) onSlideChange(0);
        }
    }, [images]);

    return (
        <div className={styles.PreviewCard} data-name={name}>
            <Swiper
                modules={[Navigation, Pagination]}
                onSwiper={(swiper) => (swiperRef.current = swiper)}
                onSlideChange={(swiper) => {
                    if (onSlideChange) onSlideChange(swiper.activeIndex);
                }}
                navigation={hasMultipleImages ? {
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev",
                } : false}
                pagination={hasMultipleImages ? {
                    el: "swiper-pagination up",
                    clickable: true,
                } : false}
                observer={true}
                observeParents={true}
            >
                {(images || []).map(({ src, alt }, index) => (
                    <SwiperSlide key={index}>
                        <img src={src} alt={alt} className="crop" />
                    </SwiperSlide>
                ))}
            </Swiper>

            {hasMultipleImages && (
                <>
                    <div className="swiper-button-prev"></div>
                    <div className="swiper-button-next"></div>
                    <div className="swiper-pagination"></div>
                </>
            )}

            <div className={styles.PreviewCardInfo}>
                <h2>{name?.trim() ? name : "Kartentitel"}</h2>
            </div>
        </div>
    );
}
