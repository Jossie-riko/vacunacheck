const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const personasRoutes = require('./routes/personas');

const app = express();
const PORT = 5001;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/personas', personasRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.json({ 
    message: ' API VacunaCheck funcionando correctamente',
    version: '1.0.0'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor VacunaCheck corriendo en http://localhost:${PORT}`);
});

module.exports = app;