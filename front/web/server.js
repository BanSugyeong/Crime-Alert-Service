const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const db = require('./public/js/db'); // db.js 파일을 불러옴

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const port = 3000;

app.use(cors());

// 세션 설정
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // https를 사용할 경우 true로 설정
}));

// 정적 파일 제공을 위해 public 디렉토리 설정
app.use(express.static('public'));


app.get('/someRoute', (req, res) => {
  const user = database.find(item => item.id === req.query.id);
  // user가 undefined일 때 id에 접근하지 않도록 수정
  if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
  }
  // id가 존재할 때 처리
  res.json({ success: true, data: user });
});

app.get('/someRoute', (req, res) => {
  console.log(req.query);  // query parameter 확인
  const user = database.find(item => item.id === req.query.id);
  console.log(user);       // user 객체 확인

  if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
  }

  res.json({ success: true, data: user });
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
          res.json({ success: false, message: '이미 존재하는 아이디입니다. 다른 아이디를 입력해주세요.' });
      } else {
          // 사용자 정보 저장
          const insertQuery = 'INSERT INTO crimedb.users (username, password) VALUES (?, ?)';
          db.query(insertQuery, [username, hashedPassword], (err, result) => {
              if (err) {
                  res.json({ success: false, message: 'Database insertion error' });
                  return;
              }
              res.json({ success: true, message: '회원가입에 성공했습니다.' });
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
              req.session.user = { id: user.user_id, username: user.username }; // 세션에 사용자 정보 저장
              res.json({ success: true, message: '로그인에 성공했습니다!' });
          } else {
              res.json({ success: false, message: '아이디 혹은 비밀번호가 틀렸습니다.' });
          }
      } else {
          res.json({ success: false, message: '아이디 혹은 비밀번호가 틀렸습니다.' });
      }
  });
});

// 로그아웃 처리
app.post('/logout', (req, res) => {
  req.session.destroy(err => {
      if (err) {
          res.json({ success: false, message: 'Logout failed.' });
      } else {
          res.json({ success: true, message: '로그아웃에 성공했습니다.' });
      }
  });
});

// board 관련 기능 시작
// 게시글 작성 (로그인한 사용자만)
app.post('/posts', (req, res) => {
  if (!req.session.user) {
      return res.json({ success: false, message: '로그인이 필요합니다.' });
  }

  const userId = req.session.user.id;
  const { title, content } = req.body;

  if (!title || title.trim() === '') {
      return res.json({ success: false, message: '제목을 입력해주세요.' });
  }

  if (!content || content.trim() === '') {
      return res.json({ success: false, message: '게시글 내용을 입력해주세요.' });
  }

  const insertQuery = 'INSERT INTO posts (user_id, title, content) VALUES (?, ?, ?)';
  db.query(insertQuery, [userId, title, content], (err, result) => {
      if (err) {
          res.json({ success: false, message: 'Database insertion error' });
          return;
      }
      
      // 작성한 사용자 이름 가져오기
      const selectQuery = 'SELECT username FROM users WHERE user_id = ?';
      db.query(selectQuery, [userId], (err, result) => {
          if (err) {
              res.json({ success: false, message: 'Database query error' });
              return;
          }
          const username = result[0].username; // 사용자 이름 가져오기
          res.json({ success: true, message: '게시글이 성공적으로 등록되었습니다.', username });
      });
  });
});

// 게시글 목록 불러오기
app.get('/posts', (req, res) => {
  const selectQuery = `
    SELECT p.post_id, p.title, p.content, p.created_at, u.username
    FROM posts p
    JOIN users u ON p.user_id = u.user_id
    ORDER BY p.created_at DESC
  `;

  db.query(selectQuery, (err, results) => {
    if (err) {
      res.json({ success: false, message: 'Database query error' });
      return;
    }
    res.json({ success: true, posts: results });
  });
});
// board 관련 기능 끝

function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next();
  } else {
    res.status(401).json({ success: false, message: 'Not authenticated' });
  }
}

// 인증 미들웨어가 필요한 라우트에 추가
app.get('/favorites', isAuthenticated, (req, res) => {
  const userId = req.session.user.id;
  const selectQuery = 'SELECT district FROM favorites WHERE user_id = ?';
  db.query(selectQuery, [userId], (err, result) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ success: false, message: 'Database query error' });
    }
    const favorites = result.map(row => row.district);
    res.json({ success: true, favorites });
  });
});

app.post('/favorites', isAuthenticated, (req, res) => {
  const userId = req.session.user.id;
  const { district } = req.body;

  const insertQuery = 'INSERT INTO favorites (user_id, district) VALUES (?, ?)';
  db.query(insertQuery, [userId, district], (err, result) => {
    if (err) {
      console.error('Database insertion error:', err);
      return res.status(500).json({ success: false, message: 'Database insertion error' });
    }
    res.json({ success: true, message: 'Favorite added successfully!' });
  });
});

app.delete('/favorites', isAuthenticated, (req, res) => {
  const userId = req.session.user.id;
  const { district } = req.body;

  const deleteQuery = 'DELETE FROM favorites WHERE user_id = ? AND district = ?';
  db.query(deleteQuery, [userId, district], (err, result) => {
    if (err) {
      console.error('Database deletion error:', err);
      return res.status(500).json({ success: false, message: 'Database deletion error' });
    }
    res.json({ success: true, message: 'Favorite removed successfully!' });
  });
});

// 즐겨찾기 관련 기능 시작
// 즐겨찾기 추가
app.post('/favorites', (req, res) => {
  const userId = req.session.user.id;
  const { district } = req.body;

  const insertQuery = 'INSERT INTO favorites (user_id, district) VALUES (?, ?)';
  db.query(insertQuery, [userId, district], (err, result) => {
    if (err) {
      res.json({ success: false, message: 'Database insertion error' });
      return;
    }
    res.json({ success: true, message: 'Favorite added successfully!' });
  });
});

// 즐겨찾기 삭제
app.delete('/favorites', (req, res) => {
  const userId = req.session.user.id;
  const { district } = req.body;

  const deleteQuery = 'DELETE FROM favorites WHERE user_id = ? AND district = ?';
  db.query(deleteQuery, [userId, district], (err, result) => {
    if (err) {
      res.json({ success: false, message: 'Database deletion error' });
      return;
    }
    res.json({ success: true, message: 'Favorite removed successfully!' });
  });
});

// 즐겨찾기 목록 불러오기
app.get('/favorites', (req, res) => {
  const userId = req.session.user && req.session.user.id;
  
  if (!userId) {
    return res.status(401).json({ success: false, message: 'Unauthorized access' });
  }

  const selectQuery = 'SELECT district FROM favorites WHERE user_id = ?';
  db.query(selectQuery, [userId], (err, result) => {
    if (err) {
      console.error('Database query error:', err);
      return res.status(500).json({ success: false, message: 'Database query error' });
    }
    const favorites = result.map(row => row.district);
    res.json({ success: true, favorites });
  });
});

// 즐겨찾기 관련 기능 끝

// 관리자 페이지 정보 시작
// 사용자 정보 가져오기
app.get('/api/admin/users', (req, res) => {
  const query = 'SELECT user_id, username, created_at FROM users';
  db.query(query, (err, results) => {
      if (err) {
          return res.json({ success: false, message: 'Database query error' });
      }
      res.json({ success: true, users: results });
  });
});

// 즐겨찾기 정보 가져오기
app.get('/api/admin/favorites', (req, res) => {
  const query = 'SELECT user_id, district FROM favorites';
  db.query(query, (err, results) => {
      if (err) {
          return res.json({ success: false, message: 'Database query error' });
      }
      res.json({ success: true, favorites: results });
  });
});

// 게시글 정보 가져오기
app.get('/api/admin/posts', (req, res) => {
  const query = `
      SELECT p.user_id, p.title, p.content, p.created_at
      FROM posts p
      JOIN users u ON p.user_id = u.user_id
      ORDER BY p.created_at DESC
  `;
  db.query(query, (err, results) => {
      if (err) {
          return res.json({ success: false, message: 'Database query error' });
      }
      res.json({ success: true, posts: results });
  });
});

// 관리자 데이터를 반환하는 엔드포인트
app.get('/admin-data', (req, res) => {
  const userQuery = 'SELECT user_id AS id, username, password FROM users';
  const favoritesQuery = 'SELECT user_id, district FROM favorites';
  const postsQuery = 'SELECT user_id, title, content, created_at FROM posts';

  Promise.all([
      new Promise((resolve, reject) => db.query(userQuery, (err, result) => err ? reject(err) : resolve(result))),
      new Promise((resolve, reject) => db.query(favoritesQuery, (err, result) => err ? reject(err) : resolve(result))),
      new Promise((resolve, reject) => db.query(postsQuery, (err, result) => err ? reject(err) : resolve(result)))
  ])
  .then(([users, favorites, posts]) => {
      res.json({ success: true, data: { users, favorites, posts } });
  })
  .catch(err => {
      console.error('Error fetching admin data:', err);
      res.json({ success: false, message: '데이터 조회 중 오류 발생' });
  });
});

// 관리자 페이지 정보 끝

// 범죄관련 뉴스 불러오기
app.get('/api/news', async (req, res) => {
  try {
    const query = encodeURIComponent('범죄'); // 원하는 검색어로 변경
    const apiUrl = `https://openapi.naver.com/v1/search/news.json?query=${query}&display=8`;

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



// 로그인 상태 확인 미들웨어
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.json({ success: false, message: 'Not authenticated' });
  }
}

// 로그인 상태를 반환하는 엔드포인트
app.get('/is-authenticated', (req, res) => {
  if (req.session.user) {
    res.json({ authenticated: true });
  } else {
    res.json({ authenticated: false });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

