const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');

// CORS 허용
app.use(cors());

// 정적 파일 제공
app.use(express.static(path.join(__dirname)));

// 서버 시작
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
