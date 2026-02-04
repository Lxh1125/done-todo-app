// API 服务 - 替代 LocalStorage，使用 Cloudflare Functions
const API_BASE_URL = '/api';

// 获取所有任务
export async function getTasks() {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks`);
    if (!response.ok) throw new Error('Failed to fetch tasks');
    return await response.json();
  } catch (error) {
    console.error('Error fetching tasks:', error);
    // 如果 API 失败，返回本地存储的数据作为备份
    return JSON.parse(localStorage.getItem('tasks') || '[]');
  }
}

// 添加任务
export async function addTask(task) {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(task)
    });
    if (!response.ok) throw new Error('Failed to add task');
    
    // 同时更新本地备份
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    
    return await response.json();
  } catch (error) {
    console.error('Error adding task:', error);
    // 如果 API 失败，仍然添加到本地存储
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    return task;
  }
}

// 更新任务
export async function updateTask(updatedTask) {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedTask)
    });
    if (!response.ok) throw new Error('Failed to update task');
    
    // 同时更新本地备份
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const updatedTasks = tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    );
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    
    return await response.json();
  } catch (error) {
    console.error('Error updating task:', error);
    // 如果 API 失败，仍然更新本地存储
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const updatedTasks = tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    );
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    return updatedTask;
  }
}

// 删除任务
export async function deleteTask(taskId) {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: taskId })
    });
    if (!response.ok) throw new Error('Failed to delete task');
    
    // 同时更新本地备份
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const filteredTasks = tasks.filter(task => task.id !== taskId);
    localStorage.setItem('tasks', JSON.stringify(filteredTasks));
    
    return await response.json();
  } catch (error) {
    console.error('Error deleting task:', error);
    // 如果 API 失败，仍然从本地存储删除
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const filteredTasks = tasks.filter(task => task.id !== taskId);
    localStorage.setItem('tasks', JSON.stringify(filteredTasks));
    return { success: true };
  }
}

// 批量保存所有任务（用于初始化或同步）
export async function saveAllTasks(tasks) {
  try {
    // 由于 KV 存储的是整个数组，我们可以直接更新
    // 这里我们使用一个特殊的批量更新端点
    const response = await fetch(`${API_BASE_URL}/tasks/batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(tasks)
    });
    if (!response.ok) throw new Error('Failed to save tasks');
    
    // 同时更新本地备份
    localStorage.setItem('tasks', JSON.stringify(tasks));
    
    return await response.json();
  } catch (error) {
    console.error('Error saving tasks:', error);
    // 如果 API 失败，仍然保存到本地存储
    localStorage.setItem('tasks', JSON.stringify(tasks));
    return tasks;
  }
}
