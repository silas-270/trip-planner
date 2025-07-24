import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getWorkspaces, addWorkspace, deleteWorkspace, requestAccess } from '../services/api';
import { useAuth } from './useAuth';

export function useWorkspaces() {
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
        deleteWs,
        accesWs
    };
}