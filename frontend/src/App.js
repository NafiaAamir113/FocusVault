import React, { useState, useEffect } from 'react';
import './App.css';

// Targets your Python local execution address context
const API_BASE = "http://127.0.0.1:5000/tasks";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Form Input Context States
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState(""); // Added input state tracking

  // Fetch data records from the backend
  const fetchTasks = async () => {
    try {
      const res = await fetch(API_BASE);
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (err) {
      console.error("Failed synchronization communication connection with API instance:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Deadline alert system: Flags a task if it's due within 48 hours (Beyond-CRUD Feature)
  const isExpiringSoon = (dueDateString) => {
    if (!dueDateString) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    
    const targetDate = new Date(dueDateString);
    targetDate.setHours(0, 0, 0, 0);

    // Calculate time gap in days
    const timeDiff = targetDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    // True if task is due today, tomorrow, or overdue
    return daysDiff <= 2 && daysDiff >= 0;
  };

  // Handles both creating new entries and saving edits to existing ones
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return alert("Title state mapping is required!");

  
    const payload = { title, description, category, priority, due_date: dueDate };
    const url = editingId ? `${API_BASE}/${editingId}` : API_BASE;
    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        resetForm();
        fetchTasks();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setTitle(task.title);
    setDescription(task.description || "");
    setCategory(task.category || "");
    setPriority(task.priority || "Medium");
    setDueDate(task.due_date || ""); // Hydrate deadline parameter context
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setCategory("");
    setPriority("Medium");
    setDueDate("");
  };

  const deleteTask = async (id) => {
    if (!window.confirm("Purge selected record entry context from local SQLite partition?")) return;
    try {
      const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      if (res.ok) fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const togglePin = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/${id}/toggle-pin`, { method: "PATCH" });
      if (res.ok) fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };


  // Filter tasks based on matches in the title, description, or category badge fields
  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (task.category && task.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="max-container">
      <header>
        <h1>FocusVault</h1>
        <input 
          type="text" 
          className="search-input"
          placeholder="Instant filter index matching selection..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </header>

      <div className="dashboard-grid">
        {/* Inputs Section */}
        <div className="form-card">
          <h2>{editingId ? "✏️ Edit Strategy Record" : "📝 Secure New Task"}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title *</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}></textarea>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Category Tag</label>
                <input type="text" placeholder="e.g. Work" value={category} onChange={e => setCategory(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Priority Tier</label>
                <select value={priority} onChange={e => setPriority(e.target.value)}>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>
            
            {/* Added Target Deadline */}
            <div className="form-group" style={{ marginTop: '4px' }}>
              <label>Target Deadline</label>
              <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
            </div>

            <div className="btn-flex">
              <button type="submit" className="btn-submit">
                {editingId ? "Update File" : "Commit Vault Entry"}
              </button>
              {editingId && (
                <button type="button" className="btn-cancel" onClick={resetForm}>Cancel</button>
              )}
            </div>
          </form>
        </div>

        {/* Output Section */}
        <div className="vault-feed">
          {filteredTasks.length === 0 ? (
            <div className="empty-state">
              No index data records match operational filter criteria definitions.
            </div>
          ) : (
            filteredTasks.map(task => (
              <div key={task.id} className={`task-card ${task.pinned ? 'pinned-active' : ''}`}>
                <div>
                  <div className="card-header">
                    <span className="category-badge">{task.category || "General"}</span>
                    <button className="pin-btn" onClick={() => togglePin(task.id)}>
                      {task.pinned ? "📌" : "📍"}
                    </button>
                  </div>
                  
                  {/* Warning Banner Trigger Injection */}
                  {isExpiringSoon(task.due_date) && (
                    <div style={{
                      backgroundColor: '#fff3cd', 
                      color: '#856404', 
                      padding: '8px 12px', 
                      borderRadius: '6px', 
                      fontSize: '0.8rem', 
                      fontWeight: 'bold',
                      marginBottom: '12px',
                      borderLeft: '4px solid #ffc107',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      ⚠️ Warning: Deadline is within 48 hours!
                    </div>
                  )}

                  <div className="title-container">
                    <span>{task.priority === "High" ? "🔴" : task.priority === "Medium" ? "🟡" : "🟢"}</span>
                    <h3>{task.title}</h3>
                  </div>
                  <p className="task-desc">{task.description}</p>
                </div>
                
                <div className="card-footer">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span>Created: {task.created_at}</span>
                    {task.due_date && (
                      <span style={{ fontWeight: '600', color: isExpiringSoon(task.due_date) ? '#dc3545' : '#495057' }}>
                        Due: {task.due_date}
                      </span>
                    )}
                  </div>
                  <div className="action-links">
                    <button className="edit-link" onClick={() => startEdit(task)}>Edit</button>
                    <button className="delete-link" onClick={() => deleteTask(task.id)}>Delete</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}