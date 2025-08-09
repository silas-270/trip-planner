import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getCards, getWorkspaceMeta, addCard, deleteCard, submitVote } from '../services/api/api'
import { useAuth } from './Auth/useAuth'
import { useParams } from 'react-router-dom'

const useAccommodations = () => {
    const queryClient = useQueryClient()
    const { user } = useAuth()
    const userId = user?.id
    const { wsid: workspaceId } = useParams()

    const {
        data: accoms = [],
        isLoading,
        error,
        refetch,
    } = useQuery({
        queryKey: ['accommodations', workspaceId, userId], // userId zur Differenzierung
        queryFn: () => getCards(workspaceId),              // API bleibt gleich
        enabled: !!workspaceId && !!userId,
        staleTime: 1000 * 60 * 5,
        refetchInterval: 1000 * 30,
        refetchIntervalInBackground: false,
    })

    const {
        data: workspaceMeta,
        isLoading: metaLoading,
        error: metaError,
    } = useQuery({
        queryKey: ['workspaceMeta', workspaceId],
        queryFn: () => getWorkspaceMeta(workspaceId),
        enabled: !!workspaceId,
        staleTime: 1000 * 60 * 10,
    })

    // Mutation zum Erstellen
    const createMutation = useMutation({
        mutationFn: ({ workspaceId, mode, cardData }) => addCard(workspaceId, mode, cardData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accommodations', workspaceId] })
        },
    })

    // Mutation zum Löschen
    const deleteMutation = useMutation({
        mutationFn: ({ workspaceId, cardId }) => deleteCard(workspaceId, cardId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accommodations', workspaceId] })
        },
    })

    // Mutation zum Voten
    const voteMutation = useMutation({
        mutationFn: ({ cardId, vote }) => submitVote(cardId, vote),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accommodations', workspaceId] })
        },
    })

    const addAccom = async (mode, cardData) => {
        return await createMutation.mutateAsync({ workspaceId, mode, cardData })
    }

    const deleteAccom = async (cardId) => {
        return await deleteMutation.mutateAsync({ workspaceId, cardId })
    }

    const voteAccom = async (cardId, voteValue) => {
        return await voteMutation.mutateAsync({ cardId, vote: voteValue })
    }

    return {
        accoms,
        workspaceMeta,
        isLoading,
        error,
        refetch,
        addAccom,
        deleteAccom,
        voteAccom,
    }
}

export default useAccommodations