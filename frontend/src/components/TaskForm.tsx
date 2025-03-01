import React, { useState } from 'react';
import { createTask as apiCreateTask, Task } from '../api/taskApi';

interface TaskFormProps {
    onTaskCreated: (newTask: Task) => void; // Callback to notify parent component of new task
}

const TaskForm: React.FC<TaskFormProps> = ({ onTaskCreated }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status] = useState('pending'); // Default status for new tasks

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const newTask = { title, description, status } as Task; // Create Task object
            const createdTask = await apiCreateTask(newTask);
            onTaskCreated(createdTask); // Notify parent component
            setTitle(''); // Reset form
            setDescription('');
        } catch (error) {
            console.error("Failed to create task:", error);
            // Handle error (e.g., display error message to user)
        }
    };

    return (
        <div>
            <h2>Add New Task</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Title:</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <button type="submit">Add Task</button>
            </form>
        </div>
    );
};

export default TaskForm;