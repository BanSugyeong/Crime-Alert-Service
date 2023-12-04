const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

app.get('/api/news', async (req, res) => {
  try {
    const query = encodeURIComponent('범죄'); // 원하는 검색어로 변경
    const apiUrl = `https://openapi.naver.com/v1/search/news.json?query=${query}&display=5`;

    // 네이버 API에 요청
    const response = await axios.get(apiUrl, {
      headers: {
        'X-Naver-Client-Id': 'YOUR_CLIENT_ID',
        'X-Naver-Client-Secret': 'YOUR_CLIENT_SECRET',
      },
    });

    // API 응답 전송
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching news:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});