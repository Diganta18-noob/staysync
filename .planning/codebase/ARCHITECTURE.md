# System Architecture

*Date: 2026-04-24*

## Pattern
The application follows a standard Client-Server architecture with a RESTful API backend and a Single Page Application (SPA) frontend.

## Layers

### Frontend (Client)
- **View Layer**: React components organized into `pages` and `components`. Pages represent full route views, while components are modular, reusable UI elements.
- **State Layer**: Primarily relies on React local state and Context API.
- **Data Fetching Layer**: Direct API calls using `axios` or native `fetch`. A caching layer utilizing IndexedDB (`idb`) and HTTP headers is currently under implementation.

### Backend (Server)
- **Routing Layer**: Express routers mapped to specific domain entities (e.g., `/api/properties`, `/api/users`).
- **Controller Layer**: Business logic resides here. Controllers extract request data, interact with models, and send JSON responses.
- **Data Access Layer**: Mongoose schemas and models define the data structure and interact directly with MongoDB.
- **Middleware Layer**: Custom middleware functions handle Authentication (JWT verification), Authorization (Role-based access), and Error Handling. Caching middleware is currently being integrated.

## Data Flow
1. User interacts with the React UI (e.g., requests property list).
2. Frontend makes an HTTP GET request to `/api/properties`.
3. Express router intercepts the request and runs it through middleware (auth, cache, etc.).
4. The property controller queries MongoDB via Mongoose.
5. MongoDB returns the data to the controller.
6. Controller formats the response and sends JSON back to the client.
7. React state updates, triggering a re-render to display the data.

## Abstractions
- **StorageService**: A planned unified abstraction for interacting with `localStorage`, `sessionStorage`, and `cookies`.
- **idbCache**: A planned abstraction layer for IndexedDB to handle "Stale-While-Revalidate" caching logic.

## Entry Points
- **Frontend**: `client/src/main.jsx` -> mounts the React application.
- **Backend**: `server/src/app.js` or `server/server.js` -> configures Express and starts the HTTP listener.
