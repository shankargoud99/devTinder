# DevConnect — Frontend

React 19 + Redux Toolkit + Tailwind v4 + DaisyUI + Socket.io client. Talks to the `backend` project in this repo.

## Setup

```bash
cd frontend
npm install
cp .env.example .env
# edit .env if your backend isn't on http://localhost:7777
npm run dev
```

Runs on `http://localhost:5173`. Make sure the backend is running on port 7777 (or whatever you set `VITE_API_BASE_URL` to), and that its `CORS_ORIGINS` includes `http://localhost:5173`.

## Folder structure

```
src/
  main.jsx              → Redux Provider + app mount
  App.jsx                → routes
  index.css               → Tailwind + DaisyUI + design tokens (dark, dev/git-inspired theme)
  utils/
    constants.js           → API base URL
    api.js                  → axios instance (withCredentials for cookie auth)
    socket.js                → socket.io-client singleton
  redux/
    store.js
    slices/                  → user, feed, connections, requests
  components/
    NavBar.jsx, Body.jsx, ProtectedRoute.jsx, UserCard.jsx
  pages/
    Login.jsx    → signup/login toggle
    Feed.jsx      → discover feed, one card at a time (interested/ignore)
    Requests.jsx   → pending requests received (accept/reject)
    Connections.jsx → accepted connections, links to chat
    Profile.jsx      → edit profile + photo upload, live preview
    Chat.jsx           → real-time messaging via Socket.io
```

## Design notes

Dark, terminal/git-inspired visual identity — fits a developer-facing product rather than a generic social app:
- Skill tags render like syntax/code tags (`#react`, monospace, green accent)
- Connection state uses a vertical "branch line": dashed amber = pending request, solid green = connected
- Type: Space Grotesk (display), Inter (body), JetBrains Mono (skills/data)
- All colors are CSS variables in `index.css` (`--dc-*`) — change them there to re-theme.

## Auth flow

Auth is fully cookie-based (httpOnly JWT set by the backend on `/login`/`/signup`). The axios instance sends `withCredentials: true` on every request, so no token handling is needed in JS. `Body.jsx` calls `/profile/view` on mount to check the session and populate Redux; `ProtectedRoute` redirects to `/login` if there's no user in the store.

## Real-time

`utils/socket.js` creates a single Socket.io connection per session (auth via the same cookie). `Chat.jsx` emits `joinChat`/`sendMessage` and listens for `messageReceived`. `NavBar` shows a live badge for pending request count (re-fetched on the Requests page; wiring a live push update for `newConnectionRequest` is a natural next step).
