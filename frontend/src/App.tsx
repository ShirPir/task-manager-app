import React, { useState, useCallback } from 'react'; // Import useCallback
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import { Task } from './api/taskApi';
import './App.css';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]); // State to hold tasks in App component

  // useCallback to memoize the onTaskCreated function
  const handleTaskCreated = useCallback((newTask: Task) => {
    // When a new task is created, update the tasks state to re-render TaskList
    setTasks((prevTasks) => [...prevTasks, newTask]);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Task Manager</h1>
      </header>
      <main>
        <TaskForm onTaskCreated={handleTaskCreated} /> {/* Include TaskForm */}
        <TaskList /> {/* TaskList will now re-render when tasks state in App changes */}
      </main>
    </div>
  );
}

export default App;