const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

// Definimos las rutas
router.get('/', eventController.getAllEvents);          // GET /events
router.get('/:id', eventController.getEventById);      // GET /events/:id
router.post('/', eventController.createEvent);         // POST /events
router.put('/:id', eventController.updateEvent);       // PUT /events/:id
router.delete('/:id', eventController.deleteEvent);    // DELETE /events/:id

module.exports = router;
