import { useState, useCallback } from 'react'
import PopupForm from '../../components/Templates/PopupForm/PopupForm'
import TextButton from '../../components/Atoms/Buttons/TextButton'

const styles = {
    confirmText: {
        color: 'var(--text)',
        fontSize: '1.5rem'
    },
    buttonRow: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: '8px'
    }
}

export function useConfirm() {
    const [state, setState] = useState({ message: '', resolve: null })

    const confirm = useCallback((message) => {
        return new Promise((resolve) => {
            setState({ message, resolve })
        })
    }, [])

    const handleConfirm = () => {
        state.resolve(true)
        setState({ message: '', resolve: null })
    }

    const handleCancel = () => {
        state.resolve(false)
        setState({ message: '', resolve: null })
    }

    const ConfirmDialog = state.message ? (
        <PopupForm>
            <div style={styles.confirmText}>
                {state.message}
            </div>
            <div style={styles.buttonRow}>
                <TextButton 
                    desktopLabel='Abbrechen'
                    onClick={handleCancel}
                />
                <TextButton 
                    desktopLabel='Bestätigen'
                    type='red'
                    onClick={handleConfirm}
                />
            </div>
        </PopupForm>
    ) : null

    return [confirm, ConfirmDialog]
}