const express = require('express');
const axios = require('axios');
const cors = require('cors');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const port = 3000;

app.use(cors());

// 정적 파일 제공을 위해 public 디렉토리 설정
app.use(express.static('public'));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'crimedb'
});

// 데이터베이스 연결
db.connect(err => {
  if (err) {
      console.error('Error connecting to the database: ' + err.stack);
      return;
  }
  console.log('Connected to database as ID ' + db.threadId);
});

// 회원가입 처리
app.post('/signup', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // 비밀번호 해시
  const hashedPassword = bcrypt.hashSync(password, 10);

  // 사용자명 중복 확인
  const checkUserQuery = 'SELECT * FROM users WHERE username = ?';
  db.query(checkUserQuery, [username], (err, result) => {
      if (err) {
          res.json({ success: false, message: 'Database query error' });
          return;
      }
      if (result.length > 0) {
          res.json({ success: false, message: 'Username already exists. Please choose a different username.' });
      } else {
          // 사용자 정보 저장
          const insertQuery = 'INSERT INTO crimedb.users (username, password) VALUES (?, ?)';
          db.query(insertQuery, [username, hashedPassword], (err, result) => {
              if (err) {
                  res.json({ success: false, message: 'Database insertion error' });
                  return;
              }
              res.json({ success: true, message: 'Registration successful!' });
          });
      }
  });
});

// 로그인 처리
app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const checkUserQuery = 'SELECT * FROM users WHERE username = ?';
  db.query(checkUserQuery, [username], (err, result) => {
      if (err) {
          res.json({ success: false, message: 'Database query error' });
          return;
      }
      if (result.length > 0) {
          const user = result[0];
          if (bcrypt.compareSync(password, user.password)) {
              res.json({ success: true, message: 'Login successful!' });
          } else {
              res.json({ success: false, message: 'Invalid username or password.' });
          }
      } else {
          res.json({ success: false, message: 'Invalid username or password.' });
      }
  });
});

// 범죄관련 뉴스 불러오기
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
