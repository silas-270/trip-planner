import ReactDOM from "react-dom";
import styles from './uielements.module.css';

export function AddButton({
    text,
    className,
    onClick
}) {
    return (
        <button className={className} onClick={onClick}>
            {text}
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