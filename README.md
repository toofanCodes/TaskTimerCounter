# Task Timer - Element Tracker v1

A hierarchical time tracker application designed to log time spent on Projects, Sprints, Tasks, and individual work Elements (laps). Built with Vanilla JavaScript and a Node.js/Express backend using local file storage (`log.json`).

**(Optional: Add a Screenshot/GIF Here)**

## Features

* **Hierarchical Tracking:** Organizes work into Projects > Sprints > Tasks > Elements.
* **Element Lap Timer:** Times individual work elements (laps) within a task using a HH:MM:SS display.
* **Element Counter:** Tracks the number of completed elements for the current task.
* **Lap & Stop Controls:**
    * `Lap` button completes the current element, logs its duration, adds time to totals, and immediately starts the timer for the next element.
    * `Stop` button logs the current element's duration and stops the timer completely (requires clicking "Start Task" to begin again).
* **Pause/Play:** Pause and resume the current element timer.
* **Persistent Logging (Local File):** Saves all element completions and creation events (Project, Sprint) to a local `log.json` file via the Node.js backend. **Note:** This method has limitations on read-only filesystems like those used by Vercel.
* **Hierarchical Log View:** Displays a structured log for the selected project, showing Sprints, Tasks, and their completed Elements with calculated total times. Log items are collapsible. Expand/Collapse All controls provided.
* **Data Export/Clear:** Export the entire log as a CSV file or clear all log data from the server (clears `log.json`).
* **Collapsible UI:** Sidebar sections (Project, Sprint, Task) and the main Project Log section are collapsible. Selected item names are displayed in collapsed sidebar headers.
* **Right Sidebar:** Includes a collapsible "How To Use" panel with vertical text toggle.
* **Fullscreen Mode:** Focus on the timer/counter/controls in a dedicated fullscreen view. Includes an optional scrolling text ticker.
* **Theme Toggle:** Switch between Light and Dark themes (preference saved locally).
* **Timer Accuracy:** Includes Page Visibility API listener to correct timer drift when returning to the tab. Includes `beforeunload` warning if the timer is active.
* **Responsive Design:** Adapts layout for different screen sizes.

## Tech Stack

* **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6+)
* **Backend:** Node.js, Express
* **Database:** Local JSON file (`log.json`)
* **Node Modules:** `express`, `body-parser`, `json2csv`, `cors` (if needed for local dev), `proper-lockfile` (for file access control)

## Getting Started

### Prerequisites

* Node.js and npm installed.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/toofanCodes/TaskTimerCounter.git](https://github.com/toofanCodes/TaskTimerCounter.git)
    cd TaskTimerCounter
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Running Locally

1.  **Start the server:**
    ```bash
    node server.js
    ```
    * This will create `log.json` if it doesn't exist and start the server.
2.  Open your browser and navigate to `http://localhost:3000` (or the port specified in `server.js`). Data will be saved to `log.json` in the project root.

### Deployment (Important Note)

* The current file-based persistence (`log.json`) **will likely NOT work** on serverless platforms like Vercel, Netlify, Heroku etc., due to their ephemeral or read-only filesystems. Saving logs will fail on these platforms.
* For deployment on such platforms, the backend needs to be modified to use a database (like Firebase Firestore, PostgreSQL, MongoDB Atlas, etc.) instead of the local file system. See Future Plans.

## How to Use

Refer to the collapsible "How To Use" panel (click the "Tool guidelines" tab) on the right side of the application itself for detailed usage instructions.

## Known Issues / Limitations

* **Deployment Persistence:** As noted above, file-based saving doesn't work on typical serverless deployment platforms.
* **Offline Support:** The application currently requires an active connection to the running Node.js server to save/load data.
* **Auto-Save Recovery:** Auto-save logs are created but not automatically used to restore timer state on page refresh/crash.
* **Performance:** The hierarchical log display might become slow with extremely large datasets (many thousands of entries).
* **Accessibility:** Keyboard navigation and dynamic ARIA labels could be further improved.

## Future Plans (as of April 19th)

*(Based on `timer_feature_plan_v1` document)*

1.  **Server Database:** Replace file storage with a proper database (e.g., Firebase Firestore) to enable deployment on platforms like Vercel. *(User indicated this is the next priority)*
2.  **Offline-First:** Implement IndexedDB and Service Worker caching.
3.  **Background Sync:** Reliably sync offline data to the server.
4.  **Backup/Restore:** Implement JSON export/import.
5.  **Pomodoro Mode:** Add timed work/break cycles.
6.  **Task Checklists:** Allow elements to represent sub-tasks.
7.  **Backlog/Planning:** Add UI for managing backlog and sprints.
8.  **Analytics:** Add data visualization for sprints.
9.  **Notifications:** Implement browser notifications.
10. **Calendar Integration:** Add ICS export / Google Calendar sync.
11. **PWA Installability:** Add `manifest.json`.
