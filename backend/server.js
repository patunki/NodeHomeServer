const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
const db = require('./database')
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');


const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

const galleryPath = path.join(__dirname, 'uploads');

const SECRET_KEY=process.env.SECRET_KEY;

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

app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
      // Fetch user from the database
      const query = `SELECT * FROM users WHERE email = ?`;
      const [users] = await db.query(query, [email]);

      if (users.length === 0) {
          return res.status(401).json({ error: 'Invalid credentials' });
      }

      const user = users[0];

      // Compare hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
          return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Generate JWT
      const token = jwt.sign(
          {
              id: user.id,
              username: user.username,
              email: user.email,
          },
          SECRET_KEY,
          { expiresIn: '1h' } // Token expires in 1 hour
      );
      console.log("login: ", token);
      res.status(200).json({
          message: 'Login successful',
          token,
          user: {
              id: user.id,
              username: user.username,
              email: user.email,
              privileges: user.privileges,
              member: user.member,
              role: user.role,
          },
      });
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/auth/signup', async (req, res) => {
  const { username, password, email } = req.body;
  console.log("trying to signup ", req.body);
  if (!username || !password || !email) {
    console.log("missing fields");
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
      // Hash the password with a salt
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Insert the user into the database
      const query = `
          INSERT INTO users (username, password, email, create_time) 
          VALUES (?, ?, ?, NOW())
      `;
      await db.query(query, [username, hashedPassword, email]);

      res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal server error' });
  }
});

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1]; // Extract token from "Bearer <token>"
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
      if (err) {
          return res.status(401).json({ error: 'Invalid token' });
      }

      req.user = decoded; // Attach decoded token to the request object
      next();
  });
};

app.get('/auth/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  console.log("verifying");
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log("unauthorized");
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  try {
    jwt.verify(token, SECRET_KEY); // Verify the token
    console.log("valid auth");
    res.status(200).json({ message: 'Token is valid' });
  } catch (err) {
    console.log("invalid: ", authHeader);
    res.status(401).json({ error: 'Invalid token' });
  }
});

app.get('/api/protected', verifyToken, (req, res) => {
  res.status(200).json({ message: 'This is a protected route', user: req.user });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

