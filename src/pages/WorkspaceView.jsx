import { useWorkspaces } from '../hooks/useWorkspaces';
import { OwnWorkspaces } from '../components/workspace/OwnWorkspaces';
import { SharedWorkspaces } from '../components/workspace/SharedWorkspaces';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/auth';

export function WorkspaceView() {
    const { owned, shared, addWs, deleteWs } = useWorkspaces();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <button onClick={handleLogout}>Logout</button>
            <OwnWorkspaces
                workspaces={owned}
                onAddWorkspace={addWs}
                onDeleteWorkspace={deleteWs}
            />
            <SharedWorkspaces
                workspaces={shared}
            />
        </div>
    );
}