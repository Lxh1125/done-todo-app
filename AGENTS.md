# AGENTS.md

## Build, Lint, and Test Commands

This is a React + Vite project using plain JavaScript.

### Core Commands

```bash
npm run dev      # Start development server with hot reload
npm run build    # Build for production (outputs to dist/)
npm run preview  # Preview production build locally
```

### Environment Setup

```bash
npm install      # Install dependencies (already done)
```

## Project Structure

```
src/
├── api.js        # API service layer (Cloudflare Functions integration)
├── App.jsx       # Main application component (~350 lines, simplified)
├── App.css       # Component styles (~500 lines)
├── index.css     # Global reset and base styles
└── main.jsx      # Entry point
```

## Code Style Guidelines

### JavaScript/React Conventions

- **Components**: Use PascalCase for React components (e.g., `CheckIcon`, `App`)
- **Functions**: Use camelCase for all functions and variables (e.g., `addTask`, `getCountdown`)
- **Constants**: Use camelCase for const values (e.g., `priorityConfig`)
- **Files**: Use kebab-case for non-component files (e.g., `api.js`, `main.jsx`)

### Imports

```javascript
// React core
import React from 'react'

// Named imports for hooks
import { useState, useEffect } from 'react'

// Component imports
import App from './App.jsx'

// Named imports for utilities
import { getTasks, addTask, updateTask, deleteTask } from './api'
```

### Component Structure

```jsx
// Small reusable icons use arrow function components
const CheckIcon = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" ...>
  </svg>
)

// Main components use function declarations
function App() {
  // Hooks at top
  const [state, setState] = useState(initialValue)

  // Helper functions
  const helperFunction = () => { ... }

  // Event handlers
  const handleClick = () => { ... }

  // Render
  return ( ... )
}

export default App
```

### State Management

- Use `useState` for component-local state
- Use `useEffect` for side effects (data fetching, localStorage sync)
- Update state with functional updates when depending on previous state
- Optimistic UI updates with async API calls and error fallback to localStorage

### Error Handling

```javascript
try {
  const data = await apiCall()
} catch (error) {
  console.error('Descriptive error message:', error)
  // Fallback to localStorage or graceful degradation
}
```

API failures log errors and fall back to localStorage backup automatically.

### Naming Conventions

| Pattern | Example |
|---------|---------|
| Components | `App`, `CheckIcon` |
| Event handlers | `handleClick`, `toggleComplete` |
| State variables | `tasks`, `loading`, `showCompleted` |
| Props | `className` |
| Constants | `priorityConfig` |

### CSS Styling

- Use CSS custom properties (`:root`) for theming
- Consistent color variables: `--accent-primary`, `--text-primary`, `--bg-primary`
- Component classes: BEM-ish naming (`.task-item`, `.task-content`)
- Responsive breakpoints at `768px`
- Use `rem` for spacing, `px` for borders and small elements

### API Integration

- All API functions are async and exported from `src/api.js`
- Base URL: `/api` (Cloudflare Functions)
- API functions: `getTasks`, `addTask`, `updateTask`, `deleteTask`, `saveAllTasks`
- All API calls have localStorage fallback for offline support

### Data Model

```javascript
{
  id: number,          // Timestamp-based ID
  text: string,        // Task description
  completed: boolean,
  priority: 'high' | 'low',
  dueDate: string,     // ISO date string YYYY-MM-DD
  createdAt: string    // ISO timestamp
}
```

### Priority System

- `high`: Red (#ff4757), value: 2
- `low`: Green (#2ed573), value: 1

### Countdown Display Rules

| Status | Display | Color |
|--------|---------|-------|
| Overdue | `X天逾期` | Red #ff4757 |
| Today | `今天` | Orange #ffa502 |
| Tomorrow | `明天` | Orange #ffa502 |
| 2-7 days | `X天后` | Green #2ed573 |
| >7 days | `X月X日` | Gray #a0a0a0 |

### Icons

All icons are inline SVG components with `className` prop for styling:
- `viewBox="0 0 24 24"`
- `stroke="currentColor"` for line icons
- `fill="currentColor"` or `fill="none"` as appropriate

### Date Handling

- Use `new Date()` with `toISOString()` for storage
- Display dates in Chinese format (`zh-CN` locale)
- Helper functions: `getCountdown`, `formatDate`

### Best Practices

1. Use `key` prop when mapping lists
2. Destruct props in component signatures
3. Functional updates: `setTasks(prev => [...prev, newTask])`
4. Early returns for validation
5. `e.preventDefault()` on form submit handlers
6. `autoFocus` on edit inputs
7. `animationDelay` for staggered list animations

### Current Limitations

- No TypeScript (JSX files, `.d.ts` files present but not used)
- No linting configured (ESLint, Prettier not installed)
- No test framework installed
- No CSS-in-JS or CSS modules (plain CSS files)

### Simplified Feature Set

This is a minimalist todo app with the following features:
- **Date display**: Large title showing current date in Chinese format
- **Task list**: Active tasks sorted by urgency and priority
- **Countdown**: Shows days until due date or overdue status
- **Priority**: Only high (red) and low (green) levels
- **Completed section**: Collapsible section to view completed tasks
- **Add task**: Quick add with priority and due date
- **Edit task**: Double-click to edit task text and due date
- **Delete task**: Delete button appears on hover
