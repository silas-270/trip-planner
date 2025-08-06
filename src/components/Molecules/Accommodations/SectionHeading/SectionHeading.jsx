import { useState, useEffect } from 'react'
import { useToast } from '../../../../services/context/ToastContext'
import useWorkspaces from '../../../../hooks/useWorkspaces'
import useImageSearch from '../../../../hooks/Utils/useImageSearch'
import { useAuth } from '../../../../hooks/Auth/useAuth'
import { useNavigate } from 'react-router-dom';

import PopupForm from '../../../Templates/PopupForm/PopupForm'
import WorkspacePopup from '../../Workspaces/WorkspacePopup/WorkspacePopup'
import TextButton from '../../../Atoms/Buttons/TextButton'
import SvgButton from '../../../Atoms/Buttons/SvgButton'
import { BackArrow, MenuDots, Edit, Share } from '../../../../assets/svg'

import styles from './SectionHeading.module.css'

const SectionHeading = ({
    setShowPopup,
    workspaceMeta
}) => {
    const { user } = useAuth();
    const userId = user?.id;

    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false)

    const { updateWs } = useWorkspaces()
    const { images, loading, search, reset } = useImageSearch()
    const { addToast } = useToast()

    const [showWorkspaceForm, setShowWorkspaceForm] = useState(false)
    const [name, setName] = useState("")
    const [query, setQuery] = useState("")
    const [currentIndex, setCurrentIndex] = useState(0)

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

    return (
        <>
            <div className={styles.sectionWrapper}>
                <div className={styles.leftGroup}>
                    <SvgButton svg={<BackArrow />} onClick={() => navigate('/')} />
                    <SvgButton svg={<MenuDots />} onClick={() => setShowMenu(prevState => !prevState)} />
                    {showMenu &&
                        <>
                            {(userId === workspaceMeta.owner_id) &&
                                <SvgButton svg={<Edit />} onClick={() => setShowWorkspaceForm(true)} />
                            }
                            <SvgButton svg={<Share />} onClick={() => console.log('share')} />
                        </>
                    }
                    <h2 className={styles.sectionHeading}>{workspaceMeta?.name?.trim() || 'Workspace'}</h2>
                </div>
                <TextButton mobileLabel='➕' desktopLabel='➕ Unterkunft hinzufügen' onClick={() => setShowPopup(true)} />
            </div>

            {showWorkspaceForm && workspaceMeta && (
                <PopupForm onClose={() => closeWorkspacePopup(true)}>
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
                            desktopLabel='Abbrechen'
                            onClick={() => closeWorkspacePopup(true)}
                        />
                    </div>
                </PopupForm>
            )}
        </>
    )
}

export default SectionHeading