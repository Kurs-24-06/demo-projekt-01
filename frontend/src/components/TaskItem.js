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
  
  // Prioritätsstufe auf Basis des Erstellungsdatums bestimmen (Demo-Zweck)
  // In einer echten Anwendung würde man ein dediziertes Prioritätsfeld verwenden
  const getPriorityLevel = () => {
    const now = new Date();
    const created = new Date(task.createdAt);
    const diffDays = Math.floor((now - created) / (1000 * 60 * 60 * 24));
    
    if (diffDays >= 3) return 'high';
    if (diffDays >= 1) return 'medium';
    return 'low';
  };
  
  const priorityLevel = getPriorityLevel();
  
  // Prioritätsbezeichnung und -farbe definieren
  const priorityConfig = {
    high: { label: 'Hoch', color: '#ef4444', bgColor: '#fee2e2' },
    medium: { label: 'Mittel', color: '#f59e0b', bgColor: '#fef3c7' },
    low: { label: 'Niedrig', color: '#10b981', bgColor: '#d1fae5' }
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
          
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', alignItems: 'center' }}>
            {/* Prioritäts-Badge */}
            <span style={{ 
              fontSize: '0.7rem', 
              fontWeight: '600',
              backgroundColor: priorityConfig[priorityLevel].bgColor,
              color: priorityConfig[priorityLevel].color,
              padding: '0.2rem 0.5rem',
              borderRadius: '9999px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              {priorityConfig[priorityLevel].label}
            </span>
            
            {/* Erstellungsdatum */}
            <span className="date">
              <svg 
                width="12" 
                height="12" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                style={{ display: 'inline-block', marginRight: '0.25rem', verticalAlign: 'middle' }}
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              {formatDate(task.createdAt)}
            </span>
          </div>
        </div>
      </div>
      
      {/* löschen button */}
      <button 
        className="delete-btn"
        onClick={() => onDelete(task._id)}
        aria-label="Task löschen"
      >
        <svg 
          width="18" 
          height="18" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          <line x1="10" y1="11" x2="10" y2="17"></line>
          <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
      </button>
    </div>
  );
}

export default TaskItem;