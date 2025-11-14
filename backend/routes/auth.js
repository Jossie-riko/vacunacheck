    const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Ruta de Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Email y contraseña son requeridos' 
    });
  }

  const query = 'SELECT * FROM usuarios_sistema WHERE email = ?';
  
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error('Error en login:', err);
      return res.status(500).json({ 
        success: false, 
        message: 'Error en el servidor',
        details: err.message 
      });
    }

    if (results.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'Credenciales incorrectas' 
      });
    }

    const usuario = results[0];

    if (password !== usuario.password) {
      return res.status(401).json({ 
        success: false, 
        message: 'Credenciales incorrectas' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Login exitoso',
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  });
});

// Ruta de registro
router.post('/register', (req, res) => {
  const { nombre, email, password, rol } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Todos los campos son requeridos' 
    });
  }

  const query = 'INSERT INTO usuarios_sistema (nombre, email, password, rol) VALUES (?, ?, ?, ?)';
  
  db.query(query, [nombre, email, password, rol || 'usuario'], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ 
          success: false, 
          message: 'El email ya está registrado' 
        });
      }
      return res.status(500).json({ 
        success: false, 
        message: 'Error al registrar usuario'
      });
    }

    res.status(201).json({ 
      success: true, 
      message: 'Usuario registrado exitosamente'
    });
  });
});

module.exports = router;