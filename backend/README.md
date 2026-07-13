# DevConnect — Backend

Node.js + Express + MongoDB + Socket.io backend for a developer networking & real-time messaging platform.

## Setup

```bash
cd backend
npm install
cp .env.example .env
# edit .env: set DB_CONNECTION_SECRET (local Mongo or Atlas) and a real JWT_SECRET
npm run dev   # nodemon, or `npm start` for plain node
```

Server runs on `http://localhost:7777` by default. Health check: `GET /health`.

## Folder structure

```
src/
  app.js                 → entry point, wires everything together
  config/database.js     → mongoose connection
  models/                → User, ConnectionRequest, Chat
  middlewares/auth.js    → JWT cookie auth guard
  routes/
    auth.router.js        → signup, login, logout
    profile.router.js     → view/edit profile, photo upload
    request.router.js     → send/review connection requests
    user.router.js        → feed, connections, pending requests
    chat.router.js         → fetch chat history
  utils/
    validation.js          → signup/edit-profile validators
    socket.js               → Socket.io auth + real-time messaging
uploads/                  → uploaded profile photos (served at /uploads/*)
```

## API reference

All authenticated routes read the JWT from an **HTTP-only cookie** named `token` (set automatically on login/signup) — no `Authorization` header needed. Send requests with `credentials: "include"` from the frontend.

### Auth
| Method | Route | Body | Notes |
|---|---|---|---|
| POST | `/signup` | `firstName, lastName, emailId, password` | Sets cookie |
| POST | `/login` | `emailId, password` | Sets cookie |
| POST | `/logout` | — | Clears cookie |

### Profile
| Method | Route | Notes |
|---|---|---|
| GET | `/profile/view` | Auth required |
| PATCH | `/profile/edit` | Whitelisted fields only: firstName, lastName, age, gender, about, skills, photoUrl |
| POST | `/profile/photo` | `multipart/form-data`, field name `photo`, max 5MB, jpeg/png/webp |

### Connections
| Method | Route | Notes |
|---|---|---|
| POST | `/request/send/:status/:toUserId` | status = `interested` \| `ignored` |
| POST | `/request/review/:status/:requestId` | status = `accepted` \| `rejected`, only the recipient can review |
| GET | `/user/requests/received` | Pending requests sent to you |
| GET | `/user/connections` | Your accepted connections |
| GET | `/user/feed?page=1&limit=10` | Discover feed, excludes self/connections/pending |

### Chat
| Method | Route | Notes |
|---|---|---|
| GET | `/chat/:targetUserId` | REST fallback to load history; requires an accepted connection |

### Socket.io events (real-time)
Client connects with the same `token` cookie present (browser sends it automatically if same-site, or configure `withCredentials`).

- Emit `joinChat` `{ targetUserId }` → joins a deterministic room for that pair.
- Emit `sendMessage` `{ targetUserId, text }` → persists + broadcasts to the room.
- Listen `messageReceived` → `{ senderId, firstName, photoUrl, text, createdAt }`.
- Listen `newConnectionRequest` → fired when someone sends you a request while online.
- Listen `requestAccepted` → fired when your request gets accepted while online.

## Notes / next steps
- Uses cookie-based JWT (`httpOnly`), bcrypt (10 salt rounds), and per-field Mongoose validation.
- `CORS_ORIGINS` in `.env` controls allowed frontend origins (comma-separated) — update for production.
- Ready for a React + Redux Toolkit + Tailwind/DaisyUI frontend using the same endpoints described above.
