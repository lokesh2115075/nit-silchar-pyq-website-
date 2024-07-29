const express = require('express');
const app = express();
const mysql = require('mysql'); // Use mysql2 if needed
const cors = require('cors');
app.use(cors());

// MySQL connection setup
const conc = mysql.createConnection({
    host: "test-db.cdo6gk040cw0.us-east-2.rds.amazonaws.com",
    user: "admin",
    password: "SaiKumar2024",
    database: 'nitsilchar',
    port: 3306
});

// Connect to MySQL
conc.connect(function(err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ');
});

// Middleware setup
app.use(express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route to handle POST request to insert student details
app.post("/insertstudentdetails", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    console.log(`Inserting email: ${email} and password: ${password}`);

    const sql1 = `INSERT INTO students (email, studentpassword) VALUES (?, ?)`;
    const values = [email, password];
    conc.query(sql1, values, (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(400).send("Failed to insert"); // Send status and message
        } else {
            console.log("Successfully inserted:", result);
            return res.status(200).send("Successfully inserted"); // Send status and message
        }
    });
});

app.post("/checkstudentdetails", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    console.log(`Checking email: ${email} and password: ${password}`);

    // SQL query with placeholders
    const sql = "SELECT * FROM students WHERE email = ? AND studentpassword = ?";
    const values = [email, password];

    conc.query(sql, values, (err, result) => {
        if (err) {
            console.error("MySQL query error:", err);
            return res.status(400).send("Failed to query database");
        } else {
            console.log("Query result:", result);
            if (result.length > 0) {
                console.log("Login successful");
                return res.status(200).send("Login successful");
            } else {
                console.log("Invalid credentials");
                return res.status(401).send("Invalid credentials");
            }
        }
    });
});

// Start server
const PORT = 4141;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
