# Testing Guide for EcoStep

This project is configured with a comprehensive testing suite for both the backend (Express) and frontend (Next.js) to ensure reliability, particularly for the core carbon calculation algorithms and component rendering.

## Frameworks Used
- **Backend**: Jest + Supertest (for API integration testing).
- **Frontend**: Jest + React Testing Library (RTL). Next.js provides built-in Jest support.

## Test Coverage Goals
We aim to maintain **>70% code coverage**, specifically focusing on:
1. `carbonFactors.js` logic (critical business logic).
2. Major UI components (Dashboard, Forms).
3. API Endpoints (Auth, Activities, Users).

---

## Running Backend Tests

The backend tests are located in `ecostep-backend/__tests__/`.

1. Navigate to the backend directory:
   ```bash
   cd ecostep-backend
   ```
2. Run standard tests:
   ```bash
   npm run test
   ```
3. The `npm run test` command is already configured to output a **coverage report** (`jest --coverage --forceExit`).

---

## Running Frontend Tests

The frontend tests use DOM environments and are located in `ecostep-frontend/__tests__/`.

1. Navigate to the frontend directory:
   ```bash
   cd ecostep-frontend
   ```
2. Run tests in watch mode (great for development):
   ```bash
   npm run test:watch
   ```
3. Run tests with coverage report:
   ```bash
   npm run test:coverage
   ```

*Note: If you are using Windows PowerShell and get an Execution Policy error when running `npm`, use `cmd /c npm run test:coverage` instead, or update your PowerShell execution policy.*

## Adding New Tests
- **Unit Tests**: Place in `__tests__/unit/`. Perfect for utility functions like math, formatting, or validation.
- **Component Tests**: Place in `__tests__/components/`. Focus on rendering, accessibility roles, and user interactions (`userEvent`).
- **Integration Tests**: Place in `__tests__/integration/`. Focus on the glue between components (e.g., form submit -> state update).
