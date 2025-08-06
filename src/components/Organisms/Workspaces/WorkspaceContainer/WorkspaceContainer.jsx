import { WorkspaceCard } from '../../../Molecules/Workspaces/WorkspaceCard/WorkspaceCard'
import styles from './WorkspaceContainer.module.css'

const WorkspaceContainer = ({
    workspaces,
    gridStyle
}) => {
    return (
        <>
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
        </>
    )
}

export default WorkspaceContainer;