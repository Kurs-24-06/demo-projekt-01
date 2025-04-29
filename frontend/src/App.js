// hauptkomponente der anwendung
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import './App.css';

function App() {
  // state für die task liste
  const [tasks, setTasks] = useState([]);
  // state für ladevorgang
  const [loading, setLoading] = useState(true);
  // state für fehler
  const [error, setError] = useState(null);

  // api basis url aus umgebungsvariable oder default
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // beim ersten render tasks laden
  useEffect(() => {
    fetchTasks();
  }, []);

  // funktion zum laden der tasks vom backend
  const fetchTasks = async () => {
    try {
      setLoading(true);
      // http request an unser backend
      const response = await axios.get(`${API_URL}/tasks`);
      
      // daten im state speichern
      setTasks(response.data);
      setError(null);
    } catch (err) {
      console.error('fehler beim laden der tasks:', err);
      setError('fehler beim laden der tasks');
    } finally {
      setLoading(false);
    }
  };

  // funktion zum hinzufügen eines neuen tasks
  const addTask = async (task) => {
    try {
      // post request an unser backend
      const response = await axios.post(`${API_URL}/tasks`, task);
      
      // neuen task zur state liste hinzufügen
      setTasks([response.data, ...tasks]);
    } catch (err) {
      console.error('fehler beim erstellen des tasks:', err);
      setError('fehler beim erstellen des tasks');
    }
  };

  // funktion zum löschen eines tasks
  const deleteTask = async (id) => {
    try {
      // delete request an unser backend
      await axios.delete(`${API_URL}/tasks/${id}`);
      
      // task aus dem state entfernen
      setTasks(tasks.filter(task => task._id !== id));
    } catch (err) {
      console.error('fehler beim löschen des tasks:', err);
      setError('fehler beim löschen des tasks');
    }
  };

  // funktion zum ändern des status eines tasks
  const toggleComplete = async (id, completed) => {
    try {
      // put request an unser backend
      const response = await axios.put(`${API_URL}/tasks/${id}`, { 
        completed: !completed 
      });
      
      // task im state aktualisieren
      setTasks(tasks.map(task => 
        task._id === id ? response.data : task
      ));
    } catch (err) {
      console.error('fehler beim aktualisieren des tasks:', err);
      setError('fehler beim aktualisieren des tasks');
    }
  };

  return (
    <div className="app">
      <header>
        <h1>Task Manager</h1>
        <p>Eine Demo Multi-Tier-Anwendung mit Docker</p>
      </header>

      {/* TaskForm komponente zum erstellen neuer tasks */}
      <TaskForm onAddTask={addTask} />

      {/* fehlermeldung anzeigen, falls vorhanden */}
      {error && <div className="error-message">{error}</div>}

      {/* ladestatus anzeigen */}
      {loading ? (
        <div className="loading">Lade Tasks...</div>
      ) : (
        // TaskList komponente zum anzeigen der tasks
        <TaskList 
          tasks={tasks} 
          onDelete={deleteTask} 
          onToggleComplete={toggleComplete}
        />
      )}
    </div>
  );
}

export default App;