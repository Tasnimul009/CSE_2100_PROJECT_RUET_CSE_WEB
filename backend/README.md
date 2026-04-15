# Student Backend (MongoDB + Cloudinary)

This backend stores student account data in MongoDB and student photos in Cloudinary.

## 1) Setup

1. Copy `.env.example` to `.env`.
2. Fill these required variables in `.env`:
   - `MONGODB_URI`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the backend:
   ```bash
   npm run dev
   ```

Health check:
- `GET http://localhost:5000/api/health`

## 2) Seed Existing students.json into MongoDB

From the `backend` folder run:
```bash
npm run seed:students
```

If your source file path is different:
```bash
node src/scripts/seedStudentsFromJson.js ../frontend/public/students.json
```

## 3) Student API Endpoints

Base URL: `/api/students`

- `GET /api/students`
  - Returns students without passwords.

- `GET /api/students?includeCredentials=true`
  - Returns students with password field (for legacy local-flow compatibility).

- `GET /api/students/username/:username`
  - Returns one student by username.

- `POST /api/students/login`
  - JSON body: `{ "username": "1903002", "password": "pass3002" }`

- `POST /api/students`
  - `multipart/form-data`
  - Required fields: `name`, `studentId`, `username`, `password`
  - Optional image field: `image`

- `PATCH /api/students/:id`
  - `multipart/form-data` or JSON
  - Optional image field: `image`

- `POST /api/students/upload-photo`
  - `multipart/form-data`
  - Fields: `username`, `image`

## 4) Frontend Connection

In `frontend/.env` set:
```env
VITE_STUDENT_API_BASE_URL=http://localhost:5000/api
```

Then run frontend:
```bash
npm run dev
```

## 5) Render Deployment Notes

- Build command: `npm install`
- Start command: `npm start`
- Root directory: `backend`
- Add all `.env` variables from your local backend `.env` in Render dashboard.
- After deployment, set frontend `VITE_STUDENT_API_BASE_URL` to your Render backend URL + `/api`.

Required MongoDB env vars on Render:
- `MONGODB_URI` (or `MONGO_URI`) = full Atlas `mongodb+srv://...` connection string
- Optional: `MONGODB_DB_NAME`
- Optional (recommended on Render): `MONGODB_FORCE_IPV4=true`
- Optional: `MONGODB_SERVER_SELECTION_TIMEOUT_MS=10000`

If deployment logs show Atlas connectivity errors:
- In MongoDB Atlas Network Access, allow `0.0.0.0/0` (quickest for cloud hosts) or add your Render static egress IP.
- Confirm Atlas Database Access user/password are correct in the connection string.
- Confirm the Atlas cluster is active and not paused.
