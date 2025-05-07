// Service für die Kommunikation mit der Task API
import axios from 'axios';

// API basis URL aus der Umgebungsvariable oder default
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Authentifizierten Axios Client erstellen
const createAuthClient = () => {
  const token = localStorage.getItem('token');
  return axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
  });
};

// Task service mit allen API funktionen
const taskService = {
  // Alle Tasks abrufen
  getTasks: async () => {
    try {
      const authClient = createAuthClient();
      const response = await authClient.get('/tasks');
      return response.data;
    } catch (error) {
      console.error('Fehler beim Abrufen der Tasks:', error);
      throw error;
    }
  },
  
  // Neuen Task erstellen
  createTask: async (task) => {
    try {
      const authClient = createAuthClient();
      const response = await authClient.post('/tasks', task);
      return response.data;
    } catch (error) {
      console.error('Fehler beim Erstellen des Tasks:', error);
      throw error;
    }
  },
  
  // Task aktualisieren
  updateTask: async (id, updates) => {
    try {
      const authClient = createAuthClient();
      const response = await authClient.put(`/tasks/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Tasks:', error);
      throw error;
    }
  },
  
  // Task löschen
  deleteTask: async (id) => {
    try {
      const authClient = createAuthClient();
      const response = await authClient.delete(`/tasks/${id}`);
      return response.data;
    } catch (error) {
      console.error('Fehler beim Löschen des Tasks:', error);
      throw error;
    }
  }
};

export default taskService;