# Codebase Concerns

*Date: 2026-04-24*

## Technical Debt
- **Hardcoded Mock Data**: The frontend `Properties.jsx` component is currently relying heavily on a local `demoProperties` array instead of fetching live data from the backend. This needs to be connected to the actual `/api/properties` endpoint.
- **Absence of Tests**: Lack of automated tests means regressions must be caught manually during UI verification.
- **Caching**: The application lacks a robust caching layer. Repeated requests fetch the same data, leading to suboptimal performance and potential rate-limiting. A plan to introduce HTTP headers and IndexedDB caching is currently in motion.

## Bugs & Issues
- **Chat Application Performance**: There are known issues with the realtime chat functionality, including duplicate group rendering, message misrouting, and online status tracking bugs.
- **Authentication Resilience**: Google OAuth integration experienced issues with CORS ("origin not allowed") and state persistence. While some fixes were applied, it remains an area of concern that requires thorough end-to-end testing.

## Security
- **JWT Storage**: Currently, authentication tokens might be stored in `localStorage`, which exposes them to XSS attacks. Transitioning to secure, `HttpOnly` cookies is recommended for enhanced security.
- **Environment Variables**: Ensure `.env` and `.env.local` files containing `MONGODB_URI` and `CLOUDINARY_URL` are strictly excluded from version control.

## Performance / Fragile Areas
- **Large Component Files**: Components like `Properties.jsx` are becoming excessively large (over 400 lines) due to embedded data arrays and inline logic. Splitting these into smaller, modular components (e.g., `PropertyCard.jsx`, `FilterSidebar.jsx`) will improve maintainability.
- **Infinite Scroll Engine**: Ensure the infinite scroll implementation correctly manages memory and unmounts elements if the list grows too large to prevent browser lag.
