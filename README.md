# TaskFlow

This is TaskFlow, a full-stack task management application designed as a highly scalable, production-ready system featuring a Node.js/Express backend and a React/Vite frontend.

I built this project to demonstrate a solid understanding of REST API design, Role-Based Access Control (RBAC), and smart caching strategies.

## Live Links
- **Frontend (Vercel):** [https://taskflow-pied-gamma.vercel.app/](https://taskflow-pied-gamma.vercel.app/)
- **API Documentation (Swagger):** [https://smg-taskflow.duckdns.org/api-docs](https://smg-taskflow.duckdns.org/api-docs)

## Core Features

### The Backend (Node.js, Express, TypeScript)
- **Authentication:** Secure JWT-based auth with bcryptjs for password hashing. Real stateless, secure sessions.
- **Role-Based Access:** Users can only interact with their own tasks. Admins have system-wide access to view and manage all tasks.
- **Intelligent Caching:** Integrated Upstash Redis using a cache-aside pattern. I set up write-through invalidation so the cache instantly busts when data changes. Fast reads, zero stale data.
- **Robust Validation:** All incoming requests are strictly validated using Zod.
- **Clean Architecture:** Separated into Routes, Controllers, and Services. Extremely modular and easy to scale into microservices.
- **Database:** MongoDB via Mongoose. It connects natively to MongoDB Atlas, utilizing compound indexing to maintain fast query times.
- **Security and Stability:** Built with Helmet for secure HTTP headers, strictly configured CORS, Express Rate Limiting to prevent brute force attacks, and a global error handler to ensure stack traces never leak and the app never crashes from unhandled errors.
- **Documentation:** Full Swagger/OpenAPI 3.0 specs available out of the box at `/api-docs`.

### The Frontend (React, Vite)
- Custom-built, fully responsive UI featuring a clean dark theme.
- Integrated Axios with smart interceptors to automatically attach JWT tokens to outbound requests and redirect the user if their token expires (401).
- Real-time toast notifications so users know exactly what is going on when interacting with the API.
- Features paginated task lists, dynamic filtering by status and priority, and timestamp-based sorting.

## Deployment and CI/CD
This project is built to be deployed seamlessly.

### Vercel (Frontend)
The React app is perfectly suited for Vercel. Connect the repo, set the `VITE_API_URL` environment variable to point to the backend, and Vercel handles the global SSL CDN delivery.

### Docker and EC2 (Backend)
The backend is completely containerized using an optimized, multi-stage Alpine Dockerfile. I generated a `docker-compose.yml` to spin the API up on any Linux VPS (like AWS EC2). Since I am using MongoDB Atlas, there is no heavy database container running alongside the app, saving resources on the server.

### GitHub Actions (Automated CI/CD)
I included a complete CI/CD pipeline. Here is what happens every time code is pushed to the main branch:
1. **Build and Test:** GitHub spins up a runner, installs dependencies, and compiles both the frontend and backend.
2. **Automated Deploy:** If the build succeeds, GitHub Actions securely SSHs into the EC2 server, pulls the latest code, rebuilds the optimized Docker container, and restarts the API with zero downtime.

## Running it locally

### 1. Backend
```bash
cd server
npm install
cp .env.example .env
```
Open the `.env` file, add the MongoDB Atlas connection string and Upstash Redis tokens (the app degrades gracefully if it cannot find Redis), and run:
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
