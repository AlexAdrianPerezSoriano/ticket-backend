# 🏗️ Diagrama de Arquitectura

## Visión General
El sistema está compuesto por 3 servicios principales orquestados con Docker Compose.
┌─────────────────────────────────────────────────────────────┐
│ USUARIO (Navegador) │
└─────────────────────────┬───────────────────────────────────┘
│
▼
┌─────────────────────────────────────────────────────────────┐
│ FRONTEND (React) │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ - Páginas: Login, Register, Home, EventDetail │ │
│ │ - Componentes: EventList, ReservationForm │ │
│ │ - Context: AuthContext (JWT) │ │
│ │ - Estilos: TailwindCSS │ │
│ │ - Puerto: 80 (Nginx) │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────┬───────────────────────────────────┘
│
│ HTTP / API
│ (Axios con JWT)
▼
┌─────────────────────────────────────────────────────────────┐
│ BACKEND (Node.js + Express) │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ - Endpoints: /events, /auth, /reservations │ │
│ │ - Middleware: authenticate, isAdmin │ │
│ │ - Controladores: eventController, authController │ │
│ │ - Modelos: Event, Reservation, User │ │
│ │ - JWT: jsonwebtoken para autenticación │ │
│ │ - Puerto: 5000 │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────┬───────────────────────────────────┘
│
│ MySQL Connection
│ (mysql2/promise)
▼
┌─────────────────────────────────────────────────────────────┐
│ BASE DE DATOS (MySQL) │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ - Tabla: events │ │
│ │ - Tabla: reservations │ │
│ │ - Tabla: users (con role: admin/user) │ │
│ │ - Puerto: 3306 │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘

## Flujo de Datos

1. **Usuario** → Frontend (React) → **Backend** (Node.js) → **MySQL**
2. **Autenticación:** Login → JWT → Almacenado en localStorage → Enviado en cada petición
3. **Reservas:** Usuario selecciona evento → Formulario → POST /reservations → Verifica disponibilidad → Actualiza tickets

## Tecnologías

| Capa | Tecnología | Versión |
|------|------------|---------|
| Frontend | React + Vite + TailwindCSS | 18 / 8 / 4 |
| Backend | Node.js + Express | 26 / 5 |
| Base de Datos | MySQL | 8.4 |
| Autenticación | JWT + bcryptjs | - |
| Tests | Jest + Supertest | 30 / 7 |
| Contenedores | Docker + Docker Compose | - |

## Seguridad

- **JWT:** Tokens firmados con `JWT_SECRET`
- **Roles:** Admin y User (middleware `isAdmin`)
- **CORS:** Configurado para permitir peticiones desde el frontend
- **bcryptjs:** Contraseñas hasheadas en la base de datos

## Escalabilidad

- **Horizontal:** Se pueden agregar más instancias del backend usando un load balancer
- **Vertical:** Se puede aumentar recursos de los contenedores
- **Base de Datos:** Se puede migrar a una instancia gestionada (AWS RDS, etc.)

## Mejoras Futuras

- [ ] Implementar Redis para sesiones y caché
- [ ] Agregar WebSockets para notificaciones en tiempo real
- [ ] Implementar CI/CD con GitHub Actions
- [ ] Agregar monitoreo con Prometheus + Grafana
- [ ] Implementar colas de mensajería (RabbitMQ) para reservas
