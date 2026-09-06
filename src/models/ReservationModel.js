const pool = require('../config/database');

// Crear una nueva reserva (y disminuir los tickets disponibles)
const create = async (reservationData) => {
    const { event_id, user_name, quantity } = reservationData;

    // 1. Verificar disponibilidad
    const [eventRows] = await pool.query('SELECT available_tickets FROM events WHERE id = ? FOR UPDATE', [event_id]);
    if (eventRows.length === 0) {
        throw new Error('Evento no encontrado');
    }
    const available = eventRows[0].available_tickets;
    if (quantity > available) {
        throw new Error(`No hay suficientes tickets. Disponibles: ${available}`);
    }

    // 2. Insertar la reserva
    const [result] = await pool.query(
        'INSERT INTO reservations (event_id, user_name, quantity) VALUES (?, ?, ?)',
        [event_id, user_name, quantity]
    );

    // 3. Actualizar los tickets disponibles (restar los reservados)
    await pool.query(
        'UPDATE events SET available_tickets = available_tickets - ? WHERE id = ?',
        [quantity, event_id]
    );

    return {
        id: result.insertId,
        event_id,
        user_name,
        quantity,
        reservation_date: new Date()
    };
};

module.exports = { create };
