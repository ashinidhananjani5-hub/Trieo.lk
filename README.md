# Trieo.lk

Trieo.lk is a responsive local tourist day-visit planner built around the system requirements for a Padalangala area attraction and itinerary experience. It focuses on browsing local places, applying category filters, viewing details and maps, creating a one-day plan, and enabling a simple administrator workflow for managing attraction records.

## Features

- Auto-rotating hero section and destination discovery landing page
- Category-based attraction filtering for tourists
- Detailed place modal with travel tips and an embedded OpenStreetMap view
- One-day visit planner that saves and removes places from a trip plan
- Tourist account creation and email/password sign-in
- Administrator sign-in and management workflow for adding, editing, and deleting place records
- Browser-only demo authentication and state suitable for prototype or UI validation work; it is not production security

## Demo administrator login

- Email: admin@trieo.lk
- Password: admin123

Tourist accounts are stored in the current browser. Administrator credentials are checked in the frontend, so replace this demo authentication with a server-side identity service before production use.

## Run locally

```bash
cd frontend
npm install
npm run dev
```

Then open http://localhost:5173

## Production build

```bash
cd frontend
npm run build
```

## Frontend source layout

- `src/App.jsx` coordinates the active interface, shared state, and event handlers.
- `src/features/` contains the home, sign-in, tourist, and administrator interfaces; authentication storage and password helpers live in `features/auth/authService.js`.
- `src/components/` contains shared site chrome and the attraction editor.
- `src/data/` contains attraction records and landing-page content.
- `src/App.css` contains the shared styles used across the interfaces.
