const express = require('express');
const axios = require('axios');
const cors = require('cors');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
const port = 3000;

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'crimeDB'
});

app.use(cors());

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to database');
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, results) => {
      if (err) throw err;
      if (results.length > 0) {
          res.json({ status: 'ok', message: 'Login successful' });
      } else {
          res.status(401).json({ status: 'error', message: 'Invalid credentials' });
      }
  });
});

app.post('/favorites', (req, res) => {
  const { user_id, district } = req.body;
  db.query('INSERT INTO favorites (user_id, district) VALUES (?, ?)', [user_id, district], (err, result) => {
      if (err) throw err;
      res.json({ status: 'ok', message: 'Favorite added' });
  });
});

app.get('/api/news', async (req, res) => {
  try {
    const query = encodeURIComponent('범죄'); // 원하는 검색어로 변경
    const apiUrl = `https://openapi.naver.com/v1/search/news.json?query=${query}&display=5`;

    // 네이버 API에 요청
    const response = await axios.get(apiUrl, {
      headers: {
        'X-Naver-Client-Id': '5oIL_w5BuIcEHWvjc93X', // 클라이언트 아이디
        'X-Naver-Client-Secret': 'MR7PIBr8gt', // 클라이언트 시크릿
      },
    });

    // API 응답 전송
    res.json(response.data.items); // items만 전송
  } catch (error) {
    console.error('Error fetching news:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
