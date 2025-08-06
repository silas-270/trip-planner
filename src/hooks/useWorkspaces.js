import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getWorkspaces, addWorkspace, updateWorkspace, deleteWorkspace, requestAccess } from '../services/api/api'
import { useAuth } from './Auth/useAuth'

/* Workspace Object:
    {
        id: string,
        name: string,
        owner_id: string,
        image: Object { alt, src}
        created_at: Date
    }
*/

const useWorkspaces = () => {
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const userId = user?.id;

    const {
        data: workspaces = [],
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ['workspaces', userId],
        queryFn: getWorkspaces,
        staleTime: 1000 * 60 * 5, // 5 Minuten cache
    });

    // Unterteilen in owned/shared
    const owned = workspaces.filter(ws => ws.owner_id === userId);
    const shared = workspaces.filter(ws => ws.owner_id !== userId);

    // Mutation zum Erstellen
    const createMutation = useMutation({
        mutationFn: addWorkspace,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workspaces', userId] });
        },
    });

    // Mutation zum Aktualisieren
    const updateMutation = useMutation({
        mutationFn: updateWorkspace,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workspaces', userId] });
        },
    });

    // Mutation zum Löschen
    const deleteMutation = useMutation({
        mutationFn: deleteWorkspace,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workspaces', userId] });
        },
    });

    // Mutation zum Annehmen eines Share Link
    const accessMutation = useMutation({
        mutationFn: requestAccess,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workspaces', userId] });
        }
    });

    const addWs = async (body) => {
        await createMutation.mutateAsync(body);
    };

    const updateWs = async (body) => {
        await updateMutation.mutateAsync(body);
    }

    const deleteWs = async (workspaceId) => {
        await deleteMutation.mutateAsync(workspaceId)
    };

    const accesWs = async (accessLink) => {
        await accessMutation.mutateAsync(accessLink);
    }

    return {
        owned,
        shared,
        isLoading,
        error,
        refetch,
        addWs,
        updateWs,
        deleteWs,
        accesWs
    };
}

export default useWorkspaces;