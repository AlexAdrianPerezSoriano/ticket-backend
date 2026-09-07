const pool = require('../config/database');
const bcrypt = require('bcryptjs');

const findByEmail = async (email) => {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
};

const create = async (userData) => {
    const { name, email, password, role = 'user' } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
    [name, email, hashedPassword, role] // <-- Guarda el rol
  );
    return { id: result.insertId, name, email, role };
};

const verifyPassword = async (user, password) => {
    return await bcrypt.compare(password, user.password);
};

module.exports = { findByEmail, create, verifyPassword };
