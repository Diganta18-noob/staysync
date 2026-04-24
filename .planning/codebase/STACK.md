# Technology Stack

*Date: 2026-04-24*

## Overview
This is a full-stack JavaScript/TypeScript application using the MERN stack (MongoDB, Express, React, Node.js), structured as a monorepo-style workspace with separate `client` and `server` directories.

## Frontend Stack
- **Framework**: React 19 (`react`, `react-dom`) via Vite
- **Routing**: React Router DOM (`react-router-dom`)
- **Styling**: Tailwind CSS with custom design system utilities (`tailwindcss`, `autoprefixer`, `postcss`)
- **Animation**: Framer Motion (`framer-motion`) for UI micro-interactions and transitions
- **State Management**: React Hooks (Context API / Local state)
- **Icons**: Lucide React (`lucide-react`), React Icons (`react-icons`)
- **Data Fetching**: Axios (`axios`)
- **Caching**: LocalStorage, SessionStorage, IndexedDB (`idb`) - *Planned*

## Backend Stack
- **Runtime**: Node.js
- **Framework**: Express (`express`)
- **Database**: MongoDB via Mongoose (`mongoose`)
- **Authentication**: JWT (`jsonwebtoken`), Google OAuth (`google-auth-library`)
- **File Uploads**: Cloudinary (`cloudinary`), Multer (`multer`)
- **Security**: CORS (`cors`), Helmet (Standard Express security)

## Infrastructure & Tooling
- **Package Manager**: npm
- **Build Tool**: Vite (Frontend), standard Node execution (Backend)
- **Environment Variables**: `dotenv`

## Key Patterns
- The frontend heavily leverages Framer Motion for premium, high-fidelity UI animations, specifically targeting glassmorphic styles and "Warm Editorial SaaS" aesthetics.
- The backend relies on standard RESTful architecture with dedicated controllers, routes, and Mongoose models.
