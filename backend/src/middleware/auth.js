// authentication middleware
const jwt = require('jsonwebtoken');

// jwt secret aus umgebungsvariable oder default
// in produktion IMMER eine starke, zufällige umgebungsvariable verwenden!
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// middleware zur validierung des jwt tokens
const auth = (req, res, next) => {
  try {
    // token aus dem authorization header extrahieren
    const authHeader = req.header('Authorization');
    
    // prüfen ob der header existiert und mit "Bearer " beginnt
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        message: 'Zugriff verweigert. Token fehlt oder hat ungültiges Format.' 
      });
    }

    // token ohne "Bearer " prefix
    const token = authHeader.replace('Bearer ', '');
    
    // token verifizieren und decodieren
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // userId und username an request objekt anhängen
    // damit hat jede geschützte route zugriff auf diese infos
    req.user = {
      id: decoded.userId,
      username: decoded.username
    };
    
    // weiter zur nächsten middleware oder route handler
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    // bei jwt fehler
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Ungültiger Token' });
    }
    
    // bei abgelaufenem token
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token abgelaufen, bitte erneut anmelden' });
    }
    
    // bei anderen fehlern
    res.status(500).json({ message: 'Server-Fehler bei Authentifizierung' });
  }
};

module.exports = auth;