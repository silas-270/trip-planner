import React from 'react'

import { useEffect, useRef } from 'react'
import { Edit, Trashcan } from '../../../assets/svg'
import styles from './ContextMenu.module.css'

const ContextMenu = ({
    showEditMenu,
    setShowEditMenu,
    handleDeleteCardClick,
    handleEditCardClick
}) => {
    const menuRef = useRef(null)

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowEditMenu(false)
            }
        }

        if (showEditMenu) {
            document.addEventListener('mousedown', handleClickOutside)
        } else {
            document.removeEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [showEditMenu])

    return (
        <div ref={menuRef} className={styles.contextMenu}>
            <div className={styles.buttonList}>
                <button className={styles.iconButton} onClick={handleEditCardClick}>
                    <Edit className={styles.editButtonIcon} />
                    <span>Bearbeiten</span>
                </button>
                <button className={`${styles.iconButton} ${styles.red}`} onClick={handleDeleteCardClick}>
                    <Trashcan className={styles.deleteButtonIcon} />
                    <span>Löschen</span>
                </button>
            </div>
        </div>
    )
}

export default ContextMenu
