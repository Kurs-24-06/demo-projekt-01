// routes definieren die api endpoints für tasks
const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth');

// alle routes benötigen nun authentication
// auth middleware wird für alle routes in diesem router angewendet
router.use(auth);

// GET /api/tasks - alle tasks des eingeloggten benutzers abrufen
router.get('/', async (req, res) => {
  try {
    // nur tasks des eingeloggten benutzers abrufen
    // durch die auth middleware haben wir zugriff auf req.user.id
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
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
    // user id aus dem auth middleware hinzufügen
    const newTask = new Task({
      ...req.body,
      user: req.user.id // benutzer-id vom authentifizierten benutzer
    });
    
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
    // task anhand der id finden
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      // wenn task nicht gefunden wurde, 404 zurückgeben
      return res.status(404).json({ message: 'task nicht gefunden' });
    }
    
    // sicherstellen, dass der benutzer nur seine eigenen tasks löschen kann
    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'keine berechtigung zum löschen dieses tasks' });
    }
    
    // task löschen
    await Task.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'task erfolgreich gelöscht' });
  } catch (err) {
    console.error('fehler beim löschen des tasks:', err);
    res.status(500).json({ message: 'serverfehler beim löschen des tasks' });
  }
});

// PUT /api/tasks/:id - task aktualisieren
router.put('/:id', async (req, res) => {
  try {
    // task suchen
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'task nicht gefunden' });
    }
    
    // sicherstellen, dass der benutzer nur seine eigenen tasks aktualisieren kann
    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'keine berechtigung zum aktualisieren dieses tasks' });
    }
    
    // task aktualisieren
    // new: true gibt das aktualisierte dokument zurück
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
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