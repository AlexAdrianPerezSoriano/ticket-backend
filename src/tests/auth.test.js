const request = require('supertest');
const { app } = require('../app');
const pool = require('../config/database');

beforeEach(async () => {
  await pool.query('DELETE FROM users');
  await pool.query('ALTER TABLE users AUTO_INCREMENT = 1');
});

afterAll(async () => {
  await pool.end();
});

describe('🔐 Tests de Autenticación', () => {

  describe('POST /auth/register', () => {
    it('✅ Debe registrar un nuevo usuario', async () => {
      const userData = {
        name: 'Usuario Test',
        email: 'test@example.com',
        password: 'test123',
        role: 'user'
      };

      const response = await request(app)
        .post('/auth/register')
        .send(userData);
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('mensaje', 'Usuario registrado');
      expect(response.body.user).toHaveProperty('email', 'test@example.com');
    });

    it('❌ Debe devolver error si el email ya existe', async () => {
      // Primero registramos un usuario
      await request(app)
        .post('/auth/register')
        .send({ name: 'Usuario 1', email: 'duplicado@example.com', password: '123456' });

      // Intentamos registrar el mismo email
      const response = await request(app)
        .post('/auth/register')
        .send({ name: 'Usuario 2', email: 'duplicado@example.com', password: '123456' });
      
      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('mensaje', 'El email ya está registrado');
    });

    it('❌ Debe devolver error si faltan campos', async () => {
      const response = await request(app)
        .post('/auth/register')
        .send({ email: 'incompleto@example.com' });
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('mensaje', 'Todos los campos son requeridos');
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      // Crear un usuario para las pruebas de login
      await request(app)
        .post('/auth/register')
        .send({ name: 'Login Test', email: 'login@example.com', password: 'login123' });
    });

    it('✅ Debe iniciar sesión con credenciales correctas', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'login@example.com', password: 'login123' });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('mensaje', 'Login exitoso');
      expect(response.body.user).toHaveProperty('email', 'login@example.com');
    });

    it('❌ Debe devolver error con contraseña incorrecta', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'login@example.com', password: 'wrongpassword' });
      
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('mensaje', 'Credenciales inválidas');
    });

    it('❌ Debe devolver error con email inexistente', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ email: 'noexiste@example.com', password: '123456' });
      
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('mensaje', 'Credenciales inválidas');
    });
  });
});
