const express = require("express");
const mysql = require("mysql2");
const { exec } = require("child_process");

const app = express();

app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root123",
    database: "test"
});

// SQL Injection
app.get("/user", (req, res) => {
    const id = req.query.id;

    const sql = `SELECT * FROM users WHERE id = ${id}`;

    db.query(sql, (err, rows) => {
        if (err) return res.status(500).send(err.message);
        res.json(rows);
    });
});

// Command Injection
app.post("/ping", (req, res) => {
    const host = req.body.host;

    exec(`ping -c 4 ${host}`, (err, stdout) => {
        if (err) return res.status(500).send(err.message);
        res.send(stdout);
    });
});

// Sensitive Information Disclosure
app.get("/config", (req, res) => {
    res.json({
        db_password: "root123",
        jwt_secret: "super-secret-key",
        api_key: "1234567890"
    });
});

// Missing Authentication
app.delete("/user/:id", (req, res) => {
    const sql = `DELETE FROM users WHERE id=${req.params.id}`;

    db.query(sql);

    res.send("deleted");
});

// XSS
app.post("/comment", (req, res) => {
    const comment = req.body.comment;

    res.send(`
        <html>
            <body>
                ${comment}
            </body>
        </html>
    `);
});

app.listen(3000);
