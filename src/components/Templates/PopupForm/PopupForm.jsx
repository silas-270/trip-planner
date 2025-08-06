import ReactDOM from "react-dom";
import styles from './PopupForm.module.css'

const PopupForm = ({
    onClose,
    children
}) => {
    function handleOverlayClick(e) {
        if (e.target === e.currentTarget) onClose();
    }

    return ReactDOM.createPortal(
        <div className={styles.popupOverlay} onClick={handleOverlayClick}>
            <div className={`${styles.popup} glassmorphic`}>
                <div className={styles.popupContent}>
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
}

export default PopupForm;