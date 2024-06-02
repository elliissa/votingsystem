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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
