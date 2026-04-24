# Directory Structure

*Date: 2026-04-24*

## Root Layout
The project is divided into two main environments:
- `/client` - The frontend React application.
- `/server` - The backend Node.js/Express API.

## Frontend (`/client`)
- `src/`
  - `assets/` - Static files like images and global CSS (`index.css`).
  - `components/` - Reusable UI elements (buttons, inputs, cards, navigation).
  - `pages/` - Full-screen route components (e.g., `Home.jsx`, `Properties.jsx`, `Login.jsx`).
  - `lib/` or `utils/` - Utility functions, API clients, and planned storage services.
- `package.json` - Frontend dependencies and scripts.
- `tailwind.config.js` - Global design system configuration, colors, fonts, and animation keyframes.
- `vite.config.js` - Build tool configuration.

## Backend (`/server`)
- `src/`
  - `config/` - Environment loaders, database connection (`db.js`).
  - `controllers/` - Business logic for handling route requests (e.g., `propertyController.js`).
  - `models/` - Mongoose schemas (e.g., User, Property, Message).
  - `routes/` - Express router definitions linking endpoints to controllers.
  - `middleware/` - Express middleware for auth (`auth.js`), error handling, and caching (`cacheMiddleware.js`).
  - `utils/` - Helper functions (e.g., `seedAdmin.js`).
- `package.json` - Backend dependencies and scripts.
- `server.js` or `app.js` - Main entry point for the Express application.

## Naming Conventions
- **React Components**: PascalCase (`Properties.jsx`, `NavBar.jsx`).
- **Backend Controllers/Models**: camelCase for files (`propertyController.js`), PascalCase for Model names (`Property.js`).
- **CSS**: Kebab-case classes, heavily utilizing standard Tailwind utility classes.
