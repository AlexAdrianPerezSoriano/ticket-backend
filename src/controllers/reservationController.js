const ReservationModel = require('../models/ReservationModel');

// POST /reservations - Crear una reserva
const createReservation = async (req, res) => {
    try {
        const { event_id, user_name, quantity } = req.body;

        // Validaciones básicas
        if (!event_id || !user_name || !quantity) {
            return res.status(400).json({ mensaje: 'Faltan campos requeridos' });
        }
        if (quantity <= 0) {
            return res.status(400).json({ mensaje: 'La cantidad debe ser mayor a 0' });
        }

        const newReservation = await ReservationModel.create({ event_id, user_name, quantity });
        res.status(201).json({
            mensaje: 'Reserva exitosa',
            reservation: newReservation
        });
    } catch (error) {
        // Capturamos errores de disponibilidad
		if (error.message.includes('No hay suficientes tickets')) {
			return res.status(400).json({ error: error.message });
		}
		if (error.message.includes('Evento no encontrado')) {
			return res.status(404).json({ error: error.message });
		}
		res.status(500).json({ error: error.message });
    }
};

module.exports = { createReservation };
