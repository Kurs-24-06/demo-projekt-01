// Login Komponente für die Benutzerauthentifizierung
import React, { useState } from 'react';

function Login({ onLogin, onSwitchToRegister }) {
  // state für die formularfelder
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // validierung der eingabefelder
    if (!username.trim() || !password.trim()) {
      setError('Bitte fülle alle Felder aus');
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      
      // login funktion vom parent (app.js) aufrufen
      await onLogin(username, password);
      
      // formular zurücksetzen
      setUsername('');
      setPassword('');
    } catch (err) {
      // fehlermeldung vom backend anzeigen
      setError(err.message || 'Fehler beim Login. Bitte versuche es erneut.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <h2>Willkommen zurück</h2>
      
      {/* fehlermeldung anzeigen falls vorhanden */}
      {error && <div className="auth-error">{error}</div>}
      
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Benutzername oder E-Mail</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Gib deinen Benutzernamen oder E-Mail ein"
            required
            autoFocus
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Passwort</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Gib dein Passwort ein"
            required
          />
        </div>

        <button 
          type="submit" 
          className="auth-button" 
          disabled={isLoading || !username.trim() || !password.trim()}
        >
          {isLoading ? (
            <span>
              <svg className="spinner" viewBox="0 0 50 50">
                <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
              </svg>
              Anmeldung...
            </span>
          ) : (
            'Anmelden'
          )}
        </button>
      </form>
      
      <div className="auth-switch">
        <p>Noch kein Konto?</p>
        <button 
          onClick={onSwitchToRegister} 
          className="auth-switch-button"
        >
          Registrieren
        </button>
      </div>
    </div>
  );
}

export default Login;