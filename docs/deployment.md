# Deployment guide

## 1. Backend on Render

1. Create a new Render Web Service for the backend.
2. Add a Render PostgreSQL database and connect it to the backend service.
3. Deploy the backend from the backend folder in your GitHub repo.
4. Set these environment variables in Render:
   - DATABASE_URL: provided by the Render PostgreSQL service
   - JWT_SECRET: a long random string
   - JWT_REFRESH_SECRET: a long random string
   - JWT_EXPIRES_IN: 1h
   - CLOUDINARY_CLOUD_NAME
   - CLOUDINARY_API_KEY
   - CLOUDINARY_API_SECRET
   - RESEND_API_KEY
   - FRONTEND_URL: your Vercel frontend URL
   - NODE_ENV: production
5. Render will run the startup script automatically, which runs Prisma migrations before starting the app.

## 2. Frontend on Vercel

1. Import the frontend folder from your GitHub repo into Vercel.
2. Set this environment variable:
   - NEXT_PUBLIC_API_URL: https://your-backend-service.onrender.com
3. Deploy.

## 3. Health check cron

1. Add a GitHub repository secret named `BACKEND_HEALTHCHECK_URL`.
2. Set it to the full backend health URL, for example `https://your-backend-service.onrender.com/health`.
3. The scheduled workflow in `.github/workflows/health-check.yml` will ping that URL every 10 minutes and retry up to 3 times if the backend is slow to respond.

## 4. Post-deploy checks

- Open the Vercel site and confirm the public pages load.
- Visit https://your-backend-service.onrender.com/health and confirm it returns status ok.
- Test login, property pages, and contact forms.
