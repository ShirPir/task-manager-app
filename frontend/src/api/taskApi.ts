export interface Task {
    id: number;
    title: string;
    description: string;
    status: string;
}

const API_BASE_URL = 'http://localhost:8080'; // Backend API URL

export const fetchTasks = async (): Promise<Task[]> => {
    const response = await fetch(`${API_BASE_URL}/tasks`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json() as Task[];
};

export const createTask = async (task: Omit<Task, 'id'>): Promise<Task> => {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json() as Task;
};

export const updateTask = async (task: Task): Promise<Task> => {
    const response = await fetch(`<span class="math-inline">\{API\_BASE\_URL\}/tasks/</span>{task.id}`, { // Correct URL using template literal
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json() as Task;
};

export const deleteTask = async (id: number): Promise<void> => {
    const response = await fetch(`<span class="math-inline">\{API\_BASE\_URL\}/tasks/</span>{id}`, { // Correct URL using template literal
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
};