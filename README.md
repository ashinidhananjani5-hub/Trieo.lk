# Trieo.lk

A React + Tailwind local tourism planner backed by Firebase Authentication and Cloud Firestore.

## Run

```powershell
cd frontend
npm install
npm run dev
```

Copy `frontend/.env.example` to `frontend/.env.local` and fill it with the Firebase Web App configuration. The current local configuration points to `trieo-lk`; `.env.local` is Git-ignored. Restart Vite after changing environment values. No service account or Admin SDK credential belongs in this frontend.

**Finish the Console steps in [FIREBASE_SETUP.md](FIREBASE_SETUP.md) before using the connected app.** Local rules files are not automatically published to Firebase.

## Firebase features

- Tourist email/password registration and sign-in with Firebase Authentication.
- Persistent Firebase sign-in state and logout.
- Administrator authorization through a protected `admins/{uid}` record, enforced by Firestore Security Rules.
- Realtime attraction/category reads; administrator writes await Firestore confirmation.
- Account profiles in `users/{uid}`; administrators can view registered profiles.
- Private, ordered day plans in `plans/{uid}`, shared across devices for the same account.
- Explicit starter-place import for an administrator when the attraction collection is empty. Imported starter tourism data still needs verification.
- Image references remain external URLs. This change does not upload images to Firebase Storage.

The previous hardcoded administrator password and browser-only tourist account implementation are removed. Existing local demo accounts are not migrated; register again with Firebase. Unknown coordinates/fees are not invented.

## Checks

```powershell
cd frontend
npm run build
npm run lint
npm test
npm run test:rules
```

`test:rules` starts the Firestore emulator using the isolated `demo-trieo` project. Follow the Java requirement printed by your installed Firebase CLI. Tests never target live project data. Firebase SDK packages may require a newer Node version than the previous frontend; use Node 24.12+ if npm reports an engine warning.

## Structure

- `frontend/src/lib/firebase.js`: Firebase initialization from Vite environment variables.
- `frontend/src/features/auth/authService.js`: Authentication and account profiles.
- `frontend/src/services/firestoreService.js`: Firestore subscriptions and writes.
- `frontend/src/hooks/useFirebaseBackend.js`: Auth lifecycle and listener cleanup.
- `frontend/src/services/validation.js`: User-facing errors and data validation.
- `firestore.rules`: Database authorization and validation.
- `firebase.json`: Rule deployment and local emulator configuration.

The application still needs verified attraction information (at least ten places for the SRS), and a final geographic distance-verification method. Hosting deployment is separate from database integration.
