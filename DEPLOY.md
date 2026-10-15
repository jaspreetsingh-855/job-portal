# Deploy this Job Portal

You need three accounts: **MongoDB Atlas** (database), **Render** (backend), **Vercel** (frontend).

## 1. MongoDB Atlas

1. Create a free cluster at https://www.mongodb.com/cloud/atlas
2. Database user + password
3. Network Access → add `0.0.0.0/0`
4. Copy the connection string. Use database name `jobportal`.

## 2. Backend on Render

1. Push this repo to GitHub
2. Render → New Web Service → that repo
3. Root directory: `backend`
4. Build: `npm install`
5. Start: `npm start`
6. Environment variables:

```
NODE_ENV=production
PORT=10000
JWT_SECRET=a-long-random-secret
MONGO_URI=mongodb+srv://USER:PASSWORD@cluster.mongodb.net/jobportal
FRONTEND_ORIGIN=https://your-frontend.vercel.app
```

Optional email (Gmail app password):

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=you@gmail.com
SMTP_PASS=app-password
SMTP_FROM=Job Portal <you@gmail.com>
```

Copy the Render URL, e.g. `https://job-portal-api.onrender.com`.

## 3. Frontend on Vercel

1. Vercel → Import the same GitHub repo
2. Root directory: `frontend`
3. Environment variable:

```
VITE_API_URL=https://job-portal-api.onrender.com/api
```

4. Deploy
5. Put the Vercel URL into Render `FRONTEND_ORIGIN` and redeploy the API

CORS only allows that frontend origin, and the JWT is an **httpOnly cookie** (`SameSite=None; Secure` in production).

## Local run

```
cd backend
npm run dev

cd frontend
npm run dev
```

Frontend: http://localhost:5173  
API: http://localhost:5000
