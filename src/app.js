// 1. Importaciones
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');

// 2. Cargar variables de entorno
dotenv.config();

// 3. Importar rutas
const eventRoutes = require('./routes/eventRoutes');
const reservationRoutes = require('./routes/reservationRoutes');

// 4. Crear la app
const app = express();
const PORT = process.env.PORT || 5000;

// 5. Middlewares
app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);

// 6. Rutas de la API
app.get('/', (req, res) => {
    res.json({ mensaje: 'API de Tickets funcionando con MySQL' });
});

app.use('/events', eventRoutes);          // Todas las rutas de eventos
app.use('/reservations', reservationRoutes); // Ruta de reservas

// 7. Manejo de errores 404 (rutas no encontradas)
app.use((req, res) => {
    res.status(404).json({ mensaje: 'Ruta no encontrada' });
});

// 8. Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en http://localhost:5000`);
});
