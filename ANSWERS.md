# FocusVault — Project Reflection & Technical Answers

### 1. How to Run
To execute this project on a completely fresh machine, follow these consolidated steps:

* **Backend Setup:** Navigate into the `/backend` folder from your terminal and execute `pip install -r requirements.txt`. Run `python app.py` to automatically instantiate the SQLite schema layer and bind the local Flask engine to port `5000`.
* **Frontend Setup:** Open a separate terminal split, navigate into the `/frontend` folder, and execute `npm install` to download node modules. Start the UI engine by running `npm start`, which loads the application on port `3000`.

---

### 2. Stack Choice
* **Selected Stack:** React (Frontend), Flask (Backend), SQLite3 (Database).
* **Justification:** This stack represents an ideal architectural balance for lightweight, high-performance web applications. Flask provides an excellent micro-framework for serving clean REST APIs without forcing heavy boilerplate structures on simple CRUD operations. SQLite3 requires zero external server setup or infrastructure configurations, embedding relational data safely in a single persistent binary file. React handles rendering efficiently, enabling responsive real-time filters and dynamic styling indicators.
* **Worse Choice:** An enterprise-heavy stack like **Java Spring Boot with PostgreSQL**. Setting up Hibernate object-relational mappings, database connection pools, and a separate PostgreSQL background service adds massive configuration overhead for a local task manager, introducing unnecessary points of configuration failure without providing any immediate scalability benefits.

---

### 3. One Real Edge Case
* **Specific Edge Case:** Preventing relative execution path bugs when initializing or reading the local SQLite database file.
* **File & Line Location:** `backend/app.py` (Lines 11–12)
* **Code Implementation:**
    ```python
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    DATABASE = os.path.join(BASE_DIR, 'database.db')
    ```
* **What happens without it:** Without explicitly calculating the absolute directory path context using Python's standard `__file__` property, SQLite creates or looks for `database.db` relative to the **exact folder where the terminal command was executed**. If an evaluator runs the app from the root workspace folder instead of changing directories into `backend` first, SQLite would either crash or silently generate a duplicate, completely empty database file elsewhere, causing all persistent task records to disappear from the interface.

---

### 4. AI Usage
* **Tool Used:** Gemini (Google AI)
* **What was asked & received:** * Asked for an optimal method to calculate calendar-day differences in JavaScript without pulling in heavy libraries like Moment.js. Received a native date comparison snippet using millisecond subtractions.
    * Asked to refine structural Flask data handlers to support custom optional parameters (`due_date`) cleanly inside raw SQL parameterized queries. Received corresponding SQLite execution mappings.
* **What was changed and why:** The AI originally generated an expiration delta calculation function that simply subtracted epoch millisecond timestamps directly ($targetDate - today$). I refactored this logic by explicitly chaining `.setHours(0, 0, 0, 0)` onto both JavaScript date instantiations before calculating the days difference. Without dropping the hourly time values, a task due tomorrow but evaluated late at night would compute as a fractional decimal less than 1, causing the conditional boundary rule to break and failing to render the urgent yellow warning banner.

---

### 5. Honest Gap
* **The Problem:** The client-side task expiration tracker calculates urgency thresholds by pulling the visitor's local system machine clock (`new Date()`). 
* **Why it's a gap:** If an evaluator works across varying time zones, or manually sets their laptop clock incorrectly, the visual warning alerts will trigger either prematurely or fail to show up altogether, leading to data rendering discrepancies.
* **The Next-Day Fix:** Given an extra 24 hours of development time, I would decouple date evaluation entirely from the client machine context. I would build a server-side timestamp comparison utility directly inside the `/tasks` GET route in Flask using Python's standard `datetime` utilities. The backend would pre-calculate an explicit Boolean flag (`is_expiring_soon`) into each JSON object payload before transmitting records to React, ensuring uniform execution correctness regardless of local system anomalies.