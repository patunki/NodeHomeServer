const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Simulated user database
const users = [
    { username: "captain", password: "ahoy" },
    { username: "sailor", password: "1234" },
];

// Login route
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        res.json({ message: "Login successful!" });
    } else {
        res.status(401).json({ message: "Invalid username or password." });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
