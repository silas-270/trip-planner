import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getWorkspaces, addWorkspace, updateWorkspace, deleteWorkspace, requestAccess, createAccess, delteAccess } from '../services/api/api'
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

    // Mutation zum Annehmen eines Share Links
    const requestAccessMutation = useMutation({
        mutationFn: requestAccess,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workspaces', userId] });
        }
    });

    // Mutation zum Erstellen eines Share Links
    const createAccessMutation = useMutation({
        mutationFn: createAccess,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workspaces', userId] });
        }
    });

    // Mutation zum Löschen eines Zugangs
    const deleteAccessMutation = useMutation({
        mutationFn: delteAccess,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['workspaces', userId] });
        }
    });

    const addWs = async (body) => {
        return await createMutation.mutateAsync(body);
    };

    const updateWs = async (body) => {
        return await updateMutation.mutateAsync(body);
    }

    const deleteWs = async (workspaceId) => {
        return await deleteMutation.mutateAsync(workspaceId)
    };

    const reqAccessWs = async (code) => {
        return await requestAccessMutation.mutateAsync(code);
    }

    const newAccessWs = async (body) => {
        return await createAccessMutation.mutateAsync(body);
    }
    const delAccessWs = async (body) => {
        return await deleteAccessMutation.mutateAsync(body);
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

        reqAccessWs,
        newAccessWs,
        delAccessWs
    };
}

export default useWorkspaces;