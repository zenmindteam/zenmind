# ZenMind Healthcare Platform

## Overview
ZenMind is a modern mental‑health platform that connects users with certified therapists. It provides AI‑powered chat, personalized wellness programs, a therapy hub, mood‑tracking, and a full admin console.

## Tech Stack & Libraries
- **Frontend**: React, Vite, Tailwind CSS, GSAP (animations), Lucide React (icons), Motion/Framer‑Motion (transitions)
- **State & UI**: React hooks, custom `usePlan` hook for tier access, `apiFetch` wrapper for all API calls
- **Backend**: Node.js, Express, MongoDB (Mongoose), Socket.io (real‑time chat), JWT authentication
- **Styling**: Dark‑mode ready, glass‑morphism effects, responsive layouts using Tailwind utilities
- **Build/Tooling**: Vite dev server (`npm run dev`), ESLint + Prettier for code quality, Git for version control

## Prerequisites
- Node ≥ 18
- npm or pnpm
- MongoDB instance (local or cloud)
- Git

## Setup & Installation
```bash
# 1️⃣ Clone the repo
git clone https://github.com/zenmindteam/zenmind.git
cd "ZenMind Healthcare Website Design (1)"

# 2️⃣ Install dependencies (frontend & backend)
npm install              # installs root (frontend) packages
cd backend && npm install && cd ..

# 3️⃣ Configure environment variables
# Create a .env file in the project root:
cat <<EOF > .env
VITE_API_URL=http://localhost:5000/api   # backend API URL
VITE_SOCKET_URL=http://localhost:5000    # socket.io URL
MONGO_URI=mongodb://localhost:27017/zenmind
JWT_SECRET=your_secret_key
EOF

# 4️⃣ Run the development servers
# Backend (listens on 5000)
cd backend && npm run dev &
# Frontend (Vite dev server, default port 5173)
cd .. && npm run dev
```
The app will be available at **http://localhost:5173**.

## Building for Production
```bash
npm run build   # creates a production bundle in the `dist` folder
```
Deploy the `dist` folder to any static host and run the backend on a server.

## Project Structure
```
.
├─ src/                 # Frontend source code
│  ├─ app/              # Main React app and pages
│  └─ ...
├─ backend/             # Express API server
│  ├─ src/routes/       # API routes (therapist, admin, user, etc.)
│  └─ src/models/       # Mongoose schemas
├─ asset/               # Media assets used in the UI
├─ .env                 # Environment configuration (not committed)
├─ README.md            # Project documentation (this file)
└─ ...
```

## Contributing
1. Fork the repository.
2. Create a feature branch.
3. Follow the existing code style (Prettier + ESLint).
4. Submit a Pull Request with a clear description.

## License
MIT – see `LICENSE` for details.
