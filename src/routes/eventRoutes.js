const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { authenticate, isAdmin } = require('../middleware/auth');

// Rutas públicas (cualquiera puede ver)
router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);

// Rutas protegidas (solo administradores)
router.post('/', authenticate, isAdmin, eventController.createEvent);
router.put('/:id', authenticate, isAdmin, eventController.updateEvent);
router.delete('/:id', authenticate, isAdmin, eventController.deleteEvent);

module.exports = router;
