import { useState, useEffect, useRef } from 'react'
import './App.css'
import { getTasks, addTask as apiAddTask, updateTask as apiUpdateTask, deleteTask as apiDeleteTask } from './api'

const CheckIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
)

const TrashIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
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

const SearchIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
)

const GanttIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="8" y1="4" x2="8" y2="20"></line>
    <line x1="12" y1="4" x2="12" y2="20"></line>
    <line x1="16" y1="4" x2="16" y2="20"></line>
  </svg>
)

const DoneIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
)

const SunIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  </svg>
)

const MoonIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  </svg>
)

const priorityConfig = {
  high: { label: '高', color: '#ff4757', value: 2 },
  low: { label: '低', color: '#2ed573', value: 1 }
}

const WEEK_DAYS = ['日', '一', '二', '三', '四', '五', '六']
const CELL_WIDTH = 60
const MIN_BAR_WIDTH = 30
const TASK_ROW_HEIGHT = 52

function App() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [newTask, setNewTask] = useState('')
  const [newTaskPriority, setNewTaskPriority] = useState('low')
  const [newTaskDueDate, setNewTaskDueDate] = useState('')
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [currentView, setCurrentView] = useState('gantt')
  const [editingTask, setEditingTask] = useState(null)
  const [editDueDate, setEditDueDate] = useState('')
  const [completedSearch, setCompletedSearch] = useState('')
  const [completingTaskId, setCompletingTaskId] = useState(null)
  const [deletingTaskId, setDeletingTaskId] = useState(null)
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme')
    return saved || 'dark'
  })
  const timelineRef = useRef(null)

  const [ganttStartDate, setGanttStartDate] = useState(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const dayOfWeek = today.getDay()
    const start = new Date(today)
    start.setDate(start.getDate() - dayOfWeek)
    return start
  })

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const loadedTasks = await getTasks()
        setTasks(loadedTasks)
      } catch (error) {
        console.error('Failed to load tasks:', error)
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

  useEffect(() => {
    localStorage.setItem('done-todo-tasks', JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  const getCountdown = (dueDate) => {
    if (!dueDate) return null
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const due = new Date(dueDate)
    due.setHours(0, 0, 0, 0)
    const diffDays = Math.floor((due - today) / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return { label: `${Math.abs(diffDays)}天逾期`, color: '#ff4757' }
    if (diffDays === 0) return { label: '今天', color: '#ffa502' }
    if (diffDays === 1) return { label: '明天', color: '#ffa502' }
    if (diffDays <= 7) return { label: `${diffDays}天后`, color: '#2ed573' }
    return { label: `${Math.floor(diffDays / 7)}周后`, color: '#a0a0a0' }
  }

  const formatDate = (dateString) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
  }

  const getLocalDateString = () => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const getWeekDays = () => {
    const days = []
    for (let i = 0; i < 14; i++) {
      const date = new Date(ganttStartDate)
      date.setDate(date.getDate() + i)
      days.push(date)
    }
    return days
  }

  const getDaysOffset = (date) => {
    const start = new Date(ganttStartDate)
    start.setHours(0, 0, 0, 0)
    const target = new Date(date)
    target.setHours(0, 0, 0, 0)
    return Math.floor((target - start) / (1000 * 60 * 60 * 24))
  }

  const isToday = (date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const target = new Date(date)
    target.setHours(0, 0, 0, 0)
    return today.getTime() === target.getTime()
  }

  const navigateWeek = (direction) => {
    const newDate = new Date(ganttStartDate)
    newDate.setDate(newDate.getDate() + direction * 7)
    setGanttStartDate(newDate)
  }

  const goToToday = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const dayOfWeek = today.getDay()
    const start = new Date(today)
    start.setDate(start.getDate() - dayOfWeek)
    setGanttStartDate(start)
  }

  const getTaskBarStyle = (task) => {
    if (!task.dueDate) return null
    const createdAt = task.createdAt ? new Date(task.createdAt) : new Date()
    const dueDate = new Date(task.dueDate)
    const startOffset = getDaysOffset(createdAt)
    const endOffset = getDaysOffset(dueDate)
    const duration = endOffset - startOffset + 1
    const barLeft = startOffset * CELL_WIDTH
    const barWidth = Math.max(duration * CELL_WIDTH, MIN_BAR_WIDTH)
    return { left: barLeft, width: barWidth }
  }

  const getTodayLinePosition = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const offset = getDaysOffset(today)
    if (offset < 0 || offset > 13) return null
    return offset * CELL_WIDTH + CELL_WIDTH / 2
  }

  const handleAddTaskKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (newTask.trim()) {
        const dueDate = newTaskDueDate || getLocalDateString()
        createTask(dueDate)
      }
    }
  }

  const createTask = (dueDate) => {
    if (!newTask.trim() || !dueDate) return

    const newTaskObj = {
      id: Date.now(),
      text: newTask,
      completed: false,
      priority: newTaskPriority,
      dueDate: dueDate,
      createdAt: new Date().toISOString()
    }

    setTasks([...tasks, newTaskObj])
    try {
      apiAddTask(newTaskObj)
    } catch (error) {
      console.error('Failed to add task to API:', error)
    }

    setNewTask('')
    setNewTaskPriority('low')
    setNewTaskDueDate('')
    setShowDatePicker(false)
  }

  const addTask = async (e) => {
    if (e) e.preventDefault()
    const dueDate = newTaskDueDate || getLocalDateString()
    createTask(dueDate)
  }

  const addTaskWithDate = (dateStr) => {
    setNewTaskDueDate(dateStr)
    setShowDatePicker(false)
  }

  const toggleComplete = async (id) => {
    const updatedTask = tasks.find(task => task.id === id)
    if (updatedTask) {
      setCompletingTaskId(id)
      setTimeout(async () => {
        const newTask = { ...updatedTask, completed: !updatedTask.completed }
        setTasks(tasks.map(task => task.id === id ? newTask : task))
        try {
          await apiUpdateTask(newTask)
        } catch (error) {
          console.error('Failed to update task:', error)
        }
        setCompletingTaskId(null)
      }, 300)
    }
  }

  const handleDeleteTask = async (id) => {
    setDeletingTaskId(id)
    setTimeout(async () => {
      setTasks(tasks.filter(task => task.id !== id))
      try {
        await apiDeleteTask(id)
      } catch (error) {
        console.error('Failed to delete task:', error)
      }
      setDeletingTaskId(null)
    }, 300)
  }

  const startEdit = (task, e) => {
    e.stopPropagation()
    setEditingTask(task.id)
    setEditDueDate(task.dueDate || '')
  }

  const saveEdit = async (id) => {
    if (!editDueDate) return
    const updatedTask = tasks.find(task => task.id === id)
    if (updatedTask) {
      const newTask = { ...updatedTask, dueDate: editDueDate }
      setTasks(tasks.map(task => task.id === id ? newTask : task))
      try {
        await apiUpdateTask(newTask)
      } catch (error) {
        console.error('Failed to update task:', error)
      }
    }
    setEditingTask(null)
    setEditDueDate('')
  }

  const cancelEdit = () => {
    setEditingTask(null)
    setEditDueDate('')
  }

  const handleTimelineClick = (e) => {
    if (e.target.classList.contains('task-bar') || e.target.closest('.task-bar')) return
    setEditingTask(null)
  }

  const weekDays = getWeekDays()
  const activeTasks = tasks.filter(t => !t.completed)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
  
  const completedTasks = tasks.filter(t => t.completed)
    .filter(t => t.text.toLowerCase().includes(completedSearch.toLowerCase()))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  
  const totalCount = tasks.length
  const completedCount = tasks.filter(t => t.completed).length
  const today = new Date()
  const dateStr = today.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })
  const todayLinePos = getTodayLinePosition()
  const ganttBodyHeight = Math.max(activeTasks.length * TASK_ROW_HEIGHT, 200)

  if (loading) {
    return (
      <div className="app">
        <div className="loading">加载中...</div>
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
        
        <nav className="nav-list">
          <button 
            className={`nav-item ${currentView === 'gantt' ? 'active' : ''}`}
            onClick={() => setCurrentView('gantt')}
          >
            <GanttIcon className="nav-icon" />
            <span>日程</span>
          </button>
          <button 
            className={`nav-item ${currentView === 'completed' ? 'active' : ''}`}
            onClick={() => setCurrentView('completed')}
          >
            <DoneIcon className="nav-icon" />
            <span>已完成</span>
            {completedCount > 0 && <span className="nav-badge">{completedCount}</span>}
          </button>
        </nav>

        <div className="sidebar-footer">
          <span className="task-total">共 {totalCount} 项</span>
          <button className="theme-toggle" onClick={toggleTheme} title={theme === 'dark' ? '切换到浅色模式' : '切换到深色模式'}>
            {theme === 'dark' ? <SunIcon className="theme-icon" /> : <MoonIcon className="theme-icon" />}
          </button>
        </div>
      </div>

      <div className="main">
        {currentView === 'gantt' ? (
          <>
            <h1 className="date-title">{dateStr}</h1>

            <form onSubmit={addTask} className="add-task-form">
              <div className="priority-selector">
                {Object.entries(priorityConfig).map(([key, config]) => (
                  <button
                    key={key}
                    type="button"
                    className={`priority-option ${newTaskPriority === key ? 'active' : ''}`}
                    onClick={() => setNewTaskPriority(key)}
                    style={{ '--priority-color': config.color }}
                  >
                    {config.label}
                  </button>
                ))}
              </div>
              <div className="task-input-wrapper">
                <input
                  type="text"
                  placeholder="输入任务名，回车添加..."
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyDown={handleAddTaskKeyDown}
                  className="task-input"
                />
                <div className="date-picker-wrapper">
                  <button
                    type="button"
                    className={`date-picker-toggle ${newTaskDueDate ? 'active' : ''}`}
                    onClick={() => setShowDatePicker(!showDatePicker)}
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
                        <button type="button" onClick={() => {
                          const d = new Date()
                          d.setDate(d.getDate() + 1)
                          const year = d.getFullYear()
                          const month = String(d.getMonth() + 1).padStart(2, '0')
                          const day = String(d.getDate()).padStart(2, '0')
                          addTaskWithDate(`${year}-${month}-${day}`)
                        }}>明天</button>
                        <button type="button" onClick={() => {
                          const d = new Date()
                          d.setDate(d.getDate() + 7)
                          const year = d.getFullYear()
                          const month = String(d.getMonth() + 1).padStart(2, '0')
                          const day = String(d.getDate()).padStart(2, '0')
                          addTaskWithDate(`${year}-${month}-${day}`)
                        }}>一周</button>
                      </div>
                      {newTaskDueDate && (
                        <button type="button" className="date-clear-btn" onClick={() => { setNewTaskDueDate(''); setShowDatePicker(false) }}>
                          清除
                        </button>
                      )}
                    </div>
                  )}
                </div>
                <button type="submit" id="add-task-submit" className="add-btn">
                  添加
                </button>
              </div>
            </form>

            <div className="gantt-container" onClick={handleTimelineClick}>
              <div className="gantt-header">
                <div className="gantt-nav">
                  <button className="gantt-nav-btn" onClick={() => navigateWeek(-1)}>
                    <ChevronLeftIcon className="nav-icon" />
                  </button>
                  <button className="today-btn" onClick={goToToday}>今天</button>
                  <button className="gantt-nav-btn" onClick={() => navigateWeek(1)}>
                    <ChevronRightIcon className="nav-icon" />
                  </button>
                </div>
                <div className="gantt-timeline-header" ref={timelineRef}>
                  <div className="timeline-grid" style={{ width: 14 * CELL_WIDTH }}>
                    {weekDays.map((day, index) => (
                      <div
                        key={index}
                        className={`timeline-cell ${isToday(day) ? 'today' : ''} ${day.getDay() === 0 || day.getDay() === 6 ? 'weekend' : ''}`}
                      >
                        <div className="day-name">{WEEK_DAYS[day.getDay()]}</div>
                        <div className="day-number">{day.getDate()}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="gantt-body">
                <div className="task-list-panel">
                  {activeTasks.map(task => {
                    const countdown = getCountdown(task.dueDate)
                    return (
                      <div
                        key={task.id}
                        className={`task-row ${task.priority} ${completingTaskId === task.id ? 'completing' : ''} ${deletingTaskId === task.id ? 'deleting' : ''}`}
                        style={{ height: TASK_ROW_HEIGHT }}
                      >
                        <button
                          className="task-checkbox"
                          onClick={() => toggleComplete(task.id)}
                        >
                          {completingTaskId === task.id && <CheckIcon className="checkmark-svg" />}
                        </button>
                        <span
                          className="task-priority-dot"
                          style={{ backgroundColor: priorityConfig[task.priority]?.color }}
                        />
                        <span className="task-name">{task.text}</span>
                        <span 
                          className="task-countdown"
                          style={{ color: countdown?.color }}
                        >
                          {countdown?.label}
                        </span>
                        <button
                          className="task-delete-btn"
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          <TrashIcon className="delete-icon" />
                        </button>
                      </div>
                    )
                  })}
                  {activeTasks.length === 0 && (
                    <div className="empty-gantt">暂无待办任务</div>
                  )}
                </div>

                <div className="timeline-panel" style={{ minHeight: ganttBodyHeight }}>
                  <div className="timeline-grid-bg" style={{ width: 14 * CELL_WIDTH, height: ganttBodyHeight }}>
                    {weekDays.map((day, index) => (
                      <div
                        key={index}
                        className={`timeline-cell-bg ${isToday(day) ? 'today' : ''} ${day.getDay() === 0 || day.getDay() === 6 ? 'weekend' : ''}`}
                      />
                    ))}
                  </div>

                  {todayLinePos !== null && (
                    <div className="today-line" style={{ left: todayLinePos }}>
                      <div className="today-label">今天</div>
                    </div>
                  )}

                  <div className="task-bars" style={{ height: ganttBodyHeight }}>
                    {activeTasks.map((task, index) => {
                      const style = getTaskBarStyle(task)
                      const countdown = getCountdown(task.dueDate)
                      if (!style) return null
                      const topPosition = index * TASK_ROW_HEIGHT
                      return (
                        <div
                          key={task.id}
                          className={`task-bar priority-${task.priority} ${completingTaskId === task.id ? 'completing' : ''} ${deletingTaskId === task.id ? 'deleting' : ''}`}
                          style={{
                            left: style.left,
                            width: style.width,
                            height: TASK_ROW_HEIGHT - 10,
                            top: topPosition + 5
                          }}
                          onClick={(e) => startEdit(task, e)}
                        >
                          <span className="bar-text">{task.text}</span>
                          {countdown && (
                            <span className="bar-countdown" style={{ color: countdown.color }}>
                              {countdown.label}
                            </span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {editingTask && (
                <div className="edit-popup">
                  <div className="edit-popup-header">调整截止日期</div>
                  <input
                    type="date"
                    value={editDueDate}
                    onChange={(e) => setEditDueDate(e.target.value)}
                    className="edit-popup-input"
                  />
                  <div className="edit-popup-actions">
                    <button className="edit-popup-cancel" onClick={cancelEdit}>取消</button>
                    <button className="edit-popup-save" onClick={() => saveEdit(editingTask)}>保存</button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <h1 className="page-title">已完成任务</h1>
            
            <div className="completed-search">
              <SearchIcon className="search-icon" />
              <input
                type="text"
                placeholder="搜索已完成任务..."
                value={completedSearch}
                onChange={(e) => setCompletedSearch(e.target.value)}
                className="search-input"
              />
            </div>

            <div className="completed-list">
              {completedTasks.length === 0 ? (
                <div className="empty-state">
                  {completedSearch ? '没有找到匹配的任务' : '暂无已完成任务'}
                </div>
              ) : (
                completedTasks.map(task => (
                  <div key={task.id} className={`completed-item priority-${task.priority}`}>
                    <button
                      className="checkbox checked"
                      onClick={() => toggleComplete(task.id)}
                    >
                      <CheckIcon className="checkmark-svg" />
                    </button>
                    <span className="task-text">{task.text}</span>
                    <span className="task-date">{formatDate(task.dueDate)}</span>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      <TrashIcon className="trash-icon-svg" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default App
