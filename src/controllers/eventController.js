const EventModel = require('../models/EventModel');

// GET /events - Listar todos
const getAllEvents = async (req, res) => {
    try {
        const events = await EventModel.findAll();
        res.json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET /events/:id - Obtener uno
const getEventById = async (req, res) => {
    try {
        const event = await EventModel.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ mensaje: 'Evento no encontrado' });
        }
        res.json(event);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// POST /events - Crear (Admin)
const createEvent = async (req, res) => {
    try {
        const newEvent = await EventModel.create(req.body);
        res.status(201).json(newEvent);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PUT /events/:id - Actualizar (Admin)
const updateEvent = async (req, res) => {
    try {
        const updated = await EventModel.update(req.params.id, req.body);
        if (!updated) {
            return res.status(404).json({ mensaje: 'Evento no encontrado' });
        }
        res.json(updated);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// DELETE /events/:id - Eliminar (Admin)
const deleteEvent = async (req, res) => {
    try {
        const deleted = await EventModel.deleteEvent(req.params.id);
        if (!deleted) {
            return res.status(404).json({ mensaje: 'Evento no encontrado' });
        }
        res.status(204).send(); // Sin contenido
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent };
