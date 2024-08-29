import React from 'react';

const Task = ({ task }) => {
  
  return (
    <div className="task">
      <div className="task-header">
        <h4>{task.title}</h4>
        <p>{task.description}</p>
        <p>{task.date} {task.time}</p>
      </div>
      {task.children && task.children.length > 0 && (
        <div className="task-children">
          {task.children.map(subtask => (
            <Task key={subtask.id} task={subtask} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Task;
