// script.js

// 네이버 API 키 설정
const clientId = '5oIL_w5BuIcEHWvjc93X';
const clientSecret = 'MR7PIBr8gt';

// 네이버 뉴스 검색 함수
async function searchNews(keyword) {
    const apiUrl = `https://openapi.naver.com/v1/search/news.json?query=${encodeURIComponent(keyword)}&display=5`;

    const response = await fetch(apiUrl, {
        headers: {
            'X-Naver-Client-Id': clientId,
            'X-Naver-Client-Secret': clientSecret,
        },
    });

    const data = await response.json();
    return data.items;
}

// 웹 페이지에 뉴스 표시 함수
async function displayNews() {
    const keyword = '범죄';  // 원하는 키워드로 변경
    const newsContainer = document.getElementById('news-container');

    try {
        const newsList = await searchNews(keyword);

        newsContainer.innerHTML = '';  // 이전 내용 지우기

        if (newsList.length > 0) {
            newsList.forEach(news => {
                const newsItem = document.createElement('div');
                newsItem.innerHTML = `<p>${news.title}</p><p>${news.link}</p>`;
                newsContainer.appendChild(newsItem);
            });
        } else {
            newsContainer.innerHTML = '<p>No news found.</p>';
        }
    } catch (error) {
        console.error('Error fetching news:', error);
        newsContainer.innerHTML = '<p>Error fetching news.</p>';
    }
}

// 페이지 로드 시 뉴스 표시
window.onload = displayNews;
