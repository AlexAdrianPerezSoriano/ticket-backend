const request = require('supertest');
const { app } = require('../app');
const pool = require('../config/database');

beforeEach(async () => {
  // Limpiar tablas
  await pool.query('DELETE FROM reservations');
  await pool.query('DELETE FROM events');
  await pool.query('ALTER TABLE events AUTO_INCREMENT = 1');
  
  // Insertar evento de prueba
  await pool.query(`
    INSERT INTO events (name, date, place, total_tickets, available_tickets) VALUES
    ('Evento para Reserva', '2026-12-25', 'Guayaquil', 100, 100)
  `);
});

afterAll(async () => {
  await pool.end();
});

describe('🎟️ Tests de Reservas', () => {

  describe('POST /reservations', () => {
    it('✅ Debe crear una reserva y reducir los tickets disponibles', async () => {
      const reservationData = {
        event_id: 1,
        user_name: 'Cliente Test',
        quantity: 5
      };

      const response = await request(app)
        .post('/reservations')
        .send(reservationData);
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('mensaje', 'Reserva exitosa');
      expect(response.body.reservation).toHaveProperty('id');
      expect(response.body.reservation).toHaveProperty('quantity', 5);

      // Verificar que los tickets disponibles se redujeron
      const [event] = await pool.query('SELECT available_tickets FROM events WHERE id = 1');
      expect(event[0].available_tickets).toBe(95);
    });

    it('❌ Debe devolver error si la cantidad supera los tickets disponibles', async () => {
      const reservationData = {
        event_id: 1,
        user_name: 'Cliente Test',
        quantity: 150 // Más de los 100 disponibles
      };

      const response = await request(app)
        .post('/reservations')
        .send(reservationData);
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('No hay suficientes tickets');
    });

    it('❌ Debe devolver error si faltan campos', async () => {
      const response = await request(app)
        .post('/reservations')
        .send({ event_id: 1 });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('mensaje', 'Faltan campos requeridos');
    });

    it('❌ Debe devolver error si el evento no existe', async () => {
	  const response = await request(app)
		.post('/reservations')
		.send({ event_id: 999, user_name: 'Test', quantity: 1 });
	  
	  expect(response.status).toBe(404);
	  expect(response.body).toHaveProperty('error', 'Evento no encontrado');
	});
  });
});
