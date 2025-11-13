const express = require('express');
const router = express.Router();
const db = require('../config/database');

// ==================== READ ====================

// Obtener todas las personas
router.get('/', (req, res) => {
  const query = 'SELECT * FROM personas_vacunadas ORDER BY fecha_registro DESC';
  
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: 'Error al obtener personas'
      });
    }
    res.json({
      success: true,
      data: results
    });
  });
});

// Obtener una persona por ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM personas_vacunadas WHERE id = ?';
  
  db.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: 'Error al obtener persona'
      });
    }
    
    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Persona no encontrada'
      });
    }
    
    res.json({
      success: true,
      data: results[0]
    });
  });
});

// ==================== CREATE ====================

router.post('/', (req, res) => {
  const {
    nombre_completo, documento, email, telefono, fecha_nacimiento,
    tipo_sangre, vacuna_aplicada, dosis_numero, fecha_aplicacion,
    lote_vacuna, proxima_dosis, observaciones
  } = req.body;

  if (!nombre_completo || !documento || !email || !fecha_nacimiento || 
      !vacuna_aplicada || !dosis_numero || !fecha_aplicacion) {
    return res.status(400).json({
      success: false,
      message: 'Faltan campos obligatorios'
    });
  }

  const query = `
    INSERT INTO personas_vacunadas 
    (nombre_completo, documento, email, telefono, fecha_nacimiento, tipo_sangre,
     vacuna_aplicada, dosis_numero, fecha_aplicacion, lote_vacuna, proxima_dosis, observaciones)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [nombre_completo, documento, email, telefono, fecha_nacimiento,
    tipo_sangre, vacuna_aplicada, dosis_numero, fecha_aplicacion,
    lote_vacuna, proxima_dosis, observaciones], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({
          success: false,
          message: 'El documento ya está registrado'
        });
      }
      return res.status(500).json({
        success: false,
        error: 'Error al crear persona'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Persona registrada exitosamente',
      data: { id: result.insertId }
    });
  });
});

// ==================== UPDATE ====================

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const {
    nombre_completo, documento, email, telefono, fecha_nacimiento,
    tipo_sangre, vacuna_aplicada, dosis_numero, fecha_aplicacion,
    lote_vacuna, proxima_dosis, observaciones
  } = req.body;

  const query = `
    UPDATE personas_vacunadas SET
      nombre_completo = ?, documento = ?, email = ?, telefono = ?,
      fecha_nacimiento = ?, tipo_sangre = ?, vacuna_aplicada = ?,
      dosis_numero = ?, fecha_aplicacion = ?, lote_vacuna = ?,
      proxima_dosis = ?, observaciones = ?
    WHERE id = ?
  `;

  db.query(query, [nombre_completo, documento, email, telefono, fecha_nacimiento,
    tipo_sangre, vacuna_aplicada, dosis_numero, fecha_aplicacion,
    lote_vacuna, proxima_dosis, observaciones, id], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: 'Error al actualizar persona'
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Persona no encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Persona actualizada exitosamente'
    });
  });
});

// ==================== DELETE ====================

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM personas_vacunadas WHERE id = ?';
  
  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        error: 'Error al eliminar persona'
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Persona no encontrada'
      });
    }

    res.json({
      success: true,
      message: 'Persona eliminada exitosamente'
    });
  });
});

module.exports = router;