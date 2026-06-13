# Leema Raj Cottage Stay

This project contains the frontend and backend codebase for the Leema Raj Cottage Stay application.

## Frontend (Vercel Deployment)
- **Root directory:** `frontend`
- **Build command:** `npm run build`
- **Output directory:** `build`
- **Environment Variables:**
  - `REACT_APP_API_BASE_URL`: URL to your backend API (e.g., `https://your-backend-domain.com/api/`)

To run locally:
```bash
cd frontend
npm install
npm start
```

## Backend (AWS Deployment)
- **Root directory:** `backend`
- **Deployment steps:**
  1. Install requirements: `pip install -r requirements.txt`
  2. Run migrations: `python manage.py migrate`
  3. Start server with Gunicorn: `gunicorn backend.wsgi:application`
- **Environment Variables:**
  - `DEBUG`: False
  - `SECRET_KEY`: Your Django secret key
  - `DATABASE_URL` (or DB credentials depending on setup)
  - `CORS_ALLOWED_ORIGINS`: e.g., `https://your-vercel-domain.vercel.app`
  - `CLOUDINARY_URL`: Your Cloudinary credentials

To run locally:
```bash
cd backend
python manage.py check
python manage.py runserver
```
