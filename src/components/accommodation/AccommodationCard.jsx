import React from 'react';

import { useState } from "react";
import { placeholderImages } from '../../config';
import { BtnUp, BtnDown, Edit, Trashcan } from "../../assets/svg";
import styles from './AccommodationCard.module.css';
import { useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

export function AccommodationCard({ id, name, location, price, rating, images, url, voteState, voteCount, onVote, onDeleteAccommodation }) {
    const swiperRef = useRef(null);
    const upBtnRef = useRef(null);
    const downBtnRef = useRef(null);

    const uniqueId = `swiper-${id}`;
    const hasMultipleImages = images && images.length > 1;

    const [myVote, setMyVote] = useState(voteState);
    const [prevVote, setPrevVote] = useState(voteState);
    const [pendingVote, setPendingVote] = useState(0); // für debounce-Logik
    const debounceRef = useRef(null);

    const [showEditMenu, setShowEditMenu] = useState(false);
    const popupRef = useRef(null);

    const debounceVote = (newVote) => {
        setPendingVote(newVote);

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            if (newVote !== prevVote) {
                onVote(id, newVote)
                setPrevVote(newVote);
            }
            debounceRef.current = null;
        }, 1000); // 1 Sekunde warten
    };

    const handleUpClick = () => {
        triggerPopAnimation(upBtnRef);
        setMyVote(prev => {
            const newVote = prev === 1 ? 0 : 1;
            debounceVote(newVote);
            return newVote;
        });
    };

    const handleDownClick = () => {
        triggerPopAnimation(downBtnRef);
        setMyVote(prev => {
            const newVote = prev === -1 ? 0 : -1;
            debounceVote(newVote);
            return newVote;
        });
    };

    const handleEditClick = () => {
        setShowEditMenu(prev => !prev);
    };

    const handleEditCardClick = () => {
        setShowEditMenu(false);
    };

    const handleDeleteCardClick = () => {
        onDeleteAccommodation(id);
        setShowEditMenu(false);
    };

    const triggerPopAnimation = (ref) => {
        const svg = ref.current?.querySelector('svg');
        if (!svg) {
            console.warn("No SVG found in button");
            return;
        }

        svg.classList.remove(styles.pop);
        void svg.offsetWidth;
        svg.classList.add(styles.pop);

        setTimeout(() => {
            svg.classList.remove(styles.pop);
        }, 250);
    };

    useEffect(() => {
        if (swiperRef.current) {
            swiperRef.current.slideTo(0);
        }
    }, [images]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setShowEditMenu(false);
            }
        }

        if (showEditMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        // Cleanup bei Unmount oder wenn showEditMenu sich ändert
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showEditMenu]);

    return (
        <div className={styles.card} data-id={id}>
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
                {(images && images.length > 0 ? images : placeholderImages).map(({ src, alt }, index) => (
                    <SwiperSlide key={index}>
                        <img src={src} alt={alt} />
                    </SwiperSlide>
                ))}

                {hasMultipleImages && (
                    <>
                        <div id={`${uniqueId}-prev`} className="swiper-button-prev"></div>
                        <div id={`${uniqueId}-next`} className="swiper-button-next"></div>
                        <div id={`${uniqueId}-pagination`} className="swiper-pagination"></div>
                    </>
                )}
            </Swiper>

            {/* Information Section */}
            <div className={styles.info}>
                <div className={styles.rowTop}>
                    <h2>
                        <a href={url} target="_blank" rel="noopener noreferrer" className={styles.nameLink}>
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
                {/* Votebox Section*/}
                <div className={styles.btnWrapper}>
                    <button
                        ref={upBtnRef}
                        className={`${styles.voteBtn} ${styles.voteUp} ${myVote === 1 ? styles.active : ''}`}
                        onClick={handleUpClick}
                    >
                        <BtnUp />
                    </button>

                    <span className={styles.voteCount}>{voteCount + myVote}</span>

                    <button
                        ref={downBtnRef}
                        className={`${styles.voteBtn} ${styles.voteDown} ${myVote === -1 ? styles.active : ''}`}
                        onClick={handleDownClick}
                    >
                        <BtnDown />
                    </button>
                </div>

                {/* Edit Popup */}
                <div style={{ position: 'relative' }}>
                    <div className={styles.btnWrapper}>
                        <button className={styles.editBtn} onClick={handleEditClick}>
                            <Edit size={10} />
                        </button>
                    </div>
                    {showEditMenu && (
                        <div ref={popupRef} className={styles.editPopup}>
                            <div className={styles.buttonList}>
                                {/*<button className={styles.iconButton} onClick={handleEditCardClick}>
                                    <Edit className={styles.editButtonIcon} />
                                    <span>Edit Data</span>
                                </button>*/}
                                <button className={styles.iconButton} onClick={handleDeleteCardClick}>
                                    <Trashcan className={styles.deleteButtonIcon} />
                                    <span>Delete Card</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}