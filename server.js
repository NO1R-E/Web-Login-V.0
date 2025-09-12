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
  database: process.env.name  
});

db.connect((err) => {
  if (err) {
    console.error('Failed to connect to MySQL:', err.stack);
    return;
  }
  console.log('Connected to MySQL');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM users WHERE username = ?';
  db.query(query, [username], async (err, results) => {
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

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/login.html`);
});
