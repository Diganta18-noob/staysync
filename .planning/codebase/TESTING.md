# Testing Practices

*Date: 2026-04-24*

## Overview
Currently, the codebase does not appear to have an established automated testing framework in place (no Jest, Mocha, or Cypress configurations were immediately identified in the root package configurations).

## Current State
- **Manual Testing**: Features are primarily verified manually via browser and API clients (Postman/Insomnia).
- **Verification Plans**: UAT (User Acceptance Testing) and functional verification are handled via the `task.md` and `walkthrough.md` planning artifacts.

## Recommendations for Future Implementation
- **Unit Testing (Backend)**: Introduce `Jest` and `Supertest` to validate Express controllers and API routes, mocking MongoDB connections where necessary.
- **Component Testing (Frontend)**: Implement `React Testing Library` (RTL) paired with `Vitest` to verify UI component rendering and interaction.
- **E2E Testing**: Introduce `Cypress` or `Playwright` to test critical user journeys (e.g., login, property booking flow).
