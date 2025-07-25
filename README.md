# 🐞 MERN Bug Tracker

A full-stack bug tracking application built using **MongoDB, Express, React, and Node.js**. It supports user authentication, role-based access, real-time bug reporting, admin dashboard, dark mode, and more.

---

## 📦 Tech Stack

```bash
Frontend: React + TailwindCSS + Vite
Backend: Express + Mongoose + JWT Auth
Database: MongoDB Atlas
CI/CD: GitHub Actions
Deployment: Vercel (frontend) + Render (backend)
Monitoring: Sentry + UptimeRobot
```

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/bug-tracker.git
cd bug-tracker
```

---

### 2. Setup Environment Variables

#### Backend: `server/.env`

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/bugtracker
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

#### Frontend: `client/.env`

```env
VITE_API_URL=http://localhost:5000
```

---

### 3. Install Dependencies

#### Backend

```bash
cd server
npm install
```

#### Frontend

```bash
cd client
npm install
```

---

### 4. Run Development Servers

#### Backend

```bash
cd server
npm run dev
```

#### Frontend

```bash
cd client
npm run dev
```

Visit: [https://mern-bug-frontend.vercel.app/](https://mern-bug-frontend.vercel.app/)

---

## 🧪 Testing

```bash
# Run tests in both frontend and backend
npm run test
```

---

## 🔐 Authentication

- JWT-based login system
- Role-based access (`admin`, `user`)
- Protected routes using `RequireAuth` component

---

## ⚙️ Deployment Instructions

### ▶️ Frontend: Deploy to Vercel

```bash
# Configure build settings
Build Command: npm run build
Output Directory: dist

# Add env variable
Render_API_URL=https://mern-bug-backend.onrender.com/api
```

### ▶️ Backend: Deploy to Render

```bash
# Set up Render Web Service
Build Command: npm install
Start Command: npm start

# Add env variables:
PORT=5000
MONGO_URI=...
JWT_SECRET=...
```

---

## 🔁 Rollback Strategy

```bash
# Revert to a working release
git checkout tags/v1.0
```
---

## 📂 Project Structure

```bash
/
├── client/           # React frontend
├── server/           # Express backend
├── .github/workflows # GitHub Actions CI/CD
├── README.md
└── DEPLOYMENT.md
```

---

## 🧠 Contributions

Pull requests welcome! Make sure to lint and test before submitting:

```bash
npm run lint
npm run test
```

---

## 📜 License

MIT © 2025
