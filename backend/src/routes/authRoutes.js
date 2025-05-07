// routes definieren die api endpoints für authentication
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

// jwt secret aus umgebungsvariable oder default
// in produktion IMMER eine starke, zufällige umgebungsvariable verwenden!
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
// token gültigkeit in sekunden (24 stunden)
const JWT_EXPIRES_IN = 86400;

// POST /api/auth/register - neuen benutzer registrieren
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // prüfen ob username oder email bereits existiert
    const existingUser = await User.findOne({ 
      $or: [{ username }, { email }] 
    });
    
    if (existingUser) {
      // detaillierte fehlermeldung, welches feld bereits existiert
      if (existingUser.username === username) {
        return res.status(400).json({ message: 'Benutzername bereits vergeben' });
      }
      return res.status(400).json({ message: 'E-Mail-Adresse bereits registriert' });
    }
    
    // validierung der eingabefelder
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Alle Felder müssen ausgefüllt werden' });
    }
    
    if (password.length < 8) {
      return res.status(400).json({ 
        message: 'Das Passwort muss mindestens 8 Zeichen lang sein' 
      });
    }

    // neuen benutzer erstellen
    // passwort wird durch den pre-save hook automatisch gehasht
    const newUser = new User({ username, email, password });
    await newUser.save();
    
    // token mit userId und username erstellen
    const token = jwt.sign(
      { userId: newUser._id, username: newUser.username }, 
      JWT_SECRET, 
      { expiresIn: JWT_EXPIRES_IN } 
    );
    
    // erfolgreiche antwort mit token und user info (ohne passwort)
    res.status(201).json({
      message: 'Benutzer erfolgreich registriert',
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email
      }
    });
  } catch (err) {
    console.error('Fehler bei der Registrierung:', err);
    res.status(500).json({ message: 'Serverfehler bei der Registrierung' });
  }
});

// POST /api/auth/login - benutzer einloggen
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // benutzer suchen (entweder nach username oder email)
    const user = await User.findOne({
      $or: [{ username }, { email: username }]
    });
    
    // wenn benutzer nicht gefunden oder passwort falsch
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Ungültige Anmeldeinformationen' });
    }
    
    // token mit userId und username erstellen
    const token = jwt.sign(
      { userId: user._id, username: user.username }, 
      JWT_SECRET, 
      { expiresIn: JWT_EXPIRES_IN } 
    );
    
    // last login aktualisieren
    user.lastLogin = Date.now();
    await user.save();
    
    // erfolgreiche antwort mit token und user info (ohne passwort)
    res.json({
      message: 'Erfolgreich angemeldet',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Fehler beim Login:', err);
    res.status(500).json({ message: 'Serverfehler beim Login' });
  }
});

// GET /api/auth/me - aktuellen benutzer abrufen (geschützte route)
router.get('/me', auth, async (req, res) => {
  try {
    // benutzer aus der datenbank holen (ohne passwort)
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'Benutzer nicht gefunden' });
    }
    
    res.json(user);
  } catch (err) {
    console.error('Fehler beim Abrufen des Benutzerprofils:', err);
    res.status(500).json({ message: 'Serverfehler beim Abrufen des Profils' });
  }
});

module.exports = router;