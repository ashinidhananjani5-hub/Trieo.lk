# Firebase setup for Trieo.lk

Project: `trieo-lk`. The Firebase Web App config is already in `frontend/.env.local` on this machine. Analytics is not enabled by this implementation.

## 1. Enable email/password authentication

1. Open Firebase Console > `trieo-lk` > Build > Authentication.
2. Get started if needed.
3. Sign-in method > Email/Password > Enable > Save. Email-link sign-in is not required.
4. Authentication > Settings > Authorized domains: ensure `localhost` is present for local development. Add the eventual deployed host before deployment.

## 2. Publish the rules

1. Firestore Database > Rules.
2. Replace the editor contents with the exact contents of the repository-root `firestore.rules` file.
3. Publish.

Alternatively, after signing in to Firebase CLI with the project owner's account, run from the repository root:

```powershell
.\frontend\node_modules\.bin\firebase.cmd login
.\frontend\node_modules\.bin\firebase.cmd deploy --only firestore:rules --project trieo-lk
```

Do not use test-mode `allow read, write: if true`. The supplied rules permit public tourism reads, administrator-only place/category writes, and UID-owned day plans. The `admins` collection cannot be written by any client, including an administrator.

## 3. Provision the first administrator

1. In Authentication > Users > Add user, create the chosen admin email/password account, or register your own account through the app.
2. Copy that account's **User UID**, not its email.
3. Firestore > Data > Start collection: `admins`.
4. Document ID: paste the UID exactly.
5. Add field `enabled`, type **boolean**, value **true**.
6. Save.
7. In Trieo.lk choose Administrator and sign in with that Firebase account.

`admins/{uid}` is the source of administrator authorization. A `role: Administrator` field in a user profile does not grant permissions. A profile's stored role stays `Tourist`; the app determines the signed-in user's actual admin access from the protected admin record. Set `enabled` to false to revoke administrator writes.

Accounts created directly in Console receive a `users/{uid}` profile on first successful app login. Users listed in the dashboard are Firestore profiles, not a browser-exposed listing of all Authentication credentials. A Console-created account that has never logged into the app will not appear yet.

## 4. Create initial attractions

Admin > Overview > Import starter places imports the four existing prototype records only into an empty attraction collection, with categories in the same batch. It never runs automatically. Review stock image references, distances, opening hours, and descriptions; add verified coordinates before map display. Add at least ten verified attractions to meet the SRS.

To start without prototype records: create categories under Categories and add complete records through Add attraction.

## Collections

| Path | Contents | Access |
| --- | --- | --- |
| `places/{id}` | Name, categories, description, image references, distance, duration, hours, optional coordinates | Public read; admin write |
| `categories/catalog` | `names` array and update timestamp | Public read; admin write |
| `users/{uid}` | Name, email, fixed profile role, creation timestamp | Owner read/name update; admin read |
| `plans/{uid}` | Ordered unique `placeIds` and update timestamp | Owner only |
| `admins/{uid}` | `enabled: true` for provisioned administrators | User may read own record; Console/Admin SDK writes only |

Passwords are handled by Firebase Authentication and are not stored in these documents.

## Verify after Console setup

1. Restart Vite and confirm Home loads Firestore places.
2. Register a tourist; check Authentication and the corresponding `users/{uid}` profile.
3. Add two places, reorder, sign out/in, and confirm the plan is restored. Check another browser/device with the same account.
4. Sign in as administrator; add/edit/delete a test attraction and verify changes appear in another browser.
5. Confirm a tourist cannot enter Administrator mode. Run `npm run test:rules` to verify cross-user data denial.

## Current boundaries

- The repository's rules and credentials cannot prove Console rules have been published or Authentication has been enabled. These must be verified in the actual project.
- Image upload/Storage, hosting, password reset, and verified tourism-data research are not included in this connection step.
- Plan writes currently save the whole ordered plan; simultaneous edits from two devices use the last committed plan.
- Category rename updates the catalog and currently known matching attractions atomically; large catalogs over 450 related records require a server migration. Avoid simultaneous category schema changes by multiple administrators.
- If a plan references a deleted attraction it is omitted in the UI; a later plan save prunes deleted IDs.
- In a restricted environment, the Emulator Suite may require a separate emulator download or a newer Java runtime. That does not mean cloud authorization was tested.

References: https://firebase.google.com/docs/auth/web/password-auth and https://firebase.google.com/docs/firestore/security/get-started.
