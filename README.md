# Job Portal

```
job-portal/
├── frontend/   # React + Vite app
└── backend/    # Express API
```

## Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs at http://localhost:5173

## Backend

```bash
cd backend
npm install
npm run dev
```

Runs at http://localhost:5000

### Structure

```
backend/
├── node_modules/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── app.js
│   └── constants.js
├── .env
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── server.js
```

### API

- `GET /api/health` — health check
- `GET /api/jobs` — list jobs
- `GET /api/jobs/:id` — job by id
