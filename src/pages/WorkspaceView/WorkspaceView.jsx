import { useState } from 'react'
import { useToast } from '../../services/context/ToastContext'
import useImageSearch from '../../hooks/Utils/useImageSearch'
import useDevice from '../../hooks/Utils/useDevice'
import useWorkspaces from '../../hooks/useWorkspaces'

import PopupForm from '../../components/Templates/PopupForm/PopupForm'
import WorkspacePopup from '../../components/Molecules/Workspaces/WorkspacePopup/WorkspacePopup'
import SectionHeading from '../../components/Molecules/Workspaces/SectionHeading/SectionHeading'
import WorkspaceContainer from '../../components/Organisms/Workspaces/WorkspaceContainer/WorkspaceContainer'
import TextButton from '../../components/Atoms/Buttons/TextButton'

import styles from './WorkspaceView.module.css'

const WorkspaceView = () => {
    const { isMobile } = useDevice()
    const { images, loading, search, reset } = useImageSearch()
    const { owned, shared, addWs, accesWs } = useWorkspaces()
    const { addToast } = useToast();

    const gridStyle = isMobile
        ? { gridTemplateColumns: '1fr', justifyContent: 'stretch' }
        : {}

    const [showOwnWorkspaceForm, setShowOwnWorkspaceForm] = useState(false)
    const [name, setName] = useState("")
    const [query, setQuery] = useState("")
    const [currentIndex, setCurrentIndex] = useState(0)

    const [showSharedWorkspaceForm, setShowSharedWorkspaceForm] = useState(false)
    const [accessLink, setAccessLink] = useState('')

    const handleAddWs = async () => {
        const errorMessage = validateOwnInputs(name, images)
        if (errorMessage) {
            addToast('error', errorMessage)
            return
        }
        try {
            await addWs({ name: name.trim(), image: images[currentIndex] })
            addToast('success', 'Workspace erstellt')
        } catch (err) {
            console.error('Failed to create workspace', err.message)
            addToast('success', 'Ungültiger Link')
        }
        close(true)
    }

    const handleAccessWs = async () => {
        const errorMessage = validateSharedInputs(accessLink)
        if (errorMessage) {
            addToast('error', errorMessage)
            return
        }
        try {
            await accesWs(accessLink.trim())
            addToast('success', 'Workspace beigetreten')
        } catch (err) {
            console.error('Failed to access workspace', err.message)
            addToast('success', 'Ungültiger Link')
        }
        close(true)
    }

    const close = (own) => {
        if (own) {
            setName('')
            setQuery('')
            setCurrentIndex(0)
            reset()
            setShowOwnWorkspaceForm(false)
        } else {
            setCurrentIndex('')
            setShowSharedWorkspaceForm(false)
        }
    }

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <SectionHeading
                name='Meine Sammlungen'
                buttonLabelMobile='➕' buttonLabelDesktop='➕ Workspace hinzufügen'
                onClick={() => setShowOwnWorkspaceForm(true)}
            />
            <div className="divider" />
            <WorkspaceContainer
                workspaces={owned}
                gridStyle={gridStyle}
            />
            <SectionHeading
                name='Geteilte Sammlungen'
                buttonLabelMobile='➕' buttonLabelDesktop='➕ Workspace hinzufügen'
                onClick={() => setShowSharedWorkspaceForm(true)}
            />
            <div className="divider" />
            <WorkspaceContainer
                workspaces={shared}
                gridStyle={gridStyle}
            />

            {showOwnWorkspaceForm && (
                <PopupForm onClose={() => close(true)}>
                    <WorkspacePopup
                        images={images}
                        setCurrentIndex={setCurrentIndex}

                        name={name}
                        setName={setName}

                        query={query}
                        setQuery={setQuery}
                        search={search}
                        loading={loading}
                    />
                    <div className={styles.buttonBar}>
                        <TextButton
                            desktopLabel='Speichern'
                            onClick={handleAddWs}
                        />
                        <TextButton
                            desktopLabel='Abbrechen'
                            onClick={() => close(true)}
                        />
                    </div>
                </PopupForm>
            )}

            {showSharedWorkspaceForm && (
                <PopupForm onClose={() => close(false)}>
                    <input
                        className={`${styles.workspaceImageInput} glassmorphic`}
                        value={accessLink}
                        onChange={e => setAccessLink(e.target.value)}
                        placeholder="Hier einfügen"
                    />
                    <div className={styles.buttonBar}>
                        <TextButton
                            desktopLabel='Anfragen'
                            onClick={handleAccessWs}
                        />
                        <TextButton
                            desktopLabel='Abbrechen'
                            onClick={() => close(false)}
                        />
                    </div>
                </PopupForm>
            )}
        </div>
    )
}

export default WorkspaceView

const validateOwnInputs = (name, images) => {
    if (!name.trim()) return "Gib einen passenden Namen ein"
    if (!images) return "Finde passende Bilder"
    return null;
}

const validateSharedInputs = (accessLink) => {
    if (!accessLink.trim()) return "Bitte gib einen gültigen Link ein"
    return null;
}