import React from 'react'

import { useState, useEffect, useRef } from 'react'
import { useToast } from '../../../../services/context/ToastContext'
import useWorkspaces from '../../../../hooks/useWorkspaces'
import useImageSearch from '../../../../hooks/Utils/useImageSearch'
import { useAuth } from '../../../../hooks/Auth/useAuth'
import { useNavigate } from 'react-router-dom';

import PopupForm from '../../../Templates/PopupForm/PopupForm'
import WorkspacePopup from '../../Workspaces/WorkspacePopup/WorkspacePopup'
import TextButton from '../../../Atoms/Buttons/TextButton'
import SvgButton from '../../../Atoms/Buttons/SvgButton'
import { BackArrow, MenuDots, Edit, Share, Copy, Exit } from '../../../../assets/svg'

import styles from './SectionHeading.module.css'

const SectionHeading = ({
    setShowPopup,
    workspaceMeta
}) => {
    const { user } = useAuth();
    const userId = user?.id;

    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false)

    const { deleteWs, updateWs, newAccessWs, delAccessWs } = useWorkspaces()
    const { images, loading, search, reset } = useImageSearch()
    const { addToast } = useToast()

    const copyButtonRef = useRef(null)

    const [showWorkspaceForm, setShowWorkspaceForm] = useState(false)
    const [name, setName] = useState("")
    const [query, setQuery] = useState("")
    const [currentIndex, setCurrentIndex] = useState(0)

    const [showSharePopup, setShowSharePopup] = useState(false)
    const [shareCode, setShareCode] = useState('')

    useEffect(() => {
        if (workspaceMeta) {
            setName(workspaceMeta.name);
        }
    }, [workspaceMeta]);

    const workspaceImages = images || (workspaceMeta ? [workspaceMeta.image] : []);

    const handleUpdateWs = async () => {
        // Diffing
        const newName = (name.trim() === workspaceMeta.name) ? workspaceMeta.name : name.trim()
        const newImage = images ? images[currentIndex] : workspaceMeta.image
        try {
            await updateWs({ name: newName, image: newImage, id: workspaceMeta.id })
            workspaceMeta.name = newName
            workspaceMeta.image = newImage
            addToast('success', 'Workspace aktualisiert')
        } catch (err) {
            console.error('Failed to create workspace', err.message)
            addToast('success', 'Fehler beim aktuslisieren')
        }
        closeWorkspacePopup()
    }

    const closeWorkspacePopup = () => {
        setName('')
        setQuery('')
        setCurrentIndex(0)
        reset()
        setShowWorkspaceForm(false)
    }

    const openShareWindow = async () => {
        if (!workspaceMeta) {
            addToast('error', 'Keine Workspacedaten geladen')
            return
        }
        const result = await newAccessWs({
            workspaceId: workspaceMeta.id,
            validHours: 1,
            maxUses: 3
        })
        setShareCode(result.code)
        setShowSharePopup(true)
    }

    const handleDeleteWorkspace = async () => {
        if (!workspaceMeta) {
            addToast('error', 'Keine Workspacedaten geladen')
            return
        }
        try {
            await deleteWs(workspaceMeta.id)
            navigate('/')
        } catch (err) {
            console.error('Failed to delete Workspace', err)
        }
    }

    const handleLeaveWorkspace = async () => {
        if (!workspaceMeta) {
            addToast('error', 'Keine Workspacedaten geladen')
            return
        }
        try {
            await delAccessWs({ workspaceId: workspaceMeta.id })
            navigate('/')
        } catch (err) {
            console.error('Failed to leave Workspace', err)
        }
    }

    const closeShareWindow = () => {
        setShowSharePopup(false)
    }

    const onCopy = async () => {
        triggerPopAnimation();
        try {
            await navigator.clipboard.writeText(shareCode)
            addToast('success', 'Code kopiert')
        } catch (err) {
            console.error('Failed to copy to clipboard', err)
        }
    }

    const triggerPopAnimation = () => {
        const svg = copyButtonRef.current?.querySelector('svg')

        svg.classList.remove('pop');
        void svg.offsetWidth;
        svg.classList.add('pop');

        setTimeout(() => {
            svg.classList.remove('pop');
        }, 250);
    };

    return (
        <>
            <div className={styles.sectionWrapper}>
                <div className={styles.leftGroup}>
                    <SvgButton svg={<BackArrow />} onClick={() => navigate('/')} />
                    <SvgButton svg={<MenuDots />} onClick={() => setShowMenu(prevState => !prevState)} />
                    {showMenu &&
                        <>
                            {(userId === workspaceMeta.owner_id) ? (
                                <SvgButton svg={<Edit />} onClick={() => setShowWorkspaceForm(true)} />
                            ) : (
                                <SvgButton svg={<Exit />} onClick={handleLeaveWorkspace} />
                            )}
                            <SvgButton svg={<Share />} onClick={openShareWindow} />
                        </>
                    }
                    <h2 className={styles.sectionHeading}>{workspaceMeta?.name?.trim() || 'Workspace'}</h2>
                </div>
                <TextButton mobileLabel='➕' desktopLabel='➕ Unterkunft hinzufügen' onClick={() => setShowPopup(true)} />
            </div>

            {showWorkspaceForm && workspaceMeta && (
                <PopupForm onClose={closeWorkspacePopup}>
                    <WorkspacePopup
                        images={workspaceImages}
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
                            onClick={handleUpdateWs}
                        />
                        <TextButton
                            desktopLabel='Löschen'
                            onClick={handleDeleteWorkspace}
                        />
                        <TextButton
                            desktopLabel='Abbrechen'
                            onClick={closeWorkspacePopup}
                        />
                    </div>
                </PopupForm>
            )}

            {showSharePopup &&
                <PopupForm onClose={() => closeShareWindow}>
                    <div className={`${styles.codeDisplay} glassmorphic`}>
                        <span className={styles.codeText}>{shareCode}</span>
                        <button className={styles.copyButton} onClick={onCopy} ref={copyButtonRef}>
                            <Copy />
                        </button>
                    </div>
                    <div className={styles.buttonBar}>
                        <TextButton
                            desktopLabel='Schließen'
                            onClick={closeShareWindow}
                        />
                    </div>
                </PopupForm>
            }
        </>
    )
}

export default SectionHeading