# Application Tracker

A full stack web application that helps college students track their internship and job applications in one place.

## Features

- Google OAuth authentication via Firebase
- Add, view, update, and delete job applications
- Track application status (Not Applied, Waiting, Pending Interview, etc.)
- Store company, title, location, pay, job link, job type, notes, and date
- Protected API routes — users only see their own applications

## Tech Stack

**Frontend**
- React
- React Router
- Firebase Auth (Google OAuth)

**Backend**
- Python / Flask
- Flask-SQLAlchemy
- Flask-CORS
- Firebase Admin SDK

**Database**
- SQLite (development)
- SQLAlchemy ORM

## Architecture

- Flask application factory pattern with Blueprints
- JWT token verification on all protected API routes
- Service layer in React centralizing all API calls
- Relational database with User and Application models

## Getting Started

### Prerequisites
- Python 3.x
- Node.js
- Firebase project with Google Authentication enabled

### Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in `backend/` with:
```
DATABASE_URL=sqlite:///app.db
FIREBASE_CREDENTIALS=firebase-credentials.json
```

Add your Firebase service account credentials as `firebase-credentials.json` in `backend/`.

Run the server:
```bash
python run.py
```

### Frontend Setup
```bash
cd frontend
npm install
```

Create a `.env.local` file in `frontend/` with:
```
REACT_APP_FIREBASE_API_KEY=yourvalue
REACT_APP_FIREBASE_AUTH_DOMAIN=yourvalue
REACT_APP_FIREBASE_PROJECT_ID=yourvalue
REACT_APP_FIREBASE_STORAGE_BUCKET=yourvalue
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=yourvalue
REACT_APP_FIREBASE_APP_ID=yourvalue
```

Run the app:
```bash
npm start
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/applications/ | Get all applications |
| POST | /api/applications/ | Create new application |
| GET | /api/applications/<id> | Get single application |
| PATCH | /api/applications/<id> | Update application |
| DELETE | /api/applications/<id> | Delete application |

All endpoints require a valid Firebase ID token in the Authorization header.

## Future Plans

- Delete and edit applications from the UI
- Google Places autocomplete for location field
- Production deployment
- UI styling improvements
