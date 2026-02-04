// Cloudflare Function - Tasks API
// 路径: /api/tasks

export async function onRequestGet(context) {
  const { env } = context;
  
  try {
    // 从 KV 获取所有任务
    const tasksJson = await env.TODO_KV.get('tasks');
    const tasks = tasksJson ? JSON.parse(tasksJson) : [];
    
    return new Response(JSON.stringify(tasks), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

export async function onRequestPost(context) {
  const { env, request } = context;
  
  try {
    const newTask = await request.json();
    
    // 获取现有任务
    const tasksJson = await env.TODO_KV.get('tasks');
    const tasks = tasksJson ? JSON.parse(tasksJson) : [];
    
    // 添加新任务
    tasks.push(newTask);
    
    // 保存到 KV
    await env.TODO_KV.put('tasks', JSON.stringify(tasks));
    
    return new Response(JSON.stringify(newTask), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

export async function onRequestPut(context) {
  const { env, request } = context;
  
  try {
    const updatedTask = await request.json();
    
    // 获取现有任务
    const tasksJson = await env.TODO_KV.get('tasks');
    let tasks = tasksJson ? JSON.parse(tasksJson) : [];
    
    // 更新任务
    tasks = tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    );
    
    // 保存到 KV
    await env.TODO_KV.put('tasks', JSON.stringify(tasks));
    
    return new Response(JSON.stringify(updatedTask), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

export async function onRequestDelete(context) {
  const { env, request } = context;
  
  try {
    const { id } = await request.json();
    
    // 获取现有任务
    const tasksJson = await env.TODO_KV.get('tasks');
    let tasks = tasksJson ? JSON.parse(tasksJson) : [];
    
    // 删除任务
    tasks = tasks.filter(task => task.id !== id);
    
    // 保存到 KV
    await env.TODO_KV.put('tasks', JSON.stringify(tasks));
    
    return new Response(JSON.stringify({ success: true }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

// 处理 OPTIONS 请求 (CORS 预检)
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    }
  });
}
