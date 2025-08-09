import { Router } from 'express';
import { pool } from '../db/db.js';
import validateToken from '../services/validateToken.js';
const router = Router({ mergeParams: true });

// POST create code
router.post('/create', async (req, res) => {
    let user
    try {
        user = await validateToken(req.headers['authorization']);
    } catch (err) {
        res.status(400).json({ error: 'Session error' });
    }
    const userId = user.id;
    const { workspaceId, validHours, maxUses } = req.body;

    if (!userId) {
        return res.status(401).json({ error: 'Nicht authentifiziert' });
    }

    if (!workspaceId) {
        return res.status(400).json({ error: 'workspaceId ist erforderlich' });
    }

    let code = createCode();

    try {
        let codeExists = true;
        while (codeExists) {
            const result = await pool.query('SELECT COUNT(*) FROM invites WHERE code = $1', [code]);
            if (parseInt(result.rows[0].count) === 0) {
                codeExists = false; // Code ist einzigartig
            } else {
                code = createCode(); // Generiere neuen Code
            }
        }

        // Berechne das Ablaufdatum
        const expiresAt = new Date(Date.now() + validHours * 60 * 60 * 1000); // 24 Stunden

        // Setze das Nutzungslimit
        const usesLeft = maxUses;

        // Erstelle den Datensatz in der DB
        await pool.query(
            'INSERT INTO invites (created_at, expires_at, uses_left, code, ref) VALUES (NOW(), $1, $2, $3, $4)',
            [expiresAt, usesLeft, code, workspaceId]
        );

        // Antworte mit dem generierten Code
        res.status(201).json({
            message: 'Invite created successfully',
            code,
            expires_at: expiresAt,
            uses_left: usesLeft,
        });
    } catch (error) {
        console.error('Error creating invite:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST access to workspace
router.post('/access', async (req, res) => {
    let user
    try {
        user = await validateToken(req.headers['authorization']);
    } catch (err) {
        res.status(400).json({ error: 'Session error' });
    }
    const userId = user.id;
    const { code } = req.body;

    if (!userId) {
        return res.status(401).json({ error: 'Nicht authentifiziert' });
    }

    if (!code) {
        return res.status(400).json({ error: 'workspaceId ist erforderlich' });
    }

    try {
        cleanupInvites()

        const result = await pool.query(
            'SELECT id, expires_at, uses_left, ref FROM invites WHERE code = $1',
            [code]
        );

        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid code' });
        }
        const invite = result.rows[0];
        console.log(invite)

        // Alles ok, Code ist gültig – Reduziere uses_left und führe die Hinzufügung durch
        await pool.query(
            'UPDATE invites SET uses_left = uses_left - 1 WHERE id = $1',
            [invite.id]
        );

        // Prüfen, ob der Benutzer bereits Zugriff auf den Workspace hat
        const existing = await pool.query(`
            SELECT * FROM workspace_users WHERE workspace_id = $1 AND user_id = $2
        `, [invite.ref, userId]);

        if (existing.rows.length > 0) {
            return res.status(400).json({ error: 'Benutzer ist bereits Mitglied des Workspaces' });
        }

        // Benutzer hinzufügen
        await pool.query(`
            INSERT INTO workspace_users (workspace_id, user_id, role) VALUES ($1, $2, 'member')
        `, [invite.ref, userId]);

        res.status(200).json({ message: 'user added to workspace' });
    } catch (err) {
        console.error('Fehler beim Hinzufügen zum Workspace:', err);
        res.status(500).json({ error: 'Fehler beim Hinzufügen zum Workspace' });
    }
});

// POST leave workspace
router.post('/leave', async (req, res) => {
    let user;
    try {
        user = await validateToken(req.headers['authorization']);
    } catch (err) {
        return res.status(400).json({ error: 'Session error' });
    }
    const userId = user.id;
    const { workspaceId } = req.body;

    if (!userId) {
        return res.status(401).json({ error: 'Nicht authentifiziert' });
    }

    if (!workspaceId) {
        return res.status(400).json({ error: 'workspaceId ist erforderlich' });
    }

    try {
        // Überprüfen, ob der Benutzer Mitglied des Workspaces ist
        const existing = await pool.query(`
            SELECT * FROM workspace_users WHERE workspace_id = $1 AND user_id = $2
        `, [workspaceId, userId]);

        if (existing.rows.length === 0) {
            return res.status(400).json({ error: 'Benutzer ist nicht Mitglied dieses Workspaces' });
        }

        // Entfernen des Benutzers aus dem Workspace
        await pool.query(`
            DELETE FROM workspace_users WHERE workspace_id = $1 AND user_id = $2
        `, [workspaceId, userId]);

        res.status(200).json({ message: 'Benutzer wurde erfolgreich aus dem Workspace entfernt' });
    } catch (err) {
        console.error('Fehler beim Verlassen des Workspaces:', err);
        res.status(500).json({ error: 'Fehler beim Verlassen des Workspaces' });
    }
});


export default router;

const createCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase(); // Beispiel-Code (6-stellig)
}

async function cleanupInvites() {
    try {
        // Lösche alle abgelaufenen Codes (expires_at < NOW()) oder Codes ohne Verwendungen mehr (uses_left <= 0)
        const result = await pool.query(
            'DELETE FROM invites WHERE expires_at < NOW() OR uses_left <= 0'
        );

        console.log(`Cleanup: ${result.rowCount} invites deleted.`);
    } catch (error) {
        console.error('Error during cleanup:', error);
    }
}
