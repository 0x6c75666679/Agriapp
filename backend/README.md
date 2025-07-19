# AgriApp Backend

## Overview
This is the backend for AgriApp, a farm management platform. It provides APIs for user authentication, field management, task scheduling, and integration with AI services for soil and crop analysis.

---

## Project Structure

```
backend/
  controller/         # Route handler logic (business logic)
    fieldmanagment.js
    taskMangment.js
    userController.js
    userfeatures.js
    weatherController.js
  db/
    database.js       # Sequelize DB connection
  middleware/
    jwtVerify.js      # JWT authentication middleware
    multer.js         # File upload middleware
  model/              # Sequelize models (DB tables)
    field.js
    task.js
    user.js
  route/              # Express route definitions
    fieldRoute.js
    taskRoute.js
    userRoute.js
    weatherRoute.js
  index.js            # Main server entry point
  package.json        # Dependencies
```

---

## Main Features

- **User Authentication**: JWT-based login and registration
- **Field Management**: Users can create, view, and manage their own fields
- **Task Management**: Users can create, update, and delete tasks for their fields
- **AI Integration**: Analyze soil/crop images using external APIs (HuggingFace, Plant.id)
- **Role-based Data**: All data is linked to the authenticated user

---

## How the Backend Works

### 1. **Authentication**
- Users register and login via `/api/user/register` and `/api/user/login`.
- On login, a JWT token is issued and must be sent in the `Authorization` header for protected routes.
- The `jwtVerify.js` middleware checks the token and attaches the user info to `req.user`.

### 2. **Field Management**
- Each field has a unique name **per user** (enforced by a composite unique constraint on `userId` + `name`).
- Fields are created via `/api/field/create` (POST, JWT required).
- Users can only access and manage their own fields.

### 3. **Task Management**
- Tasks are linked to both a user and a field (foreign keys: `userId`, `fieldId`).
- When creating/updating a task, the frontend sends the field name; the backend looks up the field ID for the current user.
- Tasks can be created, updated, deleted, and listed via `/api/task/*` endpoints.
- Only the owner can modify their tasks.

### 4. **AI Integration**
- Users can upload images for soil/crop analysis.
- The backend encodes the image and sends it to external APIs (HuggingFace, Plant.id) and returns the results.

---

## Code Quality & Understanding

- **Comments**: Key functions and tricky logic are commented for clarity.
- **Descriptive Naming**: Variables and functions are named for easy understanding.
- **Modular Structure**: Code is organized by feature (controllers, models, routes, middleware).
- **Security**: All sensitive actions require JWT authentication.
- **Database Normalization**: Foreign keys and unique constraints ensure data integrity.

---

## Example: Creating a Task

1. **Frontend** sends:
   ```json
   {
     "title": "Water Tomato Field",
     "type": "watering",
     "field": "Tomato Patch",
     "startDate": "2024-05-20",
     "startTime": "09:00",
     "dueDate": "2024-05-21",
     "dueTime": "17:00",
     "priority": "high",
     "status": "Pending",
     "description": "Use drip irrigation"
   }
   ```
2. **Backend**:
   - Looks up the field by name for the current user
   - Creates the task with the correct `fieldId` and `userId`
   - Returns the created task

---

## How to Read the Code

- **Start with `index.js`**: See how the server is set up and routes are registered.
- **Check `model/`**: Understand the database structure (User, Field, Task).
- **Look at `controller/`**: See the business logic for each feature.
- **Review `route/`**: See how endpoints are mapped to controller functions.
- **Middleware**: See how authentication and file uploads are handled.

---

## Presenting in Viva
- Explain the flow: user logs in → gets JWT → creates fields/tasks → can only access their own data.
- Highlight security: JWT, per-user data, unique field names per user.
- Mention AI integration for advanced features.
- Point out code organization and comments for maintainability.

---

## Need More?
If you want inline comments or function-level docstrings in any specific file, let me know which one and I’ll add them for you! 