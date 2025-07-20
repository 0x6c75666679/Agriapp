# AgriApp – Features Documentation

## 1. User Authentication & Authorization

**Purpose:**  
Securely manage user access to the platform.

**How it works:**  
- Users can register and log in using their email and password.
- Upon login, users receive a JWT (JSON Web Token) which must be included in the `Authorization` header for all protected API requests.
- The backend verifies the token on each request and attaches user info to the request object.
- Supports role-based access (e.g., `user`, `admin`).

---

## 2. Field Management

**Purpose:**  
Allow users to manage their agricultural fields.

**How it works:**  
- Users can create, view, update, and delete their own fields.
- Each field has a unique name per user, enforced by a database constraint.
- Fields store information such as name, area, crop, location, status, and last activity.
- Only the owner of a field can modify or delete it.

---

## 3. Task Management

**Purpose:**  
Enable users to organize and track tasks related to their fields.

**How it works:**  
- Users can create, update, delete, and list tasks.
- Each task is linked to a specific field and user.
- Tasks include details like title, type (watering, fertilization, etc.), start/due dates and times, priority, status, and description.
- Only the owner can modify or delete their tasks.

---

## 4. Weather Data & AI Recommendations

**Purpose:**  
Provide users with weather information and AI-generated farming advice.

**How it works:**  
- The backend fetches weather data from a third-party API (WeatherAPI.com).
- Endpoints allow users to get current weather, forecasts, and detailed weather data for their location.
- The backend can generate AI-powered notes and recommendations based on weather conditions (e.g., irrigation advice, warnings).
- All weather endpoints require JWT authentication, and API keys are kept secure on the backend.

---

## 5. Admin Features

**Purpose:**  
Allow administrators to manage users and their roles.

**How it works:**  
- Admins can view all users, update user roles, and delete users.
- Changing a user's role invalidates their current JWT token (they must log in again).
- Only users with the `admin` role can access admin endpoints.

---

## 6. Frontend Features

**Purpose:**  
Provide a modern, user-friendly interface for all platform features.

**How it works:**  
- Built with React and Tailwind CSS for a responsive, mobile-friendly experience.
- Includes authentication UI (login, registration).
- Dashboard displays an overview of fields, tasks, and weather.
- Field and task management UIs allow full CRUD operations.
- Profile management for viewing and updating user info.
- Admin dashboard for user management.
- Weather data and AI notes are displayed in the UI.
- User feedback is provided via toasts and alerts.

---

## 7. Security & Code Quality

**Purpose:**  
Ensure the platform is secure, maintainable, and reliable.

**How it works:**  
- Passwords are hashed using bcrypt.
- JWT tokens are used for authentication and authorization.
- API keys are never exposed to the frontend.
- Code is organized by feature (controllers, models, routes, middleware).
- Descriptive naming and comments are used throughout the codebase.
- Database normalization and constraints ensure data integrity.

---

## 8. Example User Flow

1. User registers and logs in.
2. User creates a field (e.g., "Tomato Patch").
3. User creates a task for that field (e.g., "Water Tomato Field").
4. User checks weather and receives AI-powered recommendations.
5. Admin logs in and manages users as needed.

---

## 9. How to Explore the Code

- **Backend:**  
  - `index.js`: Server setup and route registration.
  - `model/`: Database schema (User, Field, Task).
  - `controller/`: Business logic for each feature.
  - `route/`: API endpoint definitions.
  - `middleware/`: Authentication and other middleware.

- **Frontend:**  
  - `src/pages/`: Main pages (dashboard, admin, profile, etc.).
  - `src/components/`: Reusable UI components.
  - `src/api/`: API utility functions for backend communication.

---

## 10. Not Implemented (as of now)

- **Soil/Crop Image Analysis:**  
  While mentioned in some documentation, actual endpoints and UI for uploading and analyzing soil/crop images are **not implemented** in the current codebase.

---

**This documentation provides a clear, structured overview of all implemented features in AgriApp.** 