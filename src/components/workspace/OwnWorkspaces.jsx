import React from 'react';

import { useState } from "react";
import { useImageSearch } from "../../hooks/useImageSearch";
import { WorkspaceCard, WorkspacePreview } from './WorkspaceCard';
import { AddButton, Popup } from '../uielements/uielements';
import { ReloadSVG } from "../../assets/svg";
import { placeholderImages } from "../../config";
import styles from './Workspaces.module.css';
import { useDevice } from '../../hooks/useDevice';
import { useToast } from '../../context/ToastContext'

export function OwnWorkspaces({ workspaces, onAddWorkspace, onDeleteWorkspace }) {
    const { isMobile } = useDevice();
    const { addToast } = useToast();

    const gridStyle = isMobile
        ? { gridTemplateColumns: '1fr', justifyContent: 'stretch' }
        : {};

    const [showPopup, setShowPopup] = useState(false);
    const [name, setName] = useState("");
    const [query, setQuery] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
    const { images, loading, search, reset } = useImageSearch();

    const handleSave = async () => {
        if (!name.trim()) {
            addToast('error', 'Gib einen passenden Namen ein');
            return;
        }
        if (images === placeholderImages) {
            addToast('error', 'Finde passende Bilder');
            return;
        }
        await onAddWorkspace({ name: name.trim(), image: images[currentIndex] });
        addToast('success', 'Workspace erstellt');
        close();
    };

    const close = () => {
        setShowPopup(false);
        setName("");
        setQuery("");
        setCurrentIndex(0);
        reset();
    };

    return (
        <div>
            <div className={styles.sectionWrapper}>
                <div className={styles.leftGroup}>
                    <h2 className={styles.sectionHeading}>Meine Sammlungen</h2>
                </div>
                <AddButton mobileText='➕' desktopText='➕ Workspace hinzufügen' onClick={() => setShowPopup(true)} />
            </div>

            <div className="divider" />

            {(workspaces && workspaces.length > 0) ? (
                <div
                    className={styles.workspaceContainer}
                    style={gridStyle}
                >
                    {workspaces.map(ws => (
                        <WorkspaceCard key={ws.id} {...ws} />
                    ))}
                </div>
            ) : (
                <div className={styles.emptyMessage}>Keine Workspaces.</div>
            )}

            {showPopup && (
                <Popup onClose={close} onSave={handleSave}>
                    <WorkspacePreview
                        images={images}
                        name={name}
                        onSlideChange={setCurrentIndex}
                    />
                    <input
                        className={styles.workspaceNameInput}
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Name des Spaces"
                    />
                    <div className={styles.imageInputRow}>
                        <input
                            className={styles.workspaceImageInput}
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder="Tags für das Coverbild"
                        />
                        <button
                            className={styles.workspaceImageReload}
                            onClick={() => search(query)}
                            disabled={loading}
                            aria-label="Bild neu laden"
                        >
                            {loading ? <div className="spinner" /> : <ReloadSVG />}
                        </button>
                    </div>
                </Popup>
            )}
        </div>
    );
}