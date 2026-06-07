# ZenTask —  Personal Task Manager

ZenTask is a responsive, full-stack Personal Task Manager built using the MERN stack (MongoDB, Express, React, Node.js) and styled with TailwindCSS. Developed as a single-user task management exercise, the application covers all required features including creating tasks with a title, optional description, and due date; viewing tasks sorted by creation date; toggling tasks between active and completed; editing task details; and deleting tasks with a confirmation prompt. It also includes status-based filtering (All, Active, Completed), an active vs. completed task counter, overdue task highlighting, an empty state UI. Bonus features include title-based search, drag-and-drop reordering,data persistence via MongoDB.

## Live Demo Links

*   **Frontend Deployed URL:** [https://task-manager-frontend-indol-three.vercel.app/](https://task-manager-frontend-indol-three.vercel.app/) 
*   **Backend API URL:** [https://task-manager-backend-aktd.onrender.com](https://task-manager-backend-aktd.onrender.com) 

> [!IMPORTANT]
> **Render Free Tier Notice:** The backend automatically spins down after 15 minutes of inactivity. The initial page load may take **30 to 50 seconds** (cold start).
> *   **UX Alert:** The UI displays a helpful notice if the server takes more than 3 seconds to respond.

## Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **React (v19) + Vite** | Frontend framework and fast build tool for creating a responsive SPA |
| **Tailwind CSS (v4)** | Utility-first CSS framework for responsive styling and consistent UI design |
| **Node.js + Express.js (v5)** | Backend runtime and web framework used to build the REST API |
| **MongoDB Atlas + Mongoose (v9)** | Cloud-hosted NoSQL database with schema validation and data modeling |
| **Nodemon** | Development tool for automatically restarting the server during development |

## How to Run Locally

Follow these steps to run ZenTask locally on your machine. *Note: You only need **Node.js (v18+)** installed; a local MongoDB instance or an Atlas connection string is required for data persistence.*

### 1. Setup the Backend
Open a terminal window and navigate to the backend directory:
```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` folder:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/task-manager
NODE_ENV=development
```
*(You can replace the local MONGODB_URI with a MongoDB Atlas connection string if preferred).*

Start the backend API server:
```bash
npm run dev
```

### 2. Setup the Frontend
Open a **second** terminal window and navigate to the frontend directory:
```bash
cd frontend
npm install
```

Start the local React development server:
```bash
npm run dev
```

The application will run on `http://localhost:5173` and automatically communicate with the local backend running on port `5000`.

## API Documentation

**Base API URL:** `/api/tasks`

| Method | Endpoint | Description | Request Body Shape | Response Shape |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/tasks` | Fetch tasks (supports optional query filters `status=active\|completed` and `search=query`) | N/A | `{ success: true, count: number, data: [Task] }` |
| `POST` | `/api/tasks` | Create a new task | `{ "title": "string", "description": "string", "dueDate": "YYYY-MM-DD" (optional), "priority": "low\|medium\|high" }` | `{ success: true, data: Task }` |
| `PUT` | `/api/tasks/:id` | Update task fields (e.g. description, completion status, priority) | `{ "title": "string", "description": "string", "completed": boolean, ... }` | `{ success: true, data: Task }` |
| `DELETE`| `/api/tasks/:id` | Permanently delete a task | N/A | `{ success: true, message: "Task deleted successfully" }` |
| `PUT` | `/api/tasks/reorder` | Update custom drag-and-drop order indexes in bulk | `{ "taskIds": ["id1", "id2", ...] }` | `{ success: true, message: "Tasks reordered successfully" }` |
| `GET` | `/health` | API Health Check | N/A | `{ status: "success", message: "...", timestamp: "..." }` |

### Task Model Schema Shape (Mongoose)
```json
{
  "_id": "ObjectId",
  "title": "string (required, max 100 chars)",
  "description": "string (default: '')",
  "dueDate": "Date (default: null)",
  "completed": "boolean (default: false)",
  "priority": "string (enum: ['low', 'medium', 'high'], default: 'medium')",
  "order": "number (default: 0)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Project Structure

```text
task-manager/
├── backend/                  # RESTful API Backend
│   ├── config/               # Configuration files
│   │   └── db.js             # Mongoose MongoDB connection handler
│   ├── controllers/          # MVC Controllers
│   │   └── taskController.js # CRUD & bulk reorder business logic
│   ├── models/               # Mongoose schemas
│   │   └── Task.js           # Task database schema definition
│   ├── routes/               # Express routing
│   │   └── taskRoutes.js     # Task API route endpoints
│   ├── app.js                # Express middleware configuration
│   └── index.js              # Server entry point
│
└── frontend/                 # Client-side UI (React + Vite)
    ├── public/               # Static icons and assets
    └── src/                  # React codebase
        ├── components/       # Interface components
        │   ├── ConfirmModal.jsx # Delete confirmation overlay
        │   ├── EmptyState.jsx   # No-tasks visual fallback
        │   ├── Header.jsx       # Stat counters and HSL progress bar
        │   ├── TaskForm.jsx     # Form creator and validation
        │   └── TaskItem.jsx     # Drag-and-drop task card item
        ├── utils.js             # Tailwind Merge dynamic utility helper
        ├── App.jsx              # App orchestration and drag states
        ├── index.css            # Tailwind directives & CSS Variables config
        └── main.jsx             # React DOM renderer index
```

## Next Steps

### What was not implemented in this iteration:
*   **User Accounts & JWT Authorization:** Currently, the system operates on a single-user model without authentication.
*   **Reminders & Notifications:** Email alerts or browser push notifications when tasks are approaching their due dates.
*   **Task Categorization:** Structuring tasks into boards, lists (e.g., "Personal", "Work"), or projects.
*   **Dark/Light Mode toggling:** The app has a single, dark theme styled around yellow accents.

### What to build next:
1.  **Authentication Layer:** Integrate JSON Web Tokens (JWT) or OAuth to allow multiple users to securely sign up, log in, and isolate their personal tasks.
2.  **Tagging & Categories:** Expand the Mongoose model to support tags or categories, enabling users to organize task cards by project.

