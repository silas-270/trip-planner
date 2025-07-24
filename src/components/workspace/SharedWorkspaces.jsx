import React from 'react';

import styles from './Workspaces.module.css';
import { useState } from 'react';
import { AddButton, Popup } from '../uielements/uielements';
import { WorkspaceCard } from './WorkspaceCard';
import { useDevice } from '../../hooks/useDevice';

export function SharedWorkspaces({ workspaces, onAccessWorkspace }) {
    const { isMobile } = useDevice();

    const gridStyle = isMobile
        ? { gridTemplateColumns: '1fr', justifyContent: 'stretch' }
        : {};

    const [showPopup, setShowPopup] = useState(false);
    const [accessLink, setAccessLink] = useState("");

    const handleSave = async () => {
        if (!accessLink.trim()) return alert("Bitte gib einen gültigen Link ein.");
        await onAccessWorkspace(accessLink);
        close();
    };

    const close = () => {
        setShowPopup(false);
        setAccessLink("");
    };

    return (
        <div>
            <div className={styles.sectionWrapper}>
                <div className={styles.leftGroup}>
                    <h2 className={styles.sectionHeading}>Geteilte Workspaces</h2>
                </div>
                <AddButton mobileText='➕' desktopText='➕ Workspace hinzufügen' className="addButton" onClick={() => setShowPopup(true)} />
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
                    <input
                        className={styles.workspaceNameInput}
                        value={accessLink}
                        onChange={e => setAccessLink(e.target.value)}
                        placeholder="Hier einfügen"
                    />
                </Popup>
            )}
        </div>
    );
}