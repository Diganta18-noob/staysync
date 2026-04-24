# Code Conventions

*Date: 2026-04-24*

## Code Style
- **JavaScript/JSX**: Modern ES6+ syntax is used throughout (arrow functions, destructuring, template literals).
- **Indentation**: 2 spaces standard across both frontend and backend.
- **Component Definitions**: Functional components using React Hooks (`useState`, `useEffect`).

## Naming Conventions
- **Variables/Functions**: `camelCase`.
- **Constants**: `UPPER_SNAKE_CASE` (especially for action types or config flags).
- **Files/Directories**:
  - React components: `PascalCase.jsx`
  - Backend controllers/middleware: `camelCase.js`
  - Routes: `camelCase.js` (e.g., `propertyRoutes.js`)

## Architectural Patterns
- **API Responses**: Controllers generally respond with standard JSON objects `{ success: boolean, data: any, message?: string }`.
- **Middleware Usage**: Routes are protected using `protect` and `authorize` middleware functions imported from `auth.js`.
- **Animations**: Heavy use of `framer-motion` variants (e.g., `fadeInUp`, `staggerContainer`) to ensure consistent entry and exit animations across pages.

## Error Handling
- **Backend**: Controllers wrap logic in `try/catch` blocks or rely on an async error wrapper. Errors return appropriate HTTP status codes (400, 401, 403, 404, 500) with a JSON error message.
- **Frontend**: API calls use `try/catch` with Axios. Errors are typically logged to console or displayed via UI toast notifications.
