// routes definieren die api endpoints für tasks
const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// GET /api/tasks - alle tasks abrufen
router.get('/', async (req, res) => {
  try {
    // alle tasks aus der datenbank holen, nach erstelldatum sortiert
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    // fehlerbehandlung mit passendem status code
    console.error('fehler beim abrufen der tasks:', err);
    res.status(500).json({ message: 'serverfehler beim abrufen der tasks' });
  }
});

// POST /api/tasks - neuen task erstellen
router.post('/', async (req, res) => {
  try {
    // aus dem request body ein neues task objekt erstellen
    const newTask = new Task(req.body);
    
    // in der datenbank speichern
    const savedTask = await newTask.save();
    
    // den gespeicherten task zurückgeben (inkl. generierter id)
    res.status(201).json(savedTask);
  } catch (err) {
    console.error('fehler beim erstellen des tasks:', err);
    
    // bei validierungsfehlern geben wir 400 zurück
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    
    res.status(500).json({ message: 'serverfehler beim erstellen des tasks' });
  }
});

// DELETE /api/tasks/:id - task löschen
router.delete('/:id', async (req, res) => {
  try {
    // task anhand der id finden und löschen
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    
    if (!deletedTask) {
      // wenn task nicht gefunden wurde, 404 zurückgeben
      return res.status(404).json({ message: 'task nicht gefunden' });
    }
    
    res.json({ message: 'task erfolgreich gelöscht' });
  } catch (err) {
    console.error('fehler beim löschen des tasks:', err);
    res.status(500).json({ message: 'serverfehler beim löschen des tasks' });
  }
});

// PUT /api/tasks/:id - task aktualisieren
router.put('/:id', async (req, res) => {
  try {
    // task suchen und aktualisieren
    // new: true gibt das aktualisierte dokument zurück
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedTask) {
      return res.status(404).json({ message: 'task nicht gefunden' });
    }
    
    res.json(updatedTask);
  } catch (err) {
    console.error('fehler beim aktualisieren des tasks:', err);
    
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    
    res.status(500).json({ message: 'serverfehler beim aktualisieren des tasks' });
  }
});

module.exports = router;