// komponente für die liste der tasks
import React from 'react';
import TaskItem from './TaskItem';

function TaskList({ tasks, onDelete, onToggleComplete }) {
  // wenn keine tasks vorhanden sind, nachricht anzeigen
  if (tasks.length === 0) {
    return (
      <div className="no-tasks">
        <svg
          width="70"
          height="70"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ margin: '0 auto 1rem', display: 'block', color: '#9ca3af' }}
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
        <p>Keine Aufgaben vorhanden</p>
        <p style={{ fontSize: '0.9rem', opacity: '0.7', marginTop: '0.5rem' }}>
          Erstelle eine neue Aufgabe, um loszulegen!
        </p>
      </div>
    );
  }

  return (
    <div className="task-list">
      <h2>
        Deine Aufgaben
        <span style={{ 
          fontSize: '0.9rem', 
          color: '#6b7280', 
          backgroundColor: '#f3f4f6',
          padding: '0.25rem 0.5rem',
          borderRadius: '9999px',
          marginLeft: '0.75rem',
          fontWeight: '500'
        }}>
          {tasks.length}
        </span>
      </h2>
      
      {/* Statistiken der Tasks anzeigen */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginBottom: '1.5rem',
        padding: '0.75rem 1rem',
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
        fontSize: '0.9rem'
      }}>
        <div>
          <strong>Gesamt:</strong> {tasks.length}
        </div>
        <div>
          <strong>Erledigt:</strong> {tasks.filter(task => task.completed).length}
        </div>
        <div>
          <strong>Offen:</strong> {tasks.filter(task => !task.completed).length}
        </div>
      </div>
      
      {/* für jeden task in der liste eine taskitem komponente rendern */}
      {tasks.map(task => (
        <TaskItem
          key={task._id}  // key prop für effizientes re-rendering
          task={task}
          onDelete={onDelete}
          onToggleComplete={onToggleComplete}
        />
      ))}
    </div>
  );
}

export default TaskList;