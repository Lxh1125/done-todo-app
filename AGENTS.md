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
├── App.jsx       # Main application component (~900 lines)
├── App.css       # Component-scoped styles (~1700 lines)
├── index.css     # Global reset and base styles
└── main.jsx      # Entry point
```

## Code Style Guidelines

### JavaScript/React Conventions

- **Components**: Use PascalCase for React components (e.g., `GanttView`, `CheckIcon`)
- **Functions**: Use camelCase for all functions and variables (e.g., `addTask`, `filteredTasks`)
- **Constants**: Use camelCase for const values (e.g., `priorityConfig`, `API_BASE_URL`)
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
| Components | `App`, `GanttView`, `CheckIcon` |
| Event handlers | `handleClick`, `onSubmit`, `toggleComplete` |
| State variables | `tasks`, `loading`, `filter`, `activeList` |
| Props | `className`, `filled`, `priority` |
| Constants | `priorityConfig`, `API_BASE_URL`, `weekDays` |

### CSS Styling

- Use CSS custom properties (`:root`) for theming
- Consistent color variables: `--accent-primary`, `--text-primary`, `--bg-primary`
- Component classes: BEM-ish naming (`.task-item`, `.task-content`, `.filter-btn`)
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
  important: boolean,
  today: boolean,
  priority: 'high' | 'medium' | 'low' | 'none',
  dueDate: string,     // ISO date string YYYY-MM-DD
  createdAt: string    // ISO timestamp
}
```

### Priority System

- `high`: Red (#ff4757), value: 3
- `medium`: Orange (#ffa502), value: 2
- `low`: Green (#2ed573), value: 1
- `none`: Gray (#555555), value: 0

### Icons

All icons are inline SVG components with `className` prop for styling:
- `viewBox="0 0 24 24"`
- `stroke="currentColor"` for line icons
- `fill="currentColor"` or `fill="none"` as appropriate

### Date Handling

- Use `new Date()` with `toISOString()` for storage
- Display dates in Chinese format (`zh-CN` locale)
- Helper functions: `isOverdue`, `isDueToday`, `isDueThisWeek`, `formatDate`

### Comments

- Use Chinese comments for business logic and user-facing text
- Use English comments for technical implementation details
- Keep comments concise; avoid redundant explanations

### Accessibility

- Interactive elements use `<button>` elements
- Inputs have placeholder text
- Focus states are clearly styled
- Icons are decorative (no ARIA labels needed)

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
