# DEPLOYMENT.md

## 🚀 Deployment Guide

### Frontend (Vercel)
1. Go to [vercel.com](https://vercel.com)
2. Import the frontend GitHub repo
3. Set build settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add environment variable:
   - `VITE_API_URL=https://your-backend-render-url.com`
5. Vercel auto-deploys on push to `main`

### Backend (Render)
1. Go to [render.com](https://render.com)
2. Create a new **Web Service**
3. Connect to backend GitHub repo
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables:
   - `PORT=5000`
   - `MONGO_URI=<your Mongo URI>`
   - `JWT_SECRET=<your secret>`