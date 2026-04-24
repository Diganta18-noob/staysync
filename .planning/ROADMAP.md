# Roadmap

## Phase 1: Backend HTTP Caching
**Goal**: Implement Cache-Control, ETag, and CDN directives in the Express backend.
- Create `cacheMiddleware.js`.
- Configure global ETags for Express.
- Apply caching to `propertyRoutes.js`.

## Phase 2: Client Storage Utilities
**Goal**: Create unified services for browser storage mechanisms.
- Implement `StorageService.js` (LocalStorage, SessionStorage, Cookies).
- Implement `idbCache.js` for IndexedDB integration.

## Phase 3: Frontend Refactoring & Stale-While-Revalidate
**Goal**: Migrate `Properties.jsx` from local mock arrays to live API fetches using the new caching systems.
- Fetch properties from actual backend endpoint.
- Implement Stale-While-Revalidate pattern using IndexedDB.
- Persist filter state using SessionStorage.
