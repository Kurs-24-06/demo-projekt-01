// komponente für einen einzelnen task
import React from 'react';

function TaskItem({ task, onDelete, onToggleComplete }) {
  // datum formatieren für bessere lesbarkeit
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('de-DE', options);
  };

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-content">
        {/* checkbox für den task status */}
        <label className="checkbox-container">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggleComplete(task._id, task.completed)}
          />
          <span className="checkmark"></span>
        </label>
        
        {/* task details */}
        <div className="task-details">
          <h3>{task.title}</h3>
          {task.description && <p>{task.description}</p>}
          <span className="date">Erstellt: {formatDate(task.createdAt)}</span>
        </div>
      </div>
      
      {/* löschen button */}
      <button 
        className="delete-btn"
        onClick={() => onDelete(task._id)}
        aria-label="Task löschen"
      >
        ✕
      </button>
    </div>
  );
}

export default TaskItem;