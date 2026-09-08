# 🎟️ Ticket Reservation System - Backend

## 📌 Descripción
API RESTful para un sistema de reserva de tickets. 
Permite gestionar eventos, reservas y autenticación de usuarios con JWT. Desarrollado con Node.js, Express y MySQL.

## 🚀 Tecnologías
- Node.js (v26)
- Express (v5)
- MySQL (v8.4)
- JWT (Autenticación)
- bcryptjs (Encriptación)
- Jest + Supertest (Pruebas unitarias)
- Docker (Contenerización)

---

## 📦 Instalación y Ejecución

### Opción 1: Con Docker (Recomendado)
git clone https://github.com/AlexAdrianPerezSoriano/ticket-backend.git
cd ticket-backend
docker compose up --build

### Opción 2: Desarrollo local
npm install
npm run dev  # Desarrollo con autorecarga
npm start    # Producción

---

## 🔧 Variables de Entorno (.env)
Crea un archivo .env en la raíz del proyecto:

PORT=5000
DB_HOST=localhost
DB_USER=ticket_user
DB_PASSWORD=ticket_pass
DB_NAME=ticket_db
JWT_SECRET=mi-secreto-super-seguro

---

## 🔧 Endpoints de la API

### Autenticación
POST /auth/register  → Registrar usuario
POST /auth/login     → Iniciar sesión (devuelve JWT)

### Eventos
GET    /events        → Listar eventos (público)
GET    /events/:id    → Detalle evento (público)
POST   /events        → Crear evento (solo admin)
PUT    /events/:id    → Editar evento (solo admin)
DELETE /events/:id    → Eliminar evento (solo admin)

### Reservas
POST /reservations    → Crear reserva (público)

---

## 👥 Credenciales de Prueba

### Administrador
Email: admin@example.com
Contraseña: admin123

### Usuario Estándar
Email: user@example.com
Contraseña: user123

---

## 🗄️ Estructura de la Base de Datos

### Tabla events
id INT PRIMARY KEY
name VARCHAR(255)
date DATE
place VARCHAR(255)
total_tickets INT
available_tickets INT

### Tabla reservations
id INT PRIMARY KEY
event_id INT (FK -> events.id)
user_name VARCHAR(255)
quantity INT
reservation_date TIMESTAMP

### Tabla users
id INT PRIMARY KEY
name VARCHAR(255)
email VARCHAR(255) UNIQUE
password VARCHAR(255)
role ENUM('user', 'admin')

---

## 🗂️ Estructura del Proyecto

backend/
├── src/
│ ├── config/
│ │ └── database.js # Configuración de MySQL
│ ├── models/
│ │ ├── EventModel.js # Modelo de eventos
│ │ ├── ReservationModel.js # Modelo de reservas
│ │ └── UserModel.js # Modelo de usuarios
│ ├── controllers/
│ │ ├── eventController.js
│ │ ├── reservationController.js
│ │ └── authController.js
│ ├── routes/
│ │ ├── eventRoutes.js
│ │ ├── reservationRoutes.js
│ │ └── authRoutes.js
│ ├── middleware/
│ │ └── auth.js # Autenticación JWT
│ ├── tests/
│ │ ├── setup.js
│ │ ├── events.test.js
│ │ ├── auth.test.js
│ │ └── reservations.test.js
│ └── app.js # Punto de entrada
├── init.sql # Script de base de datos
├── Dockerfile
├── docker-compose.yml
├── package.json
└── .env.example

---

## 🧪 Pruebas Unitarias
npm test              # Ejecutar todas las pruebas
npm run test:watch    # Ejecutar con watch mode

Cobertura:
- Autenticación (registro, login, validaciones)
- Eventos (CRUD completo)
- Reservas (creación, validación de stock)

---

## 🐳 Dockerización
docker compose up --build

Servicios:
- db: MySQL 8.4
- backend: Node.js 26 + Express

---

## 📝 Autor
Alex Pérez Soriano
https://www.linkedin.com/in/alexperezsoriano/

## 📅 Fecha
Septiembre 2026

## 📄 Licencia
Este proyecto fue desarrollado como prueba técnica.