const pool = require('../config/database');

// Obtener todos los eventos
const findAll = async () => {
    const [rows] = await pool.query('SELECT * FROM events ORDER BY date ASC');
    return rows;
};

// Obtener un evento por ID
const findById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM events WHERE id = ?', [id]);
    return rows[0];
};

// Crear un nuevo evento
const create = async (eventData) => {
    const { name, date, place, total_tickets, available_tickets } = eventData;
    const [result] = await pool.query(
        'INSERT INTO events (name, date, place, total_tickets, available_tickets) VALUES (?, ?, ?, ?, ?)',
        [name, date, place, total_tickets, available_tickets || total_tickets]
    );
    return { id: result.insertId, ...eventData };
};

// Actualizar un evento
const update = async (id, eventData) => {
    const { name, date, place, total_tickets, available_tickets } = eventData;
    const [result] = await pool.query(
        'UPDATE events SET name = ?, date = ?, place = ?, total_tickets = ?, available_tickets = ? WHERE id = ?',
        [name, date, place, total_tickets, available_tickets, id]
    );
    if (result.affectedRows === 0) return null;
    return { id, ...eventData };
};

// Eliminar un evento
const deleteEvent = async (id) => {
    const [result] = await pool.query('DELETE FROM events WHERE id = ?', [id]);
    return result.affectedRows > 0;
};

module.exports = { findAll, findById, create, update, deleteEvent };
