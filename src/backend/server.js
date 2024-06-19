const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/auth/role/:accountId', async (req, res) => {
    const { accountId } = req.params;
    try {
        const result = await pool.query('SELECT role FROM users WHERE user_id = $1', [accountId]);
        if (result.rows.length > 0) {
            res.json({ role: result.rows[0].role });
        } else {
            res.json({ role: 'No role' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

app.post('/auth/login', async (req, res) => {
    const { user_id } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE user_id = $1', [user_id]);
        if (result.rows.length === 0) {
            await pool.query('INSERT INTO users (user_id, role) VALUES ($1, $2)', [user_id, 'user']);
            res.json({ message: 'User created with default role', role: 'user' });
        } else {
            res.json({ message: 'User already exists', role: result.rows[0].role });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/queue/join', async (req, res) => {
    const { user_id } = req.body;
    try {
        const roleResult = await pool.query('SELECT role FROM users WHERE user_id = $1', [user_id]);
        if (roleResult.rows.length === 0) {
            return res.status(400).json({ error: 'User does not exist' });
        }

        const role = roleResult.rows[0].role;
        if (role !== 'voter' && role !== 'admin') {
            return res.status(403).json({ error: 'Only voters and admins can join the queue' });
        }

        const result = await pool.query('SELECT * FROM queue WHERE user_id = $1', [user_id]);
        if (result.rows.length > 0) {
            return res.status(400).json({ error: 'User already in queue' });
        }

        const positionResult = await pool.query('SELECT MAX(position) AS max_position FROM queue');
        const position = (positionResult.rows[0].max_position || 0) + 1;

        await pool.query('INSERT INTO queue (user_id, position) VALUES ($1, $2)', [user_id, position]);
        res.json({ message: 'User joined the queue', position });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/queue/position/:accountId', async (req, res) => {
    const { accountId } = req.params;
    try {
        const result = await pool.query('SELECT position FROM queue WHERE user_id = $1', [accountId]);
        if (result.rows.length > 0) {
            res.json({ position: result.rows[0].position });
        } else {
            res.json({ position: null });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/queue/advance', async (req, res) => {
    const { user_id } = req.body;

    try {
        const result = await pool.query('SELECT position FROM queue WHERE user_id = $1', [user_id]);

        if (result.rowCount === 0) {
            return res.status(400).json({ error: 'User is not in the queue' });
        }

        const userPosition = result.rows[0].position;

        await pool.query('DELETE FROM queue WHERE user_id = $1', [user_id]);

        await pool.query('UPDATE queue SET position = position - 1 WHERE position > $1', [userPosition]);

        res.status(200).json({ message: 'User removed from the queue' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/candidates', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM candidates');
        res.json({ candidates: result.rows});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/vote', async (req, res) => {
    const { user_id, candidate_id } = req.body;
    try {
        const result = await pool.query('INSERT INTO votes(user_id, candidate_id) VALUES ($1, $2)', [user_id, candidate_id]);

        res.status(200).json({ message: 'User voted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});


// Add candidate
app.post('/candidates', async (req, res) => {
    const { name, user_id } = req.body;
    try {
        const result = await pool.query('INSERT INTO candidates (name, user_id) VALUES ($1, $2) RETURNING *', [name, user_id]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get vote count for a specific candidate
app.get('/votes/count/:user_id', async (req, res) => {
    const { user_id } = req.params;
    try {
        const result = await pool.query('SELECT COUNT(*) FROM votes WHERE candidate_id = (SELECT id FROM candidates WHERE user_id = $1)', [user_id]);
        res.json({ count: result.rows[0].count });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// update user role
app.post('/admin/updateRole', async (req, res) => {
    const { user_id, new_role } = req.body;

    try {
        await pool.query('UPDATE users SET role = $1 WHERE user_id = $2', [new_role, user_id]);
        res.json({ message: 'Role updated successfully' });
    } catch (error) {
        console.error('Error updating role:', error);
        res.status(500).json({ error: 'Failed to update role' });
    }
});

// get all users and their roles
app.get('/admin/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT user_id, role FROM users');
        res.json({ users: result.rows });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});




app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
