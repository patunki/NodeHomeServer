const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
const db = require('./database')
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

const galleryPath = path.join(__dirname, 'uploads');

// Simulated user database
const users = [
    { username: "captain", password: "ahoy" },
    { username: "sailor", password: "1234" },
];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Get the folder from the request (make sure it's sanitized)
    const folder = req.body.folder || 'default'; // Default to 'default' if no folder is provided
    const folderPath = path.join(uploadPath, folder);

    // Create the folder if it doesn't exist
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    // Set the destination folder
    cb(null, folderPath);
  },
  filename: (req, file, cb) => {
    // Use the original filename for the uploaded file
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// Route to handle file uploads
app.post('/api/gallery/upload', upload.single('image'), (req, res) => {
  // After the file is uploaded, send a response back to the frontend
  if (req.file) {
    res.json({ success: true, file: req.file });
  } else {
    res.status(400).json({ error: 'No file uploaded' });
  }
});

// API Route to get images from a folder
app.get('/api/gallery/:folder', (req, res) => {
  const folderPath = path.join(__dirname, 'uploads', req.params.folder);
  if (fs.existsSync(folderPath)) {
    fs.readdir(folderPath, (err, files) => {
      if (err) {
        return res.status(500).json({ message: 'Error reading folder' });
      }
      res.status(200).json({ files: files });
    });
  } else {
    res.status(404).json({ message: 'Folder not found' });
  }
});

// API Route to get a list of all folders
app.get('/api/folders', (req, res) => {
  fs.readdir(galleryPath, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to read folders' });
    }

    // Filter files to only include directories (folders)
    const folders = files.filter(file => fs.statSync(path.join(galleryPath, file)).isDirectory());
    res.json({ folders });
  });
});

// API Route to create a new folder
app.post('/api/gallery/folder', (req, res) => {
  const folderPath = path.join(__dirname, 'uploads', req.body.folderName);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath);
    res.status(200).json({ message: 'Folder created successfully' });
  } else {
    res.status(400).json({ message: 'Folder already exists' });
  }
});

// Serve the uploaded images as static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
