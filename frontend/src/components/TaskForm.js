// komponente für das formular zum erstellen neuer tasks
import React, { useState } from 'react';

function TaskForm({ onAddTask }) {
  // state für den form input
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  // form submit handler
  const handleSubmit = (e) => {
    // standardverhalten des browsers verhindern (seite neu laden)
    e.preventDefault();
    
    // titel validieren - darf nicht leer sein
    if (!title.trim()) {
      return;
    }
    
    // neuen task erstellen und an parent komponente übergeben
    onAddTask({ title, description });
    
    // form zurücksetzen
    setTitle('');
    setDescription('');
    setIsExpanded(false);
  };

  // Funktion zum Erweitern des Formulars, wenn der Benutzer in das Titelfeld klickt
  const handleTitleFocus = () => {
    setIsExpanded(true);
  };

  return (
    <div className="task-form">
      <h2>
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          style={{ marginRight: '0.5rem', verticalAlign: 'middle' }}
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Neue Aufgabe erstellen
      </h2>
      
      <form className="task-form" onSubmit={handleSubmit} style={{ boxShadow: 'none', padding: 0, margin: 0 }}>
        <div className="form-group">
          <label htmlFor="title">Titel *</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={handleTitleFocus}
            placeholder="Was muss erledigt werden?"
            required
            autoFocus
          />
        </div>

        {/* Beschreibungsfeld nur anzeigen, wenn das Formular erweitert ist */}
        {isExpanded && (
          <div className="form-group">
            <label htmlFor="description">Beschreibung</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Beschreibe die Aufgabe genauer (optional)"
              rows="3"
            />
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
          {/* Abbrechen-Button nur anzeigen, wenn das Formular erweitert ist */}
          {isExpanded && (
            <button 
              type="button" 
              onClick={() => {
                setIsExpanded(false);
                setTitle('');
                setDescription('');
              }}
              style={{ 
                backgroundColor: 'transparent', 
                color: 'var(--text)',
                boxShadow: 'none',
                border: '1px solid var(--border)'
              }}
            >
              Abbrechen
            </button>
          )}
          
          <button 
            type="submit" 
            disabled={!title.trim()}
            style={{ 
              backgroundColor: !title.trim() ? 'var(--text-light)' : 'var(--primary)',
              opacity: !title.trim() ? 0.7 : 1
            }}
          >
            Hinzufügen
          </button>
        </div>
      </form>
    </div>
  );
}

export default TaskForm;