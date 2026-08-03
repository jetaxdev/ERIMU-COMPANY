# Deployment guide

## 1. Backend on Railway

1. Create a new Railway project.
2. Add a PostgreSQL service and connect it to the backend service.
3. Deploy the backend from the backend folder in your GitHub repo.
4. Set these environment variables in Railway:
   - DATABASE_URL: provided by the Railway PostgreSQL service
   - JWT_SECRET: a long random string
   - JWT_REFRESH_SECRET: a long random string
   - JWT_EXPIRES_IN: 1h
   - CLOUDINARY_CLOUD_NAME
   - CLOUDINARY_API_KEY
   - CLOUDINARY_API_SECRET
   - RESEND_API_KEY
   - FRONTEND_URL: your Vercel frontend URL
   - NODE_ENV: production
5. Railway will run the startup script automatically, which runs Prisma migrations before starting the app.

## 2. Frontend on Vercel

1. Import the frontend folder from your GitHub repo into Vercel.
2. Set this environment variable:
   - NEXT_PUBLIC_API_URL: https://your-backend-service.up.railway.app
3. Deploy.

## 3. Post-deploy checks

- Open the Vercel site and confirm the public pages load.
- Visit https://your-backend-service.up.railway.app/health and confirm it returns status ok.
- Test login, property pages, and contact forms.
