import { Router } from 'express';
import { pool } from '../db/db.js';
import validateToken from '../services/validateToken.js';
const router = Router({ mergeParams: true });

// GET all workspaces for a user
router.get('/', async (req, res) => {
    let user
    try {
        user = await validateToken(req.headers['authorization']);
    } catch (err) {
        res.status(400).json({ error: 'Session error' });
    }
    const userId = user.id

    if (!userId) { return res.status(401).json({ error: 'Nicht authentifiziert' }); }

    try {
        const result = await pool.query(`
            SELECT w.*
            FROM workspaces w
            JOIN workspace_users wu ON w.id = wu.workspace_id
            WHERE wu.user_id = $1`,
            [userId]
        );
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Failed to fetch workspaces:', err)
        res.status(500).json({ error: 'Failed to fetch workspaces' });
    }
});

// GET data from 
router.get('/:workspaceId', async (req, res) => {
    let user
    try {
        user = await validateToken(req.headers['authorization']);
    } catch (err) {
        res.status(400).json({ error: 'Session error' });
    }
    const userId = user.id

    if (!userId) { return res.status(401).json({ error: 'Nicht authentifiziert' }); }

    const { workspaceId } = req.params;

    try {
        const result = await pool.query(
            `SELECT id, name, image, owner_id, created_at FROM workspaces WHERE id = $1`,
            [workspaceId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Workspace nicht gefunden' });
        }

        const workspace = result.rows[0];

        const access = await checkWorkspaceAccess(userId, workspaceId);
        if (!access) return res.status(403).json({ error: 'Access denied' });

        return res.json(workspace);
    } catch (err) {
        console.error('Fehler beim Laden des Workspace:', err);
        return res.status(500).json({ error: 'Interner Serverfehler' });
    }
});

// POST create new workspace for a user
router.post('/', async (req, res) => {
    let user
    try {
        user = await validateToken(req.headers['authorization']);
    } catch (err) {
        res.status(400).json({ error: 'Session error' });
    }
    const userId = user.id

    const { name, image } = req.body;

    if (!userId) { return res.status(401).json({ error: 'Nicht authentifiziert' }); }

    try {
        const result = await pool.query(`
            INSERT INTO workspaces (name, image, owner_id) VALUES ($1, $2, $3) RETURNING *`,
            [name, image, userId]
        );
        const workspace = result.rows[0];
        await pool.query(`
            INSERT INTO workspace_users (workspace_id, user_id, role) VALUES ($1, $2, 'owner')`,
            [workspace.id, userId]
        );
        res.status(201).json(workspace);
    } catch (err) {
        console.error('Failed to create workspace:', err)
        res.status(500).json({ error: 'Failed to create workspace' });
    }
});

// PUT all workspaces for a user
router.put('/:workspaceId', async (req, res) => {
    let user
    try {
        user = await validateToken(req.headers['authorization']);
    } catch (err) {
        res.status(400).json({ error: 'Session error' });
    }
    const userId = user.id
    const { workspaceId } = req.params;

    const { name, image } = req.body;

    if (!userId) { return res.status(401).json({ error: 'Nicht authentifiziert' }); }

    const access = await checkWorkspaceAdminAccess(userId, workspaceId);
    if (!access) return res.status(403).json({ error: 'Access denied' });

    try {
        const result = await pool.query(`
            UPDATE workspaces 
            SET name = $1, image = $2 
            WHERE id = $3
            RETURNING *`,
            [name, image, workspaceId]
        );
        const workspace = result.rows[0];
        res.status(201).json(workspace);
    } catch (err) {
        console.error('Failed to create workspace:', err)
        res.status(500).json({ error: 'Failed to create workspace' });
    }
});

// DELETE a specific workspace
router.delete('/:workspaceId', async (req, res) => {
    let user
    try {
        user = await validateToken(req.headers['authorization']);
    } catch (err) {
        res.status(400).json({ error: 'Session error' });
    }
    const userId = user.id
    const { workspaceId } = req.params;

    if (!userId) { return res.status(401).json({ error: 'Nicht authentifiziert' }); }

    try {
        // Prüfen, ob der Nutzer Owner des Workspace ist
        const access = await checkWorkspaceAdminAccess(userId, workspaceId);
        if (!access) return res.status(403).json({ error: 'Access denied' });

        // Wenn Owner, dann löschen
        const result = await pool.query(
            `DELETE FROM workspaces WHERE id = $1 RETURNING *`,
            [workspaceId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Workspace nicht gefunden' });
        }

        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('Failed to delete workspace:', err);
        res.status(500).json({ error: 'Fehler beim Löschen des Workspaces' });
    }
});

export default router;

async function checkWorkspaceAccess(userId, workspaceId) {
    const access = await pool.query(`
        SELECT * FROM workspace_users WHERE workspace_id = $1 AND user_id = $2`,
        [workspaceId, userId]
    );
    return (access.rowCount !== 0);
}

async function checkWorkspaceAdminAccess(userId, workspaceId) {
    const access = await pool.query(`
        SELECT * FROM workspaces WHERE id = $1 AND owner_id = $2`,
        [workspaceId, userId]
    );
    return (access.rowCount !== 0);
}