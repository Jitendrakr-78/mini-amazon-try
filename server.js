require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
app.use(express.json());

// Static files (Frontend) serve karne ke liye
app.use(express.static(path.join(__dirname, 'public')));

// Database Connection
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Database Pool Created. Connected to Clever Cloud MySQL Database.');
});

// 1. Data SAVE karne ke liye API
app.post('/api/students', (req, res) => {
    const { name, studentClass, age, majorSubject, hobby } = req.body;
    const query = `INSERT INTO students (name, class, age, major_subject, hobby) VALUES (?, ?, ?, ?, ?)`;
    
    db.query(query, [name, studentClass, age, majorSubject, hobby], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'Student data saved successfully!', id: result.insertId });
    });
});

// 2. Data FETCH (SHOW) karne ke liye API
app.get('/api/students', (req, res) => {
    const query = `SELECT * FROM students`;
    
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(results);
    });
});

// Server Start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
