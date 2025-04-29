// main server datei - hier wird alles zusammengeführt

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const taskRoutes = require('./routes/taskRoutes');

// express app erstellen
const app = express();
const PORT = process.env.PORT || 5000;

// middleware für json parsing und cors
app.use(express.json());  // damit können wir json im request body verarbeiten
app.use(cors());  // erlaubt requests vom frontend (cross-origin)

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
app.use('/api/tasks', taskRoutes);  // alle task routen unter /api/tasks

// einfache health-check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'task-manager-api' });
});

// server starten
app.listen(PORT, () => {
  console.log(`server läuft auf port ${PORT}`);
});