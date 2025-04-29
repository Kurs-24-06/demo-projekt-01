// komponente für die liste der tasks
import React from 'react';
import TaskItem from './TaskItem';

function TaskList({ tasks, onDelete, onToggleComplete }) {
  // wenn keine tasks vorhanden sind, nachricht anzeigen
  if (tasks.length === 0) {
    return (
      <div className="no-tasks">
        <p>Keine Aufgaben vorhanden. Erstelle eine neue Aufgabe!</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      <h2>Deine Aufgaben</h2>
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