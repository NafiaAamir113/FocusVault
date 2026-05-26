# FocusVault 🔒

FocusVault is a lightweight, high-performance full-stack task management workspace engineered to optimize productivity through structured priority organization, persistent task pinning, and intelligent workflow management.

---

# 🚀 Core Features

- **Full-Stack CRUD Operations:**  
  Seamless task creation, real-time modification, persistent storage, and secure deletion workflows.

- **Smart Prioritization Layer:**  
  Categorize objectives dynamically across Low, Medium, and High priority levels.

- **Persistent Workspace Pinning:**  
  Pin important tasks to the top of your workspace for fast visibility and structured focus management.

- **Instant Dynamic Search Engine:**  
  Real-time filtering across task titles, descriptions, and category tags for rapid information retrieval.

- **Responsive Productivity Workspace:**  
  Clean and adaptive interface optimized for both desktop and smaller screen environments.

---

# 🛠️ Technical Architecture & Stack

## Frontend
- React.js
- CSS3
- Dynamic State Management using React Hooks

## Backend
- Flask REST API (Python 3.x)
- Flask-CORS for frontend/backend communication

## Database
- SQLite3 relational database
- Persistent local storage using absolute path resolution

---

# 💻 Local Installation & Deployment

## Prerequisites

Ensure your system has the following installed globally:

- Node.js (v16+ recommended)
- Python (3.8+ recommended)
- Git

---

# 1️⃣ Backend Setup

Open a terminal and run:

```bash
cd backend
pip install -r requirements.txt
python app.py
```

The Flask backend server will automatically:

- initialize the SQLite database,
- create the required schema if missing,
- and launch locally at:

```text
http://127.0.0.1:5000
```

---

# 2️⃣ Frontend Setup

Open a second terminal window and run:

```bash
cd frontend
npm install
npm start
```

The React development server will automatically launch the application at:

```text
http://localhost:3000
```

---

# 🎛️ REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/tasks` | Retrieve all tasks sorted by pinned status |
| POST | `/tasks` | Create a new task |
| PUT | `/tasks/<id>` | Update an existing task |
| DELETE | `/tasks/<id>` | Delete a task permanently |
| PATCH | `/tasks/<id>/toggle-pin` | Toggle pin/unpin state |

---

# 📦 Example JSON Payload

## Create Task

```json
{
  "title": "Prepare FYP Presentation",
  "description": "Finalize architecture diagrams",
  "category": "Academic",
  "priority": "High"
}
```

---

# 🌲 Project Structure

```plaintext
focusvault/
├── backend/
│   ├── app.py
│   ├── database.db
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── components/
│   │
│   ├── package.json
│   └── package-lock.json
│
├── .gitignore
├── ANSWERS.md
└── README.md
```

---

# ✅ Persistence Guarantee

All task records are stored inside a local SQLite database (`database.db`).

This guarantees that:

- tasks remain available after application shutdown,
- data persists across multiple executions,
- and the system satisfies persistent storage requirements.

---

# 📌 Beyond CRUD Feature

FocusVault includes a persistent task pinning engine allowing users to prioritize important records and automatically surface them at the top of the workspace feed.

Pinned tasks are dynamically sorted using backend database ordering logic.

---

# 🔍 Search & Filtering

The frontend includes a live filtering engine capable of searching across:

- task titles,
- descriptions,
- and category labels.

Filtering updates instantly without requiring page reloads.

---

# 🧠 Design Philosophy

FocusVault was intentionally designed to balance:

- simplicity,
- usability,
- persistence reliability,
- and clean architectural separation.

The application focuses on delivering a lightweight but polished productivity workspace rather than overengineering unnecessary complexity.

---

# 📄 License

This project was developed as part of the DevWeekends Fellowship Technical Assessment.
