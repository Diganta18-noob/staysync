# External Integrations

*Date: 2026-04-24*

## Overview
The application connects to a few key external services for authentication, database hosting, and media storage.

## Core Integrations

### 1. MongoDB Atlas
- **Purpose**: Primary data store for properties, users, bookings, and chat messages.
- **Integration Point**: `server/src/config/db.js` via Mongoose connection.
- **Authentication**: Connection string via `MONGODB_URI` environment variable.

### 2. Google OAuth
- **Purpose**: Single Sign-On (SSO) authentication for users.
- **Integration Point**: `server/src/controllers/authController.js` and frontend login flow.
- **Library**: `google-auth-library` (Backend), `@react-oauth/google` (Frontend - expected).

### 3. Cloudinary
- **Purpose**: Image hosting for property photos and user avatars.
- **Integration Point**: Backend upload middleware (likely utilizing `multer` + `cloudinary`).
- **Authentication**: `CLOUDINARY_URL` or API keys in environment variables.

## Future/Planned Integrations
- **WebSockets / Socket.io**: For real-time chat updates (currently exploring optimization for chat performance).
- **CDN**: Planned integration for caching static assets and API responses.
