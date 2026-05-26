from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Using absolute paths here so the app can find database.db no matter 
# where we run the terminal command from.
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATABASE = os.path.join(BASE_DIR, 'database.db')


# Standard SQLite connection utility with Row factory enabled so we can access columns by name.  
def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = get_db_connection()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            category TEXT,
            priority TEXT,
            completed INTEGER DEFAULT 0,
            pinned INTEGER DEFAULT 0,
            due_date TEXT,          -- Persistent deadline date strings stored here
            created_at TEXT
        )
    ''')
    conn.commit()
    conn.close()


# Checking endpoint to verify backend status
@app.route('/', methods=['GET'])
def server_status():
    return jsonify({
        "status": "online",
        "message": "FocusVault API Engine is running cleanly. Use /tasks endpoints."
    }), 200


# 1. READ ALL (Sorted with pinned tasks at top)
@app.route('/tasks', methods=['GET'])
def get_tasks():
    conn = get_db_connection()
    tasks = conn.execute('''
        SELECT * FROM tasks
        ORDER BY pinned DESC, id DESC
    ''').fetchall()
    conn.close()
    return jsonify([dict(task) for task in tasks]), 200


# 2. CREATE (validation, deadline handling, and persistent commits)
@app.route('/tasks', methods=['POST'])
def create_task():
    data = request.json or {}
    title = data.get('title', '').strip()

    if not title:
        return jsonify({'error': 'Title is required'}), 400

    description = data.get('description', '').strip()
    category = data.get('category', 'General').strip() or 'General'
    priority = data.get('priority', 'Medium')
    due_date = data.get('due_date', '').strip()
    created_at = datetime.now().strftime("%Y-%m-%d %H:%M")

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO tasks (title, description, category, priority, due_date, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (title, description, category, priority, due_date, created_at))
    
    new_id = cursor.lastrowid
    conn.commit()
    
    # Fetch the newly created record to pass back to the frontend UI
    inserted_task = conn.execute('SELECT * FROM tasks WHERE id = ?', (new_id,)).fetchone()
    conn.close()

    return jsonify(dict(inserted_task)), 201


# 3. UPDATE (Modifies contents of an existing record)
@app.route('/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    data = request.json or {}
    title = data.get('title', '').strip()

    if not title:
        return jsonify({'error': 'Title cannot be empty'}), 400

    description = data.get('description', '').strip()
    category = data.get('category', 'General').strip() or 'General'
    priority = data.get('priority', 'Medium')
    due_date = data.get('due_date', '').strip()
    completed = int(data.get('completed', 0))

    conn = get_db_connection()
    conn.execute('''
        UPDATE tasks 
        SET title = ?, description = ?, category = ?, priority = ?, due_date = ?, completed = ?
        WHERE id = ?
    ''', (title, description, category, priority, due_date, completed, task_id))
    
    conn.commit()
    updated_task = conn.execute('SELECT * FROM tasks WHERE id = ?', (task_id,)).fetchone()
    conn.close()

    if not updated_task:
        return jsonify({'error': 'Task context target not found'}), 404

    return jsonify(dict(updated_task)), 200


# 4. DELETE (Removes individual records safely)
@app.route('/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    conn = get_db_connection()
    task = conn.execute('SELECT * FROM tasks WHERE id = ?', (task_id,)).fetchone()
    
    if not task:
        conn.close()
        return jsonify({'error': 'Task not found'}), 404

    conn.execute('DELETE FROM tasks WHERE id = ?', (task_id,))
    conn.commit()
    conn.close()
    return jsonify({'message': f'Task {task_id} purged successfully'}), 200


# 5. BEYOND CRUD FEATURE: PIN TOGGLE (Updates binary state flag)
@app.route('/tasks/<int:task_id>/toggle-pin', methods=['PATCH'])
def toggle_pin(task_id):
    conn = get_db_connection()
    task = conn.execute('SELECT * FROM tasks WHERE id = ?', (task_id,)).fetchone()
    
    if not task:
        conn.close()
        return jsonify({'error': 'Task target missing'}), 404

    # Switches existing state flag dynamically
    new_pin_state = 1 if task['pinned'] == 0 else 0
    
    conn.execute('UPDATE tasks SET pinned = ? WHERE id = ?', (new_pin_state, task_id))
    conn.commit()
    updated_task = conn.execute('SELECT * FROM tasks WHERE id = ?', (task_id,)).fetchone()
    conn.close()

    return jsonify(dict(updated_task)), 200


if __name__ == "__main__":
    init_db()
    print("Initializing Flask local execution node...")
    app.run(debug=True, port=5000)