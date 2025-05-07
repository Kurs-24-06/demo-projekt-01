// main server datei - hier wird alles zusammengeführt

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');

// express app erstellen
const app = express();
const PORT = process.env.PORT || 5000;

// middleware für json parsing und cors
app.use(express.json());  // damit können wir json im request body verarbeiten
app.use(cors({
  // konfiguration der cors optionen für sicherheit
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', // nur anfragen von dieser domain erlauben
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // erlaubte http methoden
  allowedHeaders: ['Content-Type', 'Authorization'] // erlaubte header
}));

// mongo connection string aus umgebungsvariable oder default
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/taskdb';

// zur datenbank verbinden
mongoose.connect(MONGO_URI)
  .then(() => console.log('mit mongodb verbunden'))
  .catch(err => {
    // bei verbindungsfehler loggen wir den fehler
    console.error('mongo verbindungsfehler:', err);
    process.exit(1);  // server beenden bei db fehler
  });

// api routes
app.use('/api/auth', authRoutes);  // auth routen unter /api/auth
app.use('/api/tasks', taskRoutes);  // task routen unter /api/tasks

// einfache health-check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'task-manager-api' });
});

// 404 handler für nicht existierende routen
app.use((req, res) => {
  res.status(404).json({ message: 'Route nicht gefunden' });
});

// globaler error handler
app.use((err, req, res, next) => {
  console.error('Unbehandelter Fehler:', err);
  res.status(500).json({ 
    message: 'Ein Server-Fehler ist aufgetreten',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// server starten
app.listen(PORT, () => {
  console.log(`server läuft auf port ${PORT}`);
});