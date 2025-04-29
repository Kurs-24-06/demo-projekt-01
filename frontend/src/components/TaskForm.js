// komponente für das formular zum erstellen neuer tasks
import React, { useState } from 'react';

function TaskForm({ onAddTask }) {
  // state für den form input
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

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
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2>Neue Aufgabe erstellen</h2>
      
      <div className="form-group">
        <label htmlFor="title">Titel *</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task Titel eingeben"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Beschreibung</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Beschreibung (optional)"
          rows="3"
        />
      </div>

      <button type="submit" disabled={!title.trim()}>
        Hinzufügen
      </button>
    </form>
  );
}

export default TaskForm;