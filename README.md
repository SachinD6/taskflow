# TaskFlow 🚀

Hey there! 👋 This is Taskflow, a full-stack task management application I built. It's designed to be a highly scalable, production-ready system featuring a Node.js/Express backend and a React/Vite frontend. 

I built this project to demonstrate a solid understanding of REST API design, Role-Based Access Control (RBAC), and smart caching strategies.

## ✨ What's included?

### 🛠️ The Backend (Node.js, Express, TypeScript)
- **Authentication:** Solid JWT-based auth with `bcryptjs` for password hashing. Real stateless, secure sessions.
- **Role-Based Access:** Users can only interact with their own tasks. Admins? They get the keys to the castle to view and manage everything across the system.
- **Intelligent Caching:** Integrated **Upstash Redis** using a cache-aside pattern. I also set up write-through invalidation so the cache instantly busts when data changes. Fast reads, zero stale data.
- **Robust Validation:** All incoming requests are strictly validated using **Zod**. Bad data never even touches the controllers.
- **Clean Architecture:** Separated into Routes -> Controllers -> Services. Extremely modular and easy to scale into microservices later if needed.
- **Database:** MongoDB via Mongoose. It connects natively to MongoDB Atlas, utilizing compound indexing to keep query times snappy.
- **Security & Stability:** Helmet for secure HTTP headers, strictly configured CORS, Express Rate Limiting to prevent brute force/spam, and a global error handler so stack traces never leak and the app never crashes from unhandled errors.
- **Documentation:** Full Swagger/OpenAPI 3.0 specs available out of the box at `/api-docs`.

### 🎨 The Frontend (React, Vite)
- Custom-built, fully responsive UI featuring a sleek dark theme. 
- Integrated Axios with smart interceptors to automatically attach JWT tokens to outbound requests and boot the user to the login screen if their token expires (`401`).
- Real-time toast notifications (via `react-hot-toast`) so users know exactly what's going on.
- Features paginated task lists, dynamic filtering (by status/priority), and complex sorting.

## 🚀 Deployment & CI/CD
This project is built from the ground up to be deployed seamlessly.

### 🌐 Vercel (Frontend)
The React app is perfectly suited for Vercel. Connect the repo, set the `VITE_API_URL` environment variable to point to your backend, and Vercel handles the global SSL CDN delivery.

### 🐳 Docker & EC2 (Backend)
The backend is completely containerized using a highly optimized, multi-stage Alpine Dockerfile. 
I've provided a simple `docker-compose.yml` to spin the API up on any Linux VPS (like AWS EC2 or DigitalOcean). Because we are using **MongoDB Atlas**, there's no heavy database container running alongside your app, saving massive RAM/CPU resources on the server.

### 🤖 GitHub Actions (Automated CI/CD / GitHub Actions)
I've included a complete `.github/workflows/main.yml` pipeline! Here's what happens every time you push to the `main` branch:
1. **Build & Test:** GitHub spins up an Ubuntu runner, installs all dependencies, and compiles both the frontend and backend. This guarantees you aren't deploying broken code.
2. **Automated Deploy:** If the build succeeds, GitHub Actions securely SSHs into your EC2 server, pulls the latest code, rebuilds the optimized Docker container, and restarts the API with zero downtime.

## 💻 Running it locally

Want to spin it up on your own machine? It's super easy.

### 1. Backend
```bash
cd server
npm install
cp .env.example .env
```
Open up that `.env` file, pop in your MongoDB Atlas connection string and your Upstash Redis tokens (optional—the app degrades gracefully if it can't find Redis!), and run:
```bash
npm run dev
```
The API spins up on `http://localhost:5000`.

### 2. Frontend
```bash
cd client
npm install
npm run dev
```
The UI spins up on `http://localhost:5173`. 

---
Enjoy the code! Let me know if you run into any issues. Happy hacking! 
