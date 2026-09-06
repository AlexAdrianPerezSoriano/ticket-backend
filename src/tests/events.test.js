const request = require('supertest');
const { app } = require('../app');
const pool = require('../config/database');

// Limpiar la base de datos antes de cada prueba
beforeEach(async () => {
  await pool.query('DELETE FROM events');
  await pool.query('ALTER TABLE events AUTO_INCREMENT = 1');
  
  // Insertar eventos de prueba
  await pool.query(`
    INSERT INTO events (name, date, place, total_tickets, available_tickets) VALUES
    ('Concierto Test 1', '2026-12-01', 'Guayaquil', 100, 100),
    ('Concierto Test 2', '2026-12-15', 'Quito', 50, 50)
  `);
});

afterAll(async () => {
  await pool.end();
});

describe('📋 Tests de Eventos', () => {

  describe('GET /events', () => {
    it('✅ Debe devolver todos los eventos', async () => {
      const response = await request(app).get('/events');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      expect(response.body[0]).toHaveProperty('name', 'Concierto Test 1');
    });

    it('✅ Debe devolver eventos con los campos correctos', async () => {
      const response = await request(app).get('/events');
      
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('name');
      expect(response.body[0]).toHaveProperty('date');
      expect(response.body[0]).toHaveProperty('place');
      expect(response.body[0]).toHaveProperty('total_tickets');
      expect(response.body[0]).toHaveProperty('available_tickets');
    });
  });

  describe('GET /events/:id', () => {
    it('✅ Debe devolver un evento específico', async () => {
      const response = await request(app).get('/events/1');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).toHaveProperty('name', 'Concierto Test 1');
    });

    it('❌ Debe devolver 404 si el evento no existe', async () => {
      const response = await request(app).get('/events/999');
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('mensaje', 'Evento no encontrado');
    });
  });

  describe('POST /events (crear evento - admin)', () => {
    let adminToken = '';

	beforeAll(async () => {
	  // Limpiar usuarios
	  await pool.query('DELETE FROM users');
	  await pool.query('ALTER TABLE users AUTO_INCREMENT = 1');
	  
	  // Crear usuario admin
	  await request(app)
		.post('/auth/register')
		.send({ name: 'Admin Test', email: 'admin-test@example.com', password: 'admin123', role: 'admin' });
	  
	  // Iniciar sesión para obtener token
	  const loginResponse = await request(app)
		.post('/auth/login')
		.send({ email: 'admin-test@example.com', password: 'admin123' });
	  
	  adminToken = loginResponse.body.token;
	});

    it('✅ Debe crear un nuevo evento con token válido', async () => {
      const newEvent = {
        name: 'Nuevo Evento Test',
        date: '2026-12-25',
        place: 'Cuenca',
        total_tickets: 80
      };

      const response = await request(app)
        .post('/events')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newEvent);
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name', 'Nuevo Evento Test');
    });

    it('❌ Debe devolver error si faltan campos', async () => {
      const response = await request(app)
        .post('/events')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ name: 'Evento Incompleto' });
      
      expect(response.status).toBe(500);
    });
  });
});
