import React from 'react'

import { WorkspacePreview } from '../WorkspaceCard/WorkspaceCard'
import { ReloadSVG } from '../../../../assets/svg'

import styles from './WorkspacePopup.module.css'

const WorkspacePopup = ({
    images,
    setCurrentIndex,

    name,
    setName,

    query,
    setQuery,
    search,
    loading
}) => (
    <>
        <WorkspacePreview
            images={images}
            name={name}
            onSlideChange={setCurrentIndex}
        />
        <input
            className={`${styles.workspaceNameInput} glassmorphic`}
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Name des Spaces"
        />
        <div className={styles.imageInputRow}>
            <input
                className={`${styles.workspaceImageInput} glassmorphic`}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Tags für das Coverbild"
            />
            <button
                className={`${styles.workspaceImageReload} glassmorphic`}
                onClick={() => search(query)}
                disabled={loading}
                aria-label="Bild neu laden"
            >
                {loading ? <div className="spinner" /> : <ReloadSVG />}
            </button>
        </div>
    </>
)

export default WorkspacePopup