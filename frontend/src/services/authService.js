// Service für die Kommunikation mit der Authentication API
import axios from 'axios';

// API basis URL aus der Umgebungsvariable oder default
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Token aus dem localStorage holen
const getToken = () => localStorage.getItem('token');

// Authentifizierten Axios Client erstellen
const createAuthClient = () => {
  const token = getToken();
  return axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
    },
  });
};

// Auth service mit allen API funktionen
const authService = {
  // Benutzer registrieren
  register: async (username, email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        username,
        email,
        password,
      });
      
      // Token im localStorage speichern
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      // Fehlermeldung aus dem Backend extrahieren
      const message = error.response?.data?.message || 
                     'Ein Fehler ist bei der Registrierung aufgetreten';
      throw new Error(message);
    }
  },
  
  // Benutzer einloggen
  login: async (username, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        username,
        password,
      });
      
      // Token im localStorage speichern
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error) {
      // Fehlermeldung aus dem Backend extrahieren
      const message = error.response?.data?.message || 
                     'Ein Fehler ist beim Login aufgetreten';
      throw new Error(message);
    }
  },
  
  // Benutzer ausloggen
  logout: () => {
    // Token und User aus dem localStorage entfernen
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  // Aktuellen Benutzer abrufen
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Fehler beim Parsen des Benutzers:', error);
      return null;
    }
  },
  
  // Prüfen ob ein Benutzer eingeloggt ist
  isLoggedIn: () => {
    return !!getToken() && !!localStorage.getItem('user');
  },
  
  // Benutzerprofil abrufen
  getProfile: async () => {
    try {
      const authClient = createAuthClient();
      const response = await authClient.get('/auth/me');
      return response.data;
    } catch (error) {
      // Bei 401 (Unauthorized) den Benutzer ausloggen
      if (error.response?.status === 401) {
        authService.logout();
      }
      throw error;
    }
  }
};

export default authService;