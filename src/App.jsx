import { useState, useEffect } from 'react'
import './App.css'
import { getTasks, addTask as apiAddTask, updateTask as apiUpdateTask, deleteTask as apiDeleteTask } from './api'

const CheckIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
)

const StarIcon = ({ className, filled }) => (
  <svg className={className} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
)

const EditIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
)

const TrashIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
)

const PriorityHighIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M12 2L4 7v10l8 5 8-5V7l-8-5zm0 2.5L18.5 8 12 11.5 5.5 8 12 4.5zM5 9.5l7 4v7.5l-7-4v-7.5zm9 11.5v-7.5l7-4v7.5l-7 4z"/>
  </svg>
)

const PriorityMediumIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M12 2L4 7v10l8 5 8-5V7l-8-5zm0 2.5L18.5 8 12 11.5 5.5 8 12 4.5z"/>
  </svg>
)

const PriorityLowIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M12 22l8-5V7l-8-5-8 5v10l8 5zm0-2.5L5.5 16 12 12.5 18.5 16 12 19.5z"/>
  </svg>
)

const SearchIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
)

const PlusIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
)

const ListIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"></line>
    <line x1="8" y1="12" x2="21" y2="12"></line>
    <line x1="8" y1="18" x2="21" y2="18"></line>
    <line x1="3" y1="6" x2="3.01" y2="6"></line>
    <line x1="3" y1="12" x2="3.01" y2="12"></line>
    <line x1="3" y1="18" x2="3.01" y2="18"></line>
  </svg>
)

const CalendarIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
)

const SparklesIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
  </svg>
)

const CheckCircleIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
)

const ClockIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
)

const ChevronLeftIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
)

const ChevronRightIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
)

const GanttIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="8" y1="3" x2="8" y2="21"></line>
    <line x1="3" y1="9" x2="21" y2="9"></line>
    <line x1="3" y1="15" x2="21" y2="15"></line>
  </svg>
)

const priorityConfig = {
  high: { label: '高', color: '#ff4757', icon: PriorityHighIcon, value: 3 },
  medium: { label: '中', color: '#ffa502', icon: PriorityMediumIcon, value: 2 },
  low: { label: '低', color: '#2ed573', icon: PriorityLowIcon, value: 1 },
  none: { label: '无', color: '#555555', icon: null, value: 0 }
}

function App() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [newTask, setNewTask] = useState('')
  const [newTaskPriority, setNewTaskPriority] = useState('medium')
  const [newTaskDueDate, setNewTaskDueDate] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editingText, setEditingText] = useState('')
  const [editingDueDate, setEditingDueDate] = useState('')
  const [filter, setFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeList, setActiveList] = useState('all')
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [viewMode, setViewMode] = useState('list')

  const lists = [
    { id: 'all', name: '全部任务', Icon: ListIcon },
    { id: 'today', name: '今天', Icon: CalendarIcon },
    { id: 'important', name: '重要', Icon: StarIcon },
    { id: 'completed', name: '已完成', Icon: CheckCircleIcon },
  ]

  // 加载任务
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const loadedTasks = await getTasks()
        setTasks(loadedTasks)
      } catch (error) {
        console.error('Failed to load tasks:', error)
        // 如果 API 失败，使用本地存储作为备份
        const saved = localStorage.getItem('done-todo-tasks')
        if (saved) {
          setTasks(JSON.parse(saved))
        }
      } finally {
        setLoading(false)
      }
    }
    loadTasks()
  }, [])

  // 保存任务到本地存储（作为备份）
  useEffect(() => {
    localStorage.setItem('done-todo-tasks', JSON.stringify(tasks))
  }, [tasks])

  const isOverdue = (dueDate) => {
    if (!dueDate) return false
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const due = new Date(dueDate)
    return due < today
  }

  const isDueToday = (dueDate) => {
    if (!dueDate) return false
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const due = new Date(dueDate)
    due.setHours(0, 0, 0, 0)
    return today.getTime() === due.getTime()
  }

  const isDueThisWeek = (dueDate) => {
    if (!dueDate) return false
    const today = new Date()
    const due = new Date(dueDate)
    const weekFromNow = new Date(today)
    weekFromNow.setDate(weekFromNow.getDate() + 7)
    return due >= today && due <= weekFromNow
  }

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.text.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filter === 'all' ? true :
      filter === 'active' ? !task.completed :
      filter === 'completed' ? task.completed : true
    const matchesList = activeList === 'all' ? true :
      activeList === 'today' ? task.today :
      activeList === 'important' ? task.important :
      activeList === 'completed' ? task.completed : true
    const matchesPriority = priorityFilter === 'all' ? true :
      task.priority === priorityFilter
    const matchesDate = dateFilter === 'all' ? true :
      dateFilter === 'overdue' ? isOverdue(task.dueDate) && !task.completed :
      dateFilter === 'today' ? isDueToday(task.dueDate) :
      dateFilter === 'week' ? isDueThisWeek(task.dueDate) :
      dateFilter === 'noDate' ? !task.dueDate : true
    return matchesSearch && matchesFilter && matchesList && matchesPriority && matchesDate
  }).sort((a, b) => {
    // Sort by completion status first
    if (a.completed !== b.completed) return a.completed ? 1 : -1
    // Then by due date (overdue first, then by date)
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate) - new Date(b.dueDate)
    }
    if (a.dueDate && !b.dueDate) return -1
    if (!a.dueDate && b.dueDate) return 1
    // Finally by priority
    const priorityDiff = (priorityConfig[b.priority]?.value || 0) - (priorityConfig[a.priority]?.value || 0)
    if (priorityDiff !== 0) return priorityDiff
    return new Date(b.createdAt) - new Date(a.createdAt)
  })

  const addTask = async (e, customDueDate = null) => {
    if (e) e.preventDefault()
    if (!newTask.trim()) return
    
    const newTaskObj = {
      id: Date.now(),
      text: newTask,
      completed: false,
      important: false,
      today: true,
      priority: newTaskPriority,
      dueDate: customDueDate || newTaskDueDate || null,
      createdAt: new Date().toISOString()
    }
    
    // 先更新 UI
    setTasks([...tasks, newTaskObj])
    
    // 然后同步到 API
    try {
      await apiAddTask(newTaskObj)
    } catch (error) {
      console.error('Failed to add task to API:', error)
    }
    
    setNewTask('')
    setNewTaskPriority('medium')
    setNewTaskDueDate('')
    setShowDatePicker(false)
    // Reset filters to ensure the new task is visible
    setFilter('all')
    setDateFilter('all')
    setPriorityFilter('all')
    setActiveList('all')
  }

  const getLocalDateString = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const addTaskWithDate = (dateStr) => {
    setNewTaskDueDate(dateStr)
    setShowDatePicker(false)
  }

  const setTaskPriority = async (id, priority) => {
    const updatedTask = tasks.find(task => task.id === id)
    if (updatedTask) {
      const newTask = { ...updatedTask, priority }
      setTasks(tasks.map(task =>
        task.id === id ? newTask : task
      ))
      try {
        await apiUpdateTask(newTask)
      } catch (error) {
        console.error('Failed to update task priority:', error)
      }
    }
  }

  const toggleComplete = async (id) => {
    const updatedTask = tasks.find(task => task.id === id)
    if (updatedTask) {
      const newTask = { ...updatedTask, completed: !updatedTask.completed }
      setTasks(tasks.map(task =>
        task.id === id ? newTask : task
      ))
      try {
        await apiUpdateTask(newTask)
      } catch (error) {
        console.error('Failed to update task:', error)
      }
    }
  }

  const toggleImportant = async (id) => {
    const updatedTask = tasks.find(task => task.id === id)
    if (updatedTask) {
      const newTask = { ...updatedTask, important: !updatedTask.important }
      setTasks(tasks.map(task =>
        task.id === id ? newTask : task
      ))
      try {
        await apiUpdateTask(newTask)
      } catch (error) {
        console.error('Failed to update task:', error)
      }
    }
  }

  const deleteTask = async (id) => {
    setTasks(tasks.filter(task => task.id !== id))
    try {
      await apiDeleteTask(id)
    } catch (error) {
      console.error('Failed to delete task:', error)
    }
  }

  const startEdit = (id, text, dueDate) => {
    setEditingId(id)
    setEditingText(text)
    setEditingDueDate(dueDate || '')
  }

  const saveEdit = async (id) => {
    if (!editingText.trim()) return
    const updatedTask = tasks.find(task => task.id === id)
    if (updatedTask) {
      const newTask = { ...updatedTask, text: editingText, dueDate: editingDueDate || null }
      setTasks(tasks.map(task =>
        task.id === id ? newTask : task
      ))
      try {
        await apiUpdateTask(newTask)
      } catch (error) {
        console.error('Failed to update task:', error)
      }
    }
    setEditingId(null)
    setEditingText('')
    setEditingDueDate('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditingText('')
    setEditingDueDate('')
  }

  const formatDate = (dateString) => {
    if (!dateString) return null
    const date = new Date(dateString)
    date.setHours(0, 0, 0, 0)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    if (date.getTime() === today.getTime()) return '今天'
    if (date.getTime() === tomorrow.getTime()) return '明天'
    
    return new Date(dateString).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
  }

  const getDueDateStatus = (dueDate, completed) => {
    if (!dueDate || completed) return null
    if (isOverdue(dueDate)) return { label: '已逾期', color: '#ff4757', urgent: true }
    if (isDueToday(dueDate)) return { label: '今天到期', color: '#ffa502', urgent: true }
    if (isDueThisWeek(dueDate)) return { label: '本周到期', color: '#00ff88', urgent: false }
    return { label: formatDate(dueDate), color: '#a0a0a0', urgent: false }
  }

  const clearCompleted = () => {
    setTasks(tasks.filter(task => !task.completed))
  }

  const activeCount = tasks.filter(t => !t.completed).length
  const completedCount = tasks.filter(t => t.completed).length

  const weekDays = ['日', '一', '二', '三', '四', '五', '六']

  const isToday = (date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  // Gantt view functions
  const [ganttRange, setGanttRange] = useState(14) // days to show
  const [ganttStartDate, setGanttStartDate] = useState(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return today
  })

  const getGanttDays = () => {
    const days = []
    for (let i = 0; i < ganttRange; i++) {
      const date = new Date(ganttStartDate)
      date.setDate(date.getDate() + i)
      days.push(date)
    }
    return days
  }

  const getTasksWithDates = () => {
    return tasks
      .filter(task => task.dueDate)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
  }

  const getTaskPosition = (task) => {
    if (!task.dueDate) return null
    const taskDate = new Date(task.dueDate)
    taskDate.setHours(0, 0, 0, 0)
    const startDate = new Date(ganttStartDate)
    startDate.setHours(0, 0, 0, 0)
    const diffDays = Math.floor((taskDate - startDate) / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const navigateGantt = (direction) => {
    const newDate = new Date(ganttStartDate)
    newDate.setDate(newDate.getDate() + direction * 7)
    setGanttStartDate(newDate)
  }

  const resetGanttToToday = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    setGanttStartDate(today)
  }

  const GanttView = () => {
    const ganttDays = getGanttDays()
    const tasksWithDates = getTasksWithDates()
    
    return (
      <div className="gantt-view">
        <div className="gantt-header">
          <div className="gantt-nav">
            <button className="gantt-nav-btn" onClick={() => navigateGantt(-1)}>
              <ChevronLeftIcon className="nav-icon" />
            </button>
            <h2 className="gantt-title">
              {ganttStartDate.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })} - {ganttDays[ganttDays.length - 1].toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })}
            </h2>
            <button className="gantt-nav-btn" onClick={() => navigateGantt(1)}>
              <ChevronRightIcon className="nav-icon" />
            </button>
          </div>
          <div className="gantt-controls">
            <button className="today-btn" onClick={resetGanttToToday}>今天</button>
            <div className="range-selector">
              <button className={`range-btn ${ganttRange === 7 ? 'active' : ''}`} onClick={() => setGanttRange(7)}>7天</button>
              <button className={`range-btn ${ganttRange === 14 ? 'active' : ''}`} onClick={() => setGanttRange(14)}>14天</button>
              <button className={`range-btn ${ganttRange === 30 ? 'active' : ''}`} onClick={() => setGanttRange(30)}>30天</button>
            </div>
          </div>
        </div>
        
        <div className="gantt-chart">
          <div className="gantt-task-list">
            <div className="gantt-task-header">任务</div>
            {tasksWithDates.map(task => {
              const TaskPriorityIcon = priorityConfig[task.priority]?.icon
              return (
                <div key={task.id} className={`gantt-task-name ${task.completed ? 'completed' : ''}`}>
                  <span className="task-text">{task.text}</span>
                  {TaskPriorityIcon && (
                    <TaskPriorityIcon className="gantt-task-priority" style={{ color: priorityConfig[task.priority].color }} />
                  )}
                </div>
              )
            })}
            {tasksWithDates.length === 0 && (
              <div className="gantt-no-tasks">暂无带截止日期的任务</div>
            )}
          </div>
          
          <div className="gantt-timeline">
            <div className="gantt-days-header">
              {ganttDays.map((date, index) => (
                <div 
                  key={index} 
                  className={`gantt-day-header ${isToday(date) ? 'today' : ''} ${date.getDay() === 0 || date.getDay() === 6 ? 'weekend' : ''}`}
                >
                  <div className="day-name">{weekDays[date.getDay()]}</div>
                  <div className="day-number">{date.getDate()}</div>
                </div>
              ))}
            </div>
            
            <div className="gantt-bars-container">
              {tasksWithDates.map(task => {
                const position = getTaskPosition(task)
                const isVisible = position !== null && position >= 0 && position < ganttRange
                
                if (!isVisible) return <div key={task.id} className="gantt-bar-row empty"></div>
                
                return (
                  <div key={task.id} className="gantt-bar-row">
                    <div 
                      className={`gantt-bar ${task.completed ? 'completed' : ''} priority-${task.priority}`}
                      style={{ 
                        left: `${(position / ganttRange) * 100}%`,
                        width: `${(1 / ganttRange) * 100}%`,
                        backgroundColor: priorityConfig[task.priority]?.color || '#555'
                      }}
                      title={`${task.text} - ${task.dueDate}`}
                    >
                      <div className="gantt-bar-content">
                        <span className="bar-text">{task.text}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
              
              {/* Today marker */}
              {(() => {
                const today = new Date()
                today.setHours(0, 0, 0, 0)
                const startDate = new Date(ganttStartDate)
                startDate.setHours(0, 0, 0, 0)
                const todayPosition = Math.floor((today - startDate) / (1000 * 60 * 60 * 24))
                
                if (todayPosition >= 0 && todayPosition < ganttRange) {
                  return (
                    <div 
                      className="today-marker"
                      style={{ left: `${((todayPosition + 0.5) / ganttRange) * 100}%` }}
                    >
                      <div className="today-line"></div>
                      <div className="today-label">今天</div>
                    </div>
                  )
                }
                return null
              })()}
            </div>
          </div>
        </div>
        
        <div className="gantt-legend">
          <div className="legend-item">
            <span className="legend-dot priority-high"></span>
            <span>高优先级</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot priority-medium"></span>
            <span>中优先级</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot priority-low"></span>
            <span>低优先级</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot completed"></span>
            <span>已完成</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <div className="ambient-glow"></div>
      <div className="ambient-glow-2"></div>
      
      <div className="sidebar">
        <div className="logo">
          <div className="logo-icon-wrapper">
            <SparklesIcon className="logo-icon" />
          </div>
          <span className="logo-text">DONE</span>
        </div>
        <nav className="lists">
          {lists.map(list => (
            <button
              key={list.id}
              className={`list-item ${activeList === list.id ? 'active' : ''}`}
              onClick={() => setActiveList(list.id)}
            >
              <list.Icon className="list-icon-svg" />
              <span className="list-name">{list.name}</span>
              <span className="list-count">
                {list.id === 'all' ? tasks.length :
                 list.id === 'today' ? tasks.filter(t => t.today).length :
                 list.id === 'important' ? tasks.filter(t => t.important).length :
                 list.id === 'completed' ? completedCount : 0}
              </span>
            </button>
          ))}
        </nav>
        <div className="view-toggle">
          <button
            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            <ListIcon className="view-icon" />
            <span>列表</span>
          </button>
          <button
            className={`view-btn ${viewMode === 'gantt' ? 'active' : ''}`}
            onClick={() => setViewMode('gantt')}
          >
            <GanttIcon className="view-icon" />
            <span>甘特图</span>
          </button>
        </div>
      </div>

      <div className="main">
        <header className="header">
          <h1 className="title">
            {lists.find(l => l.id === activeList)?.name || '全部任务'}
          </h1>
          <div className="search-box">
            <input
              type="text"
              placeholder="搜索任务..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <SearchIcon className="search-icon-svg" />
          </div>
        </header>

        <form onSubmit={addTask} className="add-task-form">
          <div className="priority-selector">
            {Object.entries(priorityConfig).filter(([key]) => key !== 'none').map(([key, config]) => {
              const Icon = config.icon
              return (
                <button
                  key={key}
                  type="button"
                  className={`priority-option ${newTaskPriority === key ? 'active' : ''}`}
                  onClick={() => setNewTaskPriority(key)}
                  title={`优先级: ${config.label}`}
                  style={{ '--priority-color': config.color }}
                >
                  <Icon className="priority-option-icon" />
                </button>
              )
            })}
          </div>
          <div className="task-input-wrapper">
            <input
              type="text"
              placeholder="添加新任务..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="task-input"
            />
            <div className="date-picker-wrapper">
              <button
                type="button"
                className={`date-picker-toggle ${newTaskDueDate ? 'active' : ''} ${isOverdue(newTaskDueDate) ? 'overdue' : ''}`}
                onClick={() => setShowDatePicker(!showDatePicker)}
                title={newTaskDueDate ? `截止日期: ${formatDate(newTaskDueDate)}` : '设置截止日期'}
              >
                <CalendarIcon className="date-picker-icon" />
                {newTaskDueDate && <span className="date-picker-value">{formatDate(newTaskDueDate)}</span>}
              </button>
              {showDatePicker && (
                <div className="date-picker-popup">
                  <input
                    type="date"
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    className="date-input"
                    min={getLocalDateString()}
                  />
                  <div className="date-quick-options">
                    <button type="button" onClick={() => { addTaskWithDate(getLocalDateString()) }}>今天</button>
                    <button type="button" onClick={() => { const d = new Date(); d.setDate(d.getDate() + 1); const year = d.getFullYear(); const month = String(d.getMonth() + 1).padStart(2, '0'); const day = String(d.getDate()).padStart(2, '0'); addTaskWithDate(`${year}-${month}-${day}`) }}>明天</button>
                    <button type="button" onClick={() => { const d = new Date(); d.setDate(d.getDate() + 7); const year = d.getFullYear(); const month = String(d.getMonth() + 1).padStart(2, '0'); const day = String(d.getDate()).padStart(2, '0'); addTaskWithDate(`${year}-${month}-${day}`) }}>一周</button>
                  </div>
                  {newTaskDueDate && (
                    <button type="button" className="date-clear-btn" onClick={() => { setNewTaskDueDate(''); setShowDatePicker(false) }}>
                      清除日期
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
          <button type="submit" className="add-button">
            <PlusIcon className="plus-icon" />
          </button>
        </form>

        <div className="filter-bar">
          <div className="filter-group">
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              全部
            </button>
            <button
              className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
              onClick={() => setFilter('active')}
            >
              未完成
            </button>
            <button
              className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
              onClick={() => setFilter('completed')}
            >
              已完成
            </button>
          </div>
          <div className="priority-filter-group">
            <span className="filter-label">优先级:</span>
            <button
              className={`priority-filter-btn ${priorityFilter === 'all' ? 'active' : ''}`}
              onClick={() => setPriorityFilter('all')}
            >
              全部
            </button>
            {Object.entries(priorityConfig).filter(([key]) => key !== 'none').map(([key, config]) => (
              <button
                key={key}
                className={`priority-filter-btn ${priorityFilter === key ? 'active' : ''}`}
                onClick={() => setPriorityFilter(key)}
                style={{ '--priority-color': config.color }}
              >
                <span className="priority-dot" style={{ background: config.color }}></span>
                {config.label}
              </button>
            ))}
          </div>
          <div className="date-filter-group">
            <span className="filter-label">时间:</span>
            <button
              className={`date-filter-btn ${dateFilter === 'all' ? 'active' : ''}`}
              onClick={() => setDateFilter('all')}
            >
              全部
            </button>
            <button
              className={`date-filter-btn ${dateFilter === 'overdue' ? 'active overdue' : ''}`}
              onClick={() => setDateFilter('overdue')}
            >
              已逾期
            </button>
            <button
              className={`date-filter-btn ${dateFilter === 'today' ? 'active' : ''}`}
              onClick={() => setDateFilter('today')}
            >
              今天
            </button>
            <button
              className={`date-filter-btn ${dateFilter === 'week' ? 'active' : ''}`}
              onClick={() => setDateFilter('week')}
            >
              本周
            </button>
            <button
              className={`date-filter-btn ${dateFilter === 'noDate' ? 'active' : ''}`}
              onClick={() => setDateFilter('noDate')}
            >
              无日期
            </button>
          </div>
          {completedCount > 0 && (
            <button className="clear-btn" onClick={clearCompleted}>
              清除已完成
            </button>
          )}
        </div>

        {viewMode === 'list' ? (
          <>
            <ul className="task-list">
              {filteredTasks.map((task, index) => {
                const PriorityIcon = priorityConfig[task.priority]?.icon
                const priorityColor = priorityConfig[task.priority]?.color
                const dueDateStatus = getDueDateStatus(task.dueDate, task.completed)
                return (
                  <li
                    key={task.id}
                    className={`task-item ${task.completed ? 'completed' : ''} priority-${task.priority} ${dueDateStatus?.urgent ? 'urgent' : ''}`}
                    style={{ animationDelay: `${index * 0.05}s`, '--priority-color': priorityColor }}
                  >
                    <div className="task-priority-indicator" style={{ background: priorityColor }}></div>
                    <div className="task-content">
                      <button
                        className={`checkbox ${task.completed ? 'checked' : ''}`}
                        onClick={() => toggleComplete(task.id)}
                      >
                        {task.completed && <CheckIcon className="checkmark-svg" />}
                      </button>
                      <div className="task-main">
                        {editingId === task.id ? (
                          <div className="edit-mode">
                            <input
                              type="text"
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                              onBlur={() => saveEdit(task.id)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') saveEdit(task.id)
                                if (e.key === 'Escape') cancelEdit()
                              }}
                              className="edit-input"
                              autoFocus
                            />
                            <input
                              type="date"
                              value={editingDueDate}
                              onChange={(e) => setEditingDueDate(e.target.value)}
                              className="edit-date-input"
                            />
                          </div>
                        ) : (
                          <span
                            className="task-text"
                            onDoubleClick={() => startEdit(task.id, task.text, task.dueDate)}
                          >
                            {task.text}
                          </span>
                        )}
                        <div className="task-meta">
                          {PriorityIcon && (
                            <span className="task-priority-badge" style={{ color: priorityColor }}>
                              <PriorityIcon className="priority-badge-icon" />
                              {priorityConfig[task.priority]?.label}优先级
                            </span>
                          )}
                          {dueDateStatus && (
                            <span 
                              className={`task-due-date ${dueDateStatus.urgent ? 'urgent' : ''}`}
                              style={{ color: dueDateStatus.color }}
                            >
                              <ClockIcon className="due-date-icon" />
                              {dueDateStatus.label}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="task-actions">
                      <div className="priority-dropdown">
                        <button className="priority-toggle" style={{ color: priorityColor }}>
                          {PriorityIcon && <PriorityIcon className="priority-toggle-icon" />}
                        </button>
                        <div className="priority-menu">
                        {Object.entries(priorityConfig).filter(([key]) => key !== 'none').map(([key, config]) => {
                          const Icon = config.icon
                          return (
                            <button
                              key={key}
                              className={`priority-menu-item ${task.priority === key ? 'active' : ''}`}
                              onClick={() => setTaskPriority(task.id, key)}
                              style={{ '--priority-color': config.color }}
                            >
                              <Icon className="priority-menu-icon" />
                              <span>{config.label}优先级</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                    <button
                      className={`important-btn ${task.important ? 'important' : ''}`}
                      onClick={() => toggleImportant(task.id)}
                    >
                      <StarIcon className="star-icon-svg" filled={task.important} />
                    </button>
                    <button
                      className="edit-btn"
                      onClick={() => startEdit(task.id, task.text, task.dueDate)}
                    >
                      <EditIcon className="edit-icon-svg" />
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => deleteTask(task.id)}
                    >
                      <TrashIcon className="trash-icon-svg" />
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>

          {filteredTasks.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon-wrapper">
                <CheckCircleIcon className="empty-icon" />
              </div>
              <p className="empty-text">暂无任务</p>
              <p className="empty-subtext">添加一个新任务开始吧</p>
            </div>
          )}
        </>
        ) : (
          <GanttView />
        )}

        <footer className="footer">
          <span className="stats">
            {activeCount} 个任务未完成
          </span>
        </footer>
      </div>
    </div>
  )
}

export default App
