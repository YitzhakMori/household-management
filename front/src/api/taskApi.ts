const BASE_URL = 'http://localhost:5001/api/task';
export interface Task {
    _id: string;
    title: string;
    description?: string;
    dueDate?: Date;
    status?: string;
    assignee?: string;
    userId: string;
    taskGroupId: string;
    createdAt?: string;
    updatedAt?: string;
}
// get all tasks
export const fetchAllTasks = async (): Promise<Task[]> => {
    const response = await fetch(BASE_URL, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`, 
        },
        credentials: 'include',
    });


    if (!response.ok) {
        console.error(`Failed to fetch tasks:
            ${response.statusText}`);
            throw new Error('Failed to fetch tasks');
        }
        return await response.json();
};
// add a task
export const addTask =  async (
    title: string,
    description?: string,
    dueDate?: string,
    status?: string,
    assignee?: string
): Promise<Task> => {
    const response = await fetch(`${BASE_URL}/add`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
    credentials: 'include',
    body: JSON.stringify({
        title,
        ...(description && { description }),
        ...(dueDate && { dueDate }),
        ...(status && { status }),
        ...(assignee && { assignee })
    })
    
});
console.log('Token:', localStorage.getItem('token')); // עוזר לוודא שהטוקן קיים

console.log({ title, description, dueDate, status, assignee });

    if (!response.ok) {
        console.error(`Failed to add task: ${response.statusText}`);
        throw new Error('Failed to add task');
    }
    return await response.json();
};
// update a task
export const updateTask = async(
    taskId: string,
    title: string,
    description?: string,
    dueDate?: string,
    status?: string,
    assignee?: string
): Promise<Task> => {
    const response = await fetch(`${BASE_URL}/${taskId}`,{
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        credentials: 'include',
        body: JSON.stringify({
            title,
            ...(description && { description }),
            ...(dueDate && { dueDate }),
            ...(status && { status }),
            ...(assignee && { assignee })
        })
    });
    if (!response.ok) {
        console.error(`Failed to update task: ${response.statusText}`);
        throw new Error('Failed to update task');
    };
    return await response.json(); 
};
// delete a task
export const deleteTask = async (taskId: string): Promise<{ message: string }> => {
    const response = await fetch(`${BASE_URL}/${taskId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        credentials: 'include',
    });

    if (!response.ok) {
        console.error(`Failed to delete task: ${response.statusText}`);
        throw new Error('Failed to delete task');
    }

    return await response.json();
};
