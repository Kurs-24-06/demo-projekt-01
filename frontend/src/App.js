// hauptkomponente der anwendung
import React, { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import Login from './components/Login';
import Register from './components/Register';
import authService from './services/authService';
import taskService from './services/taskService';
import './App.css';

function App() {
  // state für die task liste
  const [tasks, setTasks] = useState([]);
  // state für ladevorgang
  const [loading, setLoading] = useState(true);
  // state für fehler
  const [error, setError] = useState(null);
  // state für auth status
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // state für aktuellen benutzer
  const [currentUser, setCurrentUser] = useState(null);
  // state für die anzeige (login oder register)
  const [authView, setAuthView] = useState('login');

  // beim ersten render auth status prüfen und tasks laden wenn eingeloggt
  useEffect(() => {
    // prüfen ob ein token existiert
    const checkAuthStatus = () => {
      const loggedIn = authService.isLoggedIn();
      
      if (loggedIn) {
        setIsAuthenticated(true);
        setCurrentUser(authService.getCurrentUser());
        // tasks laden wenn eingeloggt
        fetchTasks();
      } else {
        setIsAuthenticated(false);
        setCurrentUser(null);
        setLoading(false);
      }
    };
    
    checkAuthStatus();
  }, []);

  // funktion zum laden der tasks vom backend
  const fetchTasks = async () => {
    try {
      setLoading(true);
      // tasks über service laden
      const data = await taskService.getTasks();
      
      // daten im state speichern
      setTasks(data);
      setError(null);
    } catch (err) {
      console.error('fehler beim laden der tasks:', err);
      setError('fehler beim laden der tasks');
      
      // bei 401 (unauthorized) ausloggen
      if (err.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  // funktion zum hinzufügen eines neuen tasks
  const addTask = async (task) => {
    try {
      // task über service erstellen
      const newTask = await taskService.createTask(task);
      
      // neuen task zur state liste hinzufügen
      setTasks([newTask, ...tasks]);
    } catch (err) {
      console.error('fehler beim erstellen des tasks:', err);
      setError('fehler beim erstellen des tasks');
      
      // bei 401 (unauthorized) ausloggen
      if (err.response?.status === 401) {
        handleLogout();
      }
    }
  };

  // funktion zum löschen eines tasks
  const deleteTask = async (id) => {
    try {
      // task über service löschen
      await taskService.deleteTask(id);
      
      // task aus dem state entfernen
      setTasks(tasks.filter(task => task._id !== id));
    } catch (err) {
      console.error('fehler beim löschen des tasks:', err);
      setError('fehler beim löschen des tasks');
      
      // bei 401 (unauthorized) ausloggen
      if (err.response?.status === 401) {
        handleLogout();
      }
    }
  };

  // funktion zum ändern des status eines tasks
  const toggleComplete = async (id, completed) => {
    try {
      // task über service aktualisieren
      const updatedTask = await taskService.updateTask(id, { completed: !completed });
      
      // task im state aktualisieren
      setTasks(tasks.map(task => 
        task._id === id ? updatedTask : task
      ));
    } catch (err) {
      console.error('fehler beim aktualisieren des tasks:', err);
      setError('fehler beim aktualisieren des tasks');
      
      // bei 401 (unauthorized) ausloggen
      if (err.response?.status === 401) {
        handleLogout();
      }
    }
  };

  // funktion zum login
  const handleLogin = async (username, password) => {
    try {
      // login über service
      const data = await authService.login(username, password);
      
      // auth status aktualisieren
      setIsAuthenticated(true);
      setCurrentUser(data.user);
      
      // tasks laden
      fetchTasks();
    } catch (err) {
      console.error('login fehler:', err);
      throw err; // fehler weitergeben an die login komponente
    }
  };

  // funktion zur registrierung
  const handleRegister = async (username, email, password) => {
    try {
      // registrierung über service
      const data = await authService.register(username, email, password);
      
      // auth status aktualisieren
      setIsAuthenticated(true);
      setCurrentUser(data.user);
      
      // tasks laden
      fetchTasks();
    } catch (err) {
      console.error('registrierung fehler:', err);
      throw err; // fehler weitergeben an die register komponente
    }
  };

  // funktion zum logout
  const handleLogout = () => {
    // logout über service
    authService.logout();
    
    // auth status aktualisieren
    setIsAuthenticated(false);
    setCurrentUser(null);
    setTasks([]);
  };

  // zwischen login und register wechseln
  const switchToRegister = () => setAuthView('register');
  const switchToLogin = () => setAuthView('login');

  return (
    <div className="app">
      <header>
        <h1>Task Manager</h1>
        <p>Eine Demo Multi-Tier-Anwendung mit Docker</p>
        
        {/* wenn eingeloggt, logout button anzeigen */}
        {isAuthenticated && (
          <div className="user-info">
            <span>
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                style={{ marginRight: '0.5rem', verticalAlign: 'middle' }}
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              {currentUser?.username}
            </span>
            <button className="logout-button" onClick={handleLogout}>
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                style={{ marginRight: '0.5rem', verticalAlign: 'middle' }}
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Abmelden
            </button>
          </div>
        )}
      </header>

      {/* wenn nicht eingeloggt, login oder register form anzeigen */}
      {!isAuthenticated ? (
        authView === 'login' ? (
          <Login 
            onLogin={handleLogin} 
            onSwitchToRegister={switchToRegister} 
          />
        ) : (
          <Register 
            onRegister={handleRegister} 
            onSwitchToLogin={switchToLogin} 
          />
        )
      ) : (
        // wenn eingeloggt, task manager anzeigen
        <>
          {/* TaskForm komponente zum erstellen neuer tasks */}
          <TaskForm onAddTask={addTask} />

          {/* fehlermeldung anzeigen, falls vorhanden */}
          {error && (
            <div className="error-message">
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                style={{ marginRight: '0.5rem', verticalAlign: 'middle' }}
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              {error}
            </div>
          )}

          {/* ladestatus anzeigen */}
          {loading ? (
            <div className="loading">
              <div className="loading-spinner"></div>
              <p>Lade Tasks...</p>
            </div>
          ) : (
            // TaskList komponente zum anzeigen der tasks
            <TaskList 
              tasks={tasks} 
              onDelete={deleteTask} 
              onToggleComplete={toggleComplete}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;