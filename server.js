require('dotenv').config();
const express = require('express');
const mysql = require('mysql2'); 
const bodyParser = require('body-parser');
const path = require('path');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createConnection({
  host: process.env.db_host,
  user: process.env.db_user,
  password: process.env.db_pass,
  database: process.env.db_name  
});

db.connect((err) => {
  if (err) {
    console.error('Failed to connect to MySQL:', err.stack);
    return;
  }
  console.log('Connected to MySQL');
});

//--Login--
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT * FROM users WHERE username = ? OR email = ?';
  db.query(query, [username, username], async (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).send('Database error');
    }
    if (results.length === 0) {
      return res.status(401).send('Invalid username');
    }
    
    try {
      const valid = await bcrypt.compare(password, results[0].password);
      if (valid) {
        res.send('Login successful!');
      } else {
        res.status(401).send('Invalid username or password');
      }
    } catch (err) {
       res.status(500).send('Something went wrong');
    }
  });
});
//--Register--
app.post('/register', async (req, res) => {
  const { email, username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (email, username, password) VALUES (?, ?, ?)';
    db.query(query, [email, username, hashedPassword], (err) => {
      if (err) {
        console.error('Insert error:', err);
        return res.status(500).send('Database error');
      }
      res.send('success');
    });
  } catch (err) {
    console.error('Hash error:', err);
    res.status(500).send('Server error');
  }
});
//--Check Mail--
app.post('/check-email', (req, res) => {
  const { email } = req.body;
  db.query('SELECT id FROM users WHERE email = ?', [email], (err, results) => {
    if (err) return res.status(500).send('error');
    if (results.length > 0) return res.send('exists');
    res.send('ok');
  });
});
//--Check Username--
app.post('/check-username', (req, res) => {
  const { username } = req.body;
  db.query('SELECT id FROM users WHERE username = ?', [username], (err, results) => {
    if (err) return res.status(500).send('error');
    if (results.length > 0) return res.send('exists');
    res.send('ok');
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/login.html`);
});
