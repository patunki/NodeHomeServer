const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
const db = require('./database')
const bcrypt = require('bcryptjs');

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

app.post('/api/signup', async (req, res) => {
  const { username, password, email} = req.body;
  try {
    const query = "SELECT * FROM users WHERE  username = $1 OR email = $2;"
    const values = [username, email];
    const result = await db.execute(query, values);
    if (result.rows > 0){
      return res.status(500).json({message: 'käyttäjä jo olemassa'});
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    


    res.status(201).json({
      message: 'User created successfully!',
    });
  } catch (err) {
    console.error('Error inserting user:', err);
    res.status(500).json({ message: 'Error creating user', error: err.message });
  }
});

// API to send a chat message
app.post('/api/chat', async (req, res) => {
  const { username, message } = req.body;

  if (!username || !message) {
    return res.status(400).json({ message: 'Username and message are required' });
  }

  try {
    const [result] = await db.execute(
      `INSERT INTO chat_messages (username, message)
       VALUES (?, ?)`,
      [username, message]
    );
    res.status(201).json({
      message: 'Message sent successfully!',
      messageId: result.insertId,
    });
  } catch (err) {
    console.error('Error inserting message:', err);
    res.status(500).json({ message: 'Error sending message', error: err.message });
  }
});

// API to get all chat messages
app.get('/api/chat', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM chat_messages ORDER BY timestamp ASC');
    res.status(200).json(rows);
  } catch (err) {
    console.error('Error retrieving messages:', err);
    res.status(500).json({ message: 'Error retrieving messages', error: err.message });
  }
});

//TEST
app.get('/api/users', async (req, res) => {
  const { username, password, email, privilages, member, role, picture, bio } = req.body;

  try {
    const query = "SELECT * FROM users;"
    const result = await db.execute(query);
    console.log(result);
    res.status(201).json({
      message: 'User created successfully!',
    });
  } catch (err) {
    console.error('Error inserting user:', err);
    res.status(500).json({ message: 'Error creating user', error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
