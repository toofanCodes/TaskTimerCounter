// server.js (Node.js + Express backend with CSV support, auto-save, and file locking)

const express = require('express');
const path = require('path');
const fs = require('fs').promises; // Use promises version of fs
const bodyParser = require('body-parser');
const { Parser } = require('json2csv');
const lockfile = require('proper-lockfile'); // For file locking

const app = express();
const PORT = 3000;

const LOG_FILE = path.join(__dirname, 'log.json');
const PUBLIC_DIR = path.join(__dirname, 'public'); // Define public directory path

// Ensure log file exists (or create an empty one)
async function initializeLogFile() {
    try {
        await fs.access(LOG_FILE);
    } catch (error) {
        // File doesn't exist, create it with an empty array
        try {
            await fs.writeFile(LOG_FILE, JSON.stringify([], null, 2));
            console.log(`Log file created at ${LOG_FILE}`);
        } catch (writeError) {
            console.error(`Failed to create log file: ${writeError}`);
            process.exit(1); // Exit if we can't create the log file
        }
    }
}

// Middleware
app.use(express.static(PUBLIC_DIR)); // Serve static files from 'public' directory
app.use(bodyParser.json());

// --- Routes ---

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

// Save a log entry
app.post('/save-log', async (req, res) => {
    const logEntry = req.body;

    // --- Basic Input Validation ---
    if (!logEntry || typeof logEntry !== 'object' || !logEntry.timestamp) {
        return res.status(400).json({ error: 'Invalid log entry data received.' });
    }

    let release; // Variable to hold the lock release function
    try {
        // --- File Locking ---
        // Acquire lock (retries added for robustness)
        release = await lockfile.lock(LOG_FILE, { retries: 5, realpath: false });
        console.log('Lock acquired for saving.');

        // Read existing data
        let logData = [];
        try {
            const existing = await fs.readFile(LOG_FILE, 'utf-8');
            // --- Improved Error Handling ---
            try {
                 logData = JSON.parse(existing);
                 if (!Array.isArray(logData)) { // Ensure it's an array
                    console.warn('Log file content was not an array, resetting.');
                    logData = [];
                 }
            } catch (parseError) {
                 console.error(`Error parsing log file: ${parseError}. Resetting log data.`);
                 logData = []; // Reset if parsing fails
            }
        } catch (readError) {
            // If read fails (other than not found, which is handled by initialize), log error
            if (readError.code !== 'ENOENT') {
                 console.error(`Error reading log file: ${readError}`);
            }
            // Start with empty array if file couldn't be read properly
            logData = [];
        }


        // Add new entry
        logData.push(logEntry);

        // Write data back
        await fs.writeFile(LOG_FILE, JSON.stringify(logData, null, 2));

        console.log('Log entry saved.');
        res.status(200).json({ message: 'Log saved' });

    } catch (err) {
        console.error('Error during save operation:', err);
        res.status(500).json({ error: 'Error saving log entry.' });
    } finally {
        // --- File Locking ---
        // Ensure lock is always released
        if (release) {
            try {
                await release();
                console.log('Lock released after saving.');
            } catch (releaseError) {
                console.error('Error releasing lock:', releaseError);
            }
        }
    }
});

// Load all log entries
app.get('/load-log', async (req, res) => {
    try {
        const data = await fs.readFile(LOG_FILE, 'utf-8');
         // --- Improved Error Handling ---
         try {
             const jsonData = JSON.parse(data);
             res.json(Array.isArray(jsonData) ? jsonData : []); // Ensure array is returned
         } catch (parseError) {
             console.error(`Error parsing log file on load: ${parseError}. Returning empty log.`);
             res.json([]); // Return empty array if parsing fails
         }
    } catch (err) {
        // If file doesn't exist (ENOENT), return empty array (expected)
        if (err.code === 'ENOENT') {
            res.json([]);
        } else {
            // For other errors, log and send server error
            console.error('Error loading log file:', err);
            res.status(500).json({ error: 'Error loading log data.' });
        }
    }
});

// Export log as CSV
app.get('/log.csv', async (req, res) => {
    try {
        const data = await fs.readFile(LOG_FILE, 'utf-8');
        let logData = [];
        // --- Improved Error Handling ---
        try {
             logData = JSON.parse(data);
             if (!Array.isArray(logData)) logData = []; // Ensure array
        } catch (parseError) {
             console.error(`Error parsing log file for CSV: ${parseError}. Sending empty CSV.`);
             logData = [];
        }


        // --- Updated CSV Fields ---
        // Select fields relevant to the new element-based logging
        const fields = [
            'timestamp',
            'project',
            'sprint',
            'task',
            'elementType', // 'element' or 'element_autosave'
            'status', // 'completed' or 'autosave'
            'duration', // Formatted duration MM:SS (for completed elements)
            'elementDurationSeconds', // Raw seconds (for completed elements)
            'currentElementSeconds', // For autosave entries
            'elementCountInTask',
            'taskTotalSeconds',
            'sprintTotalSeconds',
            'projectTotalSeconds',
            'taskStarted',
            'sprintStarted',
            'projectStarted',
            'projectDescription'
            // Add/remove fields as needed
        ];
        const opts = { fields };

        const parser = new Parser(opts);
        const csv = parser.parse(logData);

        res.header('Content-Type', 'text/csv');
        res.attachment('log.csv'); // Suggests download filename
        res.send(csv);

    } catch (err) {
         if (err.code === 'ENOENT') {
            res.status(404).send('Log file not found');
        } else {
            console.error('Error generating CSV:', err);
            res.status(500).json({ error: 'Error generating CSV.' });
        }
    }
});

// Clear the log file
app.post('/clear-log', async (req, res) => {
    let release;
    try {
        // --- File Locking ---
        release = await lockfile.lock(LOG_FILE, { retries: 5, realpath: false });
        console.log('Lock acquired for clearing.');

        // Write empty array to file
        await fs.writeFile(LOG_FILE, JSON.stringify([], null, 2));

        console.log('Log file cleared.');
        res.status(200).json({ message: 'Log cleared successfully.' });

    } catch (err) {
        console.error('Error clearing log:', err);
        res.status(500).json({ error: 'Error clearing log file.' });
    } finally {
        // --- File Locking ---
        if (release) {
             try {
                await release();
                console.log('Lock released after clearing.');
            } catch (releaseError) {
                console.error('Error releasing lock:', releaseError);
            }
        }
    }
});

// --- Start Server ---
// Initialize log file before starting the server
initializeLogFile().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
        console.log(`Serving static files from ${PUBLIC_DIR}`);
        console.log(`Using log file at ${LOG_FILE}`);
    });
}).catch(error => {
     console.error("Failed to initialize server:", error);
});
