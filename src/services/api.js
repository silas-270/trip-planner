import { CONFIG } from "../config.js";
import { supabase } from '../services/supabaseClient';

const apiFetch = async (url, options = {}) => {
    const {
        data: { session },
        error,
    } = await supabase.auth.getSession();

    if (error || !session) {
        throw new Error('Kein gültiger Supabase-Token verfügbar.');
    }

    const token = session.access_token;

    // Bestehende Header übernehmen oder neuen leeren Header setzen
    const headers = new Headers(options.headers || {});
    headers.set('Authorization', `Bearer ${token}`);

    // Rückgabe des fetch-Aufrufs mit den kombinierten Optionen
    return fetch(url, {
        ...options,
        headers,
    });
};

// Get workspace data
export async function getWorkspaceMeta(workspaceId) {
    try {
        const response = await apiFetch(`${CONFIG.API_URL}/workspaces/${workspaceId}`, {
            method: 'GET',
        });
        return await response.json();
    } catch (err) {
        console.error('Fehler:', err.message);
    }
}

// Get all Workspaces for a User
export async function getWorkspaces() {
    try {
        const response = await apiFetch(`${CONFIG.API_URL}/workspaces`, {
            method: 'GET',
        });
        return await response.json();
    } catch (err) {
        console.error('Fehler:', err.message);
    }
}

// Create a new Workspace
export async function addWorkspace(body) {
    const response = await apiFetch(`${CONFIG.API_URL}/workspaces`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    return await response.json();
}

// Delete a Workspace
export async function deleteWorkspace(workspaceId) {
    const response = await apiFetch(`${CONFIG.API_URL}/workspaces/${workspaceId}`, {
        method: 'DELETE',
    });
}

// Request Access for Workspace
export async function requestAccess(accessLink) {
    const response = await apiFetch(`${CONFIG.API_URL}/workspaces/access`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessLink }), // Objekt -> JSON-String
    });
    return await response.json();
}

// Get all Cards in a Workspace
export async function getCards(workspaceId) {
    const response = await apiFetch(`${CONFIG.API_URL}/workspaces/${workspaceId}/cards`);
    return await response.json();
}

// Create a new Card in a Workspace
export async function addCard(workspaceId, mode, cardData) {
    const response = await apiFetch(`${CONFIG.API_URL}/workspaces/${workspaceId}/cards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...cardData, mode: mode }),
    });
    return await response.json();
}

// Delete a Card
export async function deleteCard(workspaceId, cardId) {
    const response = await apiFetch(`${CONFIG.API_URL}/workspaces/${workspaceId}/cards/${cardId}`, {
        method: 'DELETE',
    });
}

// Submits vote to card
export async function submitVote(cardId, vote) {
    // Nur gültige Werte zulassen
    if (![1, 0, -1].includes(vote)) {
        console.error('Ungültiger Vote-Wert:', vote);
        return;
    }

    try {
        const response = await apiFetch(`${CONFIG.API_URL}/vote`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cardId, vote })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Fehler beim Senden des Votes:', errorData.error);
            return;
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Netzwerkfehler beim Senden des Votes:', error);
    }
}

// Gets images from Unsplash
export async function fetchImages(query, index = 1) {
    if (!query || typeof query !== 'string') {
        throw new Error('Ein gültiger Suchbegriff (query) muss übergeben werden.');
    }

    if (typeof index !== 'number' || index < 1) {
        throw new Error('Der Parameter "index" muss eine positive Zahl sein.');
    }

    try {
        const url = `${CONFIG.API_URL}/images?q=${encodeURIComponent(query)}&index=${index}`;
        const response = await apiFetch(url);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Unbekannter Fehler beim Abrufen der Bilder');
        }

        const images = await response.json();
        return images; // Array mit Objekten { alt, src }
    } catch (error) {
        console.error('Fehler beim Abrufen der Bilder:', error);
        throw error;
    }
}