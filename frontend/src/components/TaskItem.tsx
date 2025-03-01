import React, { useState } from 'react';
import { Task, updateTask as apiUpdateTask, deleteTask as apiDeleteTask } from '../api/taskApi';

interface TaskItemProps {
    task: Task;
    onTaskUpdated: (updatedTask: Task) => void; // Callback for task updates
    onTaskDeleted: (taskId: number) => void;     // Callback for task deletion
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onTaskUpdated, onTaskDeleted }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(task.title);
    const [editDescription, setEditDescription] = useState(task.description);
    const [editStatus, setEditStatus] = useState(task.status);

    const handleDelete = async () => {
        try {
            await apiDeleteTask(task.id);
            onTaskDeleted(task.id); // Notify parent component of deletion
        } catch (error) {
            console.error("Failed to delete task:", error);
            // Handle error (e.g., display error message)
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditTitle(task.title); // Revert changes
        setEditDescription(task.description);
        setEditStatus(task.status);
    };

    const handleSaveEdit = async () => {
        try {
            const updatedTask = { ...task, title: editTitle, description: editDescription, status: editStatus };
            const savedTask = await apiUpdateTask(updatedTask);
            onTaskUpdated(savedTask); // Notify parent component of update
            setIsEditing(false); // Exit edit mode
        } catch (error) {
            console.error("Failed to update task:", error);
            // Handle error
        }
    };

    if (isEditing) {
        return (
            <li>
                <h3><input type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)} /></h3>
                <p><textarea value={editDescription} onChange={e => setEditDescription(e.target.value)} /></p>
                <div>
                    <label htmlFor={`status-${task.id}`}>Status:</label>
                    <select
                        id={`status-${task.id}`}
                        value={editStatus}
                        onChange={e => setEditStatus(e.target.value)}
                    >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
                <button onClick={handleSaveEdit}>Save</button>
                <button onClick={handleCancelEdit}>Cancel</button>
            </li>
        );
    } else {
        return (
            <li>
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <p>Status: {task.status}</p>
                <button onClick={handleEdit}>Edit</button>
                <button onClick={handleDelete}>Delete</button>
            </li>
        );
    }
};

export default TaskItem;