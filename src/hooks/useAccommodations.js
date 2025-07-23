import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCards, addCard, deleteCard, submitVote } from '../services/api';
import { useAuth } from './useAuth';
import { useParams } from 'react-router-dom';

export function useAccommodations() {
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const userId = user?.id;
    const { wsid: workspaceId } = useParams();

    const {
        data: accoms = [],
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ['accommodations', workspaceId],
        queryFn: () => getCards(workspaceId),
        enabled: !!workspaceId,
        staleTime: 1000 * 60 * 5,
        refetchInterval: 1000 * 30, // alle 30s automatisch aktualisieren
        refetchIntervalInBackground: false, // nur bei aktivem Tab
    });

    // Mutation zum Erstellen
    const createMutation = useMutation({
        mutationFn: ({ workspaceId, mode, cardData }) => addCard(workspaceId, mode, cardData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accommodations', workspaceId] });
        },
    });

    // Mutation zum Löschen
    const deleteMutation = useMutation({
        mutationFn: ({ workspaceId, cardId }) => deleteCard(workspaceId, cardId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accommodations', workspaceId] });
        },
    });

    // Mutation zum Voten
    const voteMutation = useMutation({
        mutationFn: ({ cardId, vote }) => submitVote(cardId, vote),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accommodations', workspaceId] });
        },
    });

    const addAccom = async (mode, cardData) => {
        await createMutation.mutateAsync({ workspaceId, mode, cardData });
    };

    const deleteAccom = async (cardId) => {
        await deleteMutation.mutateAsync({ workspaceId, cardId });
    }

    const vote = async (cardId, voteValue) => {
        await voteMutation.mutateAsync({ cardId, vote: voteValue });
    };

    return {
        accoms,
        isLoading,
        error,
        refetch,
        addAccom,
        deleteAccom,
        vote,
    };
}
