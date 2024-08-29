import React, { useState, useEffect } from 'react';
import Task from './Task';
import './task.css';

// Function to sort tasks by date and time
const sortTasks = (tasks) => {
  return tasks.sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateA - dateB;
  });
};

const TaskList = ({ tasks }) => {
  const [sortedTasks, setSortedTasks] = useState([]);

  useEffect(() => {
    const sorted = sortTasks(tasks);
    setSortedTasks(sorted);
  }, [tasks]);

  return (
    <div className="task-list">
      <h1>Tasks</h1>
      {sortedTasks.map(task => (
        <Task key={task.id} task={task} />
      ))}
    </div>
  );
};

export default TaskList;
