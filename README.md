# Task Flow Project

Task management API built with Node.js, Express, and MongoDB. It supports user registration/login, role-based authorization, JWT authentication, task CRUD, and file uploads (task attachments and user avatars).

## Features
- JWT auth with short-lived tokens
- Role-based access control (`USER`, `ADMIN`)
- Validation via Joi
- Multer-based uploads for task files and user avatars
- Centralized error handling
- MongoDB via Mongoose
- Basic response status helpers

## Tech Stack
- Node.js, Express 5
- MongoDB, Mongoose 9
- JSON Web Tokens (`jsonwebtoken`)
- Validation: `joi`
- Uploads: `multer`
- Middleware: `morgan`, `cors`
- Caching: `node-cache` for user lookup in `verifyToken`

## Project Structure
```
server.js
src/
  app.js
  config/
    db.js
    multerConfig.js
  controllers/
    task.controller.js
    user.controller.js
  middleware/
    allowTo.js
    asyncWrapper.js
    validate.js
    verifyToken.js
  models/
    task.model.js
    user.model.js
  routes/
    taskRoutes.js
    userRoutes.js
  utils/
    allowedFields.js
    generateJWT.js
    httpStatusText.js
```

## Requirements
- Node.js 18+
- MongoDB connection string

## Environment Variables
Create a `.env` file in the project root with:
```
PORT=5000
MONGOOSE_URL=mongodb://localhost:27017/task-flow
JWT_SECRET_KEY=your-strong-secret
```

`server.js` loads `.env` and starts the app:
- `PORT` is the HTTP port
- `MONGOOSE_URL` is the MongoDB connection string
- `JWT_SECRET_KEY` signs/validates JWTs

## Installation
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create `.env` as above.
3. Start the server:
   ```bash
   node server.js
   # or
   npx nodemon server.js
   ```

## Authentication
- Login returns a JWT that expires in 2 minutes (`src/utils/generateJWT.js`).
- Send the token with every protected request using the header:
  ```
  Authorization: Bearer <token>
  ```
- `verifyToken` verifies the token, loads the user, and attaches:
  ```json
  { "_id": "<ObjectId>", "id": "<stringified _id>", "role": "USER|ADMIN" }
  ```

## API Reference
Base URL: `http://localhost:<PORT>`

### Users
- `POST /api/users/register`
  - Body (JSON or multipart/form-data if uploading `avatar`):
    ```json
    { "firstName": "...", "lastName": "...", "username": "...", "email": "...", "password": "...", "role": "USER|ADMIN" }
    ```
  - Optional file: `avatar` (image). Saved to `uploads/images`.

- `POST /api/users/login`
  - Body:
    ```json
    { "email": "...", "password": "..." }
    ```
  - Returns: `{ status, data: { token } }`

- `GET /api/users/` (ADMIN)
  - Headers: `Authorization: Bearer <token>`

- `PATCH /api/users/update-profile` (USER)
  - Headers: `Authorization: Bearer <token>`
  - Body (JSON) any of: `firstName`, `lastName`, `username`, `email`
  - Optional file: `avatar` (image) via multipart/form-data

### Tasks
- `GET /api/tasks/getAllTasks` (ADMIN)
  - Query: `limit`, `page`

- `GET /api/tasks/me` (USER)
  - Returns tasks owned by the authenticated user

- `GET /api/tasks/getUserTasks` (USER)
  - Optional filter: `status=COMPLETED|PENDING` (query or body)

- `POST /api/tasks/` (USER)
  - Multipart form-data with fields:
    - `taskTitle` (string)
    - `taskContent` (string)
    - `status` (`COMPLETED`|`PENDING`)
    - `taskFiles` (multiple files, up to 5), saved to `uploads/files`

- `PATCH /api/tasks/:taskId` (USER)
  - JSON updates; optional `taskFiles` via multipart (appends new files)

- `DELETE /api/tasks/:taskId` (USER)

## Validation
- Joi schemas:
  - Users: `src/validators/user.validator.js`
  - Tasks: `src/validators/task.validator.js`

## File Uploads
- Static files served at `/uploads` (`src/app.js`)
- Task files saved under `uploads/files`
- Avatars saved under `uploads/images`

## Error Format
Errors are centralized in `src/app.js` and generally follow:
```json
{ "status": "error|fail", "message": "Reason", "code": 400|401|404|500 }
```

## Notes
- Tokens expire in 2 minutes; re-login if requests start failing.
- `verifyToken` caches user lookup for ~5 minutes to improve performance.
- Always include the `Bearer` prefix in the `Authorization` header.

## Quick Test (curl)
```bash
# Register
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"A","lastName":"B","username":"ab","email":"ab@example.com","password":"secret"}'

# Login
TOKEN=$(curl -s -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ab@example.com","password":"secret"}' | jq -r '.data.token')

# Update profile
curl -X PATCH http://localhost:5000/api/users/update-profile \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Alice"}'
```

