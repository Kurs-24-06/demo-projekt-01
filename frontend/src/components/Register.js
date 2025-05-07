// Register Komponente für die Benutzerregistrierung
import React, { useState } from 'react';

function Register({ onRegister, onSwitchToLogin }) {
  // state für die formularfelder
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // validierung der eingabefelder
    if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Bitte fülle alle Felder aus');
      return;
    }
    
    // passwort validierung
    if (password !== confirmPassword) {
      setError('Passwörter stimmen nicht überein');
      return;
    }
    
    if (password.length < 8) {
      setError('Passwort muss mindestens 8 Zeichen lang sein');
      return;
    }
    
    // einfache email validierung
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      setError('Bitte gib eine gültige E-Mail-Adresse ein');
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      
      // register funktion vom parent (app.js) aufrufen
      await onRegister(username, email, password);
      
      // formular zurücksetzen
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      // fehlermeldung vom backend anzeigen
      setError(err.message || 'Fehler bei der Registrierung. Bitte versuche es erneut.');
    } finally {
      setIsLoading(false);
    }
  };

  // Passwort-Stärke berechnen (einfache Version)
  const getPasswordStrength = (password) => {
    if (!password) return 0;
    
    let strength = 0;
    // Länge
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    
    // Komplexität
    if (/[A-Z]/.test(password)) strength += 1; // Großbuchstaben
    if (/[0-9]/.test(password)) strength += 1; // Zahlen
    if (/[^A-Za-z0-9]/.test(password)) strength += 1; // Sonderzeichen
    
    return Math.min(strength, 5); // Max 5
  };

  const passwordStrength = getPasswordStrength(password);
  
  // Funktion zur Anzeige der Passwortstärke
  const renderPasswordStrength = () => {
    if (!password) return null;
    
    const strengthLabels = ['Sehr schwach', 'Schwach', 'Mittel', 'Gut', 'Stark', 'Sehr stark'];
    const strengthColors = ['#ef4444', '#ef4444', '#f59e0b', '#f59e0b', '#10b981', '#10b981'];
    
    return (
      <div className="password-strength">
        <div className="strength-bars">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i} 
              className="strength-bar"
              style={{ 
                backgroundColor: i < passwordStrength ? strengthColors[passwordStrength] : '#e5e7eb',
              }}
            ></div>
          ))}
        </div>
        <span style={{ color: strengthColors[passwordStrength] }}>
          {strengthLabels[passwordStrength]}
        </span>
      </div>
    );
  };

  return (
    <div className="auth-form-container">
      <h2>Konto erstellen</h2>
      
      {/* fehlermeldung anzeigen, falls vorhanden */}
      {error && <div className="auth-error">{error}</div>}
      
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="reg-username">Benutzername</label>
          <input
            type="text"
            id="reg-username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Wähle einen Benutzernamen"
            required
            autoFocus
            minLength="3"
            maxLength="30"
          />
        </div>

        <div className="form-group">
          <label htmlFor="reg-email">E-Mail</label>
          <input
            type="email"
            id="reg-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Deine E-Mail-Adresse"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="reg-password">Passwort</label>
          <input
            type="password"
            id="reg-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Wähle ein sicheres Passwort (min. 8 Zeichen)"
            required
            minLength="8"
          />
          {renderPasswordStrength()}
        </div>

        <div className="form-group">
          <label htmlFor="reg-confirm-password">Passwort bestätigen</label>
          <input
            type="password"
            id="reg-confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Passwort erneut eingeben"
            required
          />
        </div>

        <button 
          type="submit" 
          className="auth-button" 
          disabled={isLoading || !username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()}
        >
          {isLoading ? 'Wird registriert...' : 'Registrieren'}
        </button>
      </form>
      
      <div className="auth-switch">
        <p>Bereits registriert?</p>
        <button 
          onClick={onSwitchToLogin} 
          className="auth-switch-button"
        >
          Anmelden
        </button>
      </div>
    </div>
  );
}

export default Register;