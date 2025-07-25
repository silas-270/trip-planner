import React from 'react';

import ReactDOM from "react-dom";
import styles from './uielements.module.css';
import { logout } from "../../services/auth";
import { useNavigate } from 'react-router-dom';
import { useDevice } from '../../hooks/useDevice';

export function LogoutButton() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <button className={styles.logoutBtn} onClick={handleLogout}>
            Logout
        </button>
    );
}

export function AddButton({
    mobileText = '',
    desktopText = '',
    onClick
}) {
    const { isMobile } = useDevice();
    return (
        <button className={styles.addButton} onClick={onClick}>
            {isMobile ? mobileText : desktopText}
        </button>
    );
}

export function ReturnButton({
    onClick
}) {
    return (
        <button className={styles.returnButton} onClick={onClick}>
            {'<'}
        </button>
    );
}

export function SvgButton({
    onClick,
    svg
}) {
    return (
        <button className={styles.svgButton} onClick={onClick}>
            {svg}
        </button>
    );
}

export function Popup({
    onClose,
    onSave,
    isSaving,
    children
}) {
    function handleOverlayClick(e) {
        if (e.target === e.currentTarget) onClose();
    }

    return ReactDOM.createPortal(
        <div className={styles.popupOverlay} onClick={handleOverlayClick}>
            <div className={styles.popup}>
                <div className={styles.popupContent}>
                    {children}
                </div>
                <div className={styles.popupButtons}>
                    <button
                        className={styles.cancelButton}
                        onClick={onClose}>Abbrechen
                    </button>
                    <button
                        className={styles.saveButton}
                        onClick={onSave}
                        disabled={isSaving}
                    >
                        {isSaving ? "Speichern..." : "Speichern"}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}