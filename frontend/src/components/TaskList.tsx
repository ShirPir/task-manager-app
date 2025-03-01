import React, { useState, useEffect, useCallback } from 'react'; // Import useCallback
import { fetchTasks, Task } from '../api/taskApi';
import TaskItem from './TaskItem';

const TaskList: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadTasks = useCallback(async () => { // Use useCallback for loadTasks
        setLoading(true);
        setError(null);
        try {
            const fetchedTasks = await fetchTasks();
            setTasks(fetchedTasks);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }, []); // Empty dependency array for useCallback, as it only depends on fetchTasks which is assumed to be stable

    useEffect(() => {
        loadTasks();
    }, [loadTasks]); // Dependency array includes loadTasks

    const handleTaskUpdated = useCallback((updatedTask: Task) => {
        // Update task in the tasks state
        setTasks(prevTasks =>
            prevTasks.map(task => task.id === updatedTask.id ? updatedTask : task)
        );
    }, []); // Empty dependency array as it only uses setTasks

    const handleTaskDeleted = useCallback((deletedTaskId: number) => {
        // Remove task from the tasks state
        setTasks(prevTasks =>
            prevTasks.filter(task => task.id !== deletedTaskId)
        );
    }, []); // Empty dependency array as it only uses setTasks


    if (loading) {
        return <p>Loading tasks...</p>;
    }

    if (error) {
        return <p>Error loading tasks: {error}</p>;
    }

    return (
        <div>
            <h2>Tasks</h2>
            {tasks.length === 0 ? (
                <p>No tasks yet.</p>
            ) : (
                <ul>
                    {tasks.map(task => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            onTaskUpdated={handleTaskUpdated} // Pass handleTaskUpdated
                            onTaskDeleted={handleTaskDeleted} // Pass handleTaskDeleted
                        />
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TaskList;