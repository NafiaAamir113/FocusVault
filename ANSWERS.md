# FocusVault — Project Reflection & Technical Answers

### 1. How to Run
To execute this project on a completely fresh machine, follow these consolidated steps:

* **Prerequisites:** Ensure your system has Node.js (v16+) and Python (3.8+) installed globally.
* **Backend Setup:** Navigate into the `/backend` folder from your terminal and execute `pip install -r requirements.txt`. Run `python app.py` to automatically instantiate the SQLite schema layer, build the database tables, and bind the local Flask engine to port `5000`.
* **Frontend Setup:** Open a separate terminal split, navigate into the `/frontend` folder, and execute `npm install` to download node modules. Start the UI engine by running `npm start`, which compiles the client assets and automatically opens the dashboard application in your browser at port `3000`.

---

### 2. Stack Choice
* **Selected Stack:** React (Frontend), Flask (Backend), SQLite3 (Database).
* **Justification:** This stack represents an ideal architectural balance for lightweight, high-performance web applications. Flask provides an excellent micro-framework for serving clean REST APIs without forcing heavy boilerplate structures on simple CRUD operations. SQLite3 requires zero external server setup or infrastructure configurations, embedding relational data safely in a single persistent binary file (`database.db`) right inside the backend folder. React handles rendering efficiently, enabling responsive real-time search filters and instant UI updates when pinning items.
* **Worse Choice:** An enterprise-heavy stack like **Java Spring Boot with PostgreSQL**. Setting up Hibernate object-relational mappings, database connection pools, and a separate PostgreSQL background service adds massive configuration overhead for a local task manager, introducing unnecessary points of environment failure without providing any immediate benefits.

---

### 3. One Real Edge Case
* **Specific Edge Case:** Preventing relative execution path bugs when initializing or reading the local SQLite database file.
* **File & Line Location:** `backend/app.py` (Lines 11–12)
* **Code Implementation:**
    ```python
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    DATABASE = os.path.join(BASE_DIR, 'database.db')
    ```
* **What happens without it:** Without explicitly calculating the absolute directory path context using Python's standard `__file__` property, SQLite creates or looks for `database.db` relative to the **exact folder where the terminal command was executed**. If an evaluator runs the application from the root workspace folder instead of changing directories into `backend` first, SQLite would either crash or silently generate a duplicate, completely empty database file in the root workspace, causing all persistent task records to disappear from the interface.

---

### 4. AI Usage
* **Tool Used:** Gemini (Google AI)
* **What was asked & received:** * Asked for an optimized SQL query structure to implement our "Beyond-CRUD" pinning feature, specifically how to sort boolean values (`is_pinned`) so that pinned items always float to the top of the feed. Received a standard SQLite conditional query mapping.
    * Asked to debug a React state-lag issue where typing into the search bar felt delayed or skipped characters during real-time UI filtering. Received a suggested structural implementation for controlled inputs.
* **What was changed and why:** The AI originally suggested a heavy backend sorting route using an intricate SQL sub-query conditional wrapper statement (`ORDER BY CASE WHEN is_pinned = 1 THEN 0 ELSE 1 END`). I refactored this logic on the backend by simplifying it directly to a native relational descending layout: `ORDER BY is_pinned DESC, id DESC`. This achieved the exact same top-pin workspace ordering requirement while reducing computing overhead on the SQLite engine and keeping the Python handler code completely clean and readable.

---

### 5. Honest Gap
* **The Problem:** The search engine bar component filters the global task arrays client-side by performing basic substring matching using standard text parsing (`.toLowerCase().includes(searchTerm)`). 
* **Why it's a gap:** If an evaluator misspells a task title slightly (e.g., typing "Feild" instead of "Field"), or searches for multiple non-sequential words, the system returns zero results, forcing the user to type exactly correct text markers.
* **The Next-Day Fix:** Given an extra 24 hours of development time, I would replace the rigid client-side matching with a robust fuzzy-matching algorithm or leverage a lightweight utility library like Fuse.js on the frontend. This would allow the interface to compute a text-distance threshold score, allowing the search engine to gracefully handle typos, character omissions, and approximate terms to provide a much more forgiving user experience.