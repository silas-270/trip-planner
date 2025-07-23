import styles from './Workspaces.module.css';
import { WorkspaceCard } from './WorkspaceCard';

export function SharedWorkspaces({ workspaces }) {
  return (
    <div>
      <div className={styles.sectionWrapper}>
        <div className={styles.leftGroup}>
          <h2 className={styles.sectionHeading}>Geteilte Sammlungen</h2>
        </div>
      </div>
      <div className="divider" />
      {(workspaces && workspaces.length > 0) ? (
        <div className={styles.workspaceContainer}>
          {workspaces.map(ws => <WorkspaceCard key={ws.id} {...ws} />)}
        </div>
      ) : (
        <div className={styles.emptyMessage}>Keine Workspaces.</div>
      )}
    </div>
  );
}