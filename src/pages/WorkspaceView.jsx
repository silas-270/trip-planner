import React from 'react';

import { useWorkspaces } from '../hooks/useWorkspaces';
import { OwnWorkspaces } from '../components/workspace/OwnWorkspaces';
import { SharedWorkspaces } from '../components/workspace/SharedWorkspaces';
import Header from '../components/uielements/Header';

export function WorkspaceView() {
    const { owned, shared, addWs, deleteWs, accesWs } = useWorkspaces();

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <Header />
            <OwnWorkspaces
                workspaces={owned}
                onAddWorkspace={addWs}
                onDeleteWorkspace={deleteWs}
            />
            <SharedWorkspaces
                workspaces={shared}
                onAccessWorkspace={accesWs}
            />
        </div>
    );
}