# Sports Meet - Results Management System

A full-stack web application for managing and displaying sports meet results.

## Tech Stack

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Database:** MongoDB Atlas + Mongoose

## Project Structure

```
sports-meet/
├── client/          # React + Vite Frontend
├── server/          # Node.js + Express Backend
└── database/        # Legacy SQL schema placeholder
```

## Getting Started

### Database Setup
1. Create a MongoDB Atlas cluster or use a local MongoDB instance
2. Set `server/.env` with `MONGODB_URI` and `MONGODB_LOCAL_URI`
3. The app uses Mongoose models in `server/models/`, so no SQL migration is required

### Default Admin Login
1. Username: `admin`
2. Password: `Sathu1234`
3. You can change both values in `server/.env` using `ADMIN_USERNAME` and `ADMIN_PASSWORD`

### Backend
```bash
cd server
npm install
npm run dev
```

### Frontend
```bash
cd client
npm install
npm run dev
```

## Features
- Browse results by Age Category → Gender → Sport
- View Gold, Silver, Bronze winners
- Admin panel for managing events and results
- JWT-based admin authentication
