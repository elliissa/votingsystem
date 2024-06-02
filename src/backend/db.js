const { Pool } = require('pg');

const pool = new Pool({
    user: 'adminuser',
    host: 'localhost',
    database: 'votingdb',
    password: 'adminpass',
    port: 5432,
});

module.exports = pool;
