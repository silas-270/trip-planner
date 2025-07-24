import React from 'react';

import { useState } from "react";
import { AddButton, Popup } from '../uielements/uielements';
import { IconT, IconBooking, IconImmoScout } from "../../assets/svg";
import styles from './Accommodations.module.css';
import { AccommodationCard } from "./AccommodationCard";
import { useNavigate } from "react-router-dom";

export function Accommodations({ accommodations, wsMeta, onAddAccommodation, onDeleteAccommodation, onVote }) {
    const [showPopup, setShowPopup] = useState(false);
    const [createMethod, setMethod] = useState("raw");
    const [scraperUrl, setSraperUrl] = useState("");
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [location, setLocation] = useState("")
    const [rating, setRating] = useState("");

    const navigate = useNavigate();

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
    ];

    const handleSave = async () => {
        let cardData;
        switch (createMethod) {
            case "raw":
                if (!name.trim()) return;
                if (!price.trim()) return;
                if (!location.trim()) return;
                if (!rating.trim()) return;
                cardData = { name, price, location, rating };
                break;
            case "scraperBooking":
                if (!scraperUrl.trim()) return;
                cardData = { url: scraperUrl };
                break;
        }
        await onAddAccommodation(createMethod, cardData);
        close();
    };

    const backToSpaces = () => {
        navigate("/");
    };

    const close = () => {
        setShowPopup(false);
        setSraperUrl("");
        setMethod("raw")
        setName("");
        setPrice("");
        setLocation("");
        setRating("");
    };

    return (
        <div>
            <div className={styles.sectionWrapper}>
                <div className={styles.leftGroup}>
                    <AddButton text="<" className="returnButton" onClick={backToSpaces} />
                    <h2 className={styles.sectionHeading}>{wsMeta?.name?.trim() || 'Workspace'}</h2>
                </div>
                <AddButton text="➕ Unterkunft hinzufügen" className="addButton" onClick={() => setShowPopup(true)} />
            </div>
            <div className="divider" />
            {(accommodations && accommodations.length > 0) ? (
                <div className={styles.workspaceContainer}>
                    {accommodations.map(acc => <AccommodationCard key={acc.id} {...acc} onVote={onVote} onDeleteAccommodation={onDeleteAccommodation} />)}
                </div>
            ) : (
                <div className={styles.emptyMessage}>Keine Unterkünfte.</div>
            )}
            {showPopup && (
                <Popup onClose={close} onSave={handleSave}>
                    <div className={styles.inputWrapper}>
                        <div className={styles.buttonBar}>
                            {providers.map((provider) => {
                                const isActive = createMethod === provider.id;
                                return (
                                    <button
                                        key={provider.id}
                                        className={`${styles.authButton} ${isActive ? styles.active : styles.inactive}`}
                                        onClick={() => setMethod(provider.id)}
                                    >
                                        <span className={styles.iconWrapper}>
                                            <span className={styles.icon}>{provider.icon}</span>
                                        </span>
                                        <span className={styles.labelWrapper}>
                                            {provider.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                        {(createMethod === "raw") ? (
                            <>
                                <input
                                    className={styles.Input}
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder="Unterkunftsname"
                                />
                                <input
                                    className={styles.Input}
                                    value={location}
                                    onChange={e => setLocation(e.target.value)}
                                    placeholder="Ort"
                                />
                                <div className={styles.doubleInputRow}>
                                    <input
                                        className={styles.Input}
                                        value={price}
                                        onChange={e => setPrice(e.target.value)}
                                        placeholder="Preis"
                                    />
                                    <input
                                        className={styles.Input}
                                        value={rating}
                                        onChange={e => setRating(e.target.value)}
                                        placeholder="Bewertung"
                                    />
                                </div>
                            </>
                        ) : (
                            <input
                                className={styles.Input}
                                value={scraperUrl}
                                onChange={e => setSraperUrl(e.target.value)}
                                placeholder="Booking URL"
                            />
                        )}
                    </div>
                </Popup>
            )}
        </div>
    );
}